/**
 * Simple in-memory rate limiter — zero external dependencies.
 * Resets automatically as the Map entries expire.
 * NOTE: This is per-instance. On Vercel with multiple serverless functions
 * each cold-start gets a fresh Map, which is fine for basic abuse prevention.
 */

interface Entry {
  count: number
  resetAt: number
}

const store = new Map<string, Entry>()

/**
 * @param key      - unique key per rate-limited resource (e.g. IP address)
 * @param limit    - max requests allowed in the window
 * @param windowMs - window size in milliseconds
 * @returns true if the request is allowed, false if rate-limited
 */
export function rateLimit(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now()
  const entry = store.get(key)

  if (!entry || now > entry.resetAt) {
    store.set(key, { count: 1, resetAt: now + windowMs })
    return true
  }

  if (entry.count >= limit) {
    return false
  }

  entry.count++
  return true
}
