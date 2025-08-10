"use client";

import React, { useState } from "react";
import axios from "axios";
import { useMutation } from "@tanstack/react-query";

import { ProcuretechSolutionDM } from "@/domain-models/procuretech-solution/ProcuretechSolutionDM";

import ConfirmDialog from "@/components/ConfirmDialog";
import Image from "next/image";

type ProcuretechSolutionProps = {
    data: ProcuretechSolutionDM;
    refetchProcuretechSolutions: () => void;
    openEditForm: (data: ProcuretechSolutionDM) => void;
};

const ProcuretechSolutionCard: React.FC<ProcuretechSolutionProps> = ({
    data,
    refetchProcuretechSolutions,
    openEditForm,
}) => {
    // Mutation for deleting a procuretech
    const deleteProcuretechSolution = useMutation({
        mutationFn: async (data: ProcuretechSolutionDM) => {
            const response = await axios.delete("/api/procuretech-solution", {
                data,
            });
            return response.data;
        },
        onSuccess: () => {
            refetchProcuretechSolutions();
        },
        onError: (error) => {
            console.error("Failed to delete Procuretech:", error);
        },
    });

    const [isConfirmOpen, setIsConfirmOpen] = useState(false);

    const handleDelete = () => {
        setIsConfirmOpen(true);
    };

    const confirmDeletion = () => {
        deleteProcuretechSolution.mutate({ id: data.id });
        setIsConfirmOpen(false);
    };

    return (
        <>
            <div
                className="w-full px-4 pb-4 pt-14 flex flex-col items-center text-center gap-2 rounded-[6px] hover:border-[#85009D] border border-[#DBBB89] hover:bg-[#85009D] bg-[#FFFBF5]
                 text-[#85009D] hover:text-white transition-all duration-200 ease-in-out group
                  relative"
            >
                {/* Top-right edit/delete buttons */}
                <div className="absolute top-2 right-2 flex gap-2">
                    <button
                        onClick={() => openEditForm(data)}
                        className="cursor-pointer p-2 bg-white/90 hover:bg-blue-100 text-blue-600
                         rounded-full shadow-md transition-all duration-200"
                        title="Edit"
                    >
                        ✏️
                    </button>
                    <button
                        onClick={handleDelete}
                        className="cursor-pointer p-2 bg-white/90 hover:bg-red-100 text-red-600
                         rounded-full shadow-md transition-all duration-200"
                        title="Delete"
                    >
                        🗑️
                    </button>
                </div>

                <Image
                    className="group-hover:transition-all duration-200 ease-in-out"
                    src={data.img || ""}
                    alt={data.img || ""}
                    width={240}   // or remove width/height props if using next/image
                    height={240}
                />

                <h2 className="text-xl md:text-2xl font-extrabold">{data.name}</h2>

                <button onClick={() => openEditForm(data)} className="mt-auto flex items-center cursor-pointer bg-[#b08d57] text-white px-4 py-2 rounded-[6px]">View Details
                    <div className="ml-1 w-2 h-2 border-t-2 border-r-2 border-white transform rotate-45"></div>
                </button>
            </div>

            <ConfirmDialog
                isOpen={isConfirmOpen}
                onClose={() => setIsConfirmOpen(false)}
                onConfirm={confirmDeletion}
                message={`Are you sure you want to delete ${data.name}?`}
            />
        </>
    );
};

export default ProcuretechSolutionCard;
