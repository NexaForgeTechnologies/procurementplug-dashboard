"use client";

import React, { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

import { SpeakerDM } from "@/domain-models/SpeakerDM";

import IconComponent from "@/components/icon/IconComp";
import InputComponent from "@/components/input-comps/InputTxt";
import ImageUpload from "@/components/input-comps/ImgUploader";

type SpeakerFormProps = {
  active: boolean;
  onClose: () => void;
  refetchSpeakers: () => void;
};

// Initial state for form
const initialFormValues: SpeakerDM = {
  img: "",
  name: "",
  role: "",
  designation: "",
  company: "",
  bg_color: "",
};

const SpeakerComp: React.FC<SpeakerFormProps> = ({
  active,
  onClose,
  refetchSpeakers,
}) => {
  const [formValues, setFormValues] = useState<SpeakerDM>(initialFormValues);

  const [validationErrors, setValidationErrors] = useState({
    name: false,
  });

  const handleChange = (field: keyof SpeakerDM, value: string) => {
    setFormValues((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (value.trim()) {
      setValidationErrors((prev) => ({ ...prev, [field]: false }));
    }
  };

  const validateForm = () => {
    const errors = {
      name: !formValues.name?.trim(),
    };

    setValidationErrors(errors);
    return !Object.values(errors).some((e) => e);
  };
  const addSpeakerMutation = useMutation({
    mutationFn: async (data: SpeakerDM) => {
      const response = await axios.post("/api/speakers", data);
      return response.data;
    },
    onSuccess: () => {
      refetchSpeakers();
      onClose();
    },
    onError: (error) => {
      console.error("Failed to add speaker:", error);
    },
  });

  const handleSubmit = () => {
    if (!validateForm()) return;

    const newSpeaker: Omit<SpeakerDM, "id"> = {
      name: formValues.name,
      img: formValues.img,
      role: formValues.role,
      designation: formValues.designation,
      company: formValues.company,
      bg_color: formValues.bg_color,
    };

    addSpeakerMutation.mutate(newSpeaker);
  };

  useEffect(() => {
    if (active) {
      setValidationErrors({
        name: false,
      });
      setFormValues(initialFormValues);
    }
  }, [active]);

  return (
    <>
      {active && (
        <div className="fixed inset-0 bg-black/70 z-50 px-4">
          <div className="max-w-[570px] max-h-[90vh] overflow-y-auto py-4 px-3 bg-[#F7F9FB] relative top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 rounded-md">
            <div className="flex justify-between items-center">
              <h2 className="font-medium text-2xl text-[#565656]">
                Add Speaker
              </h2>
              <div className="flex gap-3">
                <div
                  className="bg-green-200 rounded-full p-3 cursor-pointer"
                  onClick={handleSubmit}
                >
                  <IconComponent color="#565656" size={16} name="save" />
                </div>
                <div
                  className="bg-red-300 rounded-full p-3 cursor-pointer"
                  onClick={onClose}
                >
                  <IconComponent color="#565656" size={16} name="close" />
                </div>
              </div>
            </div>

            <div className="my-4">
              <ImageUpload
                label="Speaker Image"
                value={formValues.img}
                onImageUpload={(img) => handleChange("img", img)}
              />
            </div>

            <div className="grid gap-4 grid-cols-2">
              <div className="col-span-2 sm:col-span-1">
                <InputComponent
                  label="Speaker Name"
                  placeholder="Enter Speaker Name"
                  onChange={(value) => handleChange("name", value)}
                  value={formValues.name}
                  required
                  showError={validationErrors.name}
                />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <InputComponent
                  label="Role"
                  placeholder="Enter Role (e.g., Host)"
                  onChange={(value) => handleChange("role", value)}
                  value={formValues.role}
                />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <InputComponent
                  label="Designation"
                  placeholder="Enter Designation"
                  onChange={(value) => handleChange("designation", value)}
                  value={formValues.designation}
                />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <InputComponent
                  label="Company"
                  placeholder="Enter Company"
                  onChange={(value) => handleChange("company", value)}
                  value={formValues.company}
                />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <InputComponent
                  label="Background Color"
                  placeholder="Enter BG Color (e.g., #d1a05c)"
                  onChange={(value) => handleChange("bg_color", value)}
                  value={formValues.bg_color}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SpeakerComp;
