"use client";

import React, { useState } from "react";
import Image from "next/image";
import axios from "axios";
import { useMutation } from "@tanstack/react-query";

import { SpeakerDM } from "@/domain-models/speaker/SpeakerDM";

import ConfirmDialog from "@/components/ConfirmDialog";

type ConsultantProps = {
  data: SpeakerDM;
  refetchSpeakers: () => void;
  openEditForm: (data: SpeakerDM) => void;
};

const ConsultantCard: React.FC<ConsultantProps> = ({
  data,
  refetchSpeakers,
  openEditForm,
}) => {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // ✅ Mutation for deleting a speaker record
  const deleteSpeaker = useMutation({
    mutationFn: async (speakerData: SpeakerDM) => {
      const response = await axios.delete("/api/speakers", {
        data: speakerData,
      });
      return response.data;
    },
    onSuccess: () => {
      refetchSpeakers();
    },
    onError: (error) => {
      console.error("Failed to delete speaker:", error);
    },
  });

  // ✅ Handle delete confirmation popup
  const handleDelete = () => {
    setIsConfirmOpen(true);
  };

  // ✅ Confirm deletion logic — delete from S3 first, then DB
  const confirmDeletion = async () => {
    setIsConfirmOpen(false);
    setIsDeleting(true);

    try {
      // 🗑️ Delete image from AWS S3 if it exists
      if (data.img) {
        await axios.delete("/api/img-uploads", { data: { url: data.img } });
      }

      // 🗑️ Then delete the speaker record
      await deleteSpeaker.mutateAsync({ id: data.id });
    } catch (error) {
      console.error("Error deleting speaker and image:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <div
        style={{ backgroundColor: data.bg_color || "#faf8f5" }}
        className={`relative border px-4 pb-4 pt-14 rounded-xl w-full flex flex-col items-center gap-2 text-center shadow-md transition-transform duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-amber-200 ${data.bg_color
            ? "text-white border-transparent"
            : "text-[#363636] border-[#b08d57]"
          }`}
      >
        {/* 🧩 Top-right buttons */}
        <div className="absolute top-2 right-2 flex gap-2">
          <button
            onClick={() => openEditForm(data)}
            className="cursor-pointer p-2 bg-white/90 hover:bg-blue-100 text-blue-600 rounded-full shadow-md transition-all duration-200"
            title="Edit"
            disabled={isDeleting}
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

        {/* 🖼️ Speaker Image */}
        <Image
          className="rounded-full w-32 h-32 object-cover"
          src={data?.img ? data.img : "/images/consultant-alternate.png"}
          alt="Speaker Image"
          width={130}
          height={130}
        />

        <h2 className="text-xl md:text-2xl font-extrabold">{data.name}</h2>

        {data.role && (
          <h3
            className={`text-xl md:text-2xl font-medium ${data.bg_color ? "text-white" : "text-[#b08d57]"
              }`}
          >
            {data.role}
          </h3>
        )}

        <div className="mt-2 flex flex-col items-center">
          <span className="font-bold">{data.designation}</span>
          {data.company && <span className="font-bold">{data.company}</span>}
        </div>
      </div>

      {/* 🧩 Confirm Delete Dialog */}
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
