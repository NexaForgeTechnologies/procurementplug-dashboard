"use client"

import React, { useState, useEffect, useRef, KeyboardEvent } from "react";
import Icon from "@/components/icon/IconComp";

type Option = { id: number; value: string };

type MultiSelectProps = {
   label?: string;
   options: Option[];
   onSelect?: (ids: number[], values: string[]) => void; // Pass array of ids and values
   required?: boolean;
   value?: (number[] | string[]) | undefined; // Accept both number[] and string[]
   maxSelection?: number;
   placeholder?: string; // New prop for max selection limit
   disabled?: boolean; // New prop for disabling the component
};

const MultiSelectComponent: React.FC<MultiSelectProps> = ({
   label,
   options,
   onSelect,
   required = false,
   value = [], // Accept initial selected ids as a prop
   maxSelection,
   placeholder = "Select an option", // Destructure maxSelection
   disabled = false,
}) => {
   const [selectedIds, setSelectedIds] = useState<number[]>([]);
   const [isOpen, setIsOpen] = useState(false); // Control dropdown visibility
   const [searchQuery, setSearchQuery] = useState(""); // Track search query input

   const dropdownRef = useRef<HTMLDivElement>(null); // Dropdown reference

   // Sync selectedIds with value prop if provided
   useEffect(() => {
      if (Array.isArray(value)) {
         setSelectedIds(
            value.map((id) => (typeof id === "string" ? parseInt(id) : id))
         ); // Convert string ids to numbers
      }
   }, [value]);

   // Handle option selection or deselection
   const handleSelect = (id: number) => {
      if (disabled) return; // Prevent selection if disabled

      let updatedIds = [...selectedIds];

      if (updatedIds.includes(id)) {
         // Deselect option
         updatedIds = updatedIds.filter((itemId) => itemId !== id);
      } else {
         // Check if max selection limit is reached
         if (maxSelection && updatedIds.length >= maxSelection) {
            return; // Do nothing if max selection is reached
         }
         // Select option
         updatedIds.push(id);
      }

      setSelectedIds(updatedIds);

      if (onSelect) {
         // Map selected ids to their corresponding values
         const selectedValues = updatedIds
            .map((id) => options.find((option) => option.id === id)?.value)
            .filter(Boolean) as string[];
         onSelect(updatedIds, selectedValues); // Trigger onSelect callback
      }
   };

   // Handle search input change
   const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchQuery(e.target.value);
   };

   // Filter options based on search query
   const filteredOptions = [
      ...options.filter((option) => selectedIds.includes(option.id)), // Selected options
      ...options
         .filter((option) => !selectedIds.includes(option.id)) // Non-selected options
         .filter((option) =>
            option.value.toLowerCase().includes(searchQuery.toLowerCase())
         ),
   ];

   // Close dropdown on outside click
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
      return () => {
         document.removeEventListener("mousedown", handleClickOutside);
      };
   }, []);

   const [focusedOptionIndex, setFocusedOptionIndex] = useState(-1);
   const optionsRef = useRef<Array<HTMLDivElement | null>>([]);
   const toggleDropdown = () => {
      if (!disabled) {
         setIsOpen((prev) => !prev);
      }
   };

   const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
      if (disabled) return;

      switch (e.key) {
         case "Enter":
         case " ": // Space
            e.preventDefault();
            if (!isOpen) {
               setIsOpen(true);
            } else if (
               focusedOptionIndex >= 0 &&
               focusedOptionIndex < filteredOptions.length
            ) {
               const option = filteredOptions[focusedOptionIndex];
               handleSelect(option.id);
            }
            break;
         case "Escape":
            e.preventDefault();
            setIsOpen(false);
            break;
         case "ArrowDown":
            e.preventDefault();
            if (!isOpen) {
               setIsOpen(true);
            } else {
               setFocusedOptionIndex((prev) =>
                  prev < filteredOptions.length - 1 ? prev + 1 : prev
               );
            }
            break;
         case "ArrowUp":
            e.preventDefault();
            if (isOpen) {
               setFocusedOptionIndex((prev) => (prev > 0 ? prev - 1 : 0));
            }
            break;
         case "Tab":
            setIsOpen(false);
            break;
      }
   };

   useEffect(() => {
      if (
         isOpen &&
         focusedOptionIndex >= 0 &&
         optionsRef.current[focusedOptionIndex]
      ) {
         optionsRef.current[focusedOptionIndex]?.scrollIntoView({
            behavior: "smooth",
            block: "nearest",
         });
      }
   }, [focusedOptionIndex, isOpen]);

   return (
      <div
         tabIndex={disabled ? -1 : 0}
         onKeyDown={handleKeyDown}
         aria-haspopup="listbox"
         aria-expanded={isOpen}
         aria-labelledby={label}
         className={`relative flex flex-row justify-between items-center bg-white rounded-lg p-2 ${disabled ? "opacity-50 cursor-not-allowed" : ""
            } focus:outline-none focus:ring-1 focus:ring-gray-300 focus:border-gray-300 transition-colors duration-200`}
         ref={dropdownRef}
      >
         <div className="w-full flex flex-col gap-1">
            {/* Label with optional required indicator */}
            <label
               className="flex text-sm gap-1 text-[#707070]"
               onClick={toggleDropdown}
            >
               {label} {required && <span className="text-red-500">*</span>}
            </label>
            <div
               className={`cursor-pointer text-[12px] text-[#A8ADB8] overflow-hidden text-ellipsis whitespace-nowrap mr-12 ${disabled ? "cursor-not-allowed" : ""
                  }`}
               onClick={toggleDropdown}
            >
               {selectedIds.length > 0 ? (
                  <span
                     className="text-[#707070]"
                     title={
                        selectedIds.length === 0
                           ? label
                           : selectedIds
                              .map(
                                 (id) =>
                                    options.find((option) => option.id === id)?.value // Use full name for tooltip
                              )
                              .filter(Boolean) // Remove undefined or null values
                              .join(", ")
                     }
                  >
                     {options
                        .filter((option) => selectedIds.includes(option.id))
                        .map((option) => option.value)
                        .join(", ")}{" "}
                  </span>
               ) : (
                  <span className="text-[#A8ADB8]">{placeholder}</span>
               )}
            </div>
         </div>

         {isOpen && !disabled && (
            <div className="absolute top-full left-0 w-full bg-white border-2 border-gray-300 rounded-xl mt-1 p-2 text-[12px] z-10">
               {/* Search Input */}
               <div className="flex justify-between items-center border-2 rounded-xl p-2 text-[#A8ADB8] mb-1">
                  <input
                     type="text"
                     className="w-full outline-none"
                     placeholder="Search..."
                     value={searchQuery}
                     onChange={handleSearch}
                  />
                  <button className="ml-2 p-1 flex items-center justify-center text-[#000D3F]">
                     <Icon name="search" color="#707070" size={16} />
                  </button>
               </div>

               {/* Filtered Options */}
               <div className="max-h-36 overflow-y-auto scroll">
                  {filteredOptions.map((option) => (
                     <div
                        key={option.id}
                        className={`p-2 hover:bg-gray-200 cursor-pointer ${selectedIds.includes(option.id)
                           ? "text-[#000D3F]"
                           : "text-[#A8ADB8]"
                           }`}
                        onClick={() => handleSelect(option.id)} // Handle selecting the option
                     >
                        <div className="flex justify-between items-center gap-1">
                           {option.value}
                           <span
                              className={`-left-8 top-4 min-w-4 min-h-4 border-[2px] rounded-[4px] flex items-center justify-center ${selectedIds.includes(option.id)
                                 ? "border-[#000D3F] bg-white"
                                 : "border-[#A8ADB8] bg-white"
                                 }`}
                           >
                              {selectedIds.includes(option.id) && (
                                 <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className={`min-h-2 min-w-2 ${selectedIds.includes(option.id)
                                       ? "text-[#000D3F]"
                                       : "text-[#A8ADB8]"
                                       }`}
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth={4}
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                 >
                                    <path d="M5 12l5 5L20 7" />
                                 </svg>
                              )}
                           </span>
                        </div>
                     </div>
                  ))}

                  {/* No options found */}
                  {filteredOptions.length === 0 && (
                     <div className="p-2 text-gray-500">No options found</div>
                  )}
               </div>
               {maxSelection && selectedIds.length >= maxSelection && (
                  <div className="text-[9px] text-red-500 mt-1">
                     Maximum limit reached
                  </div>
               )}
            </div>
         )}
         {/* Dropdown toggle icon */}
         <div
            className={`absolute right-[1px] h-9 border-l-2 border-l-[#EEEEF0] w-12 flex items-center justify-center cursor-pointer ${disabled ? "cursor-not-allowed" : ""
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