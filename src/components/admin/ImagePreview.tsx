'use client';

import { useState } from 'react';
import { Trash2, Loader2, ExternalLink } from 'lucide-react';
import Image from 'next/image';
import { toast } from 'sonner';

interface ImagePreviewProps {
  imageUrl: string;
  onDelete?: () => void;
}

export default function ImagePreview({ imageUrl, onDelete }: ImagePreviewProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);

    try {
      const response = await fetch('/api/admin/og-image', {
        method: 'DELETE',
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to delete image');
      }

      toast.success('OG image deleted successfully');
      setShowConfirmDialog(false);

      // Call delete callback
      if (onDelete) {
        onDelete();
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete image';
      toast.error(errorMessage);
    } finally {
      setIsDeleting(false);
    }
  };

  const openConfirmDialog = () => {
    setShowConfirmDialog(true);
  };

  const closeConfirmDialog = () => {
    setShowConfirmDialog(false);
  };

  // Get full URL for preview
  const fullImageUrl = imageUrl.startsWith('http')
    ? imageUrl
    : `https://katalog-id.vercel.app${imageUrl}`;

  return (
    <div className="space-y-4">
      {/* Image Preview */}
      <div className="relative bg-white/5 rounded-xl overflow-hidden border border-white/10">
        <div className="aspect-[1200/630] relative">
          {imageError ? (
            <div className="absolute inset-0 flex items-center justify-center text-[#f4e4c1]/60">
              <p>Failed to load image</p>
            </div>
          ) : (
            <Image
              src={imageUrl}
              alt="Open Graph preview"
              fill
              className="object-contain"
              onError={() => setImageError(true)}
            />
          )}
        </div>
      </div>

      {/* Image Info and Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white/5 rounded-lg p-4">
        <div className="flex-1">
          <p className="text-[#f4e4c1] font-medium mb-1">Current OG Image</p>
          <p className="text-[#f4e4c1]/60 text-sm break-all">{imageUrl}</p>
        </div>

        <div className="flex items-center gap-2">
          <a
            href={fullImageUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/15 border border-white/20 rounded-lg text-[#f4e4c1] transition-all text-sm font-medium min-h-[44px]"
          >
            <ExternalLink className="w-4 h-4" />
            <span>View</span>
          </a>

          <button
            onClick={openConfirmDialog}
            disabled={isDeleting}
            className="inline-flex items-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/40 rounded-lg text-red-400 transition-all text-sm font-medium min-h-[44px] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isDeleting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Deleting...</span>
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4" />
                <span>Delete</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Confirmation Dialog */}
      {showConfirmDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-[#172a26] border border-white/20 rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <h3 className="text-xl font-bold text-[#f4e4c1] mb-3">
              Delete OG Image?
            </h3>
            <p className="text-[#f4e4c1]/70 mb-6">
              Are you sure you want to delete this Open Graph image? The landing page will
              revert to using the default image (/logo.png).
            </p>

            <div className="flex items-center gap-3">
              <button
                onClick={closeConfirmDialog}
                disabled={isDeleting}
                className="flex-1 px-4 py-2.5 bg-white/10 hover:bg-white/15 border border-white/20 rounded-lg text-[#f4e4c1] transition-all font-medium min-h-[44px] disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex-1 px-4 py-2.5 bg-red-500 hover:bg-red-600 rounded-lg text-white transition-all font-medium min-h-[44px] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
