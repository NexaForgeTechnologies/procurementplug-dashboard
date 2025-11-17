"use client";

import React, { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

import IconComponent from "@/components/icon/IconComp";
import InputComponent from "@/components/input-comps/InputTxt";
import CircularImageUploader from "@/components/image-uploader/CircularImageUploader";
import { VipRecruitmentPartnerDM } from "@/domain-models/talent-hiring-intelligence/VipRecruitmentPartnerDM";

type EditVipProps = {
  active: boolean;
  partner: VipRecruitmentPartnerDM;
  onClose: () => void;
  refetchPartners: () => void;
};

const EditVipCard: React.FC<EditVipProps> = ({
  active,
  partner,
  onClose,
  refetchPartners,
}) => {
  const [formValues, setFormValues] = useState<VipRecruitmentPartnerDM>(partner);
  const [validationErrors, setValidationErrors] = useState({ company_name: false });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (active) {
      setFormValues(partner);
      setValidationErrors({ company_name: false });
      setSelectedFile(null);
      setIsSubmitting(false);
    }
  }, [active, partner]);

  const handleChange = <K extends keyof VipRecruitmentPartnerDM>(
    field: K,
    value: VipRecruitmentPartnerDM[K]
  ) => {
    setFormValues((prev) => ({ ...prev, [field]: value }));

    if (typeof value === "string" && value.trim()) {
      setValidationErrors((prev) => ({ ...prev, [field]: false }));
    }
  };

  const validateForm = () => {
    const errors = { company_name: !formValues.company_name?.trim() };
    setValidationErrors(errors);
    return !Object.values(errors).some(Boolean);
  };

  const updateVipMutation = useMutation({
    mutationFn: async (data: VipRecruitmentPartnerDM) => {
      const response = await axios.put(`/api/talent-hiring-intelligence/vip-recruitment-partners/`, data);
      return response.data;
    },
    onSuccess: () => {
      refetchPartners();
      setIsSubmitting(false);
      onClose();
    },
    onError: (error) => {
      console.error("Failed to update VIP partner:", error);
      setIsSubmitting(false);
    },
  });

  const handleSubmit = async () => {
    if (!validateForm()) return;
    setIsSubmitting(true);

    let logo = formValues.company_logo || "";

    try {
      if (selectedFile) {
        const formData = new FormData();
        formData.append("file", selectedFile);
        const res = await fetch("/api/img-uploads", { method: "POST", body: formData });
        if (!res.ok) throw new Error("Image upload failed");
        const data = await res.json();
        logo = data.url;
      }
    } catch (error) {
      console.error("Image upload failed:", error);
      alert("Image upload failed");
      setIsSubmitting(false);
      return;
    }

    updateVipMutation.mutate({ ...formValues, company_logo: logo });
  };

  if (!active) return null;

  return (
    <div className="fixed inset-0 bg-black/70 z-50 px-4">
      <div className="max-w-md max-h-[90vh] overflow-y-auto py-4 px-3 bg-[#F7F9FB] relative top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 rounded-md">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h2 className="font-medium text-2xl text-[#565656]">Edit VIP Partner</h2>

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
              <div className="bg-green-200 rounded-full p-3 cursor-pointer" onClick={handleSubmit}>
                <IconComponent color="#565656" size={16} name="save" />
              </div>
            )}

            <div className="bg-red-300 rounded-full p-3 cursor-pointer" onClick={onClose}>
              <IconComponent color="#565656" size={16} name="close" />
            </div>
          </div>
        </div>

        {/* Form Fields */}
        <div className="grid gap-4 mt-4">
          <CircularImageUploader
            label="Upload Company Logo"
            value={selectedFile ? URL.createObjectURL(selectedFile) : formValues.company_logo || ""}
            onImageSelect={(file) => setSelectedFile(file)}
          />

          <InputComponent
            label="Company Name"
            placeholder="Enter company name"
            onChange={(value) => handleChange("company_name", value)}
            value={formValues.company_name}
            required
            showError={validationErrors.company_name}
          />

          <InputComponent
            label="Company Email"
            placeholder="Enter email"
            onChange={(value) => handleChange("company_email", value)}
            value={formValues.company_email}
          />

          <InputComponent
            label="Website URL"
            placeholder="Enter website URL"
            onChange={(value) => handleChange("website_url", value)}
            value={formValues.website_url}
          />

          <InputComponent
            label="About"
            placeholder="Enter company description"
            onChange={(value) => handleChange("company_about", value)}
            value={formValues.company_about}
            isTextArea
            rows={4}
          />
        </div>
      </div>
    </div>
  );
};

export default EditVipCard;
