"use client";

import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

import IconComponent from "@/components/icon/IconComp";
import InputComponent from "@/components/input-comps/InputTxt";
import RectangularImgUploader from "@/components/image-uploader/RectangularImgUploader";
import FileUploader from "@/components/file-uploader/FileUploader";
import DropdownComp from "@/components/select/DropdownComp";

// Replace this with your domain model if available
import { ExclusiveIntelligenceReportsDM } from "@/domain-models/exclusive-intelligence-reports/ExclusiveIntelligenceReportsDM";

type EditExclusiveIntelligenceReportProps = {
    report: ExclusiveIntelligenceReportsDM;
    onClose: () => void;
    refetchReports: () => void;
    active?: boolean;
};

const EditExclusiveIntelligenceReport: React.FC<EditExclusiveIntelligenceReportProps> = ({
    report,
    onClose,
    refetchReports,
    active = true,
}) => {
    const [formValues, setFormValues] = useState<ExclusiveIntelligenceReportsDM>(report);
    const [validationErrors, setValidationErrors] = useState({ reportTitle: false });
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const categoryOptions = [
        { id: 1, value: "Industry Insights" },
        { id: 2, value: "Market Research" },
        { id: 3, value: "Expert Opinions" },
        { id: 4, value: "Strategic Guidance" },
    ];

    const reportTypeOptions = [
        { id: 1, value: "WhitePaper" },
        { id: 2, value: "Article" },
        { id: 3, value: "Forecast" },
        { id: 4, value: "Benchmark" },
    ];

    const sponsorOptions = [
        { id: 1, value: "Sponsored" },
        { id: 2, value: "Updated" },
        { id: 3, value: "New" },
    ];

    const intelligenceTrackerOptions = [
        { id: 1, value: "Salary tracker" },
        { id: 2, value: "Role tracker" },
        { id: 3, value: "Employer insights" },
    ];

    const handleChange = <K extends keyof ExclusiveIntelligenceReportsDM>(
        field: K,
        value: ExclusiveIntelligenceReportsDM[K]
    ) => {
        setFormValues((prev) => ({ ...prev, [field]: value }));
        if (field === "reportTitle" && typeof value === "string" && value.trim()) {
            setValidationErrors({ reportTitle: false });
        }
    };

    const validateForm = () => {
        const errors = { reportTitle: !formValues.reportTitle?.trim() };
        setValidationErrors(errors);
        return !Object.values(errors).some(Boolean);
    };

    const updateReportMutation = useMutation({
        mutationFn: async (data: ExclusiveIntelligenceReportsDM) => {
            const response = await axios.put("/api/exclusive-intelligence-reports", data);
            return response.data;
        },
        onSuccess: () => {
            refetchReports();
            onClose();
        },
        onError: (error) => {
            console.error("Failed to update report:", error);
        },
    });

    const handleUpdate = async () => {
        if (!validateForm()) return;
        setIsSubmitting(true);

        let imageUrl = formValues.imagePath;
        let fileUrl = formValues.filePath;

        // Image upload
        if (selectedImage) {
            if (report.imagePath) {
                await axios.delete("/api/img-uploads", { data: { url: report.imagePath } });
            }
            const imgFormData = new FormData();
            imgFormData.append("file", selectedImage);
            const imgRes = await axios.post("/api/img-uploads", imgFormData);
            imageUrl = imgRes.data.url;
        }

        if (!formValues.imagePath && report.imagePath) {
            await axios.delete("/api/img-uploads", { data: { url: report.imagePath } });
            imageUrl = "";
        }

        // File upload
        if (selectedFile) {
            if (report.filePath) {
                await axios.delete("/api/file-uploads", { data: { url: report.filePath } });
            }
            const fileFormData = new FormData();
            fileFormData.append("file", selectedFile);
            const fileRes = await axios.post("/api/file-uploads", fileFormData);
            fileUrl = fileRes.data.url;
        }

        if (!formValues.filePath && report.filePath) {
            await axios.delete("/api/file-uploads", { data: { url: report.filePath } });
            fileUrl = "";
        }

        await updateReportMutation.mutateAsync({ ...formValues, imagePath: imageUrl, filePath: fileUrl });
        setIsSubmitting(false);
    };

    if (!active) return null;

    return (
        <div className="fixed inset-0 bg-black/70 z-50 px-4">
            <div className="max-w-[670px] max-h-[90vh] overflow-y-auto py-4 px-3 bg-[#F7F9FB] relative top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 rounded-md">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <h2 className="font-medium text-2xl text-[#565656]">
                        Edit Exclusive Intelligence Report
                    </h2>
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

                {/* Image Upload */}
                <div className="my-4">
                    <RectangularImgUploader
                        label="Report Cover Image"
                        value={formValues.imagePath}
                        onImageSelect={(file) => setSelectedImage(file)}
                    />
                </div>

                {/* File Upload */}
                <div className="my-4">
                    <FileUploader
                        label="Report File"
                        value={formValues.filePath}
                        onFileSelect={(file) => setSelectedFile(file)}
                    />
                </div>

                {/* Form Fields */}
                <div className="grid gap-4 grid-cols-2">
                    <div className="col-span-2">
                        <InputComponent
                            label="Report Title"
                            placeholder="Enter report title"
                            onChange={(value) => handleChange("reportTitle", value)}
                            value={formValues.reportTitle}
                            required
                            showError={validationErrors.reportTitle}
                        />
                    </div>

                    <div className="col-span-2 sm:col-span-1">
                        <DropdownComp
                            label="Industry"
                            placeholder="Select industry"
                            options={categoryOptions}
                            onSelect={(id) =>
                                handleChange(
                                    "category_industry",
                                    id ? [categoryOptions.find((opt) => opt.id === id)?.value || ""] : []
                                )
                            }
                            value={formValues.category_industry?.[0] || ""}
                        />
                    </div>

                    <div className="col-span-2 sm:col-span-1">
                        <DropdownComp
                            label="Report Type"
                            placeholder="Select report type"
                            options={reportTypeOptions}
                            onSelect={(id) =>
                                handleChange(
                                    "reportType",
                                    id ? [reportTypeOptions.find((opt) => opt.id === id)?.value || ""] : []
                                )
                            }
                            value={formValues.reportType?.[0] || ""}
                        />
                    </div>

                    <div className="col-span-2 sm:col-span-1">
                        <DropdownComp
                            label="Sponsor"
                            placeholder="Select sponsor"
                            options={sponsorOptions}
                            onSelect={(id) =>
                                handleChange(
                                    "sponsor",
                                    id ? [sponsorOptions.find((opt) => opt.id === id)?.value || ""] : []
                                )
                            }
                            value={formValues.sponsor?.[0] || ""}
                        />
                    </div>

                    <div className="col-span-2 sm:col-span-1">
                        <DropdownComp
                            label="Intelligence Tracker"
                            placeholder="Select Tracker"
                            options={intelligenceTrackerOptions}
                            onSelect={(id) =>
                                handleChange(
                                    "intelligence_tracker",
                                    id ? [intelligenceTrackerOptions.find((opt) => opt.id === id)?.value || ""] : []
                                )
                            }
                            value={formValues.intelligence_tracker?.[0] || ""}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditExclusiveIntelligenceReport;
