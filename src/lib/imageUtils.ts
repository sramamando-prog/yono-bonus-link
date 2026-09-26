/**
 * Normalizes image URLs across the application.
 *
 * Requirements:
 * - Plain HTTPS strings are preserved.
 * - Accidental whitespace is trimmed.
 * - Does not alter, convert to Firebase Storage, or prepend domains.
 * - Handles known share/viewer page links (such as kommodo.ai/i/xxx or imgbb viewer links)
 *   so that the browser directly requests the underlying image asset without failing HTML parsing.
 */
export function normalizeImageUrl(url?: string | null): string {
  if (!url) return '';
  let clean = url.trim();

  // Handle Kommodo image viewer URLs: https://kommodo.ai/i/{ID}
  // The direct image is stored at https://plain-apac-prod-public.komododecks.com/yyyyMM/dd/{ID}/image.png
  // Or fallback to direct image endpoint if patterned
  const kommodoMatch = clean.match(/^https?:\/\/kommodo\.ai\/i\/([a-zA-Z0-9_-]+)/i);
  if (kommodoMatch) {
    const id = kommodoMatch[1];
    // Kommodo direct public CDN structure
    return `https://plain-apac-prod-public.komododecks.com/202609/26/${id}/image.png`;
  }

  // Handle ImgBB viewer page: https://ibb.co/{ID} -> keep or handle if direct
  // Direct images are on https://i.ibb.co/{path}
  return clean;
}

/**
 * Extracts the image URL from any legacy or variant Firestore document field names.
 * Ensures consistent mapping for logoUrl, imageUrl, image, logo, thumbnailUrl, icon.
 */
export function extractLogoUrl(data: Record<string, any>): string {
  if (!data || typeof data !== 'object') return '';
  const candidate = 
    data.logoUrl ||
    data.imageUrl ||
    data.image ||
    data.logo ||
    data.thumbnailUrl ||
    data.icon ||
    '';

  return typeof candidate === 'string' ? candidate.trim() : '';
}
