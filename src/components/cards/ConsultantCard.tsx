import React from "react";
import Image from "next/image";
import { ConsultantDM } from "@/domain-models/ConsultantDM";

type ConsultantProps = {
  data: ConsultantDM;
};


const ConsultantCard: React.FC<ConsultantProps> = ({ data }) => {
  return (
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
  );
};

export default ConsultantCard;
