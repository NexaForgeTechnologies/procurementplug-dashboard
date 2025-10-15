"use client";

import React, { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

import { LegalComplianceDM } from "@/domain-models/legal-compliance/LegalComplianceDM";

import IconComponent from "@/components/icon/IconComp";
import InputComponent from "@/components/input-comps/InputTxt";
import CircularImageUploader from "@/components/image-uploader/CircularImageUploader";
import CommaInputTextArea from "@/components/input-comps/CommaSeperatedTextAria";
import DropdownComp from "@/components/select/DropdownComp";
import MultipleImageUpload from "@/components/input-comps/ImgUploader";
import ServicesList from "@/components/input-comps/ListItemComponent";

import { useGeneric } from "@/hooks/useGeneric";

type LegalComplianceProps = {
  active: boolean;
  onClose: () => void;
  refetchLegalCompliance: () => void;
};

// Initial state for form
const initialFormValues: LegalComplianceDM = {
  img: "",
  name: "",
  experties: "",
  overview: "",
  email: "",
  jurisdictional_coverage: "",
  company_logo: [],
  practice_areas: "",
  services: [],
  sample_templates: [],
  testimonials: "",

  legal_compliance_type_id: undefined,
  legal_compliance_type_name: "",
  industry_id: undefined,
  industry_name: "",
  region_id: undefined,
  region_name: "",
};

const AddLegalCompliance: React.FC<LegalComplianceProps> = ({
  active,
  onClose,
  refetchLegalCompliance,
}) => {
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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addLegalCompliance = useMutation({
    mutationFn: async (data: LegalComplianceDM) => {
      const response = await axios.post("/api/legal-compliance", data);
      return response.data;
    },
    onSuccess: () => {
      refetchLegalCompliance();
      onClose();
    },
    onError: (error) => {
      console.error("Failed to add LegalCompliance:", error);
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
    const newCompliance: Omit<LegalComplianceDM, "id"> = {
      ...formValues,
      img: imageUrl,
    };
    addLegalCompliance.mutate(newCompliance);
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
  const { data: legal_compliance_type } = useGeneric("legal_compliance_types");
  const { data: industries } = useGeneric("industries");
  const { data: regions } = useGeneric("regions");

  const handleServicesChange = (services: string[]) => {
    handleChange("services", services)
  };

  const handleSampleChange = (samples: string[]) => {
    handleChange("sample_templates", samples)
  };

  return (
    <>
      {active && (
        <div className="fixed inset-0 bg-black/70 z-50 px-4">
          <div className="max-w-[670px] max-h-[90vh] scroll overflow-y-auto py-4 px-3 bg-[#F7F9FB] relative top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 rounded-md">

            <div className="flex justify-between items-center">
              <h2 className="font-medium text-2xl text-[#565656]">
                Add Legal & Compliance
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
                label="Legal & Compliance Image"
                value={formValues.img}
                onImageSelect={(file) => setSelectedFile(file)}
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
                />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <CommaInputTextArea
                  label="Practice Areas"
                  placeholder="Enter comma-separated practice areas ( area 1, area 2, ...)"
                  onChange={(val) => handleChange("practice_areas", val)}
                  rows={5}
                />
              </div>
              <div className="col-span-2">
                <MultipleImageUpload
                  label="Company Logo"
                  multiple
                  value={formValues.company_logo}
                  onImageUpload={(paths) =>
                    handleChange("company_logo", paths)
                  }
                />
              </div>
              <div className="col-span-2">
                <ServicesList
                  heading="Services"
                  onChange={handleServicesChange}
                />
              </div>
              <div className="col-span-2">
                <ServicesList
                  heading="Sample Templates"
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
      )}
    </>
  );
};

export default AddLegalCompliance;
