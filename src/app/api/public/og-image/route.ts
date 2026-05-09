import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

/**
 * GET /api/public/og-image
 * Serves the custom OG image from database storage.
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
        // Cache for 60 seconds for browsers, allow CDN to cache for 24 hours
        // The query parameter ?v=timestamp in metadata.ts will bust this cache when updated
        'Cache-Control': 'public, max-age=60, s-maxage=86400, stale-while-revalidate=86400',
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
