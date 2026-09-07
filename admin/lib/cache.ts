import { revalidateTag } from "next/cache";

/**
 * Invalidate a public-content cache tag immediately after an admin write.
 * Uses `expire: 0` instead of a named profile (e.g. "max") so the next
 * visitor gets fresh data right away, editors expect to see their own
 * save reflected, not a stale-while-revalidate window.
 */
export function invalidateContentTag(tag: string): void {
  revalidateTag(tag, { expire: 0 });
}
