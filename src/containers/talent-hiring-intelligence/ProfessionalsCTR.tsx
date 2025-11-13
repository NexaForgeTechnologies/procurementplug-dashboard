"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

import { TalentHiringDM } from "@/domain-models/talent-hiring-intelligence/TalentHiringDM";
import TalentHiringCard from "@/components/cards/TalentHiringCard";
import AddTalentCard from "@/components/forms/talent-hiring-intelligence/AddTalentCard";
import EditTalentCard from "@/components/forms/talent-hiring-intelligence/EditTalentCard";

function ProfessionalsCTR() {
    const [searchTerm, setSearchTerm] = useState("");
    const [modalState, setModalState] = useState<"none" | "add" | "edit">("none");
    const [selectedTalent, setSelectedTalent] = useState<TalentHiringDM | null>(null);

    // Fetch talent records from API
    const fetchTalents = async (): Promise<TalentHiringDM[]> => {
        const response = await axios.get<TalentHiringDM[]>("/api/talent-hiring-intelligence/professionals");
        return response.data;
    };

    const { data: talents, isLoading, isError, refetch } = useQuery<TalentHiringDM[]>({
        queryKey: ["talents"],
        queryFn: fetchTalents,
    });

    const term = searchTerm.trim().toLowerCase();
    const filteredTalents = talents?.filter(
        (talent) =>
            talent.name?.toLowerCase().includes(term) ||
            talent.occupation?.toLowerCase().includes(term) ||
            talent.description?.toLowerCase().includes(term)
    );

    const openAddModal = () => setModalState("add");
    const openEditModal = (talent: TalentHiringDM) => {
        setSelectedTalent(talent);
        setModalState("edit");
    };
    const closeModal = () => {
        setModalState("none");
        setSelectedTalent(null);
        refetch();
    };

    return (
        <>
            {/* Header + Search */}
            <div className="max-w-[780px] m-auto text-center">
                <h3 className="font-extrabold text-3xl md:text-5xl mb-4 md:mb-6 text-[#010101]">
                    Professionals
                </h3>
                <p className="text-[#363636] text-sm md:text-lg leading-normal md:leading-relaxed">
                    Discover tools, insights, and strategies that are redefining talent acquisition. Explore innovative approaches to enhance hiring intelligence and optimize workforce planning.
                </p>

                <div className="flex items-center gap-2 sm:gap-4 my-10">
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search by name, occupation, or description..."
                        className="w-full p-3 rounded-md border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#85009D] transition-all"
                    />
                    <button
                        onClick={openAddModal}
                        className="cursor-pointer bg-[#85009D] hover:bg-[#6B007D] text-white font-semibold rounded-md shadow-md transition-all duration-300 min-w-max py-3 px-4"
                    >
                        + <span className="hidden sm:inline">&nbsp;Add Talent</span>
                    </button>
                </div>
            </div>

            {/* Main Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-10 min-h-[200px]">
                {isLoading && (
                    <div className="flex justify-center items-center col-span-full py-20">
                        <div
                            className="w-12 h-12 border-4 border-[#85009D] border-t-transparent rounded-full animate-spin"
                            role="status"
                        />
                    </div>
                )}

                {isError && !isLoading && (
                    <p className="text-center col-span-full text-red-500 text-lg">
                        Failed to load talent records.
                    </p>
                )}

                {!isLoading && !isError && (
                    <>
                        {filteredTalents?.length ? (
                            filteredTalents.map((talent) => (
                                <TalentHiringCard
                                    key={talent.id}
                                    data={talent}
                                    refetchData={refetch}
                                    openEditForm={openEditModal}
                                />
                            ))
                        ) : (
                            <p className="text-center col-span-full text-gray-500 text-lg">
                                No talent found.
                            </p>
                        )}
                    </>
                )}
            </div>

            {/* Add Form */}
            {modalState === "add" && (
                <AddTalentCard
                    active={true}
                    onClose={closeModal}
                    refetchTalents={refetch}
                />
            )}

            {/* Edit Form */}
            {modalState === "edit" && selectedTalent && (
                <EditTalentCard
                    active={true}                // ✅ Add this prop
                    talent={selectedTalent}
                    onClose={closeModal}
                    refetchTalents={refetch}
                />
            )}

        </>
    );
}

export default ProfessionalsCTR;
