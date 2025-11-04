"use client";

import React, { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

import { ExclusivePartnerDM } from "@/domain-models/exclusive-partners/ExclusivePartnerDM";

import IconComponent from "@/components/icon/IconComp";
import InputComponent from "@/components/input-comps/InputTxt";
import CircularImageUploader from "@/components/image-uploader/CircularImageUploader";
import DropdownComp from "@/components/select/DropdownComp";

type EditExclusivePartnerProps = {
  partner: ExclusivePartnerDM & { category_id?: number; category_name?: string };
  onClose: () => void;
  refetchPartner: () => void;
};

const EditExclusivePartner: React.FC<EditExclusivePartnerProps> = ({
  partner,
  onClose,
  refetchPartner,
}) => {
  // Dropdown options for category (same as Add form)
  const categoryOptions = [
    { id: 1, value: "E-commerce" },
    { id: 2, value: "CyberSecurity" },
    { id: 3, value: "Sustainable Product" },
    { id: 4, value: "Software Development" },
  ];

  // Find matching category option if we have a name or ID
  const initialCategory = categoryOptions.find(
    (opt) =>
      opt.id === (partner as any)?.category_id ||
      opt.value === (partner as any)?.category_name
  );

  // Initialize form values
  const [formValues, setFormValues] = useState({
    id: partner?.id,
    title: partner?.title || "",
    tagline: partner?.tagline || "",
    description: partner?.description || "",
    logo: partner?.logo || "",
    website: partner?.website || "",
    category_id: initialCategory?.id ?? undefined,
  });

  const [validationErrors, setValidationErrors] = useState({ title: false });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // If partner didn’t have category before but categoryOptions got updated, recheck
    if (!formValues.category_id && initialCategory?.id) {
      setFormValues((prev) => ({ ...prev, category_id: initialCategory.id }));
    }
  }, [partner]);

  const handleChange = <K extends keyof typeof formValues>(
    field: K,
    value: (typeof formValues)[K]
  ) => {
    setFormValues((prev) => ({ ...prev, [field]: value }));
    if (typeof value === "string" && value.trim()) {
      setValidationErrors((prev) => ({ ...prev, [field]: false }));
    }
  };

  const validateForm = () => {
    const errors = { title: !formValues.title?.trim() };
    setValidationErrors(errors);
    return !Object.values(errors).some(Boolean);
  };

  const update = useMutation({
    mutationFn: async (data: typeof formValues) => {
      const response = await axios.put("/api/exclusive-partners", data);
      return response.data;
    },
    onSuccess: () => {
      refetchPartner();
      onClose();
    },
    onError: (error) => {
      console.error("Failed to update partner:", error);
    },
  });

  const handleUpdate = async () => {
    if (!validateForm()) return;
    setIsSubmitting(true);

    try {
      let imageUrl = formValues.logo;

      // Upload new image if selected
      if (selectedFile) {
        if (partner?.logo) {
          await axios.delete("/api/img-uploads", { data: { url: partner.logo } });
        }

        const formData = new FormData();
        formData.append("file", selectedFile);
        const uploadRes = await axios.post("/api/img-uploads", formData);
        imageUrl = uploadRes.data.url;
      }

      // Handle image removal
      if (!formValues.logo && partner?.logo) {
        await axios.delete("/api/img-uploads", { data: { url: partner.logo } });
        imageUrl = "";
      }

      await update.mutateAsync({
        ...formValues,
        logo: imageUrl,
        id: partner.id,
      });
    } catch (error) {
      console.error("Update error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 z-50 px-4">
      <div className="max-w-[670px] max-h-[90vh] overflow-y-auto py-4 px-3 bg-[#F7F9FB] relative top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 rounded-md">
        <div className="flex justify-between items-center">
          <h2 className="font-medium text-2xl text-[#565656]">
            Edit Exclusive Partner
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

        {/* Image Uploader */}
        <div className="my-4">
          <CircularImageUploader
            label="Partner Logo"
            value={formValues.logo}
            onImageSelect={(file) => {
              setSelectedFile(file);
              if (file) {
                const previewUrl = URL.createObjectURL(file);
                setFormValues((prev) => ({ ...prev, logo: previewUrl }));
              } else {
                setFormValues((prev) => ({ ...prev, logo: "" }));
              }
            }}
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
              onSelect={(id) => handleChange("category_id", id ?? undefined)}
              value={
                // Display the category name corresponding to the selected ID
                categoryOptions.find((option) => option.id === formValues.category_id)?.value || ""
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
  );
};

export default EditExclusivePartner;
