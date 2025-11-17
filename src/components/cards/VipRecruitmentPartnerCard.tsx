"use client";

import React, { useState } from "react";
import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import Image from "next/image";

import { VipRecruitmentPartnerDM } from "@/domain-models/talent-hiring-intelligence/VipRecruitmentPartnerDM";
import ConfirmDialog from "@/components/ConfirmDialog";

type VipPartnerProps = {
  data: VipRecruitmentPartnerDM;
  refetchPartners: () => void;
  openEditForm: (data: VipRecruitmentPartnerDM) => void;
};

const VipRecruitmentPartnerCard: React.FC<VipPartnerProps> = ({
  data,
  refetchPartners,
  openEditForm,
}) => {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showFullAbout, setShowFullAbout] = useState(false);

  const truncatedAbout =
    data.company_about && data.company_about.length > 100
      ? data.company_about.slice(0, 100) + "..."
      : data.company_about;

  const logoSrc = data.company_logo ?? "/images/default-rectangle.webp";

  const deletePartner = useMutation({
    mutationFn: async (partner: VipRecruitmentPartnerDM) => {
      const response = await axios.delete(`/api/talent-hiring-intelligence/vip-recruitment-partners?id=${partner.id}`, {
        data: { id: partner.id },
      });
      console.log("Deleted VIP recruitment partner:", response.data);
      return response.data;
    },
    onSuccess: () => {
      console.log("Successfully deleted VIP recruitment partner");
      refetchPartners();
    },
    onError: (error) => {
      console.error("Failed to delete VIP partner:", error);
    },
  });

  const handleDelete = () => setIsConfirmOpen(true);

  const confirmDeletion = async () => {
    setIsConfirmOpen(false);
    setIsDeleting(true);

    try {
      await deletePartner.mutateAsync({ id: data.id });
    } catch (error) {
      console.error("Error deleting VIP partner:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <div className="w-full px-4 pb-4 pt-16 flex flex-col items-center text-center gap-2 rounded-[6px] hover:border-[#85009D] border border-[#DBBB89] hover:bg-[#85009D] bg-[#FFFBF5] text-[#85009D] hover:text-white transition-all duration-200 ease-in-out group relative">
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
          className="rounded-md h-36 w-full object-cover my-2"
          src={logoSrc}
          alt={data.company_name || "Company Logo"}
          width={150}
          height={150}
        />

        <h2 className="text-xl md:text-2xl font-extrabold">{data.company_name}</h2>

        <div className="flex flex-col justify-start w-full text-left mt-auto">
          {data.company_about && (
            <>
              <span className="text-[#b08d57] font-semibold">About</span>
              <p className="text-[#1B1B1B] text-base group-hover:text-white">
                {showFullAbout ? data.company_about : truncatedAbout}
                {data.company_about.length > 100 && (
                  <button
                    onClick={() => setShowFullAbout(!showFullAbout)}
                    className="ml-1 text-blue-600 underline text-sm"
                  >
                    {showFullAbout ? "View Less" : "View More"}
                  </button>
                )}
              </p>
            </>
          )}

          {data.company_email && (
            <>
              <span className="text-[#b08d57] font-semibold mt-2">Email</span>
              <p className="text-[#1B1B1B] text-base group-hover:text-white break-all">
                {data.company_email}
              </p>
            </>
          )}
        </div>

        {data.website_url && (
          <a
            href={data.website_url}
            target="_blank"
            rel="noopener noreferrer"
            title={data.website_url} // shows full URL on hover
            className="inline-block px-4 py-2 mt-auto w-full text-white rounded-md font-medium text-center bg-[#b08d57] transition-colors duration-200"
          >
            Website Link
          </a>
        )}


      </div>

      <ConfirmDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={confirmDeletion}
        message={`Are you sure you want to delete ${data.company_name}?`}
      />
    </>
  );
};

export default VipRecruitmentPartnerCard;
