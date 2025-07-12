"use client";

import React, { useRef, useState } from "react";

interface PdfUploaderProps {
    onUpload: (file: File | null) => void; // null when removed
}

const PdfUploader: React.FC<PdfUploaderProps> = ({ onUpload }) => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file && file.type === "application/pdf") {
            setSelectedFile(file);
            onUpload(file);
        } else {
            alert("Please select a valid PDF file.");
        }
    };

    const removeFile = (e: React.MouseEvent) => {
        e.stopPropagation(); // prevent triggering input
        setSelectedFile(null);
        onUpload(null);
        if (fileInputRef.current) fileInputRef.current.value = ""; // clear input value
    };

    const triggerInput = () => {
        fileInputRef.current?.click();
    };

    return (
        <div
            className="border-2 border-dashed border-gray-300 bg-[#F8F8F8] p-6 rounded-md text-center w-full mx-auto cursor-pointer"
            onClick={triggerInput}
        >
            <span className="block font-semibold text-lg mb-2 text-[#707070]">
                Upload Media for
            </span>
            <span className="block text-sm mb-4 text-[#989898]">
                See the Full Agenda of the Day!
            </span>

            <input
                ref={fileInputRef}
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                className="hidden"
            />

            {selectedFile ? (
                <div className="flex items-center max-w-max m-auto gap-2 bg-gray-100 hover:bg-gray-200 text-sm px-4 py-2 rounded">
                    <span className="text-sm text-gray-700 truncate max-w-[200px]">
                        {selectedFile.name}
                    </span>
                    <button
                        onClick={removeFile}
                        type="button"
                        className="text-red-500 hover:text-red-700"
                        title="Remove file"
                    >
                        ✕
                    </button>
                </div>
            ) : (
                <div className="bg-gray-100 hover:bg-gray-200 text-sm px-4 py-2 rounded inline-block">
                    Click to upload PDF
                </div>
            )}
        </div>
    );
};

export default PdfUploader;
