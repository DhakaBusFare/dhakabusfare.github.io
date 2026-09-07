export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number; // Unix timestamp in seconds when the limit resets
  retryAfter: number; // Seconds to wait before retrying if rate limited
}

/**
 * Client-Side Rate Limiter utilizing browser localStorage / memory store.
 * Works 100% on static hosting platforms like GitHub Pages.
 */
export function checkRateLimit(
  identifier: string,
  limit: number,
  windowMs: number
): RateLimitResult {
  const now = Date.now();
  const windowStart = now - windowMs;
  const storageKey = `ratelimit_${identifier}`;

  let timestamps: number[] = [];

  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        timestamps = JSON.parse(stored);
      }
    }
  } catch (_) {}

  // Filter timestamps within active window
  timestamps = timestamps.filter((ts) => ts > windowStart);

  const isAllowed = timestamps.length < limit;

  if (isAllowed) {
    timestamps.push(now);
  }

  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem(storageKey, JSON.stringify(timestamps));
    }
  } catch (_) {}

  const remaining = Math.max(0, limit - timestamps.length);
  const oldestTimestamp = timestamps[0] || now;
  const resetMs = oldestTimestamp + windowMs;
  const reset = Math.ceil(resetMs / 1000);
  const retryAfter = isAllowed ? 0 : Math.ceil((resetMs - now) / 1000);

  return {
    success: isAllowed,
    limit,
    remaining,
    reset,
    retryAfter,
  };
}
