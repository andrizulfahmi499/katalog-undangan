import { db } from '@/lib/db';
import { cache } from 'react';

/**
 * Default OG image fallback
 */
const DEFAULT_OG_IMAGE = '/logo.png';

/**
 * Base URL for the site (used to construct absolute OG image URLs)
 */
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://katalog-id.vercel.app';

/**
 * Cached database call to prevent connection pool exhaustion during build
 */
const fetchOGSetting = cache(async () => {
  return await db.globalSetting.findUnique({
    where: { id: 'global' },
    select: { 
      landingPageOgImage: true,
      landingPageOgImageData: true,
    },
  });
});

/**
 * Gets the Open Graph image URL for metadata generation
 * Returns custom OG image API URL if set, otherwise returns default
 * 
 * @returns Promise<string> - Always returns a valid absolute image URL
 */
export async function getOGImageForMetadata(): Promise<string> {
  try {
    const setting = await fetchOGSetting();

    // Return custom OG image API URL if image data exists in database
    if (setting?.landingPageOgImage && setting?.landingPageOgImageData) {
      return `${SITE_URL}/api/public/og-image`;
    }

    return DEFAULT_OG_IMAGE;
  } catch (error) {
    console.error('Error fetching OG image for metadata:', error);
    return DEFAULT_OG_IMAGE;
  }
}
