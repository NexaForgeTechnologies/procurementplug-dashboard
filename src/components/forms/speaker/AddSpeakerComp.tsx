"use client";

import React, { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

import { SpeakerDM } from "@/domain-models/speaker/SpeakerDM";

import IconComponent from "@/components/icon/IconComp";
import InputComponent from "@/components/input-comps/InputTxt";
import CircularImageUploader from "@/components/image-uploader/CircularImageUploader";

type SpeakerFormProps = {
  speaker?: SpeakerDM;
  active: boolean;
  onClose: () => void;
  refetchSpeakers: () => void;
};

const initialFormValues: SpeakerDM = {
  img: "",
  name: "",
  designation: "",
  company: "",
  bio: "",
};

const AddSpeakerComp: React.FC<SpeakerFormProps> = ({
  active,
  onClose,
  refetchSpeakers,
}) => {
  const [formValues, setFormValues] = useState<SpeakerDM>(initialFormValues);
  const [validationErrors, setValidationErrors] = useState({ name: false });
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

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addSpeakerMutation = useMutation({
    mutationFn: async (data: SpeakerDM) => {
      const response = await axios.post("/api/speakers", data);
      return response.data;
    },
    onSuccess: () => {
      refetchSpeakers();
      setIsSubmitting(false);
      onClose();
    },
    onError: (error) => {
      console.error("Failed to add speaker:", error);
      alert("Failed to save speaker. Please try again.");
      setIsSubmitting(false);
    },
  });
  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);

    let imageUrl = formValues.img;

    // Upload image only when Save is clicked
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
      } catch (error) {
        console.error("Upload failed:", error);
        alert("Image upload failed");
        setIsSubmitting(false);
        return;
      }
    }

    const newSpeaker: Omit<SpeakerDM, "id"> = {
      name: formValues.name,
      img: imageUrl,
      designation: formValues.designation,
      company: formValues.company,
      bio: formValues.bio,
    };

    addSpeakerMutation.mutate(newSpeaker);
  };

  useEffect(() => {
    if (active) {
      setValidationErrors({ name: false });
      setFormValues(initialFormValues);
      setSelectedFile(null);
      setIsSubmitting(false);
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
                {isSubmitting ? (
                  <div className="bg-green-200 rounded-full p-3 flex items-center justify-center">
                    {/* Loader Spinner */}
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

            <div className="my-4">
              <CircularImageUploader
                label="Speaker Image"
                value={formValues.img}
                onImageSelect={(file) => setSelectedFile(file)}
              />
            </div>

            <div className="grid gap-4 grid-cols-2">
              <div className="col-span-2">
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
                  label="Company"
                  placeholder="Enter Company"
                  onChange={(value) => handleChange("company", value)}
                  value={formValues.company}
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
              <div className="col-span-2">
                <InputComponent
                  label="Bio"
                  isTextArea
                  rows={4}
                  placeholder="Enter Bio"
                  onChange={(value) => handleChange("bio", value)}
                  value={formValues.bio}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AddSpeakerComp;
