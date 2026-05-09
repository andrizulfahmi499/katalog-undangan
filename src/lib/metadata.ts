import { db } from '@/lib/db';

/**
 * Default OG image fallback
 */
const DEFAULT_OG_IMAGE = '/logo.png';

/**
 * Base URL for the site (used to construct absolute OG image URLs)
 */
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://katalog-id.vercel.app';

/**
 * Gets the Open Graph image URL for metadata generation
 * Returns custom OG image API URL if set, otherwise returns default
 * 
 * Social media crawlers require absolute URLs for OG images,
 * so we construct the full URL using the site's base URL.
 * 
 * @returns Promise<string> - Always returns a valid absolute image URL
 */
export async function getOGImageForMetadata(): Promise<string> {
  try {
    const setting = await db.globalSetting.findUnique({
      where: { id: 'global' },
      select: { 
        landingPageOgImage: true,
        landingPageOgImageData: true, // Check if actual data exists
      },
    });

    // Return custom OG image API URL if image data exists in database
    if (setting?.landingPageOgImage && setting?.landingPageOgImageData) {
      // Use absolute URL for the public API route that serves the image
      return `${SITE_URL}/api/public/og-image`;
    }

    return DEFAULT_OG_IMAGE;
  } catch (error) {
    // On error, return default image to ensure metadata always has a valid image
    console.error('Error fetching OG image for metadata:', error);
    return DEFAULT_OG_IMAGE;
  }
}
