import sharp from 'sharp';

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
