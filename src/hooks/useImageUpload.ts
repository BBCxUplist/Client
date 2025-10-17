import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export interface UploadResult {
  success: boolean;
  url?: string;
  error?: string;
}

export const useImageUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = async (
    file: File,
    bucketName: string = 'artist'
  ): Promise<UploadResult> => {
    setUploading(true);
    setError(null);

    try {
      // Validate file type (images or audio)
      const isImage = file.type.startsWith('image/');
      const isAudio =
        file.type.startsWith('audio/') ||
        ['.mp3', '.wav', '.ogg', '.m4a'].some(ext =>
          file.name.toLowerCase().endsWith(ext)
        );

      if (!isImage && !isAudio) {
        const errorMsg = 'Please select an image or audio file';
        setError(errorMsg);
        return { success: false, error: errorMsg };
      }

      // Validate file size (max 5MB for images, 50MB for audio)
      const maxSize = isImage ? 5 * 1024 * 1024 : 50 * 1024 * 1024; // 5MB for images, 50MB for audio
      if (file.size > maxSize) {
        const errorMsg = isImage
          ? 'Image file size must be less than 5MB'
          : 'Audio file size must be less than 50MB';
        setError(errorMsg);
        return { success: false, error: errorMsg };
      }

      // Get current user
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        const errorMsg = 'User not authenticated';
        setError(errorMsg);
        return { success: false, error: errorMsg };
      }

      // Generate file path with user ID and appropriate extension
      const fileExtension = isImage
        ? 'png'
        : file.name.split('.').pop() || 'mp3';
      const fileType = isImage ? 'avatar' : 'audio';
      const filePath = `${user.id}/${fileType}-${Date.now()}.${fileExtension}`;

      // Upload file to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(filePath, file, {
          upsert: true,
          contentType: file.type,
        });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        const errorMsg = uploadError.message || 'Upload failed';
        setError(errorMsg);
        return { success: false, error: errorMsg };
      }

      // Get public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from(bucketName).getPublicUrl(filePath);

      setUploadedUrl(publicUrl);
      return { success: true, url: publicUrl };
    } catch (error: any) {
      console.error('Upload error:', error);
      const errorMessage = error.message || 'An unexpected error occurred';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setUploading(false);
    }
  };

  const handleFileDelete = async (
    url: string,
    bucketName: string = 'artist'
  ): Promise<UploadResult> => {
    setError(null);

    try {
      // Extract file path from URL
      const urlParts = url.split('/');
      const fileName = urlParts[urlParts.length - 1];
      const folder = urlParts[urlParts.length - 2];
      const filePath = `${folder}/${fileName}`;

      // Delete file from Supabase Storage
      const { error: deleteError } = await supabase.storage
        .from(bucketName)
        .remove([filePath]);

      if (deleteError) {
        console.error('Delete error:', deleteError);
        const errorMsg = deleteError.message || 'Delete failed';
        setError(errorMsg);
        return { success: false, error: errorMsg };
      }

      setUploadedUrl(null);
      return { success: true };
    } catch (error: any) {
      console.error('Delete error:', error);
      const errorMessage = error.message || 'An unexpected error occurred';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const reset = () => {
    setUploadedUrl(null);
    setError(null);
    setUploading(false);
  };

  return {
    uploading,
    uploadedUrl,
    error,
    handleFileUpload,
    handleFileDelete,
    reset,
  };
};
