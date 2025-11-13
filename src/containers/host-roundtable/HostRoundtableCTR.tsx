"use client";
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

import { RoundTableDM } from "@/domain-models/round-table/RoundTableDM";

function RoundTableCTR() {
  // --- Fetch round tables dynamically ---
  const fetchRoundTable = async (): Promise<RoundTableDM[]> => {
    const response = await axios.get<RoundTableDM[]>("/api/round-table");
    return response.data;
  };

  const { data: roundTables, isLoading, isError, refetch } = useQuery<RoundTableDM[]>({
    queryKey: ["round-tables"],
    queryFn: fetchRoundTable,
  });

  const [selectedRoundTable, setSelectedRoundTable] = useState<RoundTableDM | null>(null);

  const handleViewDetails = (table: RoundTableDM) => {
    setSelectedRoundTable((prev) =>
      prev?.id === table.id ? null : table
    );
  };

  const handleApprove = (id?: number) => async () => {
    try {
      await axios.put("/api/round-table", {
        id,
        status: "Approved",
        is_approved: 1,
      });
      // Refresh the data after approval
      setSelectedRoundTable(null);
      refetch();
    }
    catch (error) {
      console.error("Error approving roundtable:", error);
    }
  };

  const handleDecline = (id?: number) => async () => {
    try {
      await axios.put("/api/round-table", {
        id,
        status: "Declined",
        is_approved: 0,
      });

      // Refresh the data after declining
      setSelectedRoundTable(null);
      refetch();
    }
    catch (error) {
      console.error("Error declining roundtable:", error);
    }
  }

  if (isLoading) return <div>Loading roundtables...</div>;
  if (isError) return <div>Failed to load roundtables.</div>;


  return (
    <>
      {!selectedRoundTable && (
        <div>
          <h3 className="max-w-[780px] m-auto text-center font-extrabold text-3xl md:text-5xl mb-4 md:mb-8 text-[#010101]">
            Host Roundtable
          </h3>

          {/* Table Header */}
          <div className="grid grid-cols-8 gap-3 mb-3 font-medium">
            <span>Host Name</span>
            <span>Company</span>
            <span>Topic</span>
            <span>Duration</span>
            <span>Start Date</span>
            <span>Amount Paid</span>
            <span>Status</span>
            <span>Action</span>
          </div>

          {/* Dynamic Rows */}
          {roundTables?.map((table) => (
            <div
              key={table.id}
              className="text-xs text-[#808080] py-2 border-t border-t-[#808080] grid grid-cols-8 gap-3 items-center"
            >
              <span>{table.name || "N/A"}</span>
              <span>{table.companyName || "N/A"}</span>
              <span>{table.title || "N/A"}</span>
              <span>{table.package || "N/A"}</span>
              <span>{table.date || "N/A"}</span>
              <span>£{table.payment || "N/A"}</span>
              <span>{table.status || "N/A"}</span>
              <button
                className="cursor-pointer p-2 rounded-md bg-[#B08D58] text-white h-max"
                onClick={() => handleViewDetails(table)}
              >
                View Details
              </button>
            </div>
          ))}
        </div>
      )}

      {selectedRoundTable && (
        <div className="space-y-4">
          <h3 className="max-w-[780px] m-auto text-center font-extrabold text-3xl md:text-5xl mb-4 md:mb-8 text-[#010101]">
            Review Details Page
          </h3>

          <div className="flex flex-col md:flex-row gap-4">
            {/* Company Registration */}
            <div className="flex-1 rounded border border-[#DBBB89] p-3 space-y-3">
              <h4 className="text-[#1B1B1B] font-bold text-xl">Company Registration</h4>
              <div>
                <span className="text-[#505050]">Company Name: </span>
                <span className="text-[#505050]/80">{selectedRoundTable.companyName || "N/A"}</span>
              </div>
              <div>
                <span className="text-[#505050]">Host Full Name: </span>
                <span className="text-[#505050]/80">{selectedRoundTable.name}</span>
              </div>
              <div>
                <span className="text-[#505050]">Work Email: </span>
                <span className="text-[#505050]/80">{selectedRoundTable.email}</span>
              </div>
              <div>
                <span className="text-[#505050]">Company Website: </span>
                <a
                  href={selectedRoundTable.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500"
                >
                  {selectedRoundTable.website}
                </a>
              </div>
              <div>
                <span className="text-[#505050]">Plan Option: </span>
                <span className="text-[#505050]/80">
                  £{selectedRoundTable.payment} {selectedRoundTable.package}
                </span>
              </div>
            </div>

            {/* Roundtable Details */}
            <div className="flex-1 rounded border border-[#DBBB89] p-3 space-y-3">
              <h4 className="text-[#1B1B1B] font-bold text-xl">Roundtable Details</h4>
              <div>
                <span className="text-[#505050]">Title / Topic: </span>
                <span className="text-[#505050]/80">{selectedRoundTable.title}</span>
              </div>
              <div>
                <span className="text-[#505050]">Description: </span>
                <span className="text-[#505050]/80">{selectedRoundTable.description}</span>
              </div>
              <div>
                <span className="text-[#505050]">Target Audience: </span>
                <span className="text-[#505050]/80">{selectedRoundTable.targetAudience || "N/A"}</span>
              </div>
              <div>
                <span className="text-[#505050]">Date: </span>
                <span className="text-[#505050]/80">{selectedRoundTable.date}</span>
              </div>
            </div>
          </div>

          {/* Images */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 rounded border border-[#DBBB89] p-3 space-y-3">
              <h4 className="text-[#1B1B1B] font-bold text-xl">Banner Image</h4>
              {selectedRoundTable.banner_image ? (
                <img
                  className="block w-full object-cover"
                  src={selectedRoundTable.banner_image}
                  alt="Banner"
                />
              ) : (
                <span className="text-[#808080]">No banner image uploaded.</span>
              )}
            </div>

            <div className="flex-1 rounded border border-[#DBBB89] p-3 space-y-3">
              <h4 className="text-[#1B1B1B] font-bold text-xl">Logo</h4>
              {selectedRoundTable.logo_image ? (
                <img
                  className="block w-40 object-contain"
                  src={selectedRoundTable.logo_image}
                  alt="Logo"
                />
              ) : (
                <span className="text-[#808080]">No logo uploaded.</span>
              )}
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

            {/* Decline Button */}
            <button onClick={handleDecline(selectedRoundTable.id)} className="cursor-pointer text-[#B08D57] bg-white border border-[#B08D57] rounded-sm px-6 py-2">
              Decline
            </button>

            {/* Approve Button */}
            <button onClick={handleApprove(selectedRoundTable.id)} className="cursor-pointer text-white bg-[#B08D57] border border-[#B08D57] rounded-sm px-6 py-2">
              Approve
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default RoundTableCTR;
