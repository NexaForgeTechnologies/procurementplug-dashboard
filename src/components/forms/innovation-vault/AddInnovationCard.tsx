"use client";

import React, { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

import IconComponent from "@/components/icon/IconComp";
import InputComponent from "@/components/input-comps/InputTxt";
import CircularImageUploader from "@/components/image-uploader/CircularImageUploader";
import DropdownComp from "@/components/select/DropdownComp";

type Innovation = {
    logo: string;
    title: string;
    category_id?: number; // ✅ numeric ID for DB
    categoryDescription: string;
    description: string;
    keyFeatures: string[];
    relatedTools: string[];
    sponsoredBy: string;
};

type AddInnovationProps = {
    active: boolean;
    onClose: () => void;
    refetchInnovation: () => void;
};

const initialFormValues: Innovation = {
    logo: "",
    title: "",
    category_id: undefined,
    categoryDescription: "",
    description: "",
    keyFeatures: [""],
    relatedTools: [""],
    sponsoredBy: "",
};

const AddInnovationCard: React.FC<AddInnovationProps> = ({
    active,
    onClose,
    refetchInnovation,
}) => {
    const [formValues, setFormValues] = useState<Innovation>(initialFormValues);
    const [validationErrors, setValidationErrors] = useState({ title: false });
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // ✅ Category dropdown options (local constant)
    const categoryOptions = [
        { id: 1, value: "live" },
        { id: 2, value: "Beta Access" },
        { id: 3, value: "Pilot Open" },
        { id: 4, value: "In Development - download deck" },
    ];

    const handleChange = <K extends keyof Innovation>(
        field: K,
        value: Innovation[K]
    ) => {
        setFormValues((prev) => ({
            ...prev,
            [field]: value,
        }));

        if (typeof value === "string" && value.trim()) {
            setValidationErrors((prev) => ({ ...prev, [field]: false }));
        }
    };

    // ✅ Handle Key Features
    const handleFeatureChange = (index: number, value: string) => {
        const updatedFeatures = [...formValues.keyFeatures];
        updatedFeatures[index] = value;
        setFormValues((prev) => ({ ...prev, keyFeatures: updatedFeatures }));
    };
    // Related Tools handlers
    const handleRelatedToolChange = (index: number, value: string) => {
        const updatedTools = [...formValues.relatedTools];
        updatedTools[index] = value;
        setFormValues((prev) => ({ ...prev, relatedTools: updatedTools }));
    };

    const addRelatedToolField = () => {
        setFormValues((prev) => ({
            ...prev,
            relatedTools: [...prev.relatedTools, ""],
        }));
    };

    const removeRelatedToolField = (index: number) => {
        const updatedTools = formValues.relatedTools.filter((_, i) => i !== index);
        setFormValues((prev) => ({ ...prev, relatedTools: updatedTools }));
    };

    const addFeatureField = () => {
        setFormValues((prev) => ({
            ...prev,
            keyFeatures: [...prev.keyFeatures, ""],
        }));
    };

    const removeFeatureField = (index: number) => {
        const updatedFeatures = formValues.keyFeatures.filter((_, i) => i !== index);
        setFormValues((prev) => ({ ...prev, keyFeatures: updatedFeatures }));
    };

    const validateForm = () => {
        const errors = { title: !formValues.title?.trim() };
        setValidationErrors(errors);
        return !Object.values(errors).some(Boolean);
    };

    // ✅ React Query mutation
    const addInnovationMutation = useMutation({
        mutationFn: async (data: Innovation) => {
            const response = await axios.post("/api/innovation-vault", data);
            return response.data;
        },
        onSuccess: () => {
            refetchInnovation();
            setIsSubmitting(false);
            onClose();
        },
        onError: (error) => {
            console.error("Failed to add innovation:", error);
            setIsSubmitting(false);
        },
    });

    const handleSubmit = async () => {
        if (!validateForm()) return;
        setIsSubmitting(true);
        console.log(formValues);

        let imageUrl = formValues.logo;
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
                handleChange("logo", imageUrl);
            } catch (error) {
                console.error("Upload failed:", error);
                alert("Image upload failed");
                setIsSubmitting(false);
                return;
            }
        }

        const newInnovation: Innovation = {
            ...formValues,
            logo: imageUrl,
        };

        addInnovationMutation.mutate(newInnovation);
    };

    useEffect(() => {
        if (active) {
            setFormValues(initialFormValues);
            setValidationErrors({ title: false });
            setSelectedFile(null);
            setIsSubmitting(false);
        }
    }, [active]);

    return (
        <>
            {active && (
                <div className="fixed inset-0 bg-black/70 z-50 px-4">
                    <div className="max-w-[670px] max-h-[90vh] overflow-y-auto py-4 px-3 bg-[#F7F9FB] relative top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 rounded-md">
                        {/* Header */}
                        <div className="flex justify-between items-center">
                            <h2 className="font-medium text-2xl text-[#565656]">Add Innovation</h2>

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

                        {/* Image Upload */}
                        <div className="my-4">
                            <CircularImageUploader
                                label="Innovation Logo"
                                value={formValues.logo}
                                onImageSelect={(file) => setSelectedFile(file)}
                            />
                        </div>

                        {/* Form Fields */}
                        <div className="grid gap-4 grid-cols-2">
                            {/* Title */}
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

                            {/* Description */}
                            <div className="col-span-2">
                                <InputComponent
                                    label="Description"
                                    placeholder="Enter innovation description"
                                    onChange={(value) => handleChange("description", value)}
                                    value={formValues.description}
                                    isTextArea
                                    rows={4}
                                />
                            </div>

                            {/* Category */}
                            <div className="col-span-2 sm:col-span-1">
                                <DropdownComp
                                    label="Category"
                                    placeholder="Select category"
                                    options={categoryOptions}
                                    onSelect={(id) => handleChange("category_id", id ?? undefined)}
                                    value={
                                        categoryOptions.find((opt) => opt.id === formValues.category_id)
                                            ?.value || ""
                                    }
                                />
                            </div>

                            {/* Category Description */}
                            <div className="col-span-2 sm:col-span-1">
                                <InputComponent
                                    label="Category Description"
                                    placeholder="Short category explanation"
                                    onChange={(value) => handleChange("categoryDescription", value)}
                                    value={formValues.categoryDescription}
                                />
                            </div>

                            {/* Key Features */}
                            <div className="col-span-2">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Key Features
                                </label>
                                {formValues.keyFeatures.map((feature, index) => (
                                    <div key={index} className="flex gap-2 mb-2">
                                        <InputComponent
                                            placeholder={`Feature ${index + 1}`}
                                            onChange={(value) => handleFeatureChange(index, value)}
                                            value={feature}
                                        />
                                        {feature.trim() && (
                                            <button
                                                onClick={() => removeFeatureField(index)}
                                                className="bg-red-200 text-red-700 px-2 rounded-md"
                                            >
                                                ✕
                                            </button>
                                        )}
                                    </div>
                                ))}

                                <button
                                    onClick={addFeatureField}
                                    className="mt-2 text-blue-600 hover:underline text-sm"
                                >
                                    + Add Feature
                                </button>
                            </div>

                            {/* Related Tools */}
                            <div className="col-span-2">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Related Tools
                                </label>
                                {formValues.relatedTools.map((tool, index) => (
                                    <div key={index} className="flex gap-2 mb-2">
                                        <InputComponent
                                            placeholder={`Tool ${index + 1}`}
                                            onChange={(value) => handleRelatedToolChange(index, value)}
                                            value={tool}
                                        />
                                        {tool.trim() && (
                                            <button
                                                onClick={() => removeRelatedToolField(index)}
                                                className="bg-red-200 text-red-700 px-2 rounded-md"
                                            >
                                                ✕
                                            </button>
                                        )}
                                    </div>
                                ))}

                                <button
                                    onClick={addRelatedToolField}
                                    className="mt-2 text-blue-600 hover:underline text-sm"
                                >
                                    + Add Tool
                                </button>
                            </div>


                            {/* Sponsored By */}
                            <div className="col-span-2">
                                <InputComponent
                                    label="Sponsored By"
                                    placeholder="Enter sponsor name"
                                    onChange={(value) => handleChange("sponsoredBy", value)}
                                    value={formValues.sponsoredBy}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default AddInnovationCard;