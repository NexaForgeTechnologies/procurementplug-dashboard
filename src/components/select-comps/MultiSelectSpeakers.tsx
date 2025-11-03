"use client";
import React, { useState, useEffect, useRef } from "react";

import Icon from "@/components/icon/IconComp";

import { SpeakerDM } from "@/domain-models/speaker/SpeakerDM";

type SelectedSpeaker = {
  id: number;
  name: string;
  role: string;
  bg_color: string;
};

type MultiSelectProps = {
  label?: string;
  options: SpeakerDM[]; // from database
  onSelect?: (selected: SelectedSpeaker[]) => void;
  required?: boolean;
  value?: SelectedSpeaker[]; // preselected (from DB)
  placeholder?: string;
  disabled?: boolean;
  showError?: boolean;
};

const MultiSelectComponent: React.FC<MultiSelectProps> = ({
  label,
  options,
  onSelect,
  required = false,
  value = [],
  placeholder = "Select an option",
  disabled = false,
  showError
}) => {
  const [selectedSpeakers, setSelectedSpeakers] = useState<SelectedSpeaker[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Sync initial value from props (e.g., from database)
  useEffect(() => {
    if (value?.length) {
      setSelectedSpeakers(value);
    }
  }, [value]);

  // Toggle selection (add or remove speaker)
  const handleSelect = (id: number) => {
    const selected = selectedSpeakers.find((s) => s.id === id);
    const option = options.find((s) => s.id === id);
    if (!option) return;

    let updated: SelectedSpeaker[];

    if (selected) {
      updated = selectedSpeakers.filter((s) => s.id !== id);
    } else {
      updated = [
        ...selectedSpeakers,
        {
          id: option.id || 0,
          name: option.name || "",
          role: option.role || "",
          bg_color: option.bg_color || "#faf8f5",
        },
      ];
    }

    setSelectedSpeakers(updated);
    onSelect?.(updated);
  };

  // const handleRoleChange = (id: number, role: string) => {
  //   const updated = selectedSpeakers.map((s) =>
  //     s.id === id ? { ...s, role } : s
  //   );
  //   setSelectedSpeakers(updated);
  //   onSelect?.(updated);
  // };

  const handleRoleChange = (id: number, role: "1" | "2" | "") => {
    const updated = selectedSpeakers.map((s) => {
      if (s.id === id) {
        // Assign fixed color based on role, or clear if role is empty
        const bg_color =
          role === "1" ? "#b08d57" : role === "2" ? "#9c27b0" : "";
        return { ...s, role, bg_color };
      }
      return s;
    });

    setSelectedSpeakers(updated);
    onSelect?.(updated);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const filteredOptions = [
    ...options.filter((opt) => selectedSpeakers.find((s) => s.id === opt.id)),
    ...options
      .filter((opt) => !selectedSpeakers.find((s) => s.id === opt.id))
      .filter((opt) =>
        (opt.name || "").toLowerCase().includes(searchQuery.toLowerCase())
      ),
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleDropdown = () => {
    if (!disabled) setIsOpen((prev) => !prev);
  };

  return (
    <div
      ref={dropdownRef}
      tabIndex={disabled ? -1 : 0}
      aria-haspopup="listbox"
      aria-expanded={isOpen}
      aria-labelledby={label}
      className={`relative flex justify-between items-center bg-white rounded-lg pl-2 py-2 ${showError ? "border border-red-500" : "border border-transparent"
        } ${disabled ? "opacity-50 cursor-not-allowed" : ""
        } focus:outline-none focus:ring-1 focus:ring-gray-300 focus:border-gray-300 transition-colors duration-200`}
    >
      <div className="flex-1">
        <label
          className="flex text-sm gap-1 text-[#707070]"
          onClick={toggleDropdown}
        >
          {label} {required && <span className="text-red-500">*</span>}
        </label>

        <div
          className="cursor-pointer text-[12px] text-[#A8ADB8] mt-1"
          onClick={toggleDropdown}
        >
          {selectedSpeakers.length > 0 ? (
            <span className="text-[#707070]">
              {selectedSpeakers.map((s) => s.name).join(", ")}
            </span>
          ) : (
            <span>{placeholder}</span>
          )}
        </div>
      </div>

      {isOpen && (
        <div className="absolute top-16 left-0 z-10 w-full rounded-xl border-2 border-gray-300
             bg-white p-2 text-sm">
          <div className="mb-2 flex items-center rounded-xl border-2 border-gray-300 p-2">
            <input
              type="text"
              className="w-full outline-none"
              placeholder="Search..."
              value={searchQuery}
              onChange={handleSearch}
            />
            <Icon name="search" size={16} color="#707070" />
          </div>

          <div className="max-h-40 overflow-y-auto">
            {filteredOptions.map((option) => {
              const selected = selectedSpeakers.find((s) => s.id === option.id);
              return (
                <div key={option.id}>
                  <div
                    className={`flex items-center justify-between p-2 cursor-pointer hover:bg-gray-100 ${selected ? "text-black" : "text-gray-500"
                      }`}
                  >
                    <div
                      onClick={() => {
                        if (option.id !== undefined) {
                          handleSelect(option.id);
                        }
                      }}
                      className="flex-1 flex gap-1 items-center">
                      <span>{option.name}</span>
                      {selected && (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 text-blue-600"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={3}
                        >
                          <path d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>

                    {/* Role selection (enabled only when selected) */}
                    <div
                      className={`flex items-center gap-4 transition-opacity ${selected ? "opacity-100" : "opacity-50"
                        }`}
                    >
                      <label className="flex items-center gap-1 text-sm text-gray-700">
                        <input
                          type="checkbox"
                          name={`role-${option.id}`}
                          value="1"
                          checked={selected?.role === "1"}
                          onChange={() => {
                            if (selected && option.id !== undefined) {
                              // if already selected as Host, unselect it
                              if (selected.role === "1") {
                                handleRoleChange(option.id, ""); // clear role
                              } else {
                                handleRoleChange(option.id, "1"); // set Host
                              }
                            }
                          }}
                          disabled={!selected}
                        />
                        Host
                      </label>

                      <label className="flex items-center gap-1 text-sm text-gray-700">
                        <input
                          type="checkbox"
                          name={`role-${option.id}`}
                          value="2"
                          checked={selected?.role === "2"}
                          onChange={() => {
                            if (selected && option.id !== undefined) {
                              // if already selected as Voice of the Day, unselect it
                              if (selected.role === "2") {
                                handleRoleChange(option.id, ""); // clear role
                              } else {
                                handleRoleChange(option.id, "2"); // set Voice of the Day
                              }
                            }
                          }}
                          disabled={!selected}
                        />
                        Voice of the Day
                      </label>
                    </div>

                  </div>
                </div>
              );
            })}

            {filteredOptions.length === 0 && (
              <div className="p-2 text-gray-400">No options found</div>
            )}
          </div>
        </div>
      )}

      {/* Dropdown toggle icon */}
      <div
        className={`h-9 border-l-2 border-l-[#EEEEF0] w-12 flex items-center justify-center cursor-pointer ${disabled ? "cursor-not-allowed" : ""
          }`}
        onClick={toggleDropdown}
      >
        <div
          className={`${isOpen ? "rotate-180" : ""
            } transition-transform duration-200`}
        >
          <Icon name="drop-down" color="#707070" size={16} />
        </div>
      </div>
    </div>
  );
};

export default MultiSelectComponent;
