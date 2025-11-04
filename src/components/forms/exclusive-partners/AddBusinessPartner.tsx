"use client";

import React, { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

import IconComponent from "@/components/icon/IconComp";
import InputComponent from "@/components/input-comps/InputTxt";
import CircularImageUploader from "@/components/image-uploader/CircularImageUploader";
import DropdownComp from "@/components/select/DropdownComp";

type BusinessPartner = {
  logo: string;
  title: string;
  tagline: string;
  description: string;
  category_id?: number; // store only ID
  website: string;
};

type BusinessPartnerFormProps = {
  active: boolean;
  onClose: () => void;
  refetchPartner: () => void;
};

const initialFormValues: BusinessPartner = {
  logo: "",
  title: "",
  tagline: "",
  description: "",
  category_id: undefined,
  website: "",
};

const AddBusinessPartner: React.FC<BusinessPartnerFormProps> = ({
  active,
  onClose,
  refetchPartner,
}) => {
  const [formValues, setFormValues] = useState<BusinessPartner>(initialFormValues);
  const [validationErrors, setValidationErrors] = useState({ title: false });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Dropdown options for category
  const categoryOptions = [
    { id: 1, value: "E-commerce" },
    { id: 2, value: "CyberSecurity" },
    { id: 3, value: "Sustainable Product" },
    { id: 4, value: "Software Development" },
  ];

  const handleChange = <K extends keyof BusinessPartner>(
    field: K,
    value: BusinessPartner[K]
  ) => {
    setFormValues((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (typeof value === "string" && value.trim()) {
      setValidationErrors((prev) => ({ ...prev, [field]: false }));
    }
  };

  const validateForm = () => {
    const errors = { title: !formValues.title?.trim() };
    setValidationErrors(errors);
    return !Object.values(errors).some(Boolean);
  };

  const addPartnerMutation = useMutation({
    mutationFn: async (data: BusinessPartner) => {
      const response = await axios.post("/api/exclusive-partners", data);
      return response.data;
    },
    onSuccess: () => {
      refetchPartner();
      setIsSubmitting(false);
      onClose();
    },
    onError: (error) => {
      console.error("Failed to add business partner:", error);
      setIsSubmitting(false);
    },
  });

  const handleSubmit = async () => {
    if (!validateForm()) return;
    setIsSubmitting(true);

    let imageUrl = formValues.logo;

    // If you want to enable file upload, uncomment this
    if (selectedFile) {
      const formData = new FormData();
      formData.append("file", selectedFile);
      try {
        const res = await fetch("/api/img-uploads", {
          method: "POST",
          body: formData,
        });
        if (!res.ok) throw new Error("Image upload failed");
        const data = await res.json();
        imageUrl = data.url;
        handleChange("logo", imageUrl);
      } catch (error) {
        console.error("Upload failed:", error);
        alert("Image upload failed");
        setIsSubmitting(false);
        return;
      }
    }

    const newPartner: BusinessPartner = {
      ...formValues,
      logo: imageUrl,
    };

    addPartnerMutation.mutate(newPartner);
  };

  useEffect(() => {
    if (active) {
      setFormValues(initialFormValues);
      setValidationErrors({ title: false });
      setSelectedFile(null);
      setIsSubmitting(false);
    }
  }, [active]);

  return (
    <>
      {active && (
        <div className="fixed inset-0 bg-black/70 z-50 px-4">
          <div className="max-w-[670px] max-h-[90vh] overflow-y-auto py-4 px-3 bg-[#F7F9FB] relative top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 rounded-md">
            {/* Header */}
            <div className="flex justify-between items-center">
              <h2 className="font-medium text-2xl text-[#565656]">
                Add Business Partner
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
                    onClick={handleSubmit}
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

            {/* Image Upload */}
            <div className="my-4">
              <CircularImageUploader
                label="Business Partner Logo"
                value={formValues.logo}
                onImageSelect={(file) => setSelectedFile(file)}
              />
            </div>

            {/* Form Fields */}
            <div className="grid gap-4 grid-cols-2">
              <div className="col-span-2">
                <InputComponent
                  label="Title"
                  placeholder="Enter partner title"
                  onChange={(value) => handleChange("title", value)}
                  value={formValues.title}
                  required
                  showError={validationErrors.title}
                />
              </div>

              <div className="col-span-2">
                <InputComponent
                  label="Tagline"
                  placeholder="Enter tagline"
                  onChange={(value) => handleChange("tagline", value)}
                  value={formValues.tagline}
                />
              </div>

              <div className="col-span-2">
                <InputComponent
                  label="Description"
                  placeholder="Enter description"
                  onChange={(value) => handleChange("description", value)}
                  value={formValues.description}
                  isTextArea
                  rows={5}
                />
              </div>

              {/* Dropdown for Category */}
              <div className="col-span-2 sm:col-span-1">
                <DropdownComp
                  label="Category"
                  placeholder="Select category"
                  options={categoryOptions}
                  onSelect={(id) => {
                    handleChange("category_id", id ?? undefined);
                  }}
                  value={
                    // Find the category name based on selected ID
                    categoryOptions.find((option) => option.id === formValues.category_id)
                      ?.value || ""
                  }
                />

              </div>

              <div className="col-span-2 sm:col-span-1">
                <InputComponent
                  label="Website Link"
                  placeholder="https://example.com"
                  onChange={(value) => handleChange("website", value)}
                  value={formValues.website}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AddBusinessPartner;
