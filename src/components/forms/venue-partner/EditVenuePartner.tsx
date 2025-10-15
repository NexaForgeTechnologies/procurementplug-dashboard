"use client";

import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

import { VenuPartnerDM } from "@/domain-models/venue-partner/VenuePartnerDM";

import IconComponent from "@/components/icon/IconComp";
import InputComponent from "@/components/input-comps/InputTxt";
import RectangularImgUploader from "@/components/image-uploader/RectangularImgUploader";
import DropdownComp from "@/components/select/DropdownComp";

import { useGeneric } from "@/hooks/useGeneric";

type SpeakerFormProps = {
  venue?: VenuPartnerDM;
  onClose: () => void;
  refetchVenuePartners: () => void;
};

const EditSpeakerComp: React.FC<SpeakerFormProps> = ({
  venue,
  onClose,
  refetchVenuePartners,
}) => {

  // Initial state for form
  const initialFormValues: VenuPartnerDM = {
    id: venue?.id,
    img: venue?.img,
    name: venue?.name,
    location: venue?.location,
    capacity_id: venue?.capacity_id,
    capacity_name: venue?.capacity_name,
    amenity_id: venue?.amenity_id,
    amenity_name: venue?.amenity_name,
    overview: venue?.overview,
    testimonials: venue?.testimonials,
  };

  const [formValues, setFormValues] = useState<VenuPartnerDM>(initialFormValues);
  const handleChange = <K extends keyof VenuPartnerDM>(
    field: K,
    value: VenuPartnerDM[K] | null
  ) => {
    setFormValues(prev => ({
      ...prev,
      [field]: value,
    }));

    if (typeof value === "string" && value.trim()) {
      setValidationErrors(prev => ({ ...prev, [field]: false }));
    }
  };
  const [validationErrors, setValidationErrors] = useState({
    name: false,
  });
  const validateForm = () => {
    const errors = {
      name: !formValues.name?.trim(),
    };
    setValidationErrors(errors);
    return !Object.values(errors).some((e) => e);
  };

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const update = useMutation({
    mutationFn: async (data: VenuPartnerDM) => {
      const response = await axios.put("/api/venue-partner", data);
      return response.data;
    },
    onSuccess: () => {
      refetchVenuePartners();
      onClose();
    },
    onError: (error) => {
      console.error("Failed to updated venue partner:", error);
    },
  });
  const handleUpdate = async () => {

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      let imageUrl = formValues.img;

      // 1️⃣ If user selected a new file
      if (selectedFile) {
        // Delete old image if exists
        if (venue?.img && venue.img !== "") {
          await axios.delete("/api/img-uploads", { data: { url: venue.img } });
        }

        // Upload new image
        const formData = new FormData();
        formData.append("file", selectedFile);
        const uploadRes = await axios.post("/api/img-uploads", formData);
        imageUrl = uploadRes.data.url;
      }

      // 2️⃣ If user removed image manually
      if (!formValues.img && venue?.img) {
        console.log("deleted");

        await axios.delete("/api/img-uploads", { data: { url: venue.img } });
        imageUrl = "";
      }

      // 3️⃣ Update database
      await update.mutateAsync({
        ...formValues,
        img: imageUrl,        // ensure image is latest
        id: venue?.id,   // include id for PUT update
      });

    } catch (error) {
      console.error("Update error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // fetching extra information like industry, location etc
  const { data: capacities } = useGeneric("capacities");
  const { data: amenities } = useGeneric("amenities");

  return (
    <>
      <div className="fixed inset-0 bg-black/70 z-50 px-4">
        <div className="max-w-[670px] max-h-[90vh] scroll overflow-y-auto py-4 px-3 bg-[#F7F9FB] relative top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 rounded-md">

          <div className="flex justify-between items-center">
            <h2 className="font-medium text-2xl text-[#565656]">
              Edit Venue Partner
            </h2>
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
                  onClick={handleUpdate}
                >
                  <IconComponent color="#565656" size={16} name="save" />
                </div>
              )}
              <div
                className="bg-red-300 rounded-full p-3 cursor-pointer"
                onClick={onClose}
              >
                <IconComponent color="#565656" size={16} name="close" />
              </div>
            </div>
          </div>

          <div className="my-4">
            <RectangularImgUploader
              label="Venue Partner Image (16:9 ratio)"
              value={formValues.img}
              onImageSelect={(file) => {
                setSelectedFile(file);
                if (file) {
                  // Temporarily show preview
                  const previewUrl = URL.createObjectURL(file);
                  setFormValues((prev) => ({ ...prev, img: previewUrl }));
                } else {
                  // Remove image
                  setFormValues((prev) => ({ ...prev, img: "" }));
                }
              }}
            />
          </div>

          <div className="grid gap-4 grid-cols-2">
            <div className="col-span-2 sm:col-span-1">
              <InputComponent
                label="Venue Partner Name"
                placeholder="Enter venue partner name"
                onChange={(value) => handleChange("name", value)}
                value={formValues.name}
                required
                showError={validationErrors.name}
              />
            </div>
            <div className="col-span-2 sm:col-span-1">
              <InputComponent
                label="Location"
                placeholder="Enter location"
                onChange={(value) => handleChange("location", value)}
                value={formValues.location}
              />
            </div>
            <div className="col-span-2 sm:col-span-1">
              <DropdownComp
                label="Capacity"
                placeholder="Select capacity"
                options={capacities || []}
                onSelect={(id, value) => {
                  handleChange("capacity_id", id); // allow null
                  handleChange("capacity_name", value); // allow null
                }}
                value={formValues.capacity_name || ""}
              />
            </div>
            <div className="col-span-2 sm:col-span-1">
              <DropdownComp
                label="Amenity"
                placeholder="Select amenity"
                options={amenities || []}
                onSelect={(id, value) => {
                  handleChange("amenity_id", id);
                  handleChange("amenity_name", value);
                }}
                value={formValues.amenity_name || ""}
              />
            </div>
            <div className="col-span-2">
              <InputComponent
                label="Overview"
                placeholder="Enter overview"
                onChange={(value) => handleChange("overview", value)}
                value={formValues.overview}
                isTextArea
                rows={5}
              />
            </div>
            <div className="col-span-2">
              <InputComponent
                label="Testimonials"
                placeholder="Enter testimonials"
                onChange={(value) => handleChange("testimonials", value)}
                value={formValues.testimonials}
                isTextArea
                rows={5}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditSpeakerComp;
