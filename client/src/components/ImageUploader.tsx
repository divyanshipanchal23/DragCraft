import { useState, useRef } from 'react';
import { Button } from './ui/button';
import { Loader2, Upload, Check, X } from 'lucide-react';
import { Alert, AlertDescription } from './ui/alert';
import { normalizeServerUrl } from '../utils/url-helpers';

interface ImageUploaderProps {
  onImageUploaded: (imageUrl: string) => void;
  accept?: string;
  showPreview?: boolean;
}

export default function ImageUploader({ 
  onImageUploaded, 
  accept = "image/*", 
  showPreview = true 
}: ImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setError(null);
    setSuccess(false);

    // Show local preview immediately
    const localPreview = URL.createObjectURL(file);
    setPreviewUrl(localPreview);

    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to upload image');
      }

      const data = await response.json();
      
      // Get the normalized URL (with server origin if needed)
      const serverUrl = normalizeServerUrl(data.url);
      
      // Release the local object URL since we now have the server URL
      URL.revokeObjectURL(localPreview);
      setPreviewUrl(serverUrl);
      
      // Set success state and call the callback
      setSuccess(true);
      onImageUploaded(data.url); // We pass the original URL to maintain API consistency
      
      // Reset success state after 3 seconds
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    } catch (err) {
      console.error('Upload error:', err);
      setError(err instanceof Error ? err.message : 'Failed to upload image');
      
      // Release the local preview on error
      URL.revokeObjectURL(localPreview);
      setPreviewUrl(null);
    } finally {
      setIsUploading(false);
      // Reset the file input value so the same file can be uploaded again if needed
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="space-y-3">
      <input
        type="file"
        className="hidden"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept={accept}
      />
      
      {showPreview && previewUrl && (
        <div className="border rounded-md p-2 bg-gray-50 dark:bg-gray-800">
          <div className="aspect-video bg-gray-200 dark:bg-gray-700 rounded-md overflow-hidden flex items-center justify-center">
            <img 
              src={previewUrl} 
              alt="Uploaded preview" 
              className="max-w-full max-h-full object-contain"
              onError={() => setError("Failed to load preview")}
            />
          </div>
        </div>
      )}
      
      <Button
        type="button"
        variant={success ? "default" : "outline"}
        onClick={handleUploadClick}
        disabled={isUploading}
        className="w-full"
      >
        {isUploading ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Uploading...
          </>
        ) : success ? (
          <>
            <Check className="h-4 w-4 mr-2" />
            Upload Successful
          </>
        ) : (
          <>
            <Upload className="h-4 w-4 mr-2" />
            {previewUrl ? "Change Image" : "Upload Image"}
          </>
        )}
      </Button>
      
      {error && (
        <Alert variant="destructive" className="mt-2 py-2">
          <X className="h-4 w-4 mr-2" />
          <AlertDescription className="text-xs">{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
} 