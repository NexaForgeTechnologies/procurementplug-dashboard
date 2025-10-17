"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useMutation, useQuery } from "@tanstack/react-query";

import { EventDM } from "@/domain-models/event/EventDm";
import { SpeakerDM } from "@/domain-models/speaker/SpeakerDM";
import { SelectedSpeaker } from "@/domain-models/speaker/SelectedSpeaker";
import { WorkshopSection } from "@/domain-models/WorkshopSectionDM";

import Icon from "@/components/icon/IconComp";
import InputText from "@/components/input-comps/InputTxt";
import MultiRectangularImgUploader from "@/components/image-uploader/MultiRectangularImgUploader";
import MultiSelect from "@/components/select-comps/MultiSelectSpeakers";
import PdfUploader from "@/components/PdfUploader";
import IconComponent from "@/components/icon/IconComp";

type EventFormProps = {
  event?: EventDM;
  onClose: () => void;
  refetchEvents: () => void;
};

const EditEventForm: React.FC<EventFormProps> = ({
  event,
  onClose,
  refetchEvents,
}) => {

  // Initial state for form
  const initialFormValues: EventDM = {
    id: event?.id || undefined,
    // hero Detail
    event_name: event?.event_name || "",
    event_date: event?.event_date || "",
    collaboration: event?.collaboration || [],
    event_heading: event?.event_heading || "",
    heading_detail: event?.heading_detail || "",
    event_date_time: event?.event_date_time || "",
    event_location: event?.event_location || "",
    event_designedfor: event?.event_designedfor || "",
    event_ticket: event?.event_ticket || "",
    event_booking_url: event?.event_booking_url || "",

    // Workshop
    workshops: event?.workshops || "",

    // Agenda PDF
    agenda: event?.agenda || "",

    // Speakers
    speakers_heading: event?.speakers_heading || "",
    speakers:
      typeof event?.speakers === "string"
        ? JSON.parse(event.speakers)
        : event?.speakers || [],

    // Highlight
    event_highlight_detail: event?.event_highlight_detail || "",
    event_highlight_img: event?.event_highlight_img || [],
    hightlight_heading: event?.hightlight_heading || "",
    hightlight_subheading_1: event?.hightlight_subheading_1 || "",
    hightlight_subdetail_1: event?.hightlight_subdetail_1 || "",
    hightlight_subheading_2: event?.hightlight_subheading_2 || "",
    hightlight_subdetail_2: event?.hightlight_subdetail_2 || "",
  };
  const [formValues, setFormValues] = useState<EventDM>(initialFormValues);
  const handleChange = (
    field: keyof EventDM,
    value: string | number[] | string[]
  ) => {
    setFormValues((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchSpeakers = async (): Promise<SpeakerDM[]> => {
    const response = await axios.get<SpeakerDM[]>("/api/speakers");
    return response.data;
  };
  const { data: speakers } = useQuery<SpeakerDM[]>({
    queryKey: ["speakers"],
    queryFn: fetchSpeakers,
  });

  const [selectedSpeakers, setSelectedSpeakers] = useState<SelectedSpeaker[]>(
    formValues.speakers || []
  );

  useEffect(() => {
    handleChange("speakers", JSON.stringify(selectedSpeakers));
  }, [selectedSpeakers]);

  // Default FIle
  const [defaultAgendaFile, setDefaultAgendaFile] = useState<
    File | undefined
  >();
  const urlToFile = async (url: string, filename: string): Promise<File> => {
    const res = await fetch(url);
    const blob = await res.blob();
    return new File([blob], filename, { type: blob.type });
  };
  useEffect(() => {
    const loadAgendaFile = async () => {
      if (formValues.agenda && typeof formValues.agenda === "string") {
        const file = await urlToFile(formValues.agenda, "Agenda.pdf");
        setDefaultAgendaFile(file);
      }
    };

    loadAgendaFile();
  }, [formValues.agenda]);

  const toBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
    });

  const handlePdfUpload = async (file: File | null) => {
    if (file) {
      const base64 = await toBase64(file);
      handleChange("agenda", base64);
    }
  };

  //Handle workshop section
  const [workshopSections, setWorkshopSections] = useState<WorkshopSection[]>(
    formValues.workshops
      ? typeof formValues.workshops === "string"
        ? JSON.parse(formValues.workshops)
        : formValues.workshops
      : []
  );

  const addWorkshopSection = () => {
    setWorkshopSections((prev) => [
      ...prev,
      {
        tiles: [
          { heading: "", details: "" },
          { heading: "", details: "" },
        ],
      },
    ]);
  };
  const removeWorkshopSection = (index: number) => {
    setWorkshopSections((prev) => prev.filter((_, i) => i !== index));
  };
  type WorkshopTile = {
    heading: string;
    details: string;
  };
  const handleTileChange = (
    sectionIndex: number,
    tileIndex: number,
    field: keyof WorkshopTile,
    value: string
  ) => {
    setWorkshopSections((prev) =>
      prev.map((section, sIndex) =>
        sIndex === sectionIndex
          ? {
            ...section,
            tiles: section.tiles.map((tile, tIndex) =>
              tIndex === tileIndex ? { ...tile, [field]: value } : tile
            ),
          }
          : section
      )
    );
  };

  useEffect(() => {
    handleChange("workshops", JSON.stringify(workshopSections)); // ✅ store string in formValues
  }, [workshopSections]);

  // Updated form submission logic
  const update = useMutation({
    mutationFn: async (data: EventDM) => {
      const response = await axios.put("/api/events", data);
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
  const handleSubmit = async () => {

    setIsSubmitting(true);

    try {
      let imageUrls: string[] = formValues.collaboration || [];

      // 🧩 Step 1 — Handle deleted images
      // Compare old event images with current form values
      const oldUrls = event?.collaboration || []; // from DB
      const removedUrls = oldUrls.filter((url: string) => !imageUrls.includes(url));

      // Delete removed images from S3
      if (removedUrls.length > 0) {
        await Promise.all(
          removedUrls.map(async (url) =>
            axios.delete("/api/img-uploads", { data: { url } })
          )
        );
      }

      // 🧩 Step 2 — Upload new images if any selected
      if (selectedFiles.length > 0) {
        const formData = new FormData();
        selectedFiles.forEach((file) => formData.append("file", file));

        const res = await fetch("/api/img-uploads", {
          method: "POST",
          body: formData,
        });

        if (!res.ok) throw new Error("Image upload failed");

        const data = await res.json();
        const uploadedUrls = data.urls || [data.url];

        // Combine existing URLs + new uploads
        imageUrls = [...imageUrls.filter((url) => !removedUrls.includes(url)), ...uploadedUrls];
      }

      // 🧩 Step 3 — Update event in DB
      await update.mutateAsync({
        ...formValues,
        collaboration: imageUrls,
        id: event?.id, // your existing event id
      });
    } catch (error) {
      console.error("Update error:", error);
      alert("Failed to update event");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/70 z-50 px-4">
        <div
          className="max-w-[800px] max-h-[90vh] scroll overflow-y-auto py-4 px-3 bg-[#ECECEC] relative 
               top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 rounded-md"
        >
          <div className="flex justify-between items-center">
            <h2 className="font-semibold text-2xl text-[#565656]">Edit Event</h2>
            <div className="flex gap-3">
              {isSubmitting ? (
                <div className="bg-green-200 rounded-full p-3 flex items-center justify-center">
                  {/* Loader Spinner */}
                  <svg
                    className="animate-spin h-4 w-4 text-gray-600"
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
                <div
                  className="bg-green-200 rounded-full p-3 cursor-pointer"
                  onClick={handleSubmit}
                >
                  <IconComponent color="#565656" size={16} name="save" />
                </div>
              )}
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
                  <MultiRectangularImgUploader
                    label="In Collaboration With (You can upload multiple)"
                    value={formValues.collaboration}
                    onImageUpload={(files) => {
                      if (files && files.length > 0) {
                        // Only keep selected files for upload, not for preview in formValues
                        setSelectedFiles((prev) => [...(prev || []), ...files]);
                      } else {
                        setSelectedFiles([]);
                      }
                    }}
                    onImageRemove={(url) => {
                      // Remove from collaboration array immediately
                      setFormValues((prev) => ({
                        ...prev,
                        collaboration: prev.collaboration?.filter((img) => img !== url),
                      }));
                    }}
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
                    onChange={(value) =>
                      handleChange("event_designedfor", value)
                    }
                    value={formValues.event_designedfor}
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
                    onChange={(value) =>
                      handleChange("event_booking_url", value)
                    }
                    value={formValues.event_booking_url}
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
                {workshopSections.map((section, sIndex) => (
                  <div key={sIndex} className="rounded relative space-y-4">
                    {section.tiles.map((tile, tIndex) => (
                      <div key={tIndex} className="rounded-md space-y-4">
                        <InputText
                          label={`Tile ${sIndex * 2 + tIndex + 1} Heading`}
                          placeholder={`Enter tile ${sIndex * 2 + tIndex + 1
                            } heading`}
                          onChange={(value) =>
                            handleTileChange(sIndex, tIndex, "heading", value)
                          }
                          value={tile.heading}
                        />
                        <InputText
                          label={`Tile ${sIndex * 2 + tIndex + 1
                            } Heading Details`}
                          placeholder={`Enter tile ${sIndex * 2 + tIndex + 1
                            } heading details`}
                          onChange={(value) =>
                            handleTileChange(sIndex, tIndex, "details", value)
                          }
                          value={tile.details}
                          isTextArea
                          rows={5}
                        />
                      </div>
                    ))}
                    {sIndex > 0 && (
                      <button
                        className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded"
                        onClick={() => removeWorkshopSection(sIndex)}
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <button
                onClick={addWorkshopSection}
                className="px-4 py-3 rounded bg-white text-[#363636] cursor-pointer"
              >
                + Add More Workshop
              </button>
            </div>

            {/* Agenda Section */}
            <div>
              <h3 className="mb-2 font-semibold text-2xl text-[#565656]">
                Agenda
              </h3>
              <PdfUploader
                onUpload={handlePdfUpload}
                defaultFile={defaultAgendaFile}
              />
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
                  onChange={(value) => handleChange("speakers_heading", value)}
                  value={formValues.speakers_heading}
                  isTextArea
                  rows={5}
                />
                <MultiSelect
                  label="Speakers"
                  options={speakers || []}
                  value={selectedSpeakers}
                  onSelect={(speakers) => setSelectedSpeakers(speakers)}
                />
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
                  onChange={(value) =>
                    handleChange("event_highlight_detail", value)
                  }
                  value={formValues.event_highlight_detail}
                />
                {/* <MultiRectangularImgUploader
                  label="Events Highlight"
                  value={formValues.event_highlight_img}
                  onImageUpload={(event_highlight_img) =>
                    handleChange("event_highlight_img", event_highlight_img)
                  }
                /> */}
                <InputText
                  label="Heading"
                  placeholder="Enter Highlights Heading"
                  onChange={(value) =>
                    handleChange("hightlight_heading", value)
                  }
                  value={formValues.hightlight_heading}
                />
                <InputText
                  label="Sub Heading 1"
                  placeholder="Enter Sub Heading 1"
                  onChange={(value) =>
                    handleChange("hightlight_subheading_1", value)
                  }
                  value={formValues.hightlight_subheading_1}
                />
                <InputText
                  label="Sub heading 1 Details"
                  placeholder="Enter Sub heading Details"
                  onChange={(value) =>
                    handleChange("hightlight_subdetail_1", value)
                  }
                  value={formValues.hightlight_subdetail_1}
                  isTextArea
                  rows={5}
                />
                <InputText
                  label="Sub Heading 2"
                  placeholder="Enter Sub Heading 2"
                  onChange={(value) =>
                    handleChange("hightlight_subheading_2", value)
                  }
                  value={formValues.hightlight_subheading_2}
                />
                <InputText
                  label="Sub heading 2 Details"
                  placeholder="Enter Sub heading Details"
                  onChange={(value) =>
                    handleChange("hightlight_subdetail_2", value)
                  }
                  value={formValues.hightlight_subdetail_2}
                  isTextArea
                  rows={5}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditEventForm;
