"use client";

import React, { useMemo, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

import { ProcuretechSolutionDM } from "@/domain-models/procuretech-solution/ProcuretechSolutionDM";

import IconComponent from "@/components/icon/IconComp";
import InputComponent from "@/components/input-comps/InputTxt";
import RectangularImgUploader from "@/components/image-uploader/RectangularImgUploader";
import List from "@/components/input-comps/ListItemComponent";

import { useProcuretechTypes } from "@/hooks/useProcuretechType";
import DropdownComp from "@/components/select/DropdownComp";
import CommaInputTextArea from "@/components/input-comps/CommaSeperatedTextAria";

import { useGeneric } from "@/hooks/useGeneric";

type SpeakerFormProps = {
  procuretech?: ProcuretechSolutionDM;
  onClose: () => void;
  refetchProcuretech: () => void;
};

const EditSpeakerComp: React.FC<SpeakerFormProps> = ({
  procuretech,
  onClose,
  refetchProcuretech,
}) => {
  console.log(procuretech);


  // Initial state for form
  const initialFormValues: ProcuretechSolutionDM = {
    id: procuretech?.id,
    img: procuretech?.img,
    name: procuretech?.name,
    type_id: procuretech?.type_id,
    type_name: procuretech?.type_name,
    overview: procuretech?.overview,
    key_features: procuretech?.key_features,
    develpment: procuretech?.develpment,
    integration: procuretech?.integration,
    pricing: procuretech?.pricing,
    recommended: procuretech?.recommended,

    deployment_model_id: procuretech?.deployment_model_id,
    deployment_model_name: procuretech?.deployment_model_name,
    pricing_model_id: procuretech?.pricing_model_id,
    pricing_model_name: procuretech?.pricing_model_name,
    integration_model_id: procuretech?.integration_model_id,
    integration_model_name: procuretech?.integration_model_name,
  };
  const [formValues, setFormValues] = useState<ProcuretechSolutionDM>(initialFormValues);
  const [validationErrors, setValidationErrors] = useState({
    name: false,
  });
  const handleChange = <K extends keyof ProcuretechSolutionDM>(
    field: K,
    value: ProcuretechSolutionDM[K] | null
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
    mutationFn: async (data: ProcuretechSolutionDM) => {
      const response = await axios.put("/api/procuretech-solution", data);
      return response.data;
    },
    onSuccess: () => {
      refetchProcuretech();
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
      let imageUrl = formValues.img;

      // 1️⃣ If user selected a new file
      if (selectedFile) {
        // Delete old image if exists
        if (procuretech?.img && procuretech.img !== "") {
          await axios.delete("/api/img-uploads", { data: { url: procuretech.img } });
        }

        // Upload new image
        const formData = new FormData();
        formData.append("file", selectedFile);
        const uploadRes = await axios.post("/api/img-uploads", formData);
        imageUrl = uploadRes.data.url;
      }

      // 2️⃣ If user removed image manually
      if (!formValues.img && procuretech?.img) {
        await axios.delete("/api/img-uploads", { data: { url: procuretech.img } });
        imageUrl = "";
      }

      // 3️⃣ Update database
      await update.mutateAsync({
        ...formValues,
        img: imageUrl,        // ensure image is latest
        id: procuretech?.id,   // include id for PUT update
      });

    } catch (error) {
      console.error("Update error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // fetching extra information like industry, location etc
  const { data: procuretechtypes } = useProcuretechTypes();
  // Only keep id and value
  type Option = { id: number; value: string; };
  const typeOptions: Option[] = (procuretechtypes ?? []).map(t => ({
    id: t.id!,
    value: t.value!
  }));

  const keyFeaturesList = useMemo(() => {
    if (Array.isArray(formValues.key_features)) return formValues.key_features;
    try {
      return JSON.parse(formValues.key_features || "[]");
    } catch {
      return [];
    }
  }, [formValues.key_features]);

  const handleKeyFeaturesChange = (keyFeatures: string[]) => {
    handleChange("key_features", keyFeatures);
  };

  // fetching extra information like industry, location etc
  const { data: deploymentModel } = useGeneric("deployment_model");
  const { data: pricingModel } = useGeneric("pricing_model");
  const { data: integrationModel } = useGeneric("integration_model");

  return (
    <>
      <div className="fixed inset-0 bg-black/70 z-50 px-4">
        <div className="max-w-[670px] max-h-[90vh] scroll overflow-y-auto py-4 px-3 bg-[#F7F9FB] relative top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 rounded-md">

          <div className="flex justify-between items-center">
            <h2 className="font-medium text-2xl text-[#565656]">
              Edit Procuretech Solution
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

          <div className="grid gap-4 grid-cols-2 mt-8">
            <div className="col-span-2">
              <RectangularImgUploader
                label="ProcureTech Solution Image"
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
            <div className="col-span-2">
              <InputComponent
                label="ProcureTech Solution Name"
                placeholder="Enter procuretech solution name"
                onChange={(value) => handleChange("name", value)}
                value={formValues.name}
                required
                showError={validationErrors.name}
              />
            </div>
            <div className="col-span-2 sm:col-span-1">
              <DropdownComp
                label="Type"
                placeholder="Select type"
                options={typeOptions || []}
                onSelect={(id, value) => {
                  handleChange("type_id", id); // allow null
                  handleChange("type_name", value); // allow null
                }}
                value={formValues.type_name || ""}
              />
            </div>
            <div className="col-span-2 sm:col-span-1">
              <DropdownComp
                label="Deployment Modal"
                placeholder="Select deployment modal"
                options={deploymentModel || []}
                onSelect={(id, value) => {
                  handleChange("deployment_model_id", id); // allow null
                  handleChange("deployment_model_name", value); // allow null
                }}
                value={formValues.deployment_model_name || ""}
              />
            </div>
            <div className="col-span-2 sm:col-span-1">
              <DropdownComp
                label="Pricing Modal"
                placeholder="Select pricing modal"
                options={pricingModel || []}
                onSelect={(id, value) => {
                  handleChange("pricing_model_id", id); // allow null
                  handleChange("pricing_model_name", value); // allow null
                }}
                value={formValues.pricing_model_name || ""}
              />
            </div>
            <div className="col-span-2 sm:col-span-1">
              <DropdownComp
                label="Integration Modal"
                placeholder="Select integration modal"
                options={integrationModel || []}
                onSelect={(id, value) => {
                  handleChange("integration_model_id", id); // allow null
                  handleChange("integration_model_name", value); // allow null
                }}
                value={formValues.integration_model_name || ""}
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
              <List
                heading="Key Features"
                initialList={keyFeaturesList}
                onChange={handleKeyFeaturesChange}
              />
            </div>
            <div className="col-span-2 sm:col-span-1">
              <CommaInputTextArea
                label="Development"
                placeholder="Enter comma-separated development ( model 1, model 2, ...)"
                onChange={(val) => handleChange("develpment", val)}
                rows={5}
                value={formValues.develpment}
              />
            </div>
            <div className="col-span-2 sm:col-span-1">
              <CommaInputTextArea
                label="Pricing Models"
                placeholder="Enter comma-separated pricing models ( model 1, model 2, ...)"
                onChange={(val) => handleChange("pricing", val)}
                rows={5}
                value={formValues.pricing}
              />
            </div>
            <div className="col-span-2 sm:col-span-1">
              <CommaInputTextArea
                label="Integration Models"
                placeholder="Enter comma-separated integration models ( model 1, model 2, ...)"
                onChange={(val) => handleChange("integration", val)}
                rows={5}
                value={formValues.integration}
              />
            </div>
            <div className="col-span-2 sm:col-span-1">
              <CommaInputTextArea
                label="Recommended For You"
                placeholder="Enter comma-separated recommendation ( value 1,value 2, ...)"
                onChange={(val) => handleChange("recommended", val)}
                rows={5}
                value={formValues.recommended}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditSpeakerComp;
