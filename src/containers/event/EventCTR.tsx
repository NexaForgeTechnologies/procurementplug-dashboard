"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

import { SpeakerDM } from "@/domain-models/SpeakerDM";
import AddEventForm from "@/components/forms/event/AddEvent";
import EditEventComp from "@/components/forms/event/EditEventComp";
import EventComp from "@/components/cards/EventCard";
import { EventDM } from "@/domain-models/EventDm";

function EventCTR() {
    const [searchTerm, setSearchTerm] = useState("");

    // Fetch Speaker
    const fetchEvents = async (): Promise<EventDM[]> => {
        const response = await axios.get<EventDM[]>("/api/events");
        return response.data;
    };
    const {
        data: events,
        isLoading,
        isError,
        refetch,
    } = useQuery<EventDM[]>({
        queryKey: ["events"],
        queryFn: fetchEvents,
    });

    const filteredEvents = (events ?? []).filter((event) => {
        const term = searchTerm.toLowerCase();
        return (
            event.event_name?.toLowerCase().includes(term) ||
            event.event_date?.toLowerCase().includes(term) ||
            event.event_date_time?.toLowerCase().includes(term)
        );
    });


    const [isActive, setIsActive] = useState(false);
    const handleClick = () => setIsActive(!isActive);

    const [activeEditMode, setActiveEditMode] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState<SpeakerDM | null>(
        null
    );

    const handleEventEdit = (speaker: SpeakerDM) => {
        setActiveEditMode(!activeEditMode);
        setSelectedEvent((prev) => (prev?.id === speaker.id ? null : speaker));
    };
    return (
        <>
            <div className="max-w-[780px] m-auto text-center">
                <h3 className="font-extrabold text-3xl md:text-5xl mb-4 md:mb-6 text-[#010101]">
                    Events
                </h3>
                <p className="text-[#363636] text-sm md:text-lg leading-normal md:leading-relaxed">
                    Effortlessly bring your programs to life by adding new events in just a few clicks. Define each occasion with a clear title, date and time, venue details, and a concise description that captures your audience’s attention.
                </p>

                {/* 🔍 Search + ➕ Add Button Row */}
                <div className="flex items-center gap-2 sm:gap-4 my-10">
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search by name, date..."
                        className="w-full p-3 rounded-md border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    />

                    <button
                        onClick={handleClick}
                        className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md shadow-md transition-all duration-300 min-w-max py-3 px-4"
                    >
                        + <span className="hidden sm:inline">&nbsp;Add Event</span>
                    </button>
                </div>
            </div>

            {/* Event Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-10">
                {filteredEvents.length > 0 ? (
                    filteredEvents.map((event) => (
                        <EventComp
                            key={event.id}
                            data={event}
                            refetchEvents={refetch}
                            openEditForm={handleEventEdit}
                        />
                    ))
                ) : (
                    <div className="col-span-full text-center text-gray-500">
                        No event found matching your criteria.
                    </div>
                )}
            </div>

            {/* Add Event */}
            {isActive && (
                <AddEventForm
                    active={isActive}
                    onClose={() => {
                        setIsActive(false);
                        refetch();
                    }}
                    refetchEvents={refetch}
                />
            )}

            {activeEditMode && selectedEvent && (
                <EditEventComp
                    event={selectedEvent}
                    onClose={() => {
                        setActiveEditMode(false);
                        setSelectedEvent(null);
                        refetch();
                    }}
                    refetchEvents={refetch}
                />
            )}
        </>
    );
}

export default EventCTR;
