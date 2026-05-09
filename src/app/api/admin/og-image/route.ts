import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { validateImageFile } from '@/lib/fileUpload';

/**
 * POST /api/admin/og-image
 * Upload a custom Open Graph image for landing page
 * Stores image as base64 in database (Vercel-compatible, no filesystem dependency)
 */
export async function POST(request: NextRequest) {
  try {
    // Get form data
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate the image file
    const validation = await validateImageFile(file);
    if (!validation.valid) {
      return NextResponse.json(
        { success: false, error: validation.error },
        { status: 400 }
      );
    }

    // Convert file to base64
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64Data = buffer.toString('base64');
    const mimeType = file.type || 'image/png';

    // The public URL that will be used in OG meta tags
    const ogImageUrl = '/api/public/og-image';

    // Store image data in database (works on Vercel serverless)
    await db.globalSetting.upsert({
      where: { id: 'global' },
      update: {
        landingPageOgImage: ogImageUrl,
        landingPageOgImageData: base64Data,
        landingPageOgImageMime: mimeType,
      },
      create: {
        id: 'global',
        landingPageTheme: 'default',
        landingPageOgImage: ogImageUrl,
        landingPageOgImageData: base64Data,
        landingPageOgImageMime: mimeType,
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        url: ogImageUrl,
        metadata: validation.metadata,
      },
    });
  } catch (error) {
    console.error('Error uploading OG image:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to upload image',
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/og-image
 * Delete the custom Open Graph image and revert to default
 */
export async function DELETE(request: NextRequest) {
  try {
    // Update database to remove OG image data
    await db.globalSetting.update({
      where: { id: 'global' },
      data: {
        landingPageOgImage: null,
        landingPageOgImageData: null,
        landingPageOgImageMime: null,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Custom OG image deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting OG image:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to delete image',
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/admin/og-image
 * Get current OG image URL
 */
export async function GET(request: NextRequest) {
  try {
    const setting = await db.globalSetting.findUnique({
      where: { id: 'global' },
      select: { landingPageOgImage: true },
    });

    return NextResponse.json({
      success: true,
      data: {
        ogImage: setting?.landingPageOgImage || null,
      },
    });
  } catch (error) {
    console.error('Error fetching OG image:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch OG image',
      },
      { status: 500 }
    );
  }
}
