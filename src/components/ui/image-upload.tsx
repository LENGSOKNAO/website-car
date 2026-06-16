import { useState } from 'react';
import Button from '@/components/ui/Button';
import ImageWithLoading from '@/components/ui/ImageWithLoading';
import Card from '@/components/ui/Card';

interface ImageUploadProps {
  onChange: (file: File) => Promise<void>;
  uploading?: boolean;
  previewUrl?: string | null;
  accept?: string;
  maxSize?: number; // in MB
}

export const ImageUpload = ({
  onChange,
  uploading = false,
  previewUrl = null,
  accept = 'image/*',
  maxSize = 5
}: ImageUploadProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      setSelectedFile(null);
      setError(null);
      return;
    }

    // Validate file type
    if (!file.type.match(accept)) {
      setError('Please select an image file');
      setSelectedFile(null);
      return;
    }

    // Validate file size
    const maxSizeInBytes = maxSize * 1024 * 1024;
    if (file.size > maxSizeInBytes) {
      setError(`File size must be less than ${maxSize}MB`);
      setSelectedFile(null);
      return;
    }

    setSelectedFile(file);
    setError(null);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    
    try {
      await onChange(selectedFile);
    } catch {
      setError('Upload failed. Please try again.');
    }
  };

  return (
    <div className="space-y-4">
      {/* Preview */}
      {previewUrl || selectedFile ? (
        <Card padding="lg" className="bg-dark-800 p-6">
          <div className="flex items-center justify-center" style={{ minHeight: '200px' }}>
            <ImageWithLoading
              src={previewUrl || URL.createObjectURL(selectedFile!)}
              alt="Preview"
              className="rounded"
              width="100%"
              height={200}
            />
          </div>
        </Card>
      ) : (
        <Card padding="lg" className="bg-dark-800">
          <div className="flex items-center justify-center p-6 text-dark-400">
            No image selected
          </div>
        </Card>
      )}

      {/* Error */}
      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}

      {/* Upload Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <label className="block sm:text-left w-full">
          <input
            type="file"
            accept={accept}
            className="block w-full text-sm text-dark-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-dark-700 file:text-dark-200 hover:file:bg-dark-600"
            onChange={handleFileChange}
            disabled={uploading}
          />
        </label>
        
        <Button
          onClick={handleUpload}
          disabled={!selectedFile || uploading}
          className="w-full sm:w-auto"
        >
          {uploading ? 'Uploading...' : 'Upload Image'}
        </Button>
      </div>
    </div>
  );
};