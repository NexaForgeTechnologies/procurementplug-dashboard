"use client";

import React, { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

import { useGeneric } from "@/hooks/useGeneric";

import { ConsultantDM } from "@/domain-models/consultant/ConsultantDM";

import IconComponent from "@/components/icon/IconComp";
import InputComponent from "@/components/input-comps/InputTxt";
import ImageUpload from "@/components/image-uploader/SpeakerImageUploader";
import CommaInputTextArea from "@/components/input-comps/CommaSeperatedTextAria";
import DropdownComp from "@/components/select/DropdownComp";

type ConsultingFormProps = {
  consultant?: ConsultantDM;
  active: boolean;
  onClose: () => void;
  refetchConsultant: () => void;
};

// Initial state for form
const initialFormValues: ConsultantDM = {
  img: "",
  name: "",
  company: "",
  designation: "",
  overview: "",
  email: "",
  experties_areas: "",
  engagement_models: "",
  clients: "",
  testimonials: "",
  consultant_type_id: undefined,
  consultant_type_name: "",
  industry_id: undefined,
  industry_name: "",
  location_id: undefined,
  location_name: "",
  specialism_id: undefined,
  specialism_name: "",
};

const AddConsultingPartner: React.FC<ConsultingFormProps> = ({
  active,
  onClose,
  refetchConsultant,
}) => {
  const [formValues, setFormValues] = useState<ConsultantDM>(initialFormValues);
  const [validationErrors, setValidationErrors] = useState({
    name: false,
  });
  const handleChange = <K extends keyof ConsultantDM>(
    field: K,
    value: ConsultantDM[K] | null
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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addConsultantMutation = useMutation({
    mutationFn: async (data: ConsultantDM) => {
      const response = await axios.post("/api/consultants", data);
      return response.data;
    },
    onSuccess: () => {
      refetchConsultant();
      setIsSubmitting(false);
      onClose();
    },
    onError: (error) => {
      console.error("Failed to add consultant:", error);
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

        handleChange("img", imageUrl);

      } catch (error) {
        console.error("Upload failed:", error);
        alert("Image upload failed");
        setIsSubmitting(false);
        return;
      }
    }

    // use imageUrl directly here
    const newConsultant: Omit<ConsultantDM, "id"> = {
      ...formValues,
      img: imageUrl,
    };
    addConsultantMutation.mutate(newConsultant);

  };

  useEffect(() => {
    if (active) {
      setValidationErrors({
        name: false,
      });
      setFormValues(initialFormValues);
      setSelectedFile(null);
      setIsSubmitting(false);
    }
  }, [active]);

  // fetching extra information like industry, location etc
  const { data: consultantTypes } = useGeneric("consultant_types");
  const { data: industries } = useGeneric("industries");
  const { data: locations } = useGeneric("locations");
  const { data: specialisms } = useGeneric("specialisms");

  return (
    <>
      {active && (
        <div className="fixed inset-0 bg-black/70 z-50 px-4">
          <div className="max-w-[670px] max-h-[90vh] scroll overflow-y-auto py-4 px-3 bg-[#F7F9FB] relative top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 rounded-md">
            <div className="flex justify-between items-center">
              <h2 className="font-medium text-2xl text-[#565656]">
                Add Consultant
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
              <ImageUpload
                label="Consultant Image"
                value={formValues.img}
                onImageSelect={(file) => setSelectedFile(file)}
              />
            </div>

            <div className="grid gap-4 grid-cols-2">
              <div className="col-span-2">
                <InputComponent
                  label="Consultant Name"
                  placeholder="Enter consultant name"
                  onChange={(value) => handleChange("name", value)}
                  value={formValues.name}
                  required
                  showError={validationErrors.name}
                />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <InputComponent
                  label="Company"
                  placeholder="Enter company"
                  onChange={(value) => handleChange("company", value)}
                  value={formValues.company}
                />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <InputComponent
                  label="Designation"
                  placeholder="Enter designation"
                  onChange={(value) => handleChange("designation", value)}
                  value={formValues.designation}
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
              <div className="col-span-2 sm:col-span-1">
                <DropdownComp
                  label="Consultant Type"
                  placeholder="Select consultant type"
                  options={consultantTypes || []}
                  onSelect={(id, value) => {
                    handleChange("consultant_type_id", id); // allow null
                    handleChange("consultant_type_name", value); // allow null
                  }}
                  value={formValues.consultant_type_name || ""}
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
                  label="Location"
                  placeholder="Select location"
                  options={locations || []}
                  onSelect={(id, value) => {
                    handleChange("location_id", id); // allow null
                    handleChange("location_name", value); // allow null
                  }}
                  value={formValues.location_name || ""}
                />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <DropdownComp
                  label="Specialism"
                  placeholder="Select specialism"
                  options={specialisms || []}
                  onSelect={(id, value) => {
                    handleChange("specialism_id", id); // allow null
                    handleChange("specialism_name", value); // allow null
                  }}
                  value={formValues.specialism_name || ""}
                />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <CommaInputTextArea
                  label="Expertise Areas"
                  placeholder="Enter comma-separated experties areas ( area 1, area 2, ...)"
                  onChange={(val) => handleChange("experties_areas", val)}
                  rows={5}
                />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <CommaInputTextArea
                  label="Engagement Models"
                  placeholder="Enter comma-separated engagement models ( model 1, model 2, ...)"
                  onChange={(val) => handleChange("engagement_models", val)}
                  rows={5}
                />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <CommaInputTextArea
                  label="Clients"
                  placeholder="Enter comma-separated clients ( client 1, client 2, ...)"
                  onChange={(val) => handleChange("clients", val)}
                  rows={5}
                />
              </div>
              <div className="col-span-2 sm:col-span-1">
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
      )}
    </>
  );
};

export default AddConsultingPartner;
