"use client";

import React, { useRef, useState } from "react";

type Props = {
  label: string;
  onImageSelect: (file: File | null) => void;
  showError?: boolean;
  value?: string; // optional preview URL if already uploaded
};

const ImageUpload: React.FC<Props> = ({ label, onImageSelect, showError, value }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | undefined>(value);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Create a temporary preview
    const localPreview = URL.createObjectURL(file);
    setPreview(localPreview);

    // Pass file to parent for later upload
    onImageSelect(file);
  };

  const handleRemoveImage = () => {
    setPreview(undefined);
    onImageSelect(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="w-full">
      <div
        className={`relative border-dashed border-2 ${showError ? "border-red-500" : "border-gray-300"
          } rounded-md w-full h-50 aspect-square flex items-center justify-center cursor-pointer bg-gray-50 hover:bg-gray-100 transition`}
        onClick={() => inputRef.current?.click()}
      >
        {preview ? (
          <>
            <img
              src={preview}
              alt="Preview"
              className="p-4 rounded-full m-auto w-50 h-50 object-cover"
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
          <div className="text-center">
            <h2 className="font-semibold text-[#707070]">Upload Media For</h2>
            <span className="text-[#989898] text-sm">
              {label ? label : "Click to upload image"}
            </span>
          </div>
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
