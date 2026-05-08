import { writeFile, unlink } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import sharp from 'sharp';
import { v4 as uuidv4 } from 'uuid';

/**
 * Validation result for file upload
 */
export interface ValidationResult {
  valid: boolean;
  error?: string;
  metadata?: {
    width: number;
    height: number;
    format: string;
    size: number;
  };
}

/**
 * Allowed MIME types for OG images
 */
const ALLOWED_MIME_TYPES = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];

/**
 * Maximum file size in bytes (5MB)
 */
const MAX_FILE_SIZE = 5 * 1024 * 1024;

/**
 * Recommended OG image dimensions
 */
export const RECOMMENDED_OG_WIDTH = 1200;
export const RECOMMENDED_OG_HEIGHT = 630;

/**
 * Validates an image file for OG image upload
 * 
 * @param file - The file to validate
 * @returns Validation result with metadata or error
 */
export async function validateImageFile(file: File): Promise<ValidationResult> {
  try {
    // Check file type
    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return {
        valid: false,
        error: `Invalid file type. Allowed types: ${ALLOWED_MIME_TYPES.join(', ')}`,
      };
    }

    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      return {
        valid: false,
        error: `File size exceeds maximum of ${MAX_FILE_SIZE / (1024 * 1024)}MB`,
      };
    }

    // Convert File to Buffer for sharp processing
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Validate image and get metadata using sharp
    const metadata = await sharp(buffer).metadata();

    if (!metadata.width || !metadata.height || !metadata.format) {
      return {
        valid: false,
        error: 'Invalid image file or corrupted data',
      };
    }

    return {
      valid: true,
      metadata: {
        width: metadata.width,
        height: metadata.height,
        format: metadata.format,
        size: file.size,
      },
    };
  } catch (error) {
    return {
      valid: false,
      error: error instanceof Error ? error.message : 'Failed to validate image',
    };
  }
}

/**
 * Generates a unique filename for uploaded file
 * 
 * @param originalName - Original filename
 * @returns Unique filename with timestamp and UUID
 */
export function generateUniqueFilename(originalName: string): string {
  const ext = path.extname(originalName);
  const timestamp = Date.now();
  const uuid = uuidv4().split('-')[0]; // Use first segment of UUID for brevity
  return `og-${timestamp}-${uuid}${ext}`;
}

/**
 * Saves a file to disk
 * 
 * @param file - The file to save
 * @param filePath - Absolute path where file should be saved
 */
export async function saveFileToDisk(file: File, filePath: string): Promise<void> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    await writeFile(filePath, buffer);
  } catch (error) {
    throw new Error(
      `Failed to save file: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

/**
 * Deletes a file from disk
 * 
 * @param filePath - Absolute path of file to delete
 * @returns True if file was deleted, false if file didn't exist
 */
export async function deleteFileFromDisk(filePath: string): Promise<boolean> {
  try {
    if (!existsSync(filePath)) {
      return false;
    }
    await unlink(filePath);
    return true;
  } catch (error) {
    throw new Error(
      `Failed to delete file: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

/**
 * Gets the public URL path for an uploaded OG image
 * 
 * @param filename - The filename of the uploaded image
 * @returns Public URL path (e.g., /uploads/og-images/filename.png)
 */
export function getPublicImageUrl(filename: string): string {
  return `/uploads/og-images/${filename}`;
}

/**
 * Gets the absolute file system path for an OG image
 * 
 * @param filename - The filename of the image
 * @returns Absolute file system path
 */
export function getAbsoluteImagePath(filename: string): string {
  return path.join(process.cwd(), 'public', 'uploads', 'og-images', filename);
}

/**
 * Extracts filename from a public URL path
 * 
 * @param url - Public URL path (e.g., /uploads/og-images/filename.png)
 * @returns Filename or null if invalid URL
 */
export function extractFilenameFromUrl(url: string): string | null {
  const match = url.match(/\/uploads\/og-images\/(.+)$/);
  return match ? match[1] : null;
}
