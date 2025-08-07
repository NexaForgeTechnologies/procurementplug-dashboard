"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

import { ConsultantDM } from "@/domain-models/ConsultantDM";

import ConsultantCard from "@/components/cards/ConsultantCard";
import AddConsultantCatd from "@/components/forms/consulting-partner/AddConsultingPartner";
import EditConsultantComp from "@/components/forms/consulting-partner/EditConsultingPartner";

function ConsultantCTR() {
    const [searchTerm, setSearchTerm] = useState("");

    // Fetch Speaker
    const fetchConsultant = async (): Promise<ConsultantDM[]> => {
        const response = await axios.get<ConsultantDM[]>("/api/consultants");
        return response.data;
    };

    const {
        data: consultants,
        refetch,
    } = useQuery<ConsultantDM[]>({
        queryKey: ["consultants"],
        queryFn: fetchConsultant,
    });

    const filteredConsultants = consultants?.filter((consultant) => {
        const term = searchTerm.toLowerCase();
        return (
            consultant.name?.toLowerCase().includes(term) ||
            consultant.company?.toLowerCase().includes(term) ||
            consultant.designation?.toLowerCase().includes(term)
        );
    });

    const [isActive, setIsActive] = useState(false);
    const handleClick = () => setIsActive(!isActive);

    const [activeEditMode, setActiveEditMode] = useState(false);
    const [selectedConsultant, setSelectedConsultant] = useState<ConsultantDM | null>(
        null
    );

    const handleConsultantEdit = (speaker: ConsultantDM) => {
        setActiveEditMode(!activeEditMode);
        setSelectedConsultant((prev) => (prev?.id === speaker.id ? null : speaker));
    };
    return (
        <>
            <div className="max-w-[780px] m-auto text-center">
                <h3 className="font-extrabold text-3xl md:text-5xl mb-4 md:mb-6 text-[#010101]">
                    Consulting Partners
                </h3>
                <p className="text-[#363636] text-sm md:text-lg leading-normal md:leading-relaxed">
                    The Procurement Plug’s Consulting Partners deliver expert solutions to enhance your procurement strategy, from process improvement and strategy development to ESG and sustainability impact.
                </p>

                {/* 🔍 Search + ➕ Add Button Row */}
                <div className="flex items-center gap-2 sm:gap-4 my-10">
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search by name, company, designation..."
                        className="w-full p-3 rounded-md border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    />

                    <button
                        onClick={handleClick}
                        className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md shadow-md transition-all duration-300 min-w-max py-3 px-4"
                    >
                        + <span className="hidden sm:inline">&nbsp;Add Consultant</span>
                    </button>
                </div>
            </div>

            {/* Consultant Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-10">
                {filteredConsultants?.length ? (
                    filteredConsultants.map((consultant) => (
                        <ConsultantCard
                            key={consultant.id}
                            data={consultant}
                            refetchConsultant={refetch}
                            openEditForm={handleConsultantEdit}
                        />
                    ))
                ) : (
                    <p className="text-center col-span-full text-gray-500 text-lg">
                        No consultant found.
                    </p>
                )}
            </div>

            {/* Add Consultant Form */}
            {isActive && (
                <AddConsultantCatd
                    active={isActive}
                    onClose={() => {
                        setIsActive(false);
                        refetch();
                    }}
                    refetchConsultant={refetch}
                />
            )}

            {activeEditMode && selectedConsultant && (
                <EditConsultantComp
                    consultant={selectedConsultant}
                    onClose={() => {
                        setActiveEditMode(false);
                        setSelectedConsultant(null);
                        refetch();
                    }}
                        refetchConsultants={refetch}
                />
            )}
        </>
    );
}

export default ConsultantCTR;
