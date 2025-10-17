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
