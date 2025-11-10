"use client";

import React, { useState } from "react";
import Image from "next/image";
import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import { InnovationDM } from "@/domain-models/innovation-vault/InnovationDM";
import ConfirmDialog from "@/components/ConfirmDialog";

interface InnovationCardProps {
    data: InnovationDM;
    refetchInnovation?: () => void;
    openEditForm?: (innovation: InnovationDM) => void;
}

const InnovationCard: React.FC<InnovationCardProps> = ({
    data,
    refetchInnovation,
    openEditForm,
}) => {
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    // Mutation for deleting innovation
    const deleteInnovationMutation = useMutation({
        mutationFn: async (innovationId: number) => {
            const response = await axios.delete(`/api/innovations?id=${innovationId}`);
            return response.data;
        },
        onSuccess: () => {
            refetchInnovation?.();
        },
        onError: (error) => console.error("Failed to delete innovation:", error),
    });

    const handleDeleteClick = () => {
        setIsConfirmOpen(true);
    };

    const confirmDeletion = async () => {
        setIsConfirmOpen(false);
        setIsDeleting(true);

        try {
            if (data.logo) {
                try {
                    await axios.delete("/api/img-uploads", { data: { url: data.logo } });
                } catch (imgErr) {
                    console.warn("Failed to delete logo, continuing DB deletion.", imgErr);
                }
            }
            await deleteInnovationMutation.mutateAsync(data.id);
        } catch (err) {
            console.error("Error deleting innovation:", err);
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <>
            <div className="w-full max-w-xs px-6 py-6 flex flex-col items-center text-center gap-3 rounded-lg border border-gray-200 shadow-md relative bg-white">
                {/* Top-right buttons */}
                <div className="absolute top-3 right-3 flex gap-2">
                    {openEditForm && (
                        <button
                            onClick={() => openEditForm(data)}
                            className="p-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full shadow-sm transition"
                            title="Edit"
                            disabled={isDeleting}
                        >
                            ✏️
                        </button>
                    )}

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

                {/* Logo */}
                {data.logo && (
                    <Image
                        className="w-28 h-28 object-contain rounded-full border border-gray-200"
                        src={data.logo}
                        alt={data.title}
                        width={112}
                        height={112}
                    />
                )}

                {/* Title */}
                <h3 className="text-lg font-bold text-gray-900 mt-6">{data.title}</h3>

            </div>

            {/* Confirm Dialog */}
            <ConfirmDialog
                isOpen={isConfirmOpen}
                onClose={() => setIsConfirmOpen(false)}
                onConfirm={confirmDeletion}
                message={`Are you sure you want to delete "${data.title}"?`}
            />
        </>
    );
};

export default InnovationCard;
