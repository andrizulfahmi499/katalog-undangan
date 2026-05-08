/**
 * Client-side file validation result
 */
export interface ClientValidationResult {
  valid: boolean;
  error?: string;
}

/**
 * Allowed MIME types for OG images (client-side)
 */
const ALLOWED_MIME_TYPES = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];

/**
 * Maximum file size in bytes (5MB)
 */
const MAX_FILE_SIZE = 5 * 1024 * 1024;

/**
 * Validates an image file on the client side (synchronous)
 * Provides immediate feedback before upload
 * 
 * @param file - The file to validate
 * @returns Validation result with error message if invalid
 */
export function validateImageFileClient(file: File): ClientValidationResult {
  // Check if file exists
  if (!file) {
    return {
      valid: false,
      error: 'No file selected',
    };
  }

  // Check file type
  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: `Invalid file type. Please upload PNG, JPG, or WebP images only.`,
    };
  }

  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
    const maxSizeMB = MAX_FILE_SIZE / (1024 * 1024);
    return {
      valid: false,
      error: `File size (${sizeMB}MB) exceeds maximum of ${maxSizeMB}MB`,
    };
  }

  return {
    valid: true,
  };
}

/**
 * Formats file size in human-readable format
 * 
 * @param bytes - File size in bytes
 * @returns Formatted string (e.g., "2.5 MB")
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

/**
 * Gets image dimensions from a File object
 * 
 * @param file - The image file
 * @returns Promise with width and height
 */
export function getImageDimensions(
  file: File
): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve({
        width: img.width,
        height: img.height,
      });
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load image'));
    };

    img.src = url;
  });
}
