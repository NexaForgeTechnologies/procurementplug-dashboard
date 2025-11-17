"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

import { VipRecruitmentPartnerDM } from "@/domain-models/talent-hiring-intelligence/VipRecruitmentPartnerDM";
import VipRecruitmentPartnerCard from "@/components/cards/VipRecruitmentPartnerCard";
import AddVipCard from "@/components/forms/talent-hiring-intelligence/vip-recruitment-partners/AddVipCard";
import EditVipCard from "@/components/forms/talent-hiring-intelligence/vip-recruitment-partners/EditVipCard";

// import EditVipRecruitmentPartner from "@/components/forms/vip-recruitment-partner/EditVipRecruitmentPartner";

function VipRecruitmentPartnerCTR() {
    const [searchTerm, setSearchTerm] = useState("");

    // 🔄 Fetch VIP Recruitment Partners
    const fetchVipRecruitmentPartners = async (): Promise<VipRecruitmentPartnerDM[]> => {
        const response = await axios.get<VipRecruitmentPartnerDM[]>("/api/talent-hiring-intelligence/vip-recruitment-partners");
        return response.data;
    };

    const { data: partners, refetch, isLoading } = useQuery<VipRecruitmentPartnerDM[]>({
        queryKey: ["vip-recruitment-partners"],
        queryFn: fetchVipRecruitmentPartners,
    });

    const filteredPartners = partners?.filter((p) => {
        const term = searchTerm.toLowerCase();
        return (
            p.company_name?.toLowerCase().includes(term) ||
            p.company_email?.toLowerCase().includes(term) ||
            p.company_about?.toLowerCase().includes(term)
        );
    });

    const [isActive, setIsActive] = useState(false);
    const handleClick = () => setIsActive(!isActive);

    const [activeEditMode, setActiveEditMode] = useState(false);
    const [selectedPartner, setSelectedPartner] = useState<VipRecruitmentPartnerDM | null>(null);

    const handleEditPartner = (partner: VipRecruitmentPartnerDM) => {
        setActiveEditMode(!activeEditMode);
        setSelectedPartner((prev) => (prev?.id === partner.id ? null : partner));
    };

    return (
        <>
            <div className="max-w-[780px] m-auto text-center">
                <h3 className="font-extrabold text-3xl md:text-5xl mb-4 md:mb-6 text-[#010101]">
                    VIP Recruitment Partners
                </h3>
                <p className="text-[#363636] text-sm md:text-lg leading-normal md:leading-relaxed">
                    Discover top-tier recruitment partners who help source, vet, and deliver high-quality procurement talent for your organizational needs.
                </p>

                {/* 🔍 Search + Add Button */}
                <div className="flex items-center gap-2 sm:gap-4 my-10">
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search by name or expertise..."
                        className="w-full p-3 rounded-md border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    />

                    <button
                        onClick={handleClick}
                        className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md shadow-md transition-all duration-300 min-w-max py-3 px-4"
                    >
                        + <span className="hidden sm:inline">&nbsp;Recruitment Partner</span>
                    </button>
                </div>
            </div>

            {/* Partner Cards / Loader / No Partners */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-10">
                {isLoading ? (
                    // VIP-themed Loader
                    <div className="col-span-full flex justify-center items-center py-20">
                        <div className="w-16 h-16 rounded-full border-4 border-t-transparent border-[#85009D] animate-spin"></div>
                    </div>
                ) : filteredPartners?.length ? (
                    filteredPartners.map((partner) => (
                        <VipRecruitmentPartnerCard
                            key={partner.id}
                            data={partner}
                            refetchPartners={refetch}
                            openEditForm={handleEditPartner}
                        />
                    ))
                ) : (
                    <p className="text-center col-span-full text-gray-500 text-lg py-20">
                        No recruitment partners found.
                    </p>
                )}
            </div>

            {/* Add Partner Form */}
            {isActive && (
                <AddVipCard
                    active={isActive}
                    onClose={() => {
                        setIsActive(false);
                        refetch();
                    }}
                    refetchPartners={refetch}
                />
            )}

            {/* Edit Partner Form (optional) */}
            {activeEditMode && selectedPartner && (
                <EditVipCard
                    partner={selectedPartner}
                    onClose={() => {
                        setActiveEditMode(false);
                        setSelectedPartner(null);
                        refetch();
                    }}
                    refetchPartners={refetch}
                    active={activeEditMode}
                />
            )}
        </>
    );
}

export default VipRecruitmentPartnerCTR;
