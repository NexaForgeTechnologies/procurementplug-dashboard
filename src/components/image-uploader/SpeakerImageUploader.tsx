"use client";

import React, { useRef, useState } from "react";

type Props = {
  label: string;
  onImageUpload: (imagePath: string) => void;
  showError?: boolean;
  value?: string; // preview if already uploaded
};

const ImageUpload: React.FC<Props> = ({
  label,
  onImageUpload,
  showError,
  value,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | undefined>(value);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/img-uploads", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");

      const data = await res.json();
      const imagePath = data.url; // e.g. "/uploads/speaker_123.png"

      setPreview(imagePath);
      onImageUpload(imagePath); // send path to parent
    } catch (error) {
      console.error("Upload error:", error);
      alert("Failed to upload image");
    }
  };

  const handleRemoveImage = () => {
    setPreview(undefined);
    onImageUpload(""); // notify parent
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="w-full">
      <div
        className={`relative border-dashed border-2 ${
          showError ? "border-red-500" : "border-gray-300"
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
