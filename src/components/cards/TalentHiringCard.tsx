"use client";

import React, { useState } from "react";
import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import ConfirmDialog from "@/components/ConfirmDialog";

import { TalentHiringDM } from "@/domain-models/talent-hiring-intelligence/TalentHiringDM";

type TalentCardProps = {
    data: TalentHiringDM;
    refetchData: () => void;
    openEditForm: (data: TalentHiringDM) => void;
};

const TalentHiringCard: React.FC<TalentCardProps> = ({
    data,
    refetchData,
    openEditForm,
}) => {
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);

    const deleteTalent = useMutation({
        mutationFn: async (talentId: number) => {
            const response = await axios.delete(
                `/api/talent-hiring-intelligence?id=${talentId}`
            );
            return response.data;
        },
        onSuccess: () => {
            refetchData();
        },
        onError: (error) => {
            console.error("Failed to delete record:", error);
        },
    });

    const confirmDeletion = async () => {
        setIsConfirmOpen(false);
        setIsDeleting(true);
        try {
            await deleteTalent.mutateAsync(data.id!);
        } catch (error) {
            console.error("Error deleting record:", error);
        } finally {
            setIsDeleting(false);
        }
    };

    const charLimit = 100;
    const description = data.description ?? "";
    const isLong = description.length > charLimit;
    const displayedDescription = !description
        ? ""
        : isLong && !isExpanded
            ? description.slice(0, charLimit)
            : description;

    return (
        <>
            <div className="w-full px-4 py-6 flex flex-col items-center text-center gap-2 rounded-lg border border-gray-200 hover:border-[#85009D] hover:shadow-lg transition-all bg-white relative">
                {/* ✏️ / 🗑️ Buttons */}
                <div className="absolute top-2 right-2 flex gap-2">
                    <button
                        onClick={() => openEditForm(data)}
                        className="cursor-pointer p-2 bg-white hover:bg-blue-50 text-blue-600 rounded-full shadow transition"
                        title="Edit"
                    >
                        ✏️
                    </button>

                    {isDeleting ? (
                        <div className="p-2 bg-white rounded-full shadow-md flex items-center justify-center">
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
                                ></circle>
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 010 16v-4l-3 3 3 3v-4a8 8 0 01-8-8z"
                                ></path>
                            </svg>
                        </div>
                    ) : (
                        <button
                            onClick={() => setIsConfirmOpen(true)}
                            className="cursor-pointer p-2 bg-white hover:bg-red-50 text-red-600 rounded-full shadow transition"
                            title="Delete"
                        >
                            🗑️
                        </button>
                    )}
                </div>

                {/* Logo */}
                <img
                    src={data.logo}
                    alt={`${data.name} Logo`}
                    className="w-16 h-16 rounded-full object-cover self-center mb-2 border border-gray-300"
                />

                {/* Card Info */}
                <h2 className="text-xl font-bold text-[#85009D]">{data.name}</h2>
                <p className="text-black font-semibold">{data.occupation}</p>
                <p className="text-[#a67c00]">{data.address}</p>

                <p className="text-black mt-2">
                    {displayedDescription}
                    {isLong && (
                        <button
                            onClick={() => setIsExpanded(!isExpanded)}
                            className="ml-1 text-[#a67c00] hover:underline font-light"
                        >
                            {isExpanded ? "...View Less" : "...View More"}
                        </button>
                    )}
                </p>
            </div>

            {/* Confirmation Dialog */}
            <ConfirmDialog
                isOpen={isConfirmOpen}
                onClose={() => setIsConfirmOpen(false)}
                onConfirm={confirmDeletion}
                message={`Are you sure you want to delete ${data.name}?`}
            />
        </>
    );
};

export default TalentHiringCard;
