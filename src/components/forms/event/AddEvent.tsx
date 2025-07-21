"use client";

import React, { useEffect, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";

import { EventDM } from "@/domain-models/EventDm";

import Icon from "@/components/icon/IconComp";
import InputText from "@/components/input-comps/InputTxt";
import ImageUpload from "@/components/input-comps/ImgUploader";
// import MultiSelect from "@/components/select-comps/MultiSelect";
import { SpeakerDM } from "@/domain-models/SpeakerDM";
import PdfUploader from "@/components/PdfUploader";

type EventFormProps = {
   event?: EventDM;
   active: boolean;
   onClose: () => void;
   refetchEvents: () => void;
};

// interface DocumentFile {
//    id: string;
//    name?: string;
//    file?: File;
//    base64?: string; // Optional: if you want to store the base64 representation
// }

// Initial state for form
const initialFormValues: EventDM = {
   event_name: "",
   event_date: "",
   collaboration: [],
   event_heading: "",
   heading_detail: "",
   event_date_time: "",
   event_location: "",
   event_designedfor: "",
   event_ticket: "",
   event_booking_url: "",
   speakers_ids: [],
   speakers_names: [],
   documents: [],

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
   const handleChange = (field: keyof EventDM, value: unknown) => {
      setFormValues((prev) => ({
         ...prev,
         [field]: value,
      }));

      // if (value.trim()) {
      //    setValidationErrors((prev) => ({ ...prev, [field]: false }));
      // }
      if (typeof value === "string" && value.trim()) {
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
      console.log(formValues);


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

   // Fetch Speaker
   const fetchSpeakers = async (): Promise<SpeakerDM[]> => {
      const response = await axios.get<SpeakerDM[]>("/api/speakers");
      return response.data;
   };
   const {
      data,
   } = useQuery<SpeakerDM[]>({
      queryKey: ["speakers"],
      queryFn: fetchSpeakers,
   });
   console.log(data);


   // const optionsFromBackend = [
   //    { id: 1, name: "Jyothi Hartley", role: "", bg_color: "" },
   //    { id: 2, name: "Annalisha Noel", role: "", bg_color: "" },
   //    { id: 3, name: "Blessed Agyemang", role: "", bg_color: "" },
   // ];

   // const [selectedSpeakers, setSelectedSpeakers] = useState<unknown[]>(optionsFromBackend);


   const handlePdfUpload = (file: File | null) => {
      if (file) {
         // console.log("Uploaded file:", file.name);
      } else {
         // console.log("File remove");
      }
   };

   return (
      <>
         {active && (
            <div className="fixed inset-0 bg-black/70 z-50 px-4">
               <div className="max-w-[800px] max-h-[90vh] overflow-y-auto py-4 px-3 bg-[#ECECEC] relative 
               top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 rounded-md">
                  <div className="flex justify-between items-center">
                     <h2 className="font-semibold text-2xl text-[#565656]">
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

                  <div className="mt-4 space-y-8">
                     {/* Hero Section */}
                     <div>
                        <h3 className="mb-2 font-semibold text-2xl text-[#565656]">
                           Hero Section
                        </h3>
                        <div className="grid gap-4 grid-cols-2">
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
                              {/* <ImageUpload
                                 label="In Collaboration With"
                                 value={formValues.collaboration}
                                 onImageUpload={(collaboration) => {
                                    handleChange("collaboration", collaboration);
                                 }}
                              /> */}
                              <ImageUpload
                                 label="In Collaboration With"
                                 multiple
                                 value={formValues.collaboration} // string[]
                                 onImageUpload={(paths) => handleChange("collaboration", paths)}
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
                                 label="Heading Detail"
                                 placeholder="Enter heading detail"
                                 onChange={(value) => handleChange("heading_detail", value)}
                                 value={formValues.heading_detail}
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
                                 label="Event Location"
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
                        </div>
                     </div>

                     {/* Workshops */}
                     <div>
                        <h3 className="font-semibold text-2xl text-[#565656]">
                           Workshops
                        </h3>
                        <div className="my-4 space-y-4">
                           <InputText
                              label="Tile 1 Heading"
                              placeholder="Enter tile 1 heading"
                              onChange={(value) => handleChange("event_name", value)}
                              value={formValues.event_name}
                           />
                           <InputText
                              label="Tile 1 Heading Details"
                              placeholder="Enter tile 1 heading details"
                              onChange={(value) => handleChange("event_name", value)}
                              value={formValues.event_name}
                              isTextArea
                              rows={5}
                           />
                           <InputText
                              label="Tile 2 Heading"
                              placeholder="Enter tile 2 heading"
                              onChange={(value) => handleChange("event_name", value)}
                              value={formValues.event_name}
                           />
                           <InputText
                              label="Tile 2 Heading Details"
                              placeholder="Enter tile 2 heading details"
                              onChange={(value) => handleChange("event_name", value)}
                              value={formValues.event_name}
                              isTextArea
                              rows={5}
                           />
                        </div>
                        <button className="px-4 py-3 rounded bg-white text-[#363636] cursor-pointer">+ Add More Workshop</button>
                     </div>

                     {/* Agenda Section */}
                     <div>
                        <h3 className="mb-2 font-semibold text-2xl text-[#565656]">
                           Agenda
                        </h3>
                        <PdfUploader onUpload={handlePdfUpload} />
                     </div>

                     {/* Speaker Section */}
                     <div>
                        <h3 className="mb-2 font-semibold text-2xl text-[#565656]">
                           Event Speakers
                        </h3>
                        <div className="space-y-4">
                           <InputText
                              label="Speakers Heading"
                              placeholder="Enter speakers heading Details"
                              onChange={(value) => handleChange("event_name", value)}
                              value={formValues.event_name}
                              isTextArea
                              rows={5}
                           />
                           {/* <MultiSelect
                              label="Speakers"
                              options={optionsFromBackend}
                              value={selectedSpeakers}
                              onSelect={(speakers) => setSelectedSpeakers(speakers)}
                           /> */}
                        </div>
                     </div>

                     {/* Event Highlights Section */}
                     <div>
                        <h3 className="font-semibold text-2xl text-[#565656]">
                           Event Highlights
                        </h3>
                        <div className="my-4 space-y-4">
                           <InputText
                              label="Event Highlights Heading Details"
                              placeholder="Enter highlights heading details"
                              onChange={(value) => handleChange("event_name", value)}
                              value={formValues.event_name}
                           />
                           <ImageUpload
                              label="Events Highlight"
                              value={formValues.collaboration}
                              onImageUpload={(collaboration) => handleChange("collaboration", collaboration)}
                           />
                           <InputText
                              label="Heading"
                              placeholder="Enter Highlights Heading"
                              onChange={(value) => handleChange("event_name", value)}
                              value={formValues.event_name}
                           />
                           <InputText
                              label="Sub Heading 1"
                              placeholder="Enter Sub Heading 1"
                              onChange={(value) => handleChange("event_name", value)}
                              value={formValues.event_name}
                           />
                           <InputText
                              label="Sub heading 1 Details"
                              placeholder="Enter Sub heading Details"
                              onChange={(value) => handleChange("event_name", value)}
                              value={formValues.event_name}
                              isTextArea
                              rows={5}
                           />
                           <InputText
                              label="Sub Heading 2"
                              placeholder="Enter Sub Heading 2"
                              onChange={(value) => handleChange("event_name", value)}
                              value={formValues.event_name}
                           />
                           <InputText
                              label="Sub heading 2 Details"
                              placeholder="Enter Sub heading Details"
                              onChange={(value) => handleChange("event_name", value)}
                              value={formValues.event_name}
                              isTextArea
                              rows={5}
                           />
                        </div>
                     </div>
                  </div>
               </div>
            </div >
         )}
      </>
   );
};

export default AddEventForm;
