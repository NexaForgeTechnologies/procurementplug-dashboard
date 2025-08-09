"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

import { VenuPartnerDM } from "@/domain-models/venue-partner/VenuePartnerDM";

import VenuPartnerCard from "@/components/cards/VenuPartnerCard";
import AddVenuePartner from "@/components/forms/venue-partner/AddVenuePartner";
import EditVenuePartner from "@/components/forms/venue-partner/EditVenuePartner";

function VenuPartnerCTR() {
    const [searchTerm, setSearchTerm] = useState("");

    // Fetch Speaker
    const fetchVenuwPartners = async (): Promise<VenuPartnerDM[]> => {
        const response = await axios.get<VenuPartnerDM[]>("/api/venue-partner");
        return response.data;
    };

    const {
        data: venues,
        refetch,
    } = useQuery<VenuPartnerDM[]>({
        queryKey: ["venues"],
        queryFn: fetchVenuwPartners,
    });

    const filteredvenues = venues?.filter((venue) => {
        const term = searchTerm.toLowerCase();
        return (
            venue.name?.toLowerCase().includes(term) ||
            venue.location?.toLowerCase().includes(term)
        );
    });

    const [isActive, setIsActive] = useState(false);
    const handleClick = () => setIsActive(!isActive);

    const [activeEditMode, setActiveEditMode] = useState(false);
    const [selectedVenues, setSelectedVenues] = useState<VenuPartnerDM | null>(
        null
    );

    const handleVenuePartnerEdit = (speaker: VenuPartnerDM) => {
        setActiveEditMode(!activeEditMode);
        setSelectedVenues((prev) => (prev?.id === speaker.id ? null : speaker));
    };
    return (
        <>
            <div className="max-w-[780px] m-auto text-center">
                <h3 className="font-extrabold text-3xl md:text-5xl mb-4 md:mb-6 text-[#010101]">
                    Venue Partners
                </h3>
                <p className="text-[#363636] text-sm md:text-lg leading-normal md:leading-relaxed">
                    Explore handpicked venues ideal for procurement events, conferences, and workshops—designed to meet your professional needs with the right capacity and amenities.</p>

                {/* 🔍 Search + ➕ Add Button Row */}
                <div className="flex items-center gap-2 sm:gap-4 my-10">
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search by name or experties..."
                        className="w-full p-3 rounded-md border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    />

                    <button
                        onClick={handleClick}
                        className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md shadow-md transition-all duration-300 min-w-max py-3 px-4"
                    >
                        + <span className="hidden sm:inline">&nbsp;Venue Partner</span>
                    </button>
                </div>
            </div>

            {/* Venue Partner Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-10">
                {filteredvenues?.length ? (
                    filteredvenues.map((venue) => (
                        <VenuPartnerCard
                            key={venue.id}
                            data={venue}
                            refetchVenues={refetch}
                            openEditForm={handleVenuePartnerEdit}
                        />
                    ))
                ) : (
                    <p className="text-center col-span-full text-gray-500 text-lg">
                        No venue partners found.
                    </p>
                )}
            </div>


            {/* Add Venue Form */}
            {isActive && (
                <AddVenuePartner
                    active={isActive}
                    onClose={() => {
                        setIsActive(false);
                        refetch();
                    }}
                    refetchVenuePartners={refetch}
                />
            )}

            {activeEditMode && selectedVenues && (
                <EditVenuePartner
                    venue={selectedVenues}
                    onClose={() => {
                        setActiveEditMode(false);
                        setSelectedVenues(null);
                        refetch();
                    }}
                    refetchVenuePartners={refetch}
                />
            )}
        </>
    );
}

export default VenuPartnerCTR;
