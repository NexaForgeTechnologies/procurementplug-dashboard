"use client";

import React, { useState } from "react";
import Image from "next/image";
import axios from "axios";
import { useMutation } from "@tanstack/react-query";

import { LegalComplianceDM } from "@/domain-models/legal-compliance/LegalComplianceDM";

import ConfirmDialog from "@/components/ConfirmDialog";

type ComplianceProps = {
  data: LegalComplianceDM;
  refetchLegalCompliance: () => void;
  openEditForm: (data: LegalComplianceDM) => void;
};

const ConsultantCard: React.FC<ComplianceProps> = ({
  data,
  refetchLegalCompliance,
  openEditForm,
}) => {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Mutation for deleting a compliance
  const deleteLegalCompliance = useMutation({
    mutationFn: async (data: LegalComplianceDM) => {
      const response = await axios.delete("/api/legal-compliance", {
        data,
      });
      return response.data;
    },
    onSuccess: () => {
      refetchLegalCompliance();
    },
    onError: (error) => {
      console.error("Failed to delete LegalCompliance:", error);
    },
  });

  const handleDelete = () => {
    setIsConfirmOpen(true);
  };

  // Confirm deletion logic — delete from S3 first, then DB
  const confirmDeletion = async () => {
    setIsConfirmOpen(false);
    setIsDeleting(true);

    try {
      // 🗑️ Delete image from AWS S3 if it exists
      if (data.img) {
        await axios.delete("/api/img-uploads", { data: { url: data.img } });
      }

      // 🗑️ Then delete the speaker record
      await deleteLegalCompliance.mutateAsync({ id: data.id });
    } catch (error) {
      console.error("Error deleting speaker and image:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <div
        className="w-full px-4 pb-4 pt-14 flex flex-col items-center text-center gap-2 rounded-[6px] hover:border-[#85009D] border border-[#DBBB89] hover:bg-[#85009D] bg-[#FFFBF5] text-[#85009D] hover:text-white transition-all duration-200 ease-in-out group relative"
      >
        {/* Top-right edit/delete buttons */}
        <div className="absolute top-2 right-2 flex gap-2">
          <button
            onClick={() => openEditForm(data)}
            className="cursor-pointer p-2 bg-white/90 hover:bg-blue-100 text-blue-600 rounded-full shadow-md transition-all duration-200"
            title="Edit"
          >
            ✏️
          </button>
          {isDeleting ? (
            <div className="p-2 bg-white/90 rounded-full shadow-md flex items-center justify-center">
              <svg
                className="animate-spin h-4 w-4 text-red-600"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 010 16v-4l-3 3 3 3v-4a8 8 0 01-8-8z"
                ></path>
              </svg>
            </div>
          ) : (
            <button
              onClick={handleDelete}
              className="cursor-pointer p-2 bg-white/90 hover:bg-red-100 text-red-600 rounded-full shadow-md transition-all duration-200"
              title="Delete"
            >
              🗑️
            </button>
          )}
        </div>

        <Image
          className="rounded-full w-40 h-40 object-cover"
          src={data.img || "/images/default-circle.png"}
          alt={"Legal Compliance Image"}
          width={160}
          height={160}
        />

        <h2 className="text-xl md:text-2xl font-semibold">{data.name}</h2>

        <div className="my-2">
          <p className="text-[#1B1B1B] text-base group-hover:text-white">{data.experties}</p>
        </div>

        <button onClick={() => openEditForm(data)} className="mt-auto flex items-center cursor-pointer bg-[#b08d57] text-white px-4 py-2 rounded-[6px]">View Details
          <div className="ml-1 w-2 h-2 border-t-2 border-r-2 border-white transform rotate-45"></div>
        </button>
      </div>

      <ConfirmDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={confirmDeletion}
        message={`Are you sure you want to delete ${data.name}?`}
      />
    </>
  );
};

export default ConsultantCard;
