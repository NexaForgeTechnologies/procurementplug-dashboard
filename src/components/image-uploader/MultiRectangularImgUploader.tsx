// "use client";

// import React, { useRef, useState, useEffect } from "react";

// type Props = {
//   label: string;
//   onImageUpload: (images: File[] | null) => void;
//   showError?: boolean;
//   value?: string[]; // external image URLs
//   multiple?: boolean;
// };

// const MultiRectangularImgUploader: React.FC<Props> = ({
//   label,
//   onImageUpload,
//   showError,
//   value = [],
//   multiple = true,
// }) => {
//   const inputRef = useRef<HTMLInputElement>(null);
//   const [previews, setPreviews] = useState<string[]>(value);
//   const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

//   // Sync previews if parent value changes
//   useEffect(() => {
//     setPreviews(value);
//   }, [value]);

//   // Handle image select
//   const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const files = e.target.files;
//     if (!files || files.length === 0) return;

//     const newFiles = Array.from(files);
//     const newPreviews = newFiles.map((file) => URL.createObjectURL(file));

//     // Combine new + old previews/files if multiple
//     const updatedPreviews = multiple ? [...previews, ...newPreviews] : newPreviews;
//     const updatedFiles = multiple ? [...selectedFiles, ...newFiles] : newFiles;

//     setPreviews(updatedPreviews);
//     setSelectedFiles(updatedFiles);
//     onImageUpload(updatedFiles);
//   };

//   // Handle image removal
//   const handleRemoveImage = (index: number) => {
//     const updatedPreviews = previews.filter((_, i) => i !== index);
//     const updatedFiles = selectedFiles.filter((_, i) => i !== index);

//     setPreviews(updatedPreviews);
//     setSelectedFiles(updatedFiles);

//     onImageUpload(updatedFiles.length > 0 ? updatedFiles : null);

//     if (inputRef.current) inputRef.current.value = "";
//   };

//   return (
//     <div className="w-full">
//       <div
//         className={`relative border-dashed border-2 ${showError ? "border-red-500" : "border-gray-300"
//           } rounded-md w-full min-h-[150px] p-4 flex flex-wrap gap-4 items-center justify-center cursor-pointer bg-gray-50 hover:bg-gray-100 transition`}
//         onClick={() => inputRef.current?.click()}
//       >
//         {previews.length > 0 ? (
//           previews.map((src, index) => (
//             <div key={index} className="relative">
//               <img
//                 src={src}
//                 alt={`Preview ${index}`}
//                 className="p-2 rounded-md w-[250px] h-[120px] object-contain bg-white border"
//               />
//               <button
//                 type="button"
//                 className="absolute top-2 right-2 bg-white text-red-500 px-2 py-1 text-xs rounded shadow"
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   handleRemoveImage(index);
//                 }}
//               >
//                 Remove
//               </button>
//             </div>
//           ))
//         ) : (
//           <div className="text-center">
//             <h2 className="font-semibold text-[#707070]">Upload Media For</h2>
//             <span className="text-[#989898] text-sm">
//               {label || "Click to upload images"}
//             </span>
//           </div>
//         )}
//       </div>

//       <input
//         ref={inputRef}
//         type="file"
//         accept="image/*"
//         multiple={multiple}
//         className="hidden"
//         onChange={handleImageChange}
//       />
//     </div>
//   );
// };

// export default MultiRectangularImgUploader;

"use client";

import React, { useRef, useState, useEffect } from "react";

type Props = {
  label: string;
  onImageUpload: (files: File[] | null) => void;
  onImageRemove?: (url: string) => void; // 👈 add this
  showError?: boolean;
  value?: string[];
  multiple?: boolean;
};


const MultiRectangularImgUploader: React.FC<Props> = ({
  label,
  onImageUpload,
  onImageRemove,
  showError,
  value = [],
  multiple = true,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [previews, setPreviews] = useState<string[]>(value);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  // ✅ Notify parent only after state updates (avoids render-phase update)
  useEffect(() => {
    if (selectedFiles.length > 0) {
      onImageUpload(selectedFiles);
    } else {
      onImageUpload(null);
    }
  }, [selectedFiles]); // runs AFTER render safely

  // Sync external URLs from parent (e.g. S3)
  useEffect(() => {
    if (value && value.length > 0) {
      setPreviews(value);
    }
  }, [JSON.stringify(value)]);

  // Clean up blobs
  useEffect(() => {
    return () => {
      previews.forEach((url) => {
        if (url.startsWith("blob:")) URL.revokeObjectURL(url);
      });
    };
  }, [previews]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newFiles = Array.from(files);
    const newPreviews = newFiles.map((file) => URL.createObjectURL(file));

    setSelectedFiles((prev) => [...prev, ...newFiles]);
    setPreviews((prev) => [...prev, ...newPreviews]);

    if (inputRef.current) inputRef.current.value = "";
  };

  const handleRemoveImage = (index: number) => {
    const removedUrl = previews[index]; // 👈 store before removing
    const updatedPreviews = previews.filter((_, i) => i !== index);
    const updatedFiles = selectedFiles.filter((_, i) => i !== index);

    setPreviews(updatedPreviews);
    setSelectedFiles(updatedFiles);

    if (onImageRemove && removedUrl && !removedUrl.startsWith("blob:")) {
      onImageRemove(removedUrl); // 👈 notify parent only for DB images
    }

    if (updatedPreviews.length === 0) onImageUpload(null);
  };


  return (
    <div className="w-full">
      <div
        className={`relative border-dashed border-2 ${showError ? "border-red-500" : "border-gray-300"
          } rounded-md w-full min-h-[150px] p-4 flex flex-wrap gap-4 items-center justify-center cursor-pointer bg-gray-50 hover:bg-gray-100 transition`}
        onClick={() => inputRef.current?.click()}
      >
        {previews.length > 0 ? (
          previews.map((src, index) => (
            <div key={index} className="relative">
              <img
                src={src}
                alt={`Preview ${index}`}
                className="p-2 rounded-md w-[250px] h-[120px] object-contain bg-white border"
              />
              <button
                type="button"
                className="absolute top-2 right-2 bg-white text-red-500 px-2 py-1 text-xs rounded shadow"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveImage(index);
                }}
              >
                Remove
              </button>
            </div>
          ))
        ) : (
          <div className="text-center">
            <h2 className="font-semibold text-[#707070]">Upload Media For</h2>
            <span className="text-[#989898] text-sm">
              {label || "Click to upload images"}
            </span>
          </div>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple={multiple}
        className="hidden"
        onChange={handleImageChange}
      />
    </div>
  );
};

export default MultiRectangularImgUploader;
