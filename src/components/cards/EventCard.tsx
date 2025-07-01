import React from "react";
import { EventDM } from "@/domain-models/EventDm";

type EventProps = {
    data: EventDM;
    refetchSpeakers?: () => void;
    openEditForm?: (data: EventDM) => void;
};

const EventComp: React.FC<EventProps> = ({ data }) => {
    return (
        <div
            className="p-5 w-full border border-[#D09B48] transition-all duration-200 ease-in-out transform hover:shadow-2xl hover:border-[#A020F0] bg-white rounded-[6px]"
        >
            <h3 className="text-[20px] font-semibold text-[#85009D] mb-3">{data.heading}</h3>
            <p className="text-sm text-[#1B1B1B] mb-2">
                <strong className="font-semibold">Event Date & Time: </strong>
                {data.date_time}
            </p>
            <p className="text-sm text-[#1B1B1B] mb-2">
                <strong className="font-semibold">Location: </strong>
                {data.location}
            </p>
            <p
                className="text-sm text-[#1B1B1B] mb-2 line-clamp-2"
                title={data.designed_for}
            >
                <strong className="text-sm font-semibold text-[#1B1B1B]">Designed For: </strong>
                {data.designed_for}
            </p>
        </div>
    );
}

export default EventComp;
