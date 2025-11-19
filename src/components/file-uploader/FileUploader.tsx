"use client";

import React, { useRef, useState } from "react";

type Props = {
  label: string;
  onFileSelect: (file: File | null) => void;
  showError?: boolean;
  value?: string; // existing file path, optional
  isLoading?: boolean; // optional external loading state
};

const FileUploader: React.FC<Props> = ({ label, onFileSelect, showError, value, isLoading }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string | undefined>(value);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name); // Show file name
    onFileSelect(file); // Pass file to parent
  };

  const handleRemoveFile = () => {
    setFileName(undefined);
    onFileSelect(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="w-full">
      <div
        className={`relative border-dashed border-2 ${showError ? "border-red-500" : "border-gray-300"
          } rounded-md w-full h-20 flex items-center justify-center cursor-pointer bg-gray-50 hover:bg-gray-100 transition`}
        onClick={() => !isLoading && inputRef.current?.click()}
      >
        {isLoading ? (
          <div className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-5 w-5 text-gray-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 010 16v-4l-3 3 3 3v-4a8 8 0 01-8-8z"></path>
            </svg>
            <span className="text-gray-600 text-sm">Uploading...</span>
          </div>
        ) : fileName ? (
          <div className="flex items-center justify-between w-full p-4">
            <span className="truncate">{fileName}</span>
            <button
              type="button"
              className="bg-white text-red-500 px-2 py-1 text-xs rounded shadow"
              onClick={(e) => {
                e.stopPropagation();
                handleRemoveFile();
              }}
            >
              Remove
            </button>
          </div>
        ) : (
          <div className="text-center">
            <h2 className="font-semibold text-[#707070]">{label}</h2>
            <span className="text-[#989898] text-sm">Click to upload a file</span>
          </div>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.doc,.docx,.xls,.xlsx,.txt" // Accept common document types
        className="hidden"
        onChange={handleFileChange}
        disabled={isLoading}
      />
    </div>
  );
};

export default FileUploader;
