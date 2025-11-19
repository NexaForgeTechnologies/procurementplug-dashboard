"use client";

import React, { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

import IconComponent from "@/components/icon/IconComp";
import InputComponent from "@/components/input-comps/InputTxt";
import RectangularImgUploader from "@/components/image-uploader/RectangularImgUploader";
import DropdownComp from "@/components/select/DropdownComp";
import FileUploader from "@/components/file-uploader/FileUploader";

type ExclusiveIntelligenceReport = {
  imagePath: string;
  filePath: string;
  reportTitle: string;
  category_industry?: string[]; // multi-select
  reportType?: string[]; // multi-select
  sponsor?: string[]; // multi-select
};

type AddExclusiveIntelligenceReportProps = {
  active: boolean;
  onClose: () => void;
  refetchReports: () => void;
};

const initialFormValues: ExclusiveIntelligenceReport = {
  imagePath: "",
  filePath: "",
  reportTitle: "",
  category_industry: [],
  reportType: [],
  sponsor: [],
};

const AddExclusiveIntelligenceReport: React.FC<AddExclusiveIntelligenceReportProps> = ({
  active,
  onClose,
  refetchReports,
}) => {
  const [formValues, setFormValues] = useState<ExclusiveIntelligenceReport>(initialFormValues);
  const [validationErrors, setValidationErrors] = useState({ reportTitle: false });
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Example dropdown/multi-select options
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

  const handleChange = <K extends keyof ExclusiveIntelligenceReport>(
    field: K,
    value: ExclusiveIntelligenceReport[K]
  ) => {
    setFormValues((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (field === "reportTitle" && typeof value === "string" && value.trim()) {
      setValidationErrors({ reportTitle: false });
    }
  };

  const validateForm = () => {
    const errors = { reportTitle: !formValues.reportTitle?.trim() };
    setValidationErrors(errors);
    return !Object.values(errors).some(Boolean);
  };

  const addReportMutation = useMutation({
    mutationFn: async (data: ExclusiveIntelligenceReport) => {
      const response = await axios.post("/api/exclusive-intelligence-reports", data);
      return response.data;
    },
    onSuccess: () => {
      refetchReports();
      setIsSubmitting(false);
      onClose();
    },
    onError: (error) => {
      console.error("Failed to add report:", error);
      setIsSubmitting(false);
    },
  });

  const handleSubmit = async () => {
    if (!validateForm()) return;
    setIsSubmitting(true);

    let imageUrl = formValues.imagePath;
    let fileUrl = formValues.filePath;

    // Upload image
    if (selectedImage) {
      const imgFormData = new FormData();
      imgFormData.append("file", selectedImage);
      try {
        const res = await fetch("/api/img-uploads", { method: "POST", body: imgFormData });
        if (!res.ok) throw new Error("Image upload failed");
        const data = await res.json();
        imageUrl = data.url;
        handleChange("imagePath", imageUrl);
      } catch (error) {
        console.error("Image upload failed:", error);
        alert("Image upload failed");
        setIsSubmitting(false);
        return;
      }
    }

    // Upload file
    if (selectedFile) {
      const fileFormData = new FormData();
      fileFormData.append("file", selectedFile);
      try {
        const res = await fetch("/api/file-uploads", { method: "POST", body: fileFormData });
        if (!res.ok) throw new Error("File upload failed");
        const data = await res.json();
        fileUrl = data.url;
        handleChange("filePath", fileUrl);
      } catch (error) {
        console.error("File upload failed:", error);
        alert("File upload failed");
        setIsSubmitting(false);
        return;
      }
    }

    const newReport: ExclusiveIntelligenceReport = {
      ...formValues,
      imagePath: imageUrl,
      filePath: fileUrl,
    };

    addReportMutation.mutate(newReport);
  };

  useEffect(() => {
    if (active) {
      setFormValues(initialFormValues);
      setValidationErrors({ reportTitle: false });
      setSelectedImage(null);
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
              <h2 className="font-medium text-2xl text-[#565656]">
                Add Exclusive Intelligence Report
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
                  <div className="bg-green-200 rounded-full p-3 cursor-pointer" onClick={handleSubmit}>
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

              {/* Category / Industry */}
              <div className="col-span-2 sm:col-span-1">
                <DropdownComp
                  label="Industry"
                  placeholder="Select industry"
                  options={categoryOptions}
                  onSelect={(id) => handleChange("category_industry", id ? [categoryOptions.find(opt => opt.id === id)?.value || ""] : [])}
                  value={formValues.category_industry?.[0] || ""}
                />
              </div>

              {/* Report Type */}
              <div className="col-span-2 sm:col-span-1">
                <DropdownComp
                  label="Report Type"
                  placeholder="Select report type"
                  options={reportTypeOptions}
                  onSelect={(id) => handleChange("reportType", id ? [reportTypeOptions.find(opt => opt.id === id)?.value || ""] : [])}
                  value={formValues.reportType?.[0] || ""}
                />
              </div>

              {/* Sponsor */}
              <div className="col-span-2 sm:col-span-1">
                <DropdownComp
                  label="Sponsor"
                  placeholder="Select sponsor"
                  options={sponsorOptions}
                  onSelect={(id) => handleChange("sponsor", id ? [sponsorOptions.find(opt => opt.id === id)?.value || ""] : [])}
                  value={formValues.sponsor?.[0] || ""}
                />
              </div>
            </div>

          </div>
        </div>
      )}
    </>
  );
};

export default AddExclusiveIntelligenceReport;
