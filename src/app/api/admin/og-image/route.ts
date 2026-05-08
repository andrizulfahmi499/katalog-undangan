import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import {
  validateImageFile,
  generateUniqueFilename,
  saveFileToDisk,
  deleteFileFromDisk,
  getPublicImageUrl,
  getAbsoluteImagePath,
  extractFilenameFromUrl,
} from '@/lib/fileUpload';

/**
 * POST /api/admin/og-image
 * Upload a custom Open Graph image for landing page
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

    // Generate unique filename
    const filename = generateUniqueFilename(file.name);
    const absolutePath = getAbsoluteImagePath(filename);
    const publicUrl = getPublicImageUrl(filename);

    // Get current OG image to delete old file
    const currentSetting = await db.globalSetting.findUnique({
      where: { id: 'global' },
    });

    try {
      // Save new file to disk
      await saveFileToDisk(file, absolutePath);

      // Update database with new image URL
      await db.globalSetting.upsert({
        where: { id: 'global' },
        update: { landingPageOgImage: publicUrl },
        create: {
          id: 'global',
          landingPageTheme: 'default',
          landingPageOgImage: publicUrl,
        },
      });

      // Delete old file if exists
      if (currentSetting?.landingPageOgImage) {
        const oldFilename = extractFilenameFromUrl(currentSetting.landingPageOgImage);
        if (oldFilename) {
          const oldPath = getAbsoluteImagePath(oldFilename);
          await deleteFileFromDisk(oldPath).catch((err) => {
            console.warn('Failed to delete old OG image:', err);
          });
        }
      }

      return NextResponse.json({
        success: true,
        data: {
          url: publicUrl,
          filename,
          metadata: validation.metadata,
        },
      });
    } catch (error) {
      // Rollback: delete uploaded file if database update fails
      await deleteFileFromDisk(absolutePath).catch(() => {});

      throw error;
    }
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
    // Get current OG image from database
    const currentSetting = await db.globalSetting.findUnique({
      where: { id: 'global' },
    });

    if (!currentSetting?.landingPageOgImage) {
      return NextResponse.json({
        success: true,
        message: 'No custom OG image to delete',
      });
    }

    // Extract filename from URL
    const filename = extractFilenameFromUrl(currentSetting.landingPageOgImage);

    // Update database to remove OG image
    await db.globalSetting.update({
      where: { id: 'global' },
      data: { landingPageOgImage: null },
    });

    // Delete file from disk (handle missing file gracefully)
    if (filename) {
      const absolutePath = getAbsoluteImagePath(filename);
      const deleted = await deleteFileFromDisk(absolutePath);

      if (!deleted) {
        console.warn('OG image file not found on disk, but database was updated');
      }
    }

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
