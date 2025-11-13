"use client";

import React, { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

import IconComponent from "@/components/icon/IconComp";
import InputComponent from "@/components/input-comps/InputTxt";
import CircularImageUploader from "@/components/image-uploader/CircularImageUploader";

type TalentHiringDM = {
  name: string;
  occupation: string;
  address: string;
  description?: string;
  imageUrl?: string;
};

type AddTalentProps = {
  active: boolean;
  onClose: () => void;
  refetchTalents: () => void;
};

const initialFormValues: TalentHiringDM = {
  name: "",
  occupation: "",
  address: "",
  description: "",
  imageUrl: "",
};

const AddTalentCard: React.FC<AddTalentProps> = ({
  active,
  onClose,
  refetchTalents,
}) => {
  const [formValues, setFormValues] = useState<TalentHiringDM>(initialFormValues);
  const [validationErrors, setValidationErrors] = useState({ name: false });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = <K extends keyof TalentHiringDM>(field: K, value: TalentHiringDM[K]) => {
    setFormValues((prev) => ({ ...prev, [field]: value }));

    if (typeof value === "string" && value.trim()) {
      setValidationErrors((prev) => ({ ...prev, [field]: false }));
    }
  };

  const validateForm = () => {
    const errors = { name: !formValues.name?.trim() };
    setValidationErrors(errors);
    return !Object.values(errors).some(Boolean);
  };

  const addTalentMutation = useMutation({
    mutationFn: async (data: TalentHiringDM) => {
      const response = await axios.post("/api/talent-hiring-intelligence/professionals", data);
      return response.data;
    },
    onSuccess: () => {
      refetchTalents();
      setIsSubmitting(false);
      onClose();
    },
    onError: (error) => {
      console.error("Failed to add talent:", error);
      setIsSubmitting(false);
    },
  });

  const handleSubmit = async () => {
    if (!validateForm()) return;
    setIsSubmitting(true);

    let imageUrl = formValues.imageUrl;

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
        handleChange("imageUrl", imageUrl);
      } catch (error) {
        console.error("Upload failed:", error);
        alert("Image upload failed");
        setIsSubmitting(false);
        return;
      }
    }

    addTalentMutation.mutate({ ...formValues, imageUrl });
  };

  useEffect(() => {
    if (active) {
      setFormValues(initialFormValues);
      setValidationErrors({ name: false });
      setSelectedFile(null);
      setIsSubmitting(false);
    }
  }, [active]);

  if (!active) return null;

  return (
    <div className="fixed inset-0 bg-black/70 z-50 px-4">
      <div className="max-w-md max-h-[90vh] overflow-y-auto py-4 px-3 bg-[#F7F9FB] relative top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 rounded-md">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h2 className="font-medium text-2xl text-[#565656]">Add Talent</h2>

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
            label="Upload Talent Image"
            value={formValues.imageUrl}
            onImageSelect={(file) => setSelectedFile(file)}
          />

          <InputComponent
            label="Name"
            placeholder="Enter talent name"
            onChange={(value) => handleChange("name", value)}
            value={formValues.name}
            required
            showError={validationErrors.name}
          />

          <InputComponent
            label="Occupation"
            placeholder="Enter occupation"
            onChange={(value) => handleChange("occupation", value)}
            value={formValues.occupation}
          />

          <InputComponent
            label="Address"
            placeholder="Enter address"
            onChange={(value) => handleChange("address", value)}
            value={formValues.address}
          />

          <InputComponent
            label="Description"
            placeholder="Enter description (optional)"
            onChange={(value) => handleChange("description", value)}
            value={formValues.description}
            isTextArea
            rows={4}
          />
        </div>
      </div>
    </div>
  );
};

export default AddTalentCard;
