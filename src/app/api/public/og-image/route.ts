import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

/**
 * GET /api/public/og-image
 * Serves the custom OG image from database storage.
 * This route is publicly accessible (no auth required) so social media
 * crawlers (Facebook, Twitter, etc.) can fetch the image.
 * 
 * Returns the image binary with proper Content-Type and cache headers.
 * Falls back to a redirect to /logo.png if no custom OG image is set.
 */
export async function GET(request: NextRequest) {
  try {
    const setting = await db.globalSetting.findUnique({
      where: { id: 'global' },
      select: {
        landingPageOgImageData: true,
        landingPageOgImageMime: true,
      },
    });

    // If no custom OG image data, redirect to default
    if (!setting?.landingPageOgImageData) {
      return NextResponse.redirect(new URL('/logo.png', request.url));
    }

    // Decode base64 to binary buffer
    const imageBuffer = Buffer.from(setting.landingPageOgImageData, 'base64');
    const mimeType = setting.landingPageOgImageMime || 'image/png';

    // Return image with proper headers
    return new NextResponse(imageBuffer, {
      status: 200,
      headers: {
        'Content-Type': mimeType,
        'Content-Length': imageBuffer.length.toString(),
        // Cache for 1 hour, allow CDN to cache for 24 hours
        // Use stale-while-revalidate so crawlers always get a fast response
        'Cache-Control': 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=86400',
        // Prevent Vercel from adding no-cache headers
        'CDN-Cache-Control': 'public, max-age=86400',
        'Vercel-CDN-Cache-Control': 'public, max-age=86400',
      },
    });
  } catch (error) {
    console.error('Error serving OG image:', error);
    // On error, redirect to default logo
    return NextResponse.redirect(new URL('/logo.png', request.url));
  }
}
