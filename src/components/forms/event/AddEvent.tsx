"use client";

import React, { useEffect, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";

import { EventDM } from "@/domain-models/EventDm";

import Icon from "@/components/icon/IconComp";
import InputText from "@/components/input-comps/InputTxt";
import ImageUpload from "@/components/input-comps/CollaborationImgUploader";
import MultiSelect from "@/components/select-comps/MultiSelect";
import { SpeakerDM } from "@/domain-models/SpeakerDM";

type EventFormProps = {
   event?: EventDM;
   active: boolean;
   onClose: () => void;
   refetchEvents: () => void;
};

// Initial state for form
const initialFormValues: EventDM = {
   event_name: "",
   event_date: "",
   collaboration: "",
   event_heading: "",
   event_detail: "",
   event_date_time: "",
   event_location: "",
   event_designedfor: "",
   event_ticket: "",
   event_booking_url: "",
   speakers_ids: [],
   speakers_names: []

};

const AddEventForm: React.FC<EventFormProps> = ({
   active,
   onClose,
   refetchEvents,
}) => {
   const [formValues, setFormValues] = useState<EventDM>(initialFormValues);
   const [validationErrors, setValidationErrors] = useState({
      event_name: false,
   });
   const handleChange = (field: keyof EventDM, value: any) => {
      setFormValues((prev) => ({
         ...prev,
         [field]: value,
      }));

      if (value.trim()) {
         setValidationErrors((prev) => ({ ...prev, [field]: false }));
      }
   };
   const validateForm = () => {
      const errors = {
         event_name: !formValues.event_name?.trim(),
      };

      setValidationErrors(errors);
      return !Object.values(errors).some((e) => e);
   };

   const addEventMutation = useMutation({
      mutationFn: async (data: EventDM) => {
         const response = await axios.post("/api/eventa", data);
         return response.data;
      },
      onSuccess: () => {
         refetchEvents();
         onClose();
      },
      onError: (error) => {
         console.error("Failed to add event:", error);
      },
   });
   const handleSubmit = () => {
      if (!validateForm()) return;

      const newEvent: Omit<EventDM, "id"> = {
         event_name: formValues.event_name,
         event_date: formValues.event_date,
      };

      addEventMutation.mutate(newEvent);
   };

   useEffect(() => {
      if (active) {
         setValidationErrors({
            event_name: false,
         });
         setFormValues(initialFormValues);
      }
   }, [active]);



   const speakerOptions = [
      { id: 1, value: "Ace" },
      { id: 2, value: "Annalisha" },
      { id: 3, value: "Jythoi" },
   ];

   // Fetch Speaker
   const fetchSpeakers = async (): Promise<SpeakerDM[]> => {
      const response = await axios.get<SpeakerDM[]>("/api/speakers");
      return response.data;
   };

   const {
      data,
      isLoading,
      isError,
      refetch,
   } = useQuery<SpeakerDM[]>({
      queryKey: ["speakers"],
      queryFn: fetchSpeakers,
   });

   const speakers =
      data?.map((speaker: any) => ({
         id: speaker.id,
         value: speaker.name,
      })) || [];

   return (
      <>
         {active && (
            <div className="fixed inset-0 bg-black/70 z-50 px-4">
               <div className="pb-80 max-w-[800px] max-h-[90vh] overflow-y-auto py-4 px-3 bg-[#F7F9FB] relative top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 rounded-md">
                  <div className="flex justify-between items-center">
                     <h2 className="font-medium text-2xl text-[#565656]">
                        Add Event
                     </h2>
                     <div className="flex gap-3">
                        <div
                           className="bg-green-200 rounded-full p-3 cursor-pointer"
                           onClick={handleSubmit}
                        >
                           <Icon color="#565656" size={16} name="save" />
                        </div>
                        <div
                           className="bg-red-300 rounded-full p-3 cursor-pointer"
                           onClick={onClose}
                        >
                           <Icon color="#565656" size={16} name="close" />
                        </div>
                     </div>
                  </div>

                  <div className="mt-4 grid gap-4 grid-cols-2">
                     <div className="col-span-2 sm:col-span-1">
                        <InputText
                           label="Event Name"
                           placeholder="Enter event name"
                           onChange={(value) => handleChange("event_name", value)}
                           value={formValues.event_name}
                           required
                           showError={validationErrors.event_name}
                        />
                     </div>
                     <div className="col-span-2 sm:col-span-1">
                        <InputText
                           label="Event Date"
                           placeholder="Enter event date"
                           onChange={(value) => handleChange("event_date", value)}
                           value={formValues.event_date}
                        />
                     </div>
                     <div className="col-span-2">
                        <ImageUpload
                           label="Upload Collaboration With"
                           value={formValues.collaboration}
                           onImageUpload={(collaboration) => handleChange("collaboration", collaboration)}
                        />
                     </div>
                     <div className="col-span-2">
                        <InputText
                           label="Heading"
                           placeholder="Enter heading"
                           onChange={(value) => handleChange("event_heading", value)}
                           value={formValues.event_heading}
                        />
                     </div>
                     <div className="col-span-2">
                        <InputText
                           label="Event Detail"
                           placeholder="Enter evet detail"
                           onChange={(value) => handleChange("event_detail", value)}
                           value={formValues.event_detail}
                           isTextArea
                           rows={4}
                        />
                     </div>
                     <div className="col-span-2 sm:col-span-1">
                        <InputText
                           label="Event Date & Time"
                           placeholder="Enter event date & time"
                           onChange={(value) => handleChange("event_date_time", value)}
                           value={formValues.event_date_time}
                        />
                     </div>
                     <div className="col-span-2 sm:col-span-1">
                        <InputText
                           label="Location"
                           placeholder="Enter event location"
                           onChange={(value) => handleChange("event_location", value)}
                           value={formValues.event_location}
                        />
                     </div>
                     <div className="col-span-2">
                        <InputText
                           label="Designed For"
                           placeholder="Enter event information"
                           onChange={(value) => handleChange("event_designedfor", value)}
                           value={formValues.event_date}
                           isTextArea
                           rows={4}
                        />
                     </div>
                     <div className="col-span-2 sm:col-span-1">
                        <InputText
                           label="Tickets"
                           placeholder="Enter event ticket price"
                           onChange={(value) => handleChange("event_ticket", value)}
                           value={formValues.event_ticket}
                        />
                     </div>
                     <div className="col-span-2 sm:col-span-1">
                        <InputText
                           label="Event Booking URL"
                           placeholder="Enter event booking url"
                           onChange={(value) => handleChange("event_booking_url", value)}
                           value={formValues.event_date}
                        />
                     </div>
                     <div className="col-span-2 sm:col-span-1">
                        <MultiSelect
                           label="Services"
                           placeholder="Select Services"
                           options={speakers}
                           value={formValues.speakers_ids}
                           onSelect={(ids, values) => {
                              handleChange("speakers_ids", ids);
                              handleChange("speakers_names", values);
                           }}
                        />
                        {/* <MultiSelect
                           label="Select Speakers"
                           placeholder="Please select speakers"
                           options={speakerOptions}
                           value={speakerData.map((s) => s.id)} // Preselect by ID
                           onSelect={(selectedUsers) => {
                              const updated = selectedUsers.map((user) => {
                                 const matched = speakerOptions.find((opt) => opt.id === user.id);
                                 return {
                                    id: user.id,
                                    name: matched?.value || "",
                                    role: user.role,
                                 };
                              });

                              setSpeakerData(updated);

                              // Optional: You can still separate for DB
                              const speaker_ids = updated.map((s) => s.id);
                              const speaker_names = updated;

                              handleChange("speakers_ids", speaker_ids);
                              handleChange("speakers_names", speaker_names); // This includes role & bgColor
                           }}
                        /> */}

                     </div>

                  </div>
               </div>
            </div>
         )}
      </>
   );
};

export default AddEventForm;
