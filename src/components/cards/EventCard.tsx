import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

import { EventDM } from "@/domain-models/event/EventDm";

import ConfirmDialog from "@/components/ConfirmDialog";

type EventProps = {
    data: EventDM;
    refetchEvents: () => void;
    openEditForm: (data: EventDM) => void;
};

const EventComp: React.FC<EventProps> = ({ data, refetchEvents, openEditForm }) => {

    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    // Mutation for deleting a event
    const deleteEvent = useMutation({
        mutationFn: async (data: EventDM) => {
            const response = await axios.delete("/api/events", {
                data,
            });
            return response.data;
        },
        onSuccess: () => {
            refetchEvents();
        },
        onError: (error) => {
            console.error("Failed to delete event:", error);
        },
    });

    const handleDelete = () => {
        setIsConfirmOpen(true);
    };

    // const confirmDeletion = async () => {
    //     deleteEvent.mutate({ id: data.id });
    //     setIsConfirmOpen(false);
    // };
    const confirmDeletion = async () => {
        setIsConfirmOpen(false);
        setIsDeleting(true);

        try {
            // 🗑️ Delete all collaboration images from AWS S3
            if (Array.isArray(data.collaboration) && data.collaboration.length > 0) {
                await Promise.all(
                    data.collaboration.map(async (url) => {
                        if (!url) return;
                        try {
                            await axios.delete("/api/img-uploads", { data: { url } });
                        } catch (err) {
                            console.error(`❌ Failed to delete image: ${url}`, err);
                        }
                    })
                );
            }

            // 🗑️ Finally delete the event record
            await deleteEvent.mutateAsync({ id: data.id });
        } catch (error) {
            console.error("Error deleting event and images:", error);
        } finally {
            setIsDeleting(false);
        }
    };



    return (
        <>
            <div
                className="relative p-5 pt-14 w-full border border-[#D09B48] transition-all duration-200 ease-in-out transform hover:shadow-2xl hover:border-[#A020F0] bg-white rounded-[6px]"
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
                    <button
                        onClick={handleDelete}
                        className="cursor-pointer p-2 bg-white/90 hover:bg-red-100 text-red-600 rounded-full shadow-md transition-all duration-200"
                        title="Delete"
                    >
                        🗑️
                    </button>
                </div>

                <h3 className="text-[20px] font-semibold text-[#85009D] mb-3">{data.event_name}</h3>
                <p className="text-sm text-[#1B1B1B] mb-2">
                    <strong className="font-semibold">Event Date & Time: </strong>
                    {data.event_date_time}
                </p>
                <p className="text-sm text-[#1B1B1B] mb-2">
                    <strong className="font-semibold">Location: </strong>
                    {data.event_location}
                </p>
                <p
                    className="text-sm text-[#1B1B1B] mb-2 line-clamp-2"
                    title={data.event_designedfor}
                >
                    <strong className="text-sm font-semibold text-[#1B1B1B]">Designed For: </strong>
                    {data.event_designedfor}
                </p>
            </div>
            <ConfirmDialog
                isOpen={isConfirmOpen}
                onClose={() => setIsConfirmOpen(false)}
                onConfirm={confirmDeletion}
                message={`Are you sure you want to delete ${data.event_name}?`}
            />
        </>
    );
}

export default EventComp;
