"use client";

import React, { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

import IconComponent from "@/components/icon/IconComp";
import InputComponent from "@/components/input-comps/InputTxt";
import CircularImageUploader from "@/components/image-uploader/CircularImageUploader";
import DropdownComp from "@/components/select/DropdownComp";

import { InnovationDM } from "@/domain-models/innovation-vault/InnovationDM";

type EditInnovationVaultProps = {
    innovation: InnovationDM;
    onClose: () => void;
    refetchInnovation: () => void;
};

interface FormValues {
    id: number;
    title: string;
    description: string;
    logo: string;
    category_id?: number;
    keyFeatures: string[];
    relatedTools: string[];
    sponsoredBy?: string;
    categoryDescription?: string;
}

const EditInnovationVault: React.FC<EditInnovationVaultProps> = ({
    innovation,
    onClose,
    refetchInnovation,
}) => {
    const categoryOptions = [
        { id: 1, value: "Live" },
        { id: 2, value: "Beta Access" },
        { id: 3, value: "Pilot Open" },
        { id: 4, value: "In Development - download deck" },
    ];

    const initialCategory = categoryOptions.find(
        (c) => c.value === innovation.category
    );

    const [formValues, setFormValues] = useState<FormValues>({
        id: innovation.id,
        title: innovation.title || "",
        description: innovation.description || "",
        logo: innovation.logo || "",
        category_id: initialCategory?.id,
        keyFeatures: innovation.keyFeatures || [""],
        relatedTools: innovation.relatedTools || [""],
        sponsoredBy: innovation.sponsoredBy || "",
        categoryDescription: innovation.categoryDescription || "",
    });

    const [validationErrors, setValidationErrors] = useState<{ title: boolean }>({ title: false });
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (!formValues.category_id && initialCategory?.id) {
            setFormValues((prev) => ({ ...prev, category_id: initialCategory.id }));
        }
    }, [formValues.category_id, initialCategory?.id]);

    const handleChange = <K extends keyof FormValues>(field: K, value: FormValues[K] | undefined) => {
        setFormValues((prev) => ({ ...prev, [field]: value }));
        if (typeof value === "string" && value.trim()) {
            setValidationErrors((prev) => ({ ...prev, [field]: false }));
        }
    };

    const handleFeatureChange = (index: number, value: string) => {
        const updatedFeatures = [...formValues.keyFeatures];
        updatedFeatures[index] = value;
        setFormValues((prev) => ({ ...prev, keyFeatures: updatedFeatures }));
    };

    const addFeatureField = () => {
        setFormValues((prev) => ({ ...prev, keyFeatures: [...prev.keyFeatures, ""] }));
    };

    const removeFeatureField = (index: number) => {
        const updatedFeatures = formValues.keyFeatures.filter((_, i) => i !== index);
        setFormValues((prev) => ({ ...prev, keyFeatures: updatedFeatures }));
    };

    const handleRelatedToolChange = (index: number, value: string) => {
        const updatedTools = [...formValues.relatedTools];
        updatedTools[index] = value;
        setFormValues((prev) => ({ ...prev, relatedTools: updatedTools }));
    };

    const addRelatedToolField = () => {
        setFormValues((prev) => ({ ...prev, relatedTools: [...prev.relatedTools, ""] }));
    };

    const removeRelatedToolField = (index: number) => {
        const updatedTools = formValues.relatedTools.filter((_, i) => i !== index);
        setFormValues((prev) => ({ ...prev, relatedTools: updatedTools }));
    };

    const validateForm = () => {
        const errors = { title: !formValues.title?.trim() };
        setValidationErrors(errors);
        return !Object.values(errors).some(Boolean);
    };

    const updateInnovation = useMutation({
        mutationFn: async (data: FormValues) => {
            const response = await axios.put("/api/innovation-vault", data);
            return response.data;
        },
        onSuccess: () => {
            refetchInnovation();
            onClose();
        },
        onError: (error) => {
            console.error("Failed to update innovation:", error);
        },
    });

    const handleUpdate = async () => {
        if (!validateForm()) return;
        setIsSubmitting(true);

        try {
            let imageUrl = formValues.logo;

            if (selectedFile) {
                if (innovation?.logo) {
                    await axios.delete("/api/img-uploads", { data: { url: innovation.logo } });
                }
                const formData = new FormData();
                formData.append("file", selectedFile);
                const uploadRes = await axios.post("/api/img-uploads", formData);
                imageUrl = uploadRes.data.url;
            }

            if (!formValues.logo && innovation?.logo) {
                await axios.delete("/api/img-uploads", { data: { url: innovation.logo } });
                imageUrl = "";
            }

            await updateInnovation.mutateAsync({ ...formValues, logo: imageUrl, id: innovation.id });
        } catch (error) {
            console.error("Update error:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/70 z-50 px-4">
            <div className="max-w-[670px] max-h-[90vh] overflow-y-auto py-4 px-3 bg-[#F7F9FB] relative top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 rounded-md">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <h2 className="font-medium text-2xl text-[#565656]">Edit Innovation</h2>
                    <div className="flex gap-3">
                        {isSubmitting ? (
                            <div className="bg-green-200 rounded-full p-3 flex items-center justify-center">
                                <svg className="animate-spin h-4 w-4 text-gray-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 010 16v-4l-3 3 3 3v-4a8 8 0 01-8-8z"></path>
                                </svg>
                            </div>
                        ) : (
                            <div className="bg-green-200 rounded-full p-3 cursor-pointer" onClick={handleUpdate}>
                                <IconComponent color="#565656" size={16} name="save" />
                            </div>
                        )}
                        <div className="bg-red-300 rounded-full p-3 cursor-pointer" onClick={onClose}>
                            <IconComponent color="#565656" size={16} name="close" />
                        </div>
                    </div>
                </div>

                {/* Image Uploader */}
                <div className="my-4">
                    <CircularImageUploader
                        label="Innovation Logo"
                        value={formValues.logo}
                        onImageSelect={(file) => {
                            setSelectedFile(file);
                            if (file) {
                                const previewUrl = URL.createObjectURL(file);
                                setFormValues((prev) => ({ ...prev, logo: previewUrl }));
                            } else {
                                setFormValues((prev) => ({ ...prev, logo: "" }));
                            }
                        }}
                    />
                </div>

                {/* Form Fields */}
                <div className="grid gap-4 grid-cols-2">
                    <div className="col-span-2">
                        <InputComponent
                            label="Title"
                            placeholder="Enter innovation title"
                            onChange={(value) => handleChange("title", value)}
                            value={formValues.title}
                            required
                            showError={validationErrors.title}
                        />
                    </div>

                    <div className="col-span-2">
                        <InputComponent
                            label="Description"
                            placeholder="Enter description"
                            onChange={(value) => handleChange("description", value)}
                            value={formValues.description}
                            isTextArea
                            rows={5}
                        />
                    </div>

                    <div className="col-span-2 sm:col-span-1">
                        <DropdownComp
                            label="Category"
                            placeholder="Select category"
                            options={categoryOptions}
                            value={categoryOptions.find((opt) => opt.id === formValues.category_id)?.value || ""}
                            onSelect={(id) => handleChange("category_id", id ?? undefined)}
                        />
                    </div>

                    <div className="col-span-2 sm:col-span-1">
                        <InputComponent
                            label="Sponsored By"
                            placeholder="Enter sponsor"
                            onChange={(value) => handleChange("sponsoredBy", value)}
                            value={formValues.sponsoredBy}
                        />
                    </div>

                    <div className="col-span-2">
                        <InputComponent
                            label="Category Description"
                            placeholder="Enter category description"
                            onChange={(value) => handleChange("categoryDescription", value)}
                            value={formValues.categoryDescription}
                            isTextArea
                            rows={3}
                        />
                    </div>

                    {/* Key Features */}
                    <div className="col-span-2">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Key Features</label>
                        {formValues.keyFeatures.map((feature, index) => (
                            <div key={index} className="flex gap-2 mb-2">
                                <InputComponent
                                    placeholder={`Feature ${index + 1}`}
                                    onChange={(value) => handleFeatureChange(index, value)}
                                    value={feature}
                                />
                                {feature.trim() && (
                                    <button
                                        type="button"
                                        onClick={() => removeFeatureField(index)}
                                        className="bg-red-200 text-red-700 px-2 rounded-md"
                                    >
                                        ✕
                                    </button>
                                )}
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={addFeatureField}
                            className="mt-2 text-blue-600 hover:underline text-sm"
                        >
                            + Add Feature
                        </button>
                    </div>

                    {/* Related Tools */}
                    <div className="col-span-2">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Related Tools</label>
                        {formValues.relatedTools.map((tool, index) => (
                            <div key={index} className="flex gap-2 mb-2">
                                <InputComponent
                                    placeholder={`Tool ${index + 1}`}
                                    onChange={(value) => handleRelatedToolChange(index, value)}
                                    value={tool}
                                />
                                {tool.trim() && (
                                    <button
                                        type="button"
                                        onClick={() => removeRelatedToolField(index)}
                                        className="bg-red-200 text-red-700 px-2 rounded-md"
                                    >
                                        ✕
                                    </button>
                                )}
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={addRelatedToolField}
                            className="mt-2 text-blue-600 hover:underline text-sm"
                        >
                            + Add Tool
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditInnovationVault;
