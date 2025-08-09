"use client";

import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

import { VenuPartnerDM } from "@/domain-models/venue-partner/VenuePartnerDM";

import IconComponent from "@/components/icon/IconComp";
import InputComponent from "@/components/input-comps/InputTxt";
import ImageUpload from "@/components/image-uploader/VenuePartnerImgUploader";
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

    const [validationErrors, setValidationErrors] = useState({
        name: false,
    });

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

    const validateForm = () => {
        const errors = {
            name: !formValues.name?.trim(),
        };
        setValidationErrors(errors);
        return !Object.values(errors).some((e) => e);
    };

    const addConsultantMutation = useMutation({
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
    const handleSubmit = () => {
        if (!validateForm()) return;

        const newConsultant: VenuPartnerDM = formValues

        addConsultantMutation.mutate(newConsultant);
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
                            Add Venue Partner
                        </h2>
                        <div className="flex gap-3">
                            <div
                                className="bg-green-200 rounded-full p-3 cursor-pointer"
                                onClick={handleSubmit}
                            >
                                <IconComponent color="#565656" size={16} name="save" />
                            </div>
                            <div
                                className="bg-red-300 rounded-full p-3 cursor-pointer"
                                onClick={onClose}
                            >
                                <IconComponent color="#565656" size={16} name="close" />
                            </div>
                        </div>
                    </div>

                    <div className="my-4">
                        <ImageUpload
                            label="Venue Partner Image"
                            value={formValues.img}
                            onImageUpload={(img) => handleChange("img", img)}
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
