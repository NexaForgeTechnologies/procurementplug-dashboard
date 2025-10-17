"use client";

import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

import { LegalComplianceDM } from "@/domain-models/legal-compliance/LegalComplianceDM";

import IconComponent from "@/components/icon/IconComp";
import InputComponent from "@/components/input-comps/InputTxt";
import CircularImageUploader from "@/components/image-uploader/CircularImageUploader";
import CommaInputTextArea from "@/components/input-comps/CommaSeperatedTextAria";
import DropdownComp from "@/components/select/DropdownComp";
import ServicesList from "@/components/input-comps/ListItemComponent";
import MultiRectangularImgUploader from "@/components/image-uploader/MultiRectangularImgUploader";

import { useGeneric } from "@/hooks/useGeneric";

type SpeakerFormProps = {
   compliance?: LegalComplianceDM;
   onClose: () => void;
   refetchLegalCompliance: () => void;
};

const EditSpeakerComp: React.FC<SpeakerFormProps> = ({
   compliance,
   onClose,
   refetchLegalCompliance,
}) => {

   // Initial state for form
   const initialFormValues: LegalComplianceDM = {
      img: compliance?.img,
      name: compliance?.name,
      experties: compliance?.experties,
      overview: compliance?.overview,
      email: compliance?.email,
      jurisdictional_coverage: compliance?.jurisdictional_coverage,
      company_logo: compliance?.company_logo,
      practice_areas: compliance?.practice_areas,
      services: compliance?.services,
      sample_templates: compliance?.sample_templates,
      testimonials: compliance?.testimonials,

      legal_compliance_type_id: compliance?.legal_compliance_type_id,
      legal_compliance_type_name: compliance?.legal_compliance_type_name,
      industry_id: compliance?.industry_id,
      industry_name: compliance?.industry_name,
      region_id: compliance?.region_id,
      region_name: compliance?.region_name,
   };
   const [formValues, setFormValues] = useState<LegalComplianceDM>(initialFormValues);
   const [validationErrors, setValidationErrors] = useState({
      name: false,
   });
   const handleChange = <K extends keyof LegalComplianceDM>(
      field: K,
      value: LegalComplianceDM[K] | null
   ) => {
      setFormValues(prev => ({
         ...prev,
         [field]: value,
      }));

      if (typeof value === "string" && value.trim()) {
         setValidationErrors(prev => ({ ...prev, [field]: false }));
      }
   };
   const validateForm = () => {
      const errors = {
         name: !formValues.name?.trim(),
      };

      setValidationErrors(errors);
      return !Object.values(errors).some((e) => e);
   };

   const [selectedFile, setSelectedFile] = useState<File | null>(null);
   const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
   const [isSubmitting, setIsSubmitting] = useState(false);

   const update = useMutation({
      mutationFn: async (data: LegalComplianceDM) => {
         const response = await axios.put("/api/legal-compliance", data);
         return response.data;
      },
      onSuccess: () => {
         refetchLegalCompliance();
         onClose();
      },
      onError: (error) => {
         console.error("Failed to updated compliance:", error);
      },
   });
   const handleUpdate = async () => {
      if (!validateForm()) return;

      setIsSubmitting(true);

      try {
         let imageUrl = formValues.img; // single image
         let companyImgUrls: string[] = formValues.company_logo || [];

         // 🔹 STEP 1 — Handle single image (img)
         if (selectedFile) {
            // Delete old image if exists
            if (compliance?.img && compliance.img !== "") {
               await axios.delete("/api/img-uploads", { data: { url: compliance.img } });
            }

            // Upload new single image
            const formData = new FormData();
            formData.append("file", selectedFile);

            const res = await fetch("/api/img-uploads", {
               method: "POST",
               body: formData,
            });
            if (!res.ok) throw new Error("Single image upload failed");
            const data = await res.json();

            imageUrl = data.url;
         }

         // If user manually cleared the image
         if (!formValues.img && compliance?.img) {
            await axios.delete("/api/img-uploads", { data: { url: compliance.img } });
            imageUrl = "";
         }

         // 🔹 STEP 2 — Handle multiple company logos
         const oldCompanyImgs = compliance?.company_logo || [];
         const removedImgs = oldCompanyImgs.filter((url: string) => !companyImgUrls.includes(url));

         // Delete removed company logos
         if (removedImgs.length > 0) {
            await Promise.all(
               removedImgs.map(async (url) =>
                  axios.delete("/api/img-uploads", { data: { url } })
               )
            );
         }

         // Upload new company logos if any selected
         if (selectedFiles.length > 0) {
            const formData = new FormData();
            selectedFiles.forEach((file) => formData.append("file", file));

            const res = await fetch("/api/img-uploads", {
               method: "POST",
               body: formData,
            });
            if (!res.ok) throw new Error("Multiple image upload failed");

            const data = await res.json();
            const uploadedUrls = data.urls || [data.url];

            // Keep existing (not removed) + add new ones
            companyImgUrls = [
               ...companyImgUrls.filter((url) => !removedImgs.includes(url)),
               ...uploadedUrls,
            ];
         }

         // 🔹 STEP 3 — Update DB
         await update.mutateAsync({
            ...formValues,
            id: compliance?.id,
            img: imageUrl,
            company_logo: companyImgUrls,
         });

      } catch (error) {
         console.error("Update error:", error);
         alert("Failed to update compliance");
      } finally {
         setIsSubmitting(false);
      }
   };


   // const handleUpdate = async () => {
   //    if (!validateForm()) return;

   //    setIsSubmitting(true);

   //    try {
   //       let imageUrl = formValues.img;

   //       // If user selected a new image
   //       if (selectedFile) {
   //          // Delete old image if exists
   //          if (compliance?.img && compliance.img !== "") {
   //             await axios.delete("/api/img-uploads", { data: { url: compliance.img } });
   //          }

   //          // Upload new image
   //          const formData = new FormData();
   //          formData.append("file", selectedFile);
   //          const uploadRes = await axios.post("/api/img-uploads", formData);
   //          imageUrl = uploadRes.data.url;
   //       }

   //       // If user removed image manually
   //       if (!formValues.img && compliance?.img) {
   //          await axios.delete("/api/img-uploads", { data: { url: compliance.img } });
   //          imageUrl = "";
   //       }

   //       // Update database with full formValues
   //       await update.mutateAsync({
   //          ...formValues,
   //          img: imageUrl,        // ensure image is latest
   //          id: compliance?.id,   // include id for PUT update
   //       });

   //    } catch (error) {
   //       console.error("Update error:", error);
   //    } finally {
   //       setIsSubmitting(false);
   //    }
   // };

   // fetching extra information like industry, location etc
   const { data: legal_compliance_type } = useGeneric("legal_compliance_types");
   const { data: industries } = useGeneric("industries");
   const { data: regions } = useGeneric("regions");

   const handleServicesChange = (services: string[]) => {
      handleChange("services", services)
   };

   const handleSampleChange = (sample: string[]) => {
      handleChange("sample_templates", sample)
   };

   return (
      <>
         <div className="fixed inset-0 bg-black/70 z-50 px-4">
            <div className="max-w-[670px] max-h-[90vh] scroll overflow-y-auto py-4 px-3 bg-[#F7F9FB] relative top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 rounded-md">

               <div className="flex justify-between items-center">
                  <h2 className="font-medium text-2xl text-[#565656]">
                     Edit Legal & Compliance
                  </h2>
                  <div className="flex gap-3">
                     {isSubmitting ? (
                        <div className="bg-green-200 rounded-full p-3 flex items-center justify-center">
                           <svg
                              className="animate-spin h-4 w-4 text-gray-600"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                           >
                              <circle
                                 className="opacity-25"
                                 cx="12"
                                 cy="12"
                                 r="10"
                                 stroke="currentColor"
                                 strokeWidth="4"
                              ></circle>
                              <path
                                 className="opacity-75"
                                 fill="currentColor"
                                 d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 010 16v-4l-3 3 3 3v-4a8 8 0 01-8-8z"
                              ></path>
                           </svg>
                        </div>
                     ) : (
                        <div
                           className="bg-green-200 rounded-full p-3 cursor-pointer"
                           onClick={handleUpdate}
                        >
                           <IconComponent color="#565656" size={16} name="save" />
                        </div>
                     )}
                     <div
                        className="bg-red-300 rounded-full p-3 cursor-pointer"
                        onClick={onClose}
                     >
                        <IconComponent color="#565656" size={16} name="close" />
                     </div>
                  </div>
               </div>

               <div className="my-4">
                  <CircularImageUploader
                     label="Legal & Compliance Image"
                     value={formValues.img}
                     onImageSelect={(file) => {
                        setSelectedFile(file);
                        if (file) {
                           // Temporarily show preview
                           const previewUrl = URL.createObjectURL(file);
                           setFormValues((prev) => ({ ...prev, img: previewUrl }));
                        } else {
                           // Remove image
                           setFormValues((prev) => ({ ...prev, img: "" }));
                        }
                     }}
                  />
               </div>

               <div className="grid gap-4 grid-cols-2">
                  <div className="col-span-2 sm:col-span-1">
                     <InputComponent
                        label="Legal & Compliance Name"
                        placeholder="Enter legal & compliance name"
                        onChange={(value) => handleChange("name", value)}
                        value={formValues.name}
                        required
                        showError={validationErrors.name}
                     />
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                     <InputComponent
                        label="Experties"
                        placeholder="Enter experties"
                        onChange={(value) => handleChange("experties", value)}
                        value={formValues.experties}
                     />
                  </div>
                  <div className="col-span-2">
                     <InputComponent
                        label="Overview"
                        placeholder="Enter overview"
                        onChange={(value) => handleChange("overview", value)}
                        value={formValues.overview}
                        isTextArea
                        rows={5}
                     />
                  </div>

                  <div className="col-span-2">
                     <DropdownComp
                        label="Legal & Compliance Type"
                        placeholder="Select legal & compliance type"
                        options={legal_compliance_type || []}
                        onSelect={(id, value) => {
                           handleChange("legal_compliance_type_id", id); // allow null
                           handleChange("legal_compliance_type_name", value); // allow null
                        }}
                        value={formValues.legal_compliance_type_name || ""}
                     />
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                     <DropdownComp
                        label="Industry"
                        placeholder="Select industry"
                        options={industries || []}
                        onSelect={(id, value) => {
                           handleChange("industry_id", id); // allow null
                           handleChange("industry_name", value); // allow null
                        }}
                        value={formValues.industry_name || ""}
                     />
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                     <DropdownComp
                        label="Region"
                        placeholder="Select region"
                        options={regions || []}
                        onSelect={(id, value) => {
                           handleChange("region_id", id); // allow null
                           handleChange("region_name", value); // allow null
                        }}
                        value={formValues.region_name || ""}
                     />
                  </div>

                  <div className="col-span-2 sm:col-span-1">
                     <CommaInputTextArea
                        label="Jurisdictional Coverage"
                        placeholder="Enter comma-separated jurisdictional coverage ( value 1, value 2, ...)"
                        onChange={(val) => handleChange("jurisdictional_coverage", val)}
                        rows={5}
                        value={formValues.jurisdictional_coverage}
                     />
                  </div>

                  <div className="col-span-2 sm:col-span-1">
                     <CommaInputTextArea
                        label="Practice Areas"
                        placeholder="Enter comma-separated practice areas ( area 1, area 2, ...)"
                        onChange={(val) => handleChange("practice_areas", val)}
                        rows={5}
                        value={formValues.practice_areas}
                     />
                  </div>

                  <div className="col-span-2">
                     <MultiRectangularImgUploader
                        label="Company Logo (You can upload multiple)"
                        value={formValues.company_logo}
                        onImageUpload={(files) => {
                           if (files && files.length > 0) {
                              // Only keep selected files for upload, not for preview in formValues
                              setSelectedFiles((prev) => [...(prev || []), ...files]);
                           } else {
                              setSelectedFiles([]);
                           }
                        }}
                        onImageRemove={(url) => {
                           // Remove from collaboration array immediately
                           setFormValues((prev) => ({
                              ...prev,
                              company_logo: prev.company_logo?.filter((img) => img !== url),
                           }));
                        }}
                     />
                  </div>

                  <div className="col-span-2">
                     <ServicesList
                        heading="Services"
                        initialList={formValues.services}
                        onChange={handleServicesChange}
                     />
                  </div>

                  <div className="col-span-2">
                     <ServicesList
                        heading="Sample Templates"
                        initialList={formValues.sample_templates}
                        onChange={handleSampleChange}
                     />
                  </div>

                  <div className="col-span-2">
                     <InputComponent
                        label="Testimonials"
                        placeholder="Enter testimonials"
                        onChange={(value) => handleChange("testimonials", value)}
                        value={formValues.testimonials}
                        isTextArea
                        rows={5}
                     />
                  </div>
               </div>
            </div>
         </div>
      </>
   );
};

export default EditSpeakerComp;
