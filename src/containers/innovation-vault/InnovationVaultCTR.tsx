"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import AddInnovationCard from "@/components/forms/innovation-vault/AddInnovationCard";
import { InnovationDM } from "@/domain-models/innovation-vault/InnovationDM";
import InnovationCard from "@/components/cards/InnovationCard";
import EditInnovationVault from "@/components/forms/innovation-vault/EditInnovationVault";

// Use this array to map category_id to category name
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

    const fetchInnovations = async (): Promise<InnovationDM[]> => {
        const response = await axios.get<InnovationDM[]>("/api/innovation-vault");
        return response.data;
    };

    const { data: innovations, refetch } = useQuery<InnovationDM[]>({
        queryKey: ["innovations"],
        queryFn: fetchInnovations,
    });

    const filteredInnovations = innovations?.filter((innovation) => {
        const term = searchTerm.toLowerCase();
        return (
            innovation.title?.toLowerCase().includes(term) ||
            innovation.category?.toLowerCase().includes(term) ||
            innovation.description?.toLowerCase().includes(term)
        );
    });

    const handleClick = () => setIsActive(!isActive);

    return (
        <>
            <div className="max-w-[780px] m-auto text-center">
                <h3 className="font-extrabold text-3xl md:text-5xl mb-4 md:mb-6 text-[#010101]">
                    Innovation Vault
                </h3>
                <p className="text-[#363636] text-sm md:text-lg leading-normal md:leading-relaxed">
                    Explore innovative solutions driving the future of procurement. Discover new tools, strategies, and ideas shaping industry transformation.
                </p>

                <div className="flex items-center gap-2 sm:gap-4 my-10">
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search by title, category, or description..."
                        className="w-full p-3 rounded-md border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    />
                    <button
                        onClick={handleClick}
                        className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md shadow-md transition-all duration-300 min-w-max py-3 px-4"
                    >
                        + <span className="hidden sm:inline">&nbsp;Add Innovation</span>
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-10">
                {filteredInnovations?.length ? (
                    filteredInnovations.map((innovation) => {
                        // Map category_id to category string
                        const categoryName =
                            categoryOptions.find((c) => c.id === (innovation as any).category_id)?.value || "";

                        return (
                            <InnovationCard
                                key={innovation.id}
                                data={{
                                    ...innovation,
                                    category: categoryName, // fill category here
                                }}
                                refetchInnovation={refetch}
                                openEditForm={() => {
                                    setSelectedInnovation({
                                        ...innovation,
                                        category: categoryName, // pass category to edit form
                                    });
                                    setIsEditActive(true);
                                }}
                            />
                        );
                    })
                ) : (
                    <p className="text-center col-span-full text-gray-500 text-lg">
                        No innovation found.
                    </p>
                )}
            </div>

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
