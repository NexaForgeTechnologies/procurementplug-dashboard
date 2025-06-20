"use client";

import React, { useState } from "react";
import Image from "next/image";
import axios from "axios";
import { useMutation } from "@tanstack/react-query";

import { ConsultantDM } from "@/domain-models/ConsultantDM";

import ConfirmDialog from "@/components/ConfirmDialog";

type ConsultantProps = {
  data: ConsultantDM;
  refetchConsultants: () => void;
};

const ConsultantCard: React.FC<ConsultantProps> = ({
  data,
  refetchConsultants,
}) => {
  // Mutation for deleting a Consultant
  const deleteConsultant = useMutation({
    mutationFn: async (data: ConsultantDM) => {
      const response = await axios.delete("/api/consultants", {
        data,
      });
      return response.data;
    },
    onSuccess: () => {
      refetchConsultants();
    },
    onError: (error) => {
      console.error("Failed to delete Consultant:", error);
    },
  });
  // const handleDelete = () => {
  //   const confirmDelete = window.confirm(
  //     `Are you sure you want to delete ${data.name}?`
  //   );
  //   if (confirmDelete) {
  //     deleteConsultant.mutate({
  //       id: data.id,
  //     });
  //   }
  // };

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const handleDelete = () => {
    setIsConfirmOpen(true);
  };

  const confirmDeletion = () => {
    deleteConsultant.mutate({ id: data.id });
    setIsConfirmOpen(false);
  };

  return (
    <>
      <div
        style={{ backgroundColor: data.bg_color || "#faf8f5" }}
        className={`relative border px-4 pb-4 pt-10 rounded-xl w-full flex flex-col items-center justify-center gap-2 text-center shadow-md transition-transform duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-amber-200 ${
          data.bg_color
            ? "text-white border-transparent"
            : "text-[#363636] border-[#b08d57]"
        }`}
      >
        {/* Top-right edit/delete buttons */}
        <div className="absolute top-2 right-2 flex gap-2">
          <button
            className="cursor-pointer p-2 bg-white/90 hover:bg-blue-100 text-blue-600 rounded-full shadow-md transition-all duration-200"
            title="Edit"
          >
            ✏️
          </button>
          <button
            onClick={handleDelete}
            className="cursor-pointer p-2 bg-white/90 hover:bg-red-100 text-red-600 rounded-full shadow-md transition-all duration-200"
            title="Delete"
          >
            🗑️
          </button>
        </div>

        <Image
          className="rounded-full w-32 h-32 object-cover"
          src={data.img || "/images/consultant-alternate.png"}
          alt={data.img || "Consultant Image"}
          width={130}
          height={130}
        />
        <h2 className="text-xl md:text-2xl font-extrabold">{data.name}</h2>
        {data.role && (
          <h3
            className={`text-xl md:text-2xl font-medium ${
              data.bg_color ? "text-white" : "text-[#b08d57]"
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
