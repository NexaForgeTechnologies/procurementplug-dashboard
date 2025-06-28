"use client";

import React, { useRef, useState } from "react";

type Props = {
  label: string;
  onImageUpload: (base64Image: string) => void;
  showError?: boolean;
  value?: string; // for preview if already uploaded
};

const ImageUpload: React.FC<Props> = ({
  label,
  onImageUpload,
  showError,
  value,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | undefined>(value);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;

      const img = new Image();
      img.src = base64;

      img.onload = () => {
        if (img.width !== img.height) {
          alert("Image must be a 1:1 square (equal width and height).");
          return;
        }

        setPreview(base64);
        onImageUpload(base64);
      };
    };

    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setPreview(undefined);
    onImageUpload(""); // clear from parent
    if (inputRef.current) inputRef.current.value = ""; // reset input
  };

  const triggerFileInput = () => {
    inputRef.current?.click();
  };

  return (
    <div className="w-full">
      <div
        className={`relative border-dashed border-2 ${
          showError ? "border-red-500" : "border-gray-300"
        } rounded-md w-full h-50 aspect-square flex items-center justify-center cursor-pointer bg-gray-50 hover:bg-gray-100 transition`}
        onClick={triggerFileInput}
      >
        {preview ? (
          <>
            <img
              src={preview}
              alt="Preview"
              className="p-4 rounded-full m-auto w-50 h-50 aspect-square object-cover"
            />
            <button
              type="button"
              className="absolute top-2 right-2 bg-white text-red-500 px-2 py-1 text-xs rounded shadow"
              onClick={(e) => {
                e.stopPropagation();
                handleRemoveImage();
              }}
            >
              Remove
            </button>
          </>
        ) : (
          <span className="text-gray-400">Click to upload image</span>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleImageChange}
      />
    </div>
  );
};

export default ImageUpload;
