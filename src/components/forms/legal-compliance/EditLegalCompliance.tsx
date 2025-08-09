"use client";

import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

import { LegalComplianceDM } from "@/domain-models/legal-compliance/LegalComplianceDM";

import IconComponent from "@/components/icon/IconComp";
import InputComponent from "@/components/input-comps/InputTxt";
import ImageUpload from "@/components/image-uploader/SpeakerImageUploader";
import CommaInputTextArea from "@/components/input-comps/CommaSeperatedTextAria";
import DropdownComp from "@/components/select/DropdownComp";
import MultipleImageUpload from "@/components/input-comps/ImgUploader";
import ServicesList from "@/components/input-comps/ListItemComponent";

import { useGeneric } from "@/hooks/useGeneric";

type SpeakerFormProps = {
    compliance?: LegalComplianceDM;
    onClose: () => void;
    refetchLegalCompliance: () => void;
};

const EditSpeakerComp: React.FC<SpeakerFormProps> = ({
    compliance,
    onClose,
    refetchLegalCompliance,
}) => {
    console.log(compliance);

    // Initial state for form
    const initialFormValues: LegalComplianceDM = {
        img: compliance?.img,
        name: compliance?.name,
        experties: compliance?.experties,
        overview: compliance?.overview,
        email: compliance?.email,
        jurisdictional_coverage: compliance?.jurisdictional_coverage,
        company_logo: compliance?.company_logo,
        practice_areas: compliance?.practice_areas,
        services: compliance?.services,
        sample_templates: compliance?.sample_templates,
        testimonials: compliance?.testimonials,

        legal_compliance_type_id: compliance?.legal_compliance_type_id,
        legal_compliance_type_name: compliance?.legal_compliance_type_name,
        industry_id: compliance?.industry_id,
        industry_name: compliance?.industry_name,
        region_id: compliance?.region_id,
        region_name: compliance?.region_name,
    };

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

    const addConsultantMutation = useMutation({
        mutationFn: async (data: LegalComplianceDM) => {
            const response = await axios.put("/api/legal-compliance", data);
            return response.data;
        },
        onSuccess: () => {
            refetchLegalCompliance();
            onClose();
        },
        onError: (error) => {
            console.error("Failed to updated compliance:", error);
        },
    });
    const handleSubmit = () => {
        if (!validateForm()) return;

        const newConsultant: LegalComplianceDM = formValues

        addConsultantMutation.mutate(newConsultant);
    };

    // fetching extra information like industry, location etc
    const { data: legal_compliance_type } = useGeneric("legal_compliance_types");
    const { data: industries } = useGeneric("industries");
    const { data: regions } = useGeneric("regions");

    const handleServicesChange = (services: string[]) => {
        handleChange("services", services)
    };

    const handleSampleChange = (sample: string[]) => {
        handleChange("sample_templates", sample)
    };

    return (
        <>
            <div className="fixed inset-0 bg-black/70 z-50 px-4">
                <div className="max-w-[670px] max-h-[90vh] scroll overflow-y-auto py-4 px-3 bg-[#F7F9FB] relative top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 rounded-md">
                    <div className="flex justify-between items-center">
                        <h2 className="font-medium text-2xl text-[#565656]">
                            Add Legal & Compliance
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
                            label="Legal & Compliance Image"
                            value={formValues.img}
                            onImageUpload={(img) => handleChange("img", img)}
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
                                initialList={formValues.services}
                                onChange={handleServicesChange}
                            />
                        </div>

                        <div className="col-span-2">
                            <ServicesList
                                heading="Sample Templates"
                                initialList={formValues.sample_templates}
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
        </>
    );
};

export default EditSpeakerComp;
