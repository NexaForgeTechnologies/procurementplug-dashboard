"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

import { SpeakerDM } from "@/domain-models/SpeakerDM";
import SpeakerCard from "@/components/cards/SpeakerCard";
import SpeakerForm from "@/components/forms/speaker/SpeakerComp";
import EditSpeakerComp from "@/components/forms/speaker/EditSpeakerComp";

function SpeakerCTR() {
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch Speaker
  const fetchSpeakers = async (): Promise<SpeakerDM[]> => {
    const response = await axios.get<SpeakerDM[]>("/api/speakers");
    return response.data;
  };

  const {
    data: speakers,
    isLoading,
    isError,
    refetch,
  } = useQuery<SpeakerDM[]>({
    queryKey: ["speakers"],
    queryFn: fetchSpeakers,
  });

  const filteredSpeakers = speakers?.filter((speaker) => {
    const term = searchTerm.toLowerCase();
    return (
      speaker.name?.toLowerCase().includes(term) ||
      speaker.company?.toLowerCase().includes(term) ||
      speaker.designation?.toLowerCase().includes(term)
    );
  });

  const [isActive, setIsActive] = useState(false);
  const handleClick = () => setIsActive(!isActive);

  const [activeEditMode, setActiveEditMode] = useState(false);
  const [selectedSpeaker, setSelectedSpeaker] = useState<SpeakerDM | null>(
    null
  );

  const handleSpeakerEdit = (speaker: SpeakerDM) => {
    setActiveEditMode(!activeEditMode);
    setSelectedSpeaker((prev) => (prev?.id === speaker.id ? null : speaker));
  };
  return (
    <>
      <div className="max-w-[780px] m-auto text-center">
        <h3 className="font-extrabold text-3xl md:text-5xl mb-4 md:mb-6 text-[#010101]">
          Speakers
        </h3>
        <p className="text-[#363636] text-sm md:text-lg leading-normal md:leading-relaxed">
          Manage your speakers with ease — add new experts, update details, or
          remove entries to keep your procurement strategy up-to-date.
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
            + <span className="hidden sm:inline">&nbsp;Add Speaker</span>
          </button>
        </div>
      </div>

      {/* Speaker Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-10">
        {filteredSpeakers?.length ? (
          filteredSpeakers.map((speaker) => (
            <SpeakerCard
              key={speaker.id}
              data={speaker}
              refetchSpeakers={refetch}
              openEditForm={handleSpeakerEdit}
            />
          ))
        ) : (
          <p className="text-center col-span-full text-gray-500 text-lg">
            No speakers found.
          </p>
        )}
      </div>

      {/* Add Skill Modal */}
      {isActive && (
        <SpeakerForm
          active={isActive}
          onClose={() => {
            setIsActive(false);
            refetch();
          }}
          refetchSpeakers={refetch}
        />
      )}

      {activeEditMode && selectedSpeaker && (
        <EditSpeakerComp
          speaker={selectedSpeaker}
          onClose={() => {
            setActiveEditMode(false);
            setSelectedSpeaker(null);
            refetch();
          }}
          refetchSpeakers={refetch}
        />
      )}
    </>
  );
}

export default SpeakerCTR;
