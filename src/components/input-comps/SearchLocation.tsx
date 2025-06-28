"use client";

import { useState, useRef, useEffect } from "react";
import { useJsApiLoader, Autocomplete } from "@react-google-maps/api";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

import Select from "@/components/input-comps/Select";
import LabelMultiSelect from "@/components/select-comps/LabelMultiSelect";
import { googleMapsLibraries } from "@/config/googleMapsConfig";

type InputProps = {
  value: string;
  placeholder?: string;
  onChange?: (formValues: any) => void;
  required?: boolean;
};

const fetchTypeOptions = async (type: number) => {
  try {
    const response = await axios.get("/api/technicians/get-tech-options", {
      params: { type },
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching type options:", error);
    throw error;
  }
};

const SearchLocationComponent: React.FC<InputProps> = ({
  value,
  placeholder,
  onChange,
  required = false,
}) => {
  const initialFormValues = {
    type: undefined,
    type_name: "",
    type_options: [],
    type_options_names: "",
    radius: 50,
    unit: "km",
    search_value: "",
  };

  const [formValues, setFormValues] = useState<any>(initialFormValues);
  const [isLoaded, setIsLoaded] = useState(false);

  const [searchInput, setSearchInput] = useState(value || "");

  // const handleChange = (field: keyof any, value: any) => {
  //   setFormValues((prev: any) => {
  //     const updatedValues = { ...prev, [field]: value };

  //     // Reset options if type changes
  //     if (field === "type") {
  //       updatedValues.type_options = [];
  //       updatedValues.type_options_names = "";
  //     }

  //     // Notify the parent component of changes
  //     if (onChange) {
  //       onChange(updatedValues);
  //     }

  //     return updatedValues;
  //   });
  // };
  const handleChange = (field: keyof any, value: any) => {
    setFormValues((prev: any) => {
      const updatedValues = { ...prev, [field]: value };

      // Preserve current search input value
      if (field !== "search_value") {
        updatedValues.search_value = searchInput;
      }

      // Reset options if type changes
      if (field === "type") {
        updatedValues.type_options = [];
        updatedValues.type_options_names = "";
      }

      // Notify parent
      if (onChange) {
        onChange(updatedValues);
      }

      return updatedValues;
    });
  };

  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const googleApiKey = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;

  const { isLoaded: googleMapsLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: googleApiKey || "",
    libraries: googleMapsLibraries,
  });

  useEffect(() => {
    setIsLoaded(googleMapsLoaded);
  }, [googleMapsLoaded]);

  const onPlaceChanged = () => {
    if (autocompleteRef.current) {
      const place = autocompleteRef.current.getPlace();
      if (place && place.formatted_address) {
        handleChange("search_value", place.formatted_address);
      }
    }
  };

  const onLoad = (autocomplete: google.maps.places.Autocomplete) => {
    autocompleteRef.current = autocomplete;
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setSearchInput(newValue); // Just update internal input
  };

  const handleBlur = () => {
    if (searchInput !== formValues.search_value) {
      handleChange("search_value", searchInput); // Only trigger onChange on blur
    }
  };

  useEffect(() => {
    if (value !== undefined) {
      setSearchInput(value);
    }
  }, [value]);

  const searchType = [
    { id: 1, value: "Certificate" },
    { id: 2, value: "Language" },
    { id: 3, value: "Skills" },
    { id: 4, value: "Skill Set" },
    { id: 5, value: "Toolkits" },
  ];

  const { data } = useQuery({
    queryKey: ["options", formValues.type],
    queryFn: () => fetchTypeOptions(formValues.type),
    staleTime: 1000 * 60,
  });

  const typeOptions =
    data?.map((option: any) => ({
      id: option.id,
      value: option.name,
    })) || [];

  return (
    <div className="bg-white rounded-lg p-2 flex flex-col md:flex-row gap-2 md:items-center">
      <div className="flex-1">
        {isLoaded && (
          <Autocomplete
            onPlaceChanged={onPlaceChanged}
            onLoad={onLoad}
            fields={["formatted_address"]}
          >
            <div className="flex gap-2">
              <input
                type="text"
                placeholder={placeholder}
                className="rounded px-2 text-[12px] outline-none placeholder-[#989898] text-[#707070] flex-grow w-full py-2 border focus:outline-none focus:border-[#1773fe8f]"
                value={searchInput}
                onChange={handleInputChange}
                onBlur={handleBlur}
                required={required}
              />
              <div className="flex items-center gap-2 text-[12px] text-[#707070]">
                <select
                  value={formValues.unit}
                  onChange={(e) => handleChange("unit", e.target.value)}
                  className="cursor-pointer border rounded p-2 focus:outline-none focus:border-[#1773fe8f]"
                >
                  <option value="km">Kilometers</option>
                  <option value="miles">Miles</option>
                </select>
                <select
                  value={formValues.radius}
                  onChange={(e) =>
                    handleChange("radius", Number(e.target.value))
                  }
                  className="w-[100px] cursor-pointer border rounded p-2 focus:outline-none focus:border-[#1773fe8f]"
                >
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                  <option value={200}>200</option>
                </select>
              </div>
            </div>
          </Autocomplete>
        )}
      </div>
      <div className="flex-1 grid grid-cols-2 items-center">
        <div className="col-span-2 sm:col-span-1">
          <Select
            placeholder="Search Type"
            options={searchType}
            onSelect={(id, value) => {
              handleChange("type", id);
              handleChange("type_name", value);
            }}
            value={formValues.type_name || ""}
          />
        </div>
        <div className="col-span-2 sm:col-span-1">
          <LabelMultiSelect
            placeholder={formValues.type_name || "Select Type First"}
            options={typeOptions || []}
            onSelect={(id, value) => {
              handleChange("type_options", id);
              handleChange("type_options_names", value);
            }}
            value={formValues.type_options}
          />
        </div>
      </div>
    </div>
  );
};

export default SearchLocationComponent;
