/** Normalize transport differences without rewriting the locked page copy. */
export function normalizeLockedCopy(source: string): string {
  return source.replace(/^\uFEFF/, '').replace(/\r\n?/g, '\n');
}
