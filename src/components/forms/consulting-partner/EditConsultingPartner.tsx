"use client";

import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

import { ConsultantDM } from "@/domain-models/consultant/ConsultantDM";

import IconComponent from "@/components/icon/IconComp";
import InputComponent from "@/components/input-comps/InputTxt";
import CircularImageUploader from "@/components/image-uploader/CircularImageUploader";
import CommaInputTextArea from "@/components/input-comps/CommaSeperatedTextAria";
import DropdownComp from "@/components/select/DropdownComp";

import { useGeneric } from "@/hooks/useGeneric";

type SpeakerFormProps = {
  consultant?: ConsultantDM;
  onClose: () => void;
  refetchConsultants: () => void;
};

const EditSpeakerComp: React.FC<SpeakerFormProps> = ({
  consultant,
  onClose,
  refetchConsultants,
}) => {

  // Initial state for form
  const initialFormValues: ConsultantDM = {
    id: consultant?.id,
    img: consultant?.img,
    name: consultant?.name,
    company: consultant?.company,
    designation: consultant?.designation,
    overview: consultant?.overview,
    email: consultant?.email,
    experties_areas: consultant?.experties_areas,
    engagement_models: consultant?.engagement_models,
    clients: consultant?.clients,
    testimonials: consultant?.testimonials,
    consultant_type_id: consultant?.consultant_type_id,
    consultant_type_name: consultant?.consultant_type_name,
    industry_id: consultant?.industry_id,
    industry_name: consultant?.industry_name,
    location_id: consultant?.location_id,
    location_name: consultant?.location_name,
    specialism_id: consultant?.specialism_id,
    specialism_name: consultant?.specialism_name,
  };
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

  const update = useMutation({
    mutationFn: async (data: ConsultantDM) => {
      const response = await axios.put("/api/consultants", data);
      return response.data;
    },
    onSuccess: () => {
      refetchConsultants();
      onClose();
    },
    onError: (error) => {
      console.error("Failed to add consultant:", error);
    },
  });
  const handleUpdate = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      let imageUrl = formValues.img;

      // If user selected a new image
      if (selectedFile) {
        // Delete old image if exists
        if (consultant?.img && consultant.img !== "") {
          await axios.delete("/api/img-uploads", { data: { url: consultant.img } });
        }

        // Upload new image
        const formData = new FormData();
        formData.append("file", selectedFile);
        const uploadRes = await axios.post("/api/img-uploads", formData);
        imageUrl = uploadRes.data.url;
      }

      // If user removed image manually
      if (!formValues.img && consultant?.img) {
        await axios.delete("/api/img-uploads", { data: { url: consultant.img } });
        imageUrl = "";
      }

      // Update database with full formValues
      await update.mutateAsync({
        ...formValues,
        img: imageUrl,        // ensure image is latest
        id: consultant?.id,   // include id for PUT update
      });

    } catch (error) {
      console.error("Update error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // fetching extra information like industry, location etc
  const { data: consultantTypes } = useGeneric("consultant_types");
  const { data: industries } = useGeneric("industries");
  const { data: locations } = useGeneric("locations");
  const { data: specialisms } = useGeneric("specialisms");

  return (
    <>
      <div className="fixed inset-0 bg-black/70 z-50 px-4">
        <div className="max-w-[670px] max-h-[90vh] scroll overflow-y-auto py-4 px-3 bg-[#F7F9FB] relative top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 rounded-md">

          <div className="flex justify-between items-center">
            <h2 className="font-medium text-2xl text-[#565656]">
              Edit Consultant
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
              label="Consultant Image"
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
                value={formValues.experties_areas}
              />
            </div>
            <div className="col-span-2 sm:col-span-1">
              <CommaInputTextArea
                label="Engagement Models"
                placeholder="Enter comma-separated engagement models ( model 1, model 2, ...)"
                onChange={(val) => handleChange("engagement_models", val)}
                rows={5}
                value={formValues.engagement_models}
              />
            </div>
            <div className="col-span-2 sm:col-span-1">
              <CommaInputTextArea
                label="Clients"
                placeholder="Enter comma-separated clients ( client 1, client 2, ...)"
                onChange={(val) => handleChange("clients", val)}
                rows={5}
                value={formValues.clients}
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
    </>
  );
};

export default EditSpeakerComp;
