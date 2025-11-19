"use client";

import React, { useState } from "react";
import Image from "next/image";
import axios from "axios";
import { useMutation } from "@tanstack/react-query";

import { ExclusiveIntelligenceReportsDM } from "@/domain-models/exclusive-intelligence-reports/ExclusiveIntelligenceReportsDM";
import ConfirmDialog from "@/components/ConfirmDialog";

type ExclusiveIntelligenceReportCardProps = {
    data: ExclusiveIntelligenceReportsDM;
    refetchReports: () => void;
    openEditForm: (data: ExclusiveIntelligenceReportsDM) => void;
};

const ExclusiveIntelligenceReportCard: React.FC<ExclusiveIntelligenceReportCardProps> = ({
    data,
    refetchReports,
    openEditForm,
}) => {
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    // Mutation for deleting report
    const deleteReportMutation = useMutation({
        mutationFn: async (reportId: number) => {
            const response = await axios.delete(`/api/exclusive-intelligence-reports?id=${reportId}`);
            return response.data;
        },
        onSuccess: () => refetchReports(),
        onError: (error) => console.error("Failed to delete report:", error),
    });

    const handleDeleteClick = () => setIsConfirmOpen(true);

    const getFileExtension = (filePath?: string) => {
        if (!filePath) return null;
        const parts = filePath.split(".");
        return parts.length > 1 ? parts[parts.length - 1].toUpperCase() : null;
    };

    const confirmDeletion = async () => {
        setIsConfirmOpen(false);
        setIsDeleting(true);

        try {
            if (data.imagePath) {
                try {
                    await axios.delete("/api/img-uploads", { data: { url: data.imagePath } });
                } catch (imgErr) {
                    console.warn("Failed to delete report image, continuing DB deletion.", imgErr);
                }
            }

            await deleteReportMutation.mutateAsync(data.id!);
        } catch (err) {
            console.error("Error deleting report:", err);
        } finally {
            setIsDeleting(false);
        }
    };


    return (
        <>
            <div className="w-full max-w-xs px-6 py-8 flex flex-col items-center text-center gap-3 rounded-lg border border-[#DBBB89] shadow-md transition-all duration-200 relative">
                {/* Top-right buttons */}
                <div className="absolute top-3 right-3 flex gap-2">
                    <button
                        onClick={() => openEditForm(data)}
                        className="p-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full shadow-sm transition"
                        title="Edit"
                        disabled={isDeleting}
                    >
                        ✏️
                    </button>
                    {isDeleting ? (
                        <div className="p-2 bg-gray-100 rounded-full shadow-sm flex items-center justify-center">
                            <svg
                                className="animate-spin h-4 w-4 text-red-600"
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
                                />
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 010 16v-4l-3 3 3 3v-4a8 8 0 01-8-8z"
                                />
                            </svg>
                        </div>
                    ) : (
                        <button
                            onClick={handleDeleteClick}
                            className="p-2 bg-gray-100 hover:bg-red-100 text-red-600 rounded-full shadow-sm transition"
                            title="Delete"
                            disabled={isDeleting}
                        >
                            🗑️
                        </button>
                    )}
                </div>

                {/* Report Image */}
                <Image
                    className="rounded-lg w-36 h-36 object-cover border border-gray-200"
                    src={data.imagePath || "/images/default-circle.png"}
                    alt={data.reportTitle || "Report"}
                    width={144}
                    height={144}
                />

                {/* Info */}
                <div className="flex flex-col justify-center">
                    <h2 className="text-lg md:text-xl font-semibold text-gray-800">{data.reportTitle}</h2>
                    {data.filePath && (
                        <p className="text-sm text-gray-500 mt-1">
                            File Format: <span className="font-medium">{getFileExtension(data.filePath)}</span>
                        </p>
                    )}
                    {data.category_industry?.length > 0 && (
                        <p className="text-[#9e8151] text-sm mt-1">
                            <span className="text-black">Industry:</span>{" "}
                            <span className="text-gray-600">{data.category_industry.join(", ")}</span>
                        </p>
                    )}

                    {data.reportType?.length > 0 && (
                        <p className="text-[#9e8151] text-sm mt-1">
                            <span className="text-black">Report Type:</span>{" "}
                            <span className="text-gray-600">{data.reportType.join(", ")}</span>
                        </p>
                    )}

                    {data.sponsor?.length > 0 && (
                        <p className="text-[#9e8151] text-sm mt-1">
                            <span className="text-black">Sponsor:</span>{" "}
                            <span className="text-gray-600">{data.sponsor.join(", ")}</span>
                        </p>
                    )}
                </div>
            </div>

            <ConfirmDialog
                isOpen={isConfirmOpen}
                onClose={() => setIsConfirmOpen(false)}
                onConfirm={confirmDeletion}
                message={`Are you sure you want to delete ${data.reportTitle}?`}
            />
        </>
    );
};

export default ExclusiveIntelligenceReportCard;
