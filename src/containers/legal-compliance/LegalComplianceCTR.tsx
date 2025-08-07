"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

import { LegalComplianceDM } from "@/domain-models/LegalComplianceDM";

import ComplianceCard from "@/components/cards/LegalCompliance";
import AddLegalComplianceComp from "@/components/forms/legal-compliance/AddLegalCompliance";
import EditLegalComplianceComp from "@/components/forms/legal-compliance/EditLegalCompliance";

function LegalComplianceCTR() {
    const [searchTerm, setSearchTerm] = useState("");

    // Fetch Speaker
    const fetchLegalCompliance = async (): Promise<LegalComplianceDM[]> => {
        const response = await axios.get<LegalComplianceDM[]>("/api/legal-compliance");
        return response.data;
    };

    const {
        data: compliances,
        refetch,
    } = useQuery<LegalComplianceDM[]>({
        queryKey: ["compliances"],
        queryFn: fetchLegalCompliance,
    });

    const filteredCompliance = compliances?.filter((compliance) => {
        const term = searchTerm.toLowerCase();
        return (
            compliance.name?.toLowerCase().includes(term) ||
            compliance.company?.toLowerCase().includes(term) ||
            compliance.designation?.toLowerCase().includes(term)
        );
    });

    const [isActive, setIsActive] = useState(false);
    const handleClick = () => setIsActive(!isActive);

    const [activeEditMode, setActiveEditMode] = useState(false);
    const [selectedLegalCompliance, setSelectedLegalCompliance] = useState<LegalComplianceDM | null>(
        null
    );

    const handleLegalComplianceEdit = (speaker: LegalComplianceDM) => {
        setActiveEditMode(!activeEditMode);
        setSelectedLegalCompliance((prev) => (prev?.id === speaker.id ? null : speaker));
    };
    return (
        <>
            <div className="max-w-[780px] m-auto text-center">
                <h3 className="font-extrabold text-3xl md:text-5xl mb-4 md:mb-6 text-[#010101]">
                    Legal & Compliance
                </h3>
                <p className="text-[#363636] text-sm md:text-lg leading-normal md:leading-relaxed">
                    Source-to-Contract (S2C) streamlines the procurement process from supplier sourcing to contract signing, helping businesses save time, reduce risks, and improve compliance.</p>

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
                        + <span className="hidden sm:inline">&nbsp;Legal & Compliance</span>
                    </button>
                </div>
            </div>

            {/* LegalCompliance Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-10">
                {filteredCompliance?.length ? (
                    filteredCompliance.map((compliance) => (
                        <ComplianceCard
                            key={compliance.id}
                            data={compliance}
                            refetchLegalCompliance={refetch}
                            openEditForm={handleLegalComplianceEdit}
                        />
                    ))
                ) : (
                    <p className="text-center col-span-full text-gray-500 text-lg">
                        No legal & compliance found.
                    </p>
                )}
            </div>


            {/* Add LegalCompliance Form */}
            {isActive && (
                <AddLegalComplianceComp
                    active={isActive}
                    onClose={() => {
                        setIsActive(false);
                        refetch();
                    }}
                    refetchLegalCompliance={refetch}
                />
            )}

            {activeEditMode && selectedLegalCompliance && (
                <EditLegalComplianceComp
                    compliance={selectedLegalCompliance}
                    onClose={() => {
                        setActiveEditMode(false);
                        setSelectedLegalCompliance(null);
                        refetch();
                    }}
                    refetchLegalCompliance={refetch}
                />
            )}
        </>
    );
}

export default LegalComplianceCTR;
