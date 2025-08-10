"use client";

import React, { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

import { ProcuretechSolutionDM } from "@/domain-models/procuretech-solution/ProcuretechSolutionDM";

import IconComponent from "@/components/icon/IconComp";
import InputComponent from "@/components/input-comps/InputTxt";
import ImageUpload from "@/components/image-uploader/VenuePartnerImgUploader";
import List from "@/components/input-comps/ListItemComponent";

import { useProcuretechTypes } from "@/hooks/useProcuretechType";
import DropdownComp from "@/components/select/DropdownComp";
import CommaInputTextArea from "@/components/input-comps/CommaSeperatedTextAria";

import { useGeneric } from "@/hooks/useGeneric";

type ProcureTechSolutionProps = {
    active: boolean;
    onClose: () => void;
    refetchProcuretech: () => void;
};

// Initial state for form
const initialFormValues: ProcuretechSolutionDM = {
    id: undefined,
    img: "",
    name: "",
    type_id: undefined,
    type_name: "",
    overview: "",
    key_features: [],
    develpment: "",
    integration: "",
    pricing: "",
    recommended: "",

    deployment_model_id: undefined,
    deployment_model_name: "",
    pricing_model_id: undefined,
    pricing_model_name: "",
    integration_model_id: undefined,
    integration_model_name: "",

    created_at: "",
    updated_at: "",
    deleted_at: "",
};

const AddLegalCompliance: React.FC<ProcureTechSolutionProps> = ({
    active,
    onClose,
    refetchProcuretech,
}) => {
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

    const addProcureTechSolution = useMutation({
        mutationFn: async (data: ProcuretechSolutionDM) => {
            const response = await axios.post("/api/procuretech-solution", data);
            return response.data;
        },
        onSuccess: () => {
            refetchProcuretech();
            onClose();
        },
        onError: (error) => {
            console.error("Failed to add LegalCompliance:", error);
        },
    });
    const handleSubmit = () => {
        if (!validateForm()) return;

        const newProcuretechSolution: Omit<ProcuretechSolutionDM, "id"> = formValues

        addProcureTechSolution.mutate(newProcuretechSolution);

    };

    useEffect(() => {
        if (active) {
            setValidationErrors({
                name: false,
            });
            setFormValues(initialFormValues);
        }
    }, [active]);

    // fetching extra information like industry, location etc
    const { data: procuretechtypes } = useProcuretechTypes();
    // Only keep id and value
    type Option = { id: number; value: string; };
    const typeOptions: Option[] = (procuretechtypes ?? []).map(t => ({
        id: t.id!,
        value: t.value!
    }));


    const handleKeyFeaturesChange = (keyFeatures: string[]) => {
        handleChange("key_features", keyFeatures)
    };


    // fetching extra information like industry, location etc
    const { data: deploymentModel } = useGeneric("deployment_model");
    const { data: pricingModel } = useGeneric("pricing_model");
    const { data: integrationModel } = useGeneric("integration_model");

    return (
        <>
            {active && (
                <div className="fixed inset-0 bg-black/70 z-50 px-4">
                    <div className="max-w-[670px] max-h-[90vh] scroll overflow-y-auto py-4 px-3 bg-[#F7F9FB] relative top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 rounded-md">
                        <div className="flex justify-between items-center">
                            <h2 className="font-medium text-2xl text-[#565656]">
                                Add Procuretech Solution
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

                        <div className="grid gap-4 grid-cols-2 mt-8">
                            <div className="col-span-2">
                                <ImageUpload
                                    label="ProcureTech Solution Image"
                                    value={formValues.img}
                                    onImageUpload={(img) => handleChange("img", img)}
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
                                    onChange={handleKeyFeaturesChange}
                                />
                            </div>

                            <div className="col-span-2 sm:col-span-1">
                                <CommaInputTextArea
                                    label="Development Model"
                                    placeholder="Enter comma-separated development models ( model 1, model 2, ...)"
                                    onChange={(val) => handleChange("develpment", val)}
                                    rows={5}
                                />
                            </div>
                            <div className="col-span-2 sm:col-span-1">
                                <CommaInputTextArea
                                    label="Pricing Models"
                                    placeholder="Enter comma-separated pricing models ( model 1, model 2, ...)"
                                    onChange={(val) => handleChange("pricing", val)}
                                    rows={5}
                                />
                            </div>
                            <div className="col-span-2 sm:col-span-1">
                                <CommaInputTextArea
                                    label="Integration Models"
                                    placeholder="Enter comma-separated integration models ( model 1, model 2, ...)"
                                    onChange={(val) => handleChange("integration", val)}
                                    rows={5}
                                />
                            </div>
                            <div className="col-span-2 sm:col-span-1">
                                <CommaInputTextArea
                                    label="Recommended For You"
                                    placeholder="Enter comma-separated recommendation ( value 1,value 2, ...)"
                                    onChange={(val) => handleChange("recommended", val)}
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
