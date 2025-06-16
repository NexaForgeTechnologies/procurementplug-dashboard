"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

import { ConsultantDM } from "@/domain-models/ConsultantDM";
import ConsultantCard from "@/components/cards/ConsultantCard";

function ConsultantCTR() {
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch Consultants
  const fetchConsultants = async (): Promise<ConsultantDM[]> => {
    const response = await axios.get<ConsultantDM[]>("/api/consultants");
    return response.data;
  };

  const {
    data: consultants,
    isLoading,
    isError,
  } = useQuery<ConsultantDM[]>({
    queryKey: ["consultants"],
    queryFn: fetchConsultants,
  });

  const filteredConsultants = consultants?.filter((consultant) => {
    const term = searchTerm.toLowerCase();
    return (
      consultant.name?.toLowerCase().includes(term) ||
      consultant.company?.toLowerCase().includes(term) ||
      consultant.role?.toLowerCase().includes(term) ||
      consultant.designation?.toLowerCase().includes(term)
    );
  });

  return (
    <>
      <div className="max-w-[780px] m-auto text-center">
        <h3 className="font-extrabold text-3xl md:text-5xl mb-4 md:mb-6 text-[#010101]">
          Consulting Partners
        </h3>
        <p className="text-[#363636] text-sm md:text-lg leading-normal md:leading-relaxed">
          Manage your consultant partners with ease — add new experts, update
          details, or remove entries to keep your procurement strategy
          up-to-date.
        </p>

        {/* 🔍 Search + ➕ Add Button Row */}
        <div className="flex items-center gap-2 sm:gap-4 my-10">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name, company, role..."
            className="w-full p-3 rounded-md border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />

          <button className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md shadow-md transition-all duration-300 min-w-max py-3 px-4">
            + <span className="hidden sm:inline">&nbsp;Add Consultant</span>
          </button>
        </div>
      </div>

      {/* Consultant Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-10">
        {filteredConsultants?.length ? (
          filteredConsultants.map((consultant) => (
            <ConsultantCard key={consultant.id} data={consultant} />
          ))
        ) : (
          <p className="text-center col-span-full text-gray-500 text-lg">
            No consultants found.
          </p>
        )}
      </div>
    </>
  );
}

export default ConsultantCTR;
