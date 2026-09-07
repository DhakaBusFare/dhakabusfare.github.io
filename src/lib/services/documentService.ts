import { supabase } from '@/lib/supabaseClient';
import documentManifest from '@/config/documents.json';

export interface RouteDocument {
  id: string;
  name: string;
  filename: string;
  publicUrl: string;
  sizeBytes?: number;
  updatedAt?: string;
  description?: string;
}

const BUCKET_NAME = 'route_documents';

/**
 * Dynamically builds RouteDocument list from src/config/documents.json manifest
 * using Supabase public storage URLs.
 */
export function getManifestDocuments(): RouteDocument[] {
  return documentManifest.map((item) => {
    const fullStoragePath = item.subfolder ? `${item.subfolder}/${item.filename}` : item.filename;
    const { data } = supabase.storage.from(BUCKET_NAME).getPublicUrl(fullStoragePath);

    return {
      id: item.id,
      name: item.name,
      filename: item.filename,
      publicUrl: data.publicUrl,
      description: item.description,
    };
  });
}

/**
 * Client-Side Supabase Storage Scanner for GitHub Pages Static Deployment.
 * Combines documents from JSON manifest with dynamic storage scanning.
 */
export async function fetchRouteDocuments(): Promise<RouteDocument[]> {
  const documentsMap = new Map<string, RouteDocument>();

  // 1. Initialize with manifest documents
  const manifestDocs = getManifestDocuments();
  manifestDocs.forEach((doc) => {
    documentsMap.set(doc.publicUrl, doc);
  });

  // 2. Scan Supabase storage dynamically for additional uploaded files
  const scanDirectory = async (folderPath: string = '') => {
    try {
      const { data: items, error } = await supabase.storage
        .from(BUCKET_NAME)
        .list(folderPath, { limit: 200, sortBy: { column: 'name', order: 'asc' } });

      if (error || !items) return;

      for (const item of items) {
        if (item.name === '.emptyFolderPlaceholder') continue;

        const fullPath = folderPath ? `${folderPath}/${item.name}` : item.name;
        const isFolder = !folderPath && !item.name.includes('.') && !item.metadata && !item.id;

        if (isFolder) {
          await scanDirectory(fullPath);
        } else {
          const { data: publicUrlData } = supabase.storage
            .from(BUCKET_NAME)
            .getPublicUrl(fullPath);

          if (!documentsMap.has(publicUrlData.publicUrl)) {
            const cleanName = item.name.replace(/\.pdf$/i, '').replace(/[-_]/g, ' ');
            const formattedName = cleanName.replace(/\b\w/g, (c) => c.toUpperCase());

            documentsMap.set(publicUrlData.publicUrl, {
              id: item.id || fullPath,
              name: formattedName,
              filename: item.name,
              publicUrl: publicUrlData.publicUrl,
              sizeBytes: item.metadata?.size,
              updatedAt: item.created_at || item.updated_at || undefined,
              description: folderPath ? `Route Document (${folderPath})` : 'Official Route Document',
            });
          }
        }
      }
    } catch (e: any) {
      console.warn(`[DocumentService] Storage scan note for '${folderPath}':`, e);
    }
  };

  try {
    await scanDirectory('');
    await scanDirectory('route_pdfs');
  } catch (e) {
    console.warn('[DocumentService] Scan note:', e);
  }

  return Array.from(documentsMap.values());
}
