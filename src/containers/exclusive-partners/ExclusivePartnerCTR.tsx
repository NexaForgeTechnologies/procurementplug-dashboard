"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

import { ExclusivePartnerDM } from "@/domain-models/exclusive-partners/ExclusivePartnerDM";

import ExclusivePartnerCard from "@/components/cards/ExclusivePartnerCard";
import AddBusinessPartner from "@/components/forms/exclusive-partners/AddBusinessPartner";
import EditExclusivePartner from "@/components/forms/exclusive-partners/EditExclusivePartner";

function ExclusivePartnerCTR() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddActive, setIsAddActive] = useState(false);
  const [isEditActive, setIsEditActive] = useState(false);
  const [selectedPartner, setSelectedPartner] = useState<ExclusivePartnerDM | null>(null);

  // Fetch Exclusive Partners
  const fetchExclusivePartners = async (): Promise<ExclusivePartnerDM[]> => {
    const response = await axios.get<ExclusivePartnerDM[]>("/api/exclusive-partners");
    return response.data;
  };

  const { data: partners, refetch } = useQuery<ExclusivePartnerDM[]>({
    queryKey: ["exclusive-partners"],
    queryFn: fetchExclusivePartners,
    staleTime: 0, // Always refetch after mutation to ensure data is fresh
  });

  // Filter partners by search term
  const filteredPartners = partners?.filter((partner) => {
    const term = searchTerm.toLowerCase();
    return (
      partner.title.toLowerCase().includes(term) ||
      partner.tagline?.toLowerCase().includes(term) ||
      partner.description?.toLowerCase().includes(term) ||
      partner.category_name?.toLowerCase().includes(term)
    );
  });

  const handleAddClick = () => setIsAddActive(true);

  const handleEditClick = (partner: ExclusivePartnerDM) => {
    setSelectedPartner(partner);
    setIsEditActive(true);
  };

  return (
    <>
      <div className="max-w-[780px] m-auto text-center">
        <h3 className="font-extrabold text-3xl md:text-5xl mb-4 md:mb-6 text-[#010101]">
          Exclusive Business Partners
        </h3>
        <p className="text-[#363636] text-sm md:text-lg leading-normal md:leading-relaxed">
          The Procurement Plug’s Exclusive Partners collaborate to provide specialized solutions that drive efficiency, sustainability, and innovation across industries.
        </p>

        {/* Search + Add Button */}
        <div className="flex items-center gap-2 sm:gap-4 my-10">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by title, tagline, description..."
            className="w-full p-3 rounded-md border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />
          <button
            onClick={handleAddClick}
            className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md shadow-md transition-all duration-300 min-w-max py-3 px-4"
          >
            + <span className="hidden sm:inline">&nbsp;Add Partner</span>
          </button>
        </div>
      </div>

      {/* Partner Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-10 px-4">
        {filteredPartners?.length ? (
          filteredPartners.map((partner) => (
            <ExclusivePartnerCard
              key={partner.id}
              data={partner}
              refetchPartner={refetch} // This ensures UI updates after delete
              openEditForm={handleEditClick}
            />
          ))
        ) : (
          <p className="text-center col-span-full text-gray-500 text-lg">
            No partners found.
          </p>
        )}
      </div>

      {/* Add Partner Form */}
      <AddBusinessPartner
        active={isAddActive}
        onClose={() => {
          setIsAddActive(false);
          refetch();
        }}
        refetchPartner={refetch}
      />

      {/* Edit Partner Form */}
      {isEditActive && selectedPartner && (
        <EditExclusivePartner
          partner={selectedPartner}
          onClose={() => {
            setIsEditActive(false);
            setSelectedPartner(null);
            refetch();
          }}
          refetchPartner={refetch}
        />
      )}
    </>
  );
}

export default ExclusivePartnerCTR;
