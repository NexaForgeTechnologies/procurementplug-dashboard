"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import AddInnovationCard from "@/components/forms/innovation-vault/AddInnovationCard";
import { InnovationDM } from "@/domain-models/innovation-vault/InnovationDM";
import InnovationCard from "@/components/cards/InnovationCard";
import EditInnovationVault from "@/components/forms/innovation-vault/EditInnovationVault";

// Category label mapping
const categoryOptions = [
  { id: 1, value: "Live" },
  { id: 2, value: "Beta Access" },
  { id: 3, value: "Pilot Open" },
  { id: 4, value: "In Development - download deck" },
];

function InnovationVaultCTR() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isActive, setIsActive] = useState(false);
  const [isEditActive, setIsEditActive] = useState(false);
  const [selectedInnovation, setSelectedInnovation] = useState<InnovationDM | null>(null);

  // Fetch innovations from API
  const fetchInnovations = async (): Promise<InnovationDM[]> => {
    const response = await axios.get<InnovationDM[]>("/api/innovation-vault");
    return response.data;
  };

  const {
    data: innovations,
    isLoading,
    isError,
    refetch,
  } = useQuery<InnovationDM[]>({
    queryKey: ["innovations"],
    queryFn: fetchInnovations,
  });

  // Map and filter innovations based on search
  const filteredInnovations = innovations
    ?.map((innovation) => {
      const categoryName =
        categoryOptions.find((c) => c.id === innovation.category_id)?.value || "";
      return { ...innovation, category: categoryName };
    })
    .filter((innovation) => {
      const term = searchTerm.trim().toLowerCase();
      return (
        innovation.title?.toLowerCase().includes(term) ||
        innovation.category?.toLowerCase().includes(term) ||
        innovation.sponsoredBy?.toLowerCase().includes(term) ||
        innovation.description?.toLowerCase().includes(term)
      );
    });

  const handleClick = () => setIsActive(!isActive);

  return (
    <>
      {/* Header + Search */}
      <div className="max-w-[780px] m-auto text-center">
        <h3 className="font-extrabold text-3xl md:text-5xl mb-4 md:mb-6 text-[#010101]">
          Innovation Vault
        </h3>
        <p className="text-[#363636] text-sm md:text-lg leading-normal md:leading-relaxed">
          Explore innovative solutions driving the future of procurement. Discover new tools,
          strategies, and ideas shaping industry transformation.
        </p>

        <div className="flex items-center gap-2 sm:gap-4 my-10">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by title, category, or description..."
            className="w-full p-3 rounded-md border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#85009D] transition-all"
          />
          <button
            onClick={handleClick}
            className="cursor-pointer bg-[#85009D] hover:bg-[#6B007D] text-white font-semibold rounded-md shadow-md transition-all duration-300 min-w-max py-3 px-4"
          >
            + <span className="hidden sm:inline">&nbsp;Add Innovation</span>
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-10 min-h-[200px]">
        {/* LOADING SPINNER */}
        {isLoading && (
          <div className="flex justify-center items-center col-span-full py-20">
            <div
              className="w-12 h-12 border-4 border-[#85009D] border-t-transparent rounded-full animate-spin"
              role="status"
            />
          </div>
        )}

        {/* ERROR STATE */}
        {isError && !isLoading && (
          <p className="text-center col-span-full text-red-500 text-lg">
            Failed to load innovations.
          </p>
        )}

        {/* DATA OR EMPTY STATE */}
        {!isLoading && !isError && (
          <>
            {filteredInnovations?.length ? (
              filteredInnovations.map((innovation) => (
                <InnovationCard
                  key={innovation.id}
                  data={innovation}
                  refetchInnovation={refetch}
                  openEditForm={() => {
                    setSelectedInnovation(innovation);
                    setIsEditActive(true);
                  }}
                />
              ))
            ) : (
              <p className="text-center col-span-full text-gray-500 text-lg">
                No innovation found.
              </p>
            )}
          </>
        )}
      </div>

      {/* Add Form */}
      {isActive && (
        <AddInnovationCard
          active={isActive}
          onClose={() => {
            setIsActive(false);
            refetch();
          }}
          refetchInnovation={refetch}
        />
      )}

      {/* Edit Form */}
      {isEditActive && selectedInnovation && (
        <EditInnovationVault
          innovation={selectedInnovation}
          onClose={() => {
            setIsEditActive(false);
            setSelectedInnovation(null);
            refetch();
          }}
          refetchInnovation={refetch}
        />
      )}
    </>
  );
}

export default InnovationVaultCTR;
