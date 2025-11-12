"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

import { RoundTableDM } from "@/domain-models/round-table/RoundTableDM";

function RoundTableCTR() {
  // Fetch round tables
  const fetchRoundTable = async (): Promise<RoundTableDM[]> => {
    const response = await axios.get<RoundTableDM[]>("/api/round-tables");
    return response.data;
  };

  const { data: roundTables, refetch } = useQuery<RoundTableDM[]>({
    queryKey: ["round-tables"],
    queryFn: fetchRoundTable,
  });

  // --- State ---
  const [selectedRoundTable, setSelectedRoundTable] = useState<RoundTableDM | null>(null);

  const handleViewDetails = (table: RoundTableDM) => {
    // Toggle if same table clicked again
    if (selectedRoundTable?.id === table.id) {
      setSelectedRoundTable(null);
    } else {
      setSelectedRoundTable(table);
    }
  };

  return (
    <>
      {!selectedRoundTable && (
        <div>
          <h3 className="max-w-[780px] m-auto text-center font-extrabold text-3xl md:text-5xl mb-4 md:mb-8 text-[#010101]">
            Host Roundtable
          </h3>

          <div className="grid grid-cols-9 gap-3 mb-3">
            <span className="font-medium">Host Name</span>
            <span className="font-medium">Company Name</span>
            <span className="col-span-2 font-medium">Topic</span>
            <span className="font-medium">Duration</span>
            <span className="font-medium">Start Date</span>
            <span className="font-medium">Amount Paid</span>
            <span className="font-medium">Status</span>
            <span className="font-medium">Action</span>
          </div>

          {/* Example static row */}
          <div className="text-[#808080] py-2 border-t border-t-[#808080] grid grid-cols-9 gap-3">
            <span>Sarah Johnson</span>
            <span>InnovateTech Solutions Ltd.</span>
            <span className="col-span-2">The Future of AI in Business Operations</span>
            <span>2 Weeks</span>
            <span>25-10-2025</span>
            <span>£275</span>
            <span>Pending</span>
            <button
              className="p-2 rounded-md bg-[#B08D58] text-white h-max"
              onClick={() =>
                handleViewDetails({
                  id: 1, // Example ID (replace with actual field)
                  host_name: "Sarah Johnson",
                  company_name: "InnovateTech Solutions Ltd.",
                  topic: "The Future of AI in Business Operations",
                  duration: "2 Weeks",
                  start_date: "25-10-2025",
                  amount_paid: "£275",
                  status: "Pending",
                } as RoundTableDM)
              }
            >
              View Details
            </button>
          </div>
        </div>
      )}

      {selectedRoundTable && (
        <div className="space-y-4">
          <h3 className="max-w-[780px] m-auto text-center font-extrabold text-3xl md:text-5xl mb-4 md:mb-8 text-[#010101]">
            Review Details Page
          </h3>

          {/* Table Details */}
          <div className="flex gap-4">
            {/* Company Registration */}
            <div className="flex-1 rounded border border-[#DBBB89] p-3 space-y-3">
              <h4 className="text-[#1B1B1B] font-bold text-xl">Company Registration</h4>
              <div>
                <span className="text-[#505050]">Company Name: </span>
                <span className="text-[#505050]/80">InnovateTech Solutions Ltd.</span>
              </div>
              <div>
                <span className="text-[#505050]">Host Full Name: </span>
                <span className="text-[#505050]/80">Eleanor West</span>
              </div>
              <div>
                <span className="text-[#505050]">Work Email: </span>
                <span className="text-[#505050]/80"> elenorwest@abc.com</span>
              </div>
              <div>
                <span className="text-[#505050]">Company Website / LinkedIn URL (URL): </span>
                <span className="text-[#505050]/80">www.brightbridge.com</span>
              </div>
              <div>
                <span className="text-[#505050]">Plan Option: </span>
                <span className="text-[#505050]/80">£150 1 Week</span>
              </div>
            </div>

            {/* Roundtable Details */}
            <div className="flex-1 rounded border border-[#DBBB89] p-3 space-y-3">
              <h4 className="text-[#1B1B1B] font-bold text-xl">Roundtable Details</h4>
              <div>
                <span className="text-[#505050]">Roundtable Title / Topic: </span>
                <span className="text-[#505050]/80">The Future of AI in Business</span>
              </div>
              <div>
                <span className="text-[#505050]">Introduction / Description: </span>
                <span className="text-[#505050]/80">Join leading industry professionals
                  to  explore how artificial intelligence is reshaping business
                  workflows, from automation to decision-making.</span>
              </div>
              <div>
                <span className="text-[#505050]">Target Audience / Key Participants: </span>
                <span className="text-[#505050]/80">CTOs, Product Managers,
                  Innovation Leads, and AI Researchers</span>
              </div>
              <div>
                <span className="text-[#505050]">Date (dd-mm-yyyy): </span>
                <span className="text-[#505050]/80">25-10-2025</span>
              </div>
            </div>
          </div>

          {/* Images */}
          <div className="flex gap-4">
            {/* Banner */}
            <div className="flex-1 rounded border border-[#DBBB89] p-3 space-y-3">
              <h4 className="text-[#1B1B1B] font-bold text-xl">Banner Image</h4>
              <img className="block w-full" src="" alt="" />
            </div>

            {/* Logo */}
            <div className="flex-1 rounded border border-[#DBBB89] p-3 space-y-3">
              <h4 className="text-[#1B1B1B] font-bold text-xl">Logo</h4>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 items-center">
            <button
              className="cursor-pointer text-[#B08D57] bg-white border border-[#B08D57] rounded-sm px-6 py-2"
              onClick={() => setSelectedRoundTable(null)}
            >
              Back
            </button>
            <button className="cursor-pointer text-[#B08D57] bg-white border border-[#B08D57] rounded-sm px-6 py-2">
              Decline
            </button>
            <button className="cursor-pointer text-white bg-[#B08D57] border border-[#B08D57] rounded-sm px-6 py-2">
              Approve
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default RoundTableCTR;
