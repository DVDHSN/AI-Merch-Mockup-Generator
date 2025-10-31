import React, { useState, useCallback, useRef } from 'react';
import { UploadIcon } from './Icons';
import type { OriginalImage } from '../types';

interface ImageUploaderProps {
  onImageUpload: (image: OriginalImage) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload }) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        // remove data:mime/type;base64, prefix
        resolve(result.split(',')[1]);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const handleFileChange = useCallback(async (files: FileList | null) => {
    if (files && files[0]) {
      const file = files[0];
      setPreview(URL.createObjectURL(file));
      const base64 = await fileToBase64(file);
      onImageUpload({ base64, mimeType: file.type });
    }
  }, [onImageUpload]);

  const onDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const onDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const onDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileChange(e.dataTransfer.files);
  }, [handleFileChange]);

  return (
    <div
      className={`relative border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-all duration-300 ${isDragging ? 'border-cyan-400 bg-gray-700' : 'border-gray-600 hover:border-cyan-500'}`}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      onClick={() => fileInputRef.current?.click()}
    >
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={(e) => handleFileChange(e.target.files)}
      />
      {preview ? (
        <img src={preview} alt="Preview" className="mx-auto max-h-48 rounded-md object-contain" />
      ) : (
        <div className="flex flex-col items-center justify-center py-8">
          <UploadIcon />
          <p className="mt-2 text-gray-400">
            <span className="font-semibold text-cyan-400">Click to upload</span> or drag and drop
          </p>
          <p className="text-xs text-gray-500">PNG, JPG, WEBP, etc.</p>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
