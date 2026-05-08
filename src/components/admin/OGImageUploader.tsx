'use client';

import { useState, useRef, DragEvent, ChangeEvent } from 'react';
import { Upload, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { validateImageFileClient, formatFileSize } from '@/lib/clientFileValidation';
import { toast } from 'sonner';

interface OGImageUploaderProps {
  onUploadSuccess?: (imageUrl: string) => void;
  currentImage?: string | null;
}

export default function OGImageUploader({
  onUploadSuccess,
  currentImage,
}: OGImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFileSelection(files[0]);
    }
  };

  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelection(files[0]);
    }
  };

  const handleFileSelection = async (file: File) => {
    setError(null);
    setUploadSuccess(false);

    // Client-side validation
    const validation = validateImageFileClient(file);
    if (!validation.valid) {
      setError(validation.error || 'Invalid file');
      toast.error(validation.error || 'Invalid file');
      return;
    }

    // Upload file
    await uploadFile(file);
  };

  const uploadFile = async (file: File) => {
    setIsUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/admin/og-image', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Upload failed');
      }

      setUploadSuccess(true);
      toast.success('OG image uploaded successfully!');

      // Call success callback
      if (onUploadSuccess && data.data?.url) {
        onUploadSuccess(data.data.url);
      }

      // Reset success state after 3 seconds
      setTimeout(() => setUploadSuccess(false), 3000);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to upload image';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div
        onClick={handleClick}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer
          transition-all duration-200
          ${isDragging ? 'border-[#d4af37] bg-[#d4af37]/10' : 'border-white/20 hover:border-white/40'}
          ${isUploading ? 'pointer-events-none opacity-60' : ''}
        `}
        role="button"
        tabIndex={0}
        aria-label="Upload Open Graph image"
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleClick();
          }
        }}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/jpg,image/webp"
          onChange={handleFileInputChange}
          className="hidden"
          aria-label="File input for OG image"
        />

        <div className="flex flex-col items-center gap-4">
          {isUploading ? (
            <>
              <Loader2 className="w-12 h-12 text-[#d4af37] animate-spin" />
              <p className="text-[#f4e4c1] font-medium">Uploading...</p>
            </>
          ) : uploadSuccess ? (
            <>
              <CheckCircle2 className="w-12 h-12 text-green-400" />
              <p className="text-green-400 font-medium">Upload successful!</p>
            </>
          ) : (
            <>
              <Upload className="w-12 h-12 text-[#f4e4c1]/60" />
              <div>
                <p className="text-[#f4e4c1] font-medium mb-1">
                  Click to upload or drag and drop
                </p>
                <p className="text-[#f4e4c1]/60 text-sm">
                  PNG, JPG, or WebP (max 5MB)
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Recommended Size Hint */}
      <div className="flex items-start gap-2 text-sm text-[#f4e4c1]/70 bg-white/5 rounded-lg p-3">
        <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
        <p>
          <strong>Recommended size:</strong> 1200x630px for optimal social media display
          (Facebook, Twitter, LinkedIn)
        </p>
      </div>

      {/* Error Display */}
      {error && (
        <div className="flex items-start gap-2 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg p-3">
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
          <p>{error}</p>
        </div>
      )}
    </div>
  );
}
