"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

import { ProcuretechSolutionDM } from "@/domain-models/procuretech-solution/ProcuretechSolutionDM";

import ProcuretechCard from "@/components/cards/ProcuretechSolutionCard";
import AddProcuretechSolution from "@/components/forms/procuretech-solution/AddProcuretechSolution";
import EditProcuretechSolution from "@/components/forms/procuretech-solution/EditProcuretechSolution";

function ProcuretechSolutionCTR() {
    const [searchTerm, setSearchTerm] = useState("");

    // Fetch Speaker
    const fetchProcuretechSolution = async (): Promise<ProcuretechSolutionDM[]> => {
        const response = await axios.get<ProcuretechSolutionDM[]>("/api/procuretech-solution");
        return response.data;
    };

    const {
        data: procuretechSolutions,
        refetch,
    } = useQuery<ProcuretechSolutionDM[]>({
        queryKey: ["procuretechSolutions"],
        queryFn: fetchProcuretechSolution,
    });

    const filteredProcuretechSolution = procuretechSolutions?.filter((procuretechSolution) => {
        const term = searchTerm.toLowerCase();
        return (
            procuretechSolution.name?.toLowerCase().includes(term)
        );
    });

    const [isActive, setIsActive] = useState(false);
    const handleClick = () => setIsActive(!isActive);

    const [activeEditMode, setActiveEditMode] = useState(false);
    const [selectedprocuretechSolution, setSelectedProcuretechSolution] = useState<ProcuretechSolutionDM | null>(
        null
    );

    const handleProcuretechEdit = (speaker: ProcuretechSolutionDM) => {
        setActiveEditMode(!activeEditMode);
        setSelectedProcuretechSolution((prev) => (prev?.id === speaker.id ? null : speaker));
    };
    return (
        <>
            <div className="max-w-[780px] m-auto text-center">
                <h3 className="font-extrabold text-3xl md:text-5xl mb-4 md:mb-6 text-[#010101]">
                    ProcureTech Solutions
                </h3>
                <p className="text-[#363636] text-sm md:text-lg leading-normal md:leading-relaxed">
                    ProcureTech Solutions offers smart digital tools to simplify and speed up the procurement process, helping businesses manage sourcing, contracts, and spending more efficiently.</p>

                {/* 🔍 Search + ➕ Add Button Row */}
                <div className="flex items-center gap-2 sm:gap-4 my-10">
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search by name..."
                        className="w-full p-3 rounded-md border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    />

                    <button
                        onClick={handleClick}
                        className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md shadow-md transition-all duration-300 min-w-max py-3 px-4"
                    >
                        + <span className="hidden sm:inline">&nbsp;ProcureTech Solution</span>
                    </button>
                </div>
            </div>

            {/* Procuretech Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-10">
                {filteredProcuretechSolution?.length ? (
                    filteredProcuretechSolution.map((procuretech) => (
                        <ProcuretechCard
                            key={procuretech.id}
                            data={procuretech}
                            refetchProcuretechSolutions={refetch}
                            openEditForm={handleProcuretechEdit}
                        />
                    ))
                ) : (
                    <p className="text-center col-span-full text-gray-500 text-lg">
                        No procuretech solution found.
                    </p>
                )}
            </div>


            {/* Add Procuretech Form */}
            {isActive && (
                <AddProcuretechSolution
                    active={isActive}
                    onClose={() => {
                        setIsActive(false);
                        refetch();
                    }}
                    refetchProcuretech={refetch}
                />
            )}

            {activeEditMode && selectedprocuretechSolution && (
                <EditProcuretechSolution
                    procuretech={selectedprocuretechSolution}
                    onClose={() => {
                        setActiveEditMode(false);
                        setSelectedProcuretechSolution(null);
                        refetch();
                    }}
                    refetchProcuretech={refetch}
                />
            )}
        </>
    );
}

export default ProcuretechSolutionCTR;
