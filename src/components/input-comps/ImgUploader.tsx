// "use client";

// import React, { useRef, useState } from "react";

// type Props = {
//    label: string;
//    onImageUpload: (imagePath: string) => void;
//    showError?: boolean;
//    value?: string; // preview if already uploaded
// };

// const ImageUpload: React.FC<Props> = ({
//    label,
//    onImageUpload,
//    showError,
//    value,
// }) => {
//    const inputRef = useRef<HTMLInputElement>(null);
//    const [preview, setPreview] = useState<string | undefined>(value);
//    console.log(preview);


//    const handleImageChange = async (
//       e: React.ChangeEvent<HTMLInputElement>
//    ) => {
//       const file = e.target.files?.[0];
//       if (!file) {
//          console.log("❌ No file selected");
//          return;
//       }

//       const formData = new FormData();
//       formData.append("file", file);

//       try {
//          const res = await fetch("/api/image-uploads", {
//             method: "POST",
//             body: formData,
//          });

//          if (!res.ok) throw new Error("Upload failed");

//          const data = await res.json();
//          const imagePath = data.url; // e.g. "/uploads/speaker_123.png"

//          setPreview(imagePath);
//          onImageUpload(imagePath); // send path to parent
//       } catch (error) {
//          console.error("Upload error:", error);
//          alert("Failed to upload image");
//       }
//    };

//    const handleRemoveImage = () => {
//       setPreview(undefined);
//       onImageUpload(""); // notify parent
//       if (inputRef.current) inputRef.current.value = "";
//    };

//    return (
//       <div className="w-full">
//          <div
//             className={`relative border-dashed border-2 ${showError ? "border-red-500" : "border-gray-300"
//                } rounded-md w-full h-[150px] aspect-square flex items-center justify-center cursor-pointer bg-gray-50 hover:bg-gray-100 transition`}
//             onClick={() => inputRef.current?.click()}
//          >
//             {preview ? (
//                <>
//                   <img
//                      src={preview}
//                      alt="Preview"
//                      className="p-4 rounded-2xl m-auto w-[350px] h-[150px] object-cover"
//                   />
//                   <button
//                      type="button"
//                      className="absolute top-2 right-2 bg-white text-red-500 px-2 py-1 text-xs rounded shadow"
//                      onClick={(e) => {
//                         e.stopPropagation();
//                         handleRemoveImage();
//                      }}
//                   >
//                      Remove
//                   </button>
//                </>
//             ) : (
//                <div className="text-center">
//                   <h2 className="font-semibold text-[#707070]">Upload Media For</h2>
//                   <span className="text-[#989898] text-sm">
//                      {label ? label : "Click to upload image"}
//                   </span>
//                </div>
//             )}
//          </div>

//          <input
//             ref={inputRef}
//             type="file"
//             accept="image/*"
//             className="hidden"
//             onChange={handleImageChange}
//          />
//       </div>
//    );
// };

// export default ImageUpload;


"use client";

import React, { useRef, useState, useEffect } from "react";

type Props = {
   label: string;
   onImageUpload: (imagePaths: string[]) => void;
   showError?: boolean;
   value?: string[]; // always string[] for consistency
   multiple?: boolean;
};

const ImageUpload: React.FC<Props> = ({
   label,
   onImageUpload,
   showError,
   value = [],
   multiple = false,
}) => {
   const inputRef = useRef<HTMLInputElement>(null);
   const [preview, setPreview] = useState<string[]>([]);

   // Sync previews if value prop changes externally
   useEffect(() => {
      setPreview(value);
   }, [value]);

   const handleImageChange = async (
      e: React.ChangeEvent<HTMLInputElement>
   ) => {
      const files = e.target.files;
      if (!files || files.length === 0) {
         console.log("❌ No file selected");
         return;
      }

      const uploadedImages: string[] = [];

      for (const file of Array.from(files)) {
         const formData = new FormData();
         formData.append("file", file);

         try {
            const res = await fetch("/api/image-uploads", {
               method: "POST",
               body: formData,
            });

            if (!res.ok) throw new Error("Upload failed");

            const data = await res.json();
            const imagePath = data.url; // e.g. "/uploads/image.png"
            uploadedImages.push(imagePath);
         } catch (error) {
            console.error("Upload error:", error);
            alert("Failed to upload image");
         }
      }

      const updatedPreview = multiple
         ? [...preview, ...uploadedImages]
         : [uploadedImages[0]];

      setPreview(updatedPreview);
      onImageUpload(updatedPreview);
   };

   const handleRemoveImage = (index: number) => {
      const newPreview = [...preview];
      newPreview.splice(index, 1);
      setPreview(newPreview);
      onImageUpload(newPreview);
      if (inputRef.current) inputRef.current.value = "";
   };

   return (
      <div className="w-full">
         <div
            className={`relative border-dashed border-2 ${showError ? "border-red-500" : "border-gray-300"
               } rounded-md w-full min-h-[150px] p-4 flex flex-wrap gap-4 items-center justify-center cursor-pointer bg-gray-50 hover:bg-gray-100 transition`}
            onClick={() => inputRef.current?.click()}
         >
            {preview.length > 0 ? (
               preview.map((img, index) => (
                  <div key={index} className="relative">
                     <img
                        src={img}
                        alt={`Preview ${index}`}
                        className="rounded-xl w-[250px] h-[100px]"
                     />
                     <button
                        type="button"
                        className="absolute top-1 right-1 bg-white text-red-500 px-1 py-0.5 text-xs rounded shadow"
                        onClick={(e) => {
                           e.stopPropagation();
                           handleRemoveImage(index);
                        }}
                     >
                        ✕
                     </button>
                  </div>
               ))
            ) : (
               <div className="text-center">
                  <h2 className="font-semibold text-[#707070]">
                     Upload Media For
                  </h2>
                  <span className="text-[#989898] text-sm">
                     {label || "Click to upload image"}
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

export default ImageUpload;
