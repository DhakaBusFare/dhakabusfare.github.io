/**
 * IndexedDB Frontend Cache Manager for Route Documents PDFs.
 * Caches PDF binary ArrayBuffers locally in the browser to avoid re-fetching.
 */

const DB_NAME = 'DhakaBusFare_PdfCache';
const DB_VERSION = 1;
const STORE_NAME = 'pdf_blobs';

interface CacheEntry {
  url: string;
  data: ArrayBuffer;
  timestamp: number;
}

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB is not supported in this environment.'));
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'url' });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Retrieve cached PDF ArrayBuffer from IndexedDB.
 */
export async function getCachedPdf(url: string): Promise<ArrayBuffer | null> {
  try {
    const db = await openDatabase();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const request = store.get(url);

      request.onsuccess = () => {
        const result = request.result as CacheEntry | undefined;
        if (result && result.data) {
          resolve(result.data);
        } else {
          resolve(null);
        }
      };

      request.onerror = () => resolve(null);
    });
  } catch (error) {
    console.warn('[PdfCache] Failed to read from IndexedDB:', error);
    return null;
  }
}

/**
 * Save PDF ArrayBuffer into IndexedDB.
 */
export async function setCachedPdf(url: string, data: ArrayBuffer): Promise<void> {
  try {
    const db = await openDatabase();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const entry: CacheEntry = {
        url,
        data,
        timestamp: Date.now(),
      };
      const request = store.put(entry);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.warn('[PdfCache] Failed to save to IndexedDB:', error);
  }
}

/**
 * Fetches PDF data from URL with automatic IndexedDB frontend caching.
 */
export async function fetchPdfWithCache(url: string): Promise<{ data: ArrayBuffer; isCached: boolean }> {
  // Check frontend IndexedDB cache first
  const cachedData = await getCachedPdf(url);
  if (cachedData) {
    console.log(`[PdfCache] HIT - Served from local IndexedDB cache: ${url}`);
    return { data: cachedData, isCached: true };
  }

  console.log(`[PdfCache] MISS - Fetching over network: ${url}`);
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch PDF document (HTTP ${response.status})`);
  }

  const arrayBuffer = await response.arrayBuffer();

  // Save to IndexedDB cache in background
  setCachedPdf(url, arrayBuffer).catch((err) =>
    console.warn('[PdfCache] Async cache write error:', err)
  );

  return { data: arrayBuffer, isCached: false };
}
