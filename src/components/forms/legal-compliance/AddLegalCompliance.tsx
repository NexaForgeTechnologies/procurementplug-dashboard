"use client";

import React, { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

import { LegalComplianceDM } from "@/domain-models/LegalComplianceDM";

import IconComponent from "@/components/icon/IconComp";
import InputComponent from "@/components/input-comps/InputTxt";
import ImageUpload from "@/components/image-uploader/SpeakerImageUploader";
import CommaInputTextArea from "@/components/input-comps/CommaSeperatedTextAria";

type LegalComplianceProps = {
    active: boolean;
    onClose: () => void;
    refetchLegalCompliance: () => void;
};

// Initial state for form
const initialFormValues: LegalComplianceDM = {
    img: "",
    name: "",
    company: "",
    designation: "",
    overview: "",
    email: "",
    experties_areas: "",
    engagement_models: "",
    clients: "",
    testimonials: ""
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

    const handleChange = (field: keyof LegalComplianceDM, value: string) => {
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

    const handleSubmit = () => {
        if (!validateForm()) return;

        const newLegalCompliance: Omit<LegalComplianceDM, "id"> = formValues

        addLegalCompliance.mutate(newLegalCompliance);
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
                    <div className="max-w-[670px] max-h-[90vh] overflow-y-auto py-4 px-3 bg-[#F7F9FB] relative top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 rounded-md">
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
                            <div className="col-span-2">
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

export default AddLegalCompliance;
