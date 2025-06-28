"use client";

import React, { useRef, useState, useCallback, useEffect } from "react";
import { useJsApiLoader, Autocomplete } from "@react-google-maps/api";
import IconComponent from "@/components/icon/Icon";
import AddressMap from "@/components/gmap/AddressMap";
import debounce from "lodash.debounce";
import { googleMapsLibraries } from "@/config/googleMapsConfig";

type InputProps = {
  label: string;
  placeholder?: string;
  required?: boolean;
  showError?: boolean;
  value?: string;
  onChange?: (
    value: string,
    isLoaded: boolean,
    lat?: number,
    lng?: number
  ) => void;
  disabled?: boolean;
};

const InputLocation: React.FC<InputProps> = ({
  label,
  placeholder,
  onChange,
  value = "",
  showError = false,
  required = false,
  disabled = false,
}) => {
  // const [address, setAddress] = useState(value);
  const [address, setAddress] = useState(value);

  // Sync internal address when prop value changes
  useEffect(() => {
    setAddress(value || "");
  }, [value]);

  const [latlng, setLatlng] = useState<{ lat: number; lng: number } | null>(
    null
  );
  const [showMap, setShowMap] = useState(false);

  const [isFocused, setIsFocused] = React.useState(false);
  const handleFocus = () => {
    setIsFocused(true);
  };

  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const lastFetchedAddress = useRef<string | null>(null);
  const lastLatLng = useRef<{ lat: number; lng: number } | null>(null);

  const googleApiKey = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: googleApiKey || "",
    libraries: googleMapsLibraries,
  });

  const onLoad = (autocomplete: google.maps.places.Autocomplete) => {
    autocompleteRef.current = autocomplete;
  };

  const fetchCoordinates = useCallback(
    debounce(async (newValue: string) => {
      if (!newValue.trim()) return;

      try {
        const geocoder = new google.maps.Geocoder();
        const results = await geocoder.geocode({ address: newValue });

        if (results.results.length > 0) {
          const lat = results.results[0].geometry.location.lat();
          const lng = results.results[0].geometry.location.lng();

          // Prevent redundant updates if lat/lng didn't change
          if (
            lastLatLng.current &&
            lastLatLng.current.lat === lat &&
            lastLatLng.current.lng === lng
          ) {
            return;
          }

          lastLatLng.current = { lat, lng };
          setLatlng({ lat, lng });

          if (onChange) {
            onChange(newValue, isLoaded, lat, lng);
          }
        }
      } catch (error) {
        console.error("Geocoding error:", error);
      }
    }, 800),
    [onChange, isLoaded]
  );
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setAddress(newValue);
    onChange?.(newValue, isLoaded);
  };

  // This is called when focus is lost
  const handleBlur = () => {
    setIsFocused(false);
    if (address === lastFetchedAddress.current) return;

    lastFetchedAddress.current = address;
    fetchCoordinates(address);
  };

  const onPlaceChanged = () => {
    if (autocompleteRef.current) {
      const place = autocompleteRef.current.getPlace();
      if (place.formatted_address) {
        lastFetchedAddress.current = place.formatted_address;
        setAddress(place.formatted_address);

        if (place.geometry?.location) {
          const lat = place.geometry.location.lat();
          const lng = place.geometry.location.lng();

          if (
            lastLatLng.current &&
            lastLatLng.current.lat === lat &&
            lastLatLng.current.lng === lng
          ) {
            return;
          }

          lastLatLng.current = { lat, lng };
          setLatlng({ lat, lng });

          if (onChange) {
            onChange(place.formatted_address, isLoaded, lat, lng);
          }
        }
      }
    }
  };

  return (
    <div
      className={`flex flex-col bg-white rounded-lg p-2 gap-1 shadow-input relative ${
        disabled ? "opacity-50 cursor-not-allowed" : ""
      } ${
        showError
          ? "border border-red-500"
          : isFocused
          ? "border border-gray-300 ring-1 ring-gray-300"
          : "border border-transparent"
      } `}
    >
      <div className="flex flex-row justify-between">
        <div className="w-full">
          <label className="text-[#707070] text-sm flex gap-1">
            {label}
            {required && <span className="text-red-500 items-start">*</span>}
          </label>
          <div className="flex items-center mt-1 w-full">
            {isLoaded && (
              <Autocomplete
                onPlaceChanged={onPlaceChanged}
                onLoad={onLoad}
                // fields={["formatted_address", "geometry.location"]}
                options={{
                  fields: ["formatted_address", "geometry"],
                }}
                className="w-full"
              >
                <input
                  ref={inputRef}
                  type="text"
                  placeholder={placeholder}
                  className="text-[12px] outline-none placeholder-[#989898] text-[#707070] flex-grow w-full"
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  onFocus={handleFocus}
                  required={required}
                  value={address}
                  disabled={disabled}
                />
              </Autocomplete>
            )}
          </div>
        </div>
        <button
          className="ml-2 mr-1"
          onClick={() => !disabled && setShowMap(!showMap)}
          disabled={disabled}
        >
          <span className="flex items-center gap-3">
            <span className="gap-3">
              <IconComponent name="map-icon" size={48} />
            </span>
            <span
              className={`flex gap-3 transform transition-transform duration-300 ${
                showMap ? "rotate-180" : "rotate-0"
              }`}
            >
              <IconComponent name="arrow-down" color="#A8ADB8" />
            </span>
          </span>
        </button>
      </div>

      {/* AddressMap is always rendered but starts hidden */}
      <div
        className={`mt-2 h-[300px] rounded-md shadow-md transition-opacity duration-300 ease-in-out transform scale-100 bg-slate-200 ${
          showMap ? "flex" : "hidden"
        }`}
      >
        {isLoaded && (
          <AddressMap
            search={lastFetchedAddress.current || ""}
            isLoaded={isLoaded}
            onLocationChange={(lat, lng) => setLatlng({ lat, lng })}
          />
        )}
      </div>
    </div>
  );
};

export default InputLocation;
