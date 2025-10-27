
import React, { useState, useCallback } from 'react';
import { UploadIcon, SpinnerIcon } from './icons';

interface ImageUploaderProps {
  onImageUpload: (file: File) => void;
  isLoading: boolean;
  loadingText: string;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload, isLoading, loadingText }) => {
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onImageUpload(e.dataTransfer.files[0]);
    }
  }, [onImageUpload]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      onImageUpload(e.target.files[0]);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-2xl p-8 text-center">
        <h1 className="text-5xl font-serif text-gray-800 mb-2">Culinary Vision AI</h1>
        <p className="text-xl text-gray-500 mb-8">What's in your fridge? Let's cook something amazing.</p>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center text-green-600">
            <SpinnerIcon className="animate-spin h-12 w-12 mb-4" />
            <p className="text-lg font-medium">{loadingText}</p>
          </div>
        ) : (
          <form
            className={`w-full h-64 border-4 border-dashed rounded-2xl transition-colors duration-300 flex flex-col items-center justify-center ${dragActive ? 'border-green-500 bg-green-50' : 'border-gray-300 bg-white'}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onSubmit={(e) => e.preventDefault()}
          >
            <input type="file" id="file-upload" className="hidden" accept="image/*" onChange={handleChange} />
            <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center">
              <UploadIcon className="w-16 h-16 text-gray-400 mb-4" />
              <span className="text-lg font-medium text-gray-600">Drag & drop your photo here</span>
              <span className="text-gray-500 mt-1">or</span>
              <span className="mt-2 px-6 py-2 bg-green-600 text-white font-semibold rounded-full hover:bg-green-700 transition-colors">
                Browse File
              </span>
            </label>
          </form>
        )}
      </div>
    </div>
  );
};
