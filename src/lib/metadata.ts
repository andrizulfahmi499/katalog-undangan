import { db } from '@/lib/db';

/**
 * Default OG image fallback
 */
const DEFAULT_OG_IMAGE = '/logo.png';

/**
 * Gets the Open Graph image URL for metadata generation
 * Returns custom OG image if set, otherwise returns default
 * 
 * @returns Promise<string> - Always returns a valid image URL
 */
export async function getOGImageForMetadata(): Promise<string> {
  try {
    const setting = await db.globalSetting.findUnique({
      where: { id: 'global' },
      select: { landingPageOgImage: true },
    });

    // Return custom OG image if exists, otherwise default
    return setting?.landingPageOgImage || DEFAULT_OG_IMAGE;
  } catch (error) {
    // On error, return default image to ensure metadata always has a valid image
    console.error('Error fetching OG image for metadata:', error);
    return DEFAULT_OG_IMAGE;
  }
}
