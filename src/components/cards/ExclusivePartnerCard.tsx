"use client";

import React, { useState } from "react";
import Image from "next/image";
import axios from "axios";
import { useMutation } from "@tanstack/react-query";

import { ExclusivePartnerDM } from "@/domain-models/exclusive-partners/ExclusivePartnerDM";
import ConfirmDialog from "@/components/ConfirmDialog";

type ExclusivePartnerCardProps = {
  data: ExclusivePartnerDM;
  refetchPartner: () => void;
  openEditForm: (data: ExclusivePartnerDM) => void;
};

const categoryOptions = [
  { id: 1, value: "E-commerce" },
  { id: 2, value: "CyberSecurity" },
  { id: 3, value: "Sustainable Product" },
  { id: 4, value: "Software Development" },
];

const getCategoryNameById = (id?: number) => {
  return categoryOptions.find((cat) => cat.id === id)?.value || "";
};

const ExclusivePartnerCard: React.FC<ExclusivePartnerCardProps> = ({
  data,
  refetchPartner,
  openEditForm,
}) => {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);

  // 🔥 URL FORMATTER LOGIC
  const formatUrl = (url: string) => {
    if (!url) return "";

    // Already valid
    if (url.startsWith("https://") || url.startsWith("http://")) {
      return url;
    }

    // No protocol → add https://
    return "https://" + url;
  };

  // Mutation for deleting partner
  const deletePartnerMutation = useMutation({
    mutationFn: async (partnerId: number) => {
      const response = await axios.delete(`/api/exclusive-partners?id=${partnerId}`);
      return response.data;
    },
    onSuccess: () => refetchPartner(),
    onError: (error) => console.error("Failed to delete partner:", error),
  });

  const handleDeleteClick = () => setIsConfirmOpen(true);

  const confirmDeletion = async () => {
    setIsConfirmOpen(false);
    setIsDeleting(true);

    try {
      if (data.logo) {
        try {
          await axios.delete("/api/img-uploads", { data: { url: data.logo } });
        } catch (imgErr) {
          console.warn("Failed to delete partner image, continuing DB deletion.", imgErr);
        }
      }

      await deletePartnerMutation.mutateAsync(data.id);
    } catch (err) {
      console.error("Error deleting partner:", err);
    } finally {
      setIsDeleting(false);
    }
  };

  // Truncated description logic
  const charLimit = 100;
  const isLongDescription = data.description && data.description.length > charLimit;
  const displayedDescription =
    isLongDescription && !showFullDescription
      ? data.description!.substring(0, charLimit) + "..."
      : data.description;

  return (
    <>
      <div className="w-full max-w-xs px-6 py-8 flex flex-col items-center text-center gap-3 rounded-lg border border-[#DBBB89] shadow-md transition-all duration-200 relative">
        {/* Top-right buttons */}
        <div className="absolute top-3 right-3 flex gap-2">
          <button
            onClick={() => openEditForm(data)}
            className="p-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full shadow-sm transition"
            title="Edit"
            disabled={isDeleting}
          >
            ✏️
          </button>
          {isDeleting ? (
            <div className="p-2 bg-gray-100 rounded-full shadow-sm flex items-center justify-center">
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
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 010 16v-4l-3 3 3 3v-4a8 8 0 01-8-8z"
                />
              </svg>
            </div>
          ) : (
            <button
              onClick={handleDeleteClick}
              className="p-2 bg-gray-100 hover:bg-red-100 text-red-600 rounded-full shadow-sm transition"
              title="Delete"
              disabled={isDeleting}
            >
              🗑️
            </button>
          )}
        </div>

        {/* Logo */}
        <Image
          className="rounded-full w-36 h-36 object-cover border border-gray-200"
          src={data.logo || "/images/default-circle.png"}
          alt={data.title}
          width={144}
          height={144}
        />

        {/* Info */}
        <div className="flex flex-col justify-center">
          <h2 className="text-lg md:text-xl font-semibold text-gray-800">{data.title}</h2>
          {data.tagline && <p className="text-gray-600 text-sm mt-1">{data.tagline}</p>}
          {data.description && (
            <p className="text-gray-500 text-xs mt-2">
              {displayedDescription}
              {isLongDescription && (
                <button
                  onClick={() => setShowFullDescription(!showFullDescription)}
                  className="text-blue-500 ml-1 underline text-xs"
                >
                  {showFullDescription ? "View Less" : "View More"}
                </button>
              )}
            </p>
          )}
          {(data.category_name || data.category_id) && (
            <p className="text-[#9e8151] text-sm mt-2">
              <span className="text-black">Category : </span>
              <span className="text-gray-600 text-sm">
                {data.category_name ?? getCategoryNameById(data.category_id)}
              </span>
            </p>
          )}
        </div>

        {data.website && (
          <a
            href={formatUrl(data.website)}
            target="_blank"
            rel="noopener noreferrer"
            className="text-white py-1 px-1 bg-[#b08d57] hover:bg-[#b08d57] mt-auto w-full rounded"
          >
            Visit Website
          </a>
        )}
      </div>

      <ConfirmDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={confirmDeletion}
        message={`Are you sure you want to delete ${data.title}?`}
      />
    </>
  );
};

export default ExclusivePartnerCard;
