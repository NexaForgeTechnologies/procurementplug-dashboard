// "use client"

// import React, { useState, useEffect, useRef, KeyboardEvent } from "react";

// import Icon from "@/components/icon/IconComp";

// type Option = { id: number; value: string };

// type MultiSelectProps = {
//    label?: string;
//    options: Option[];
//    onSelect?: (ids: number[], values: string[]) => void; // Pass array of ids and values
//    required?: boolean;
//    value?: (number[] | string[]) | undefined; // Accept both number[] and string[]
//    placeholder?: string; // New prop for max selection limit
//    disabled?: boolean; // New prop for disabling the component
// };

// const MultiSelectComponent: React.FC<MultiSelectProps> = ({
//    label,
//    options,
//    onSelect,
//    required = false,
//    value = [], // Accept initial selected ids as a prop
//    placeholder = "Select an option", // Destructure maxSelection
//    disabled = false,
// }) => {
//    const [selectedIds, setSelectedIds] = useState<number[]>([]);
//    const [isOpen, setIsOpen] = useState(false); // Control dropdown visibility
//    const [searchQuery, setSearchQuery] = useState(""); // Track search query input

//    const dropdownRef = useRef<HTMLDivElement>(null); // Dropdown reference

//    // Sync selectedIds with value prop if provided
//    useEffect(() => {
//       if (Array.isArray(value)) {
//          setSelectedIds(
//             value.map((id) => (typeof id === "string" ? parseInt(id) : id))
//          ); // Convert string ids to numbers
//       }
//    }, [value]);

//    // Handle option selection or deselection
//    const handleSelect = (id: number) => {
//       if (disabled) return; // Prevent selection if disabled

//       let updatedIds = [...selectedIds];

//       if (updatedIds.includes(id)) {
//          // Deselect option
//          updatedIds = updatedIds.filter((itemId) => itemId !== id);
//       } else {
//          // Select option
//          updatedIds.push(id);
//       }

//       setSelectedIds(updatedIds);

//       if (onSelect) {
//          // Map selected ids to their corresponding values
//          const selectedValues = updatedIds
//             .map((id) => options.find((option) => option.id === id)?.value)
//             .filter(Boolean) as string[];
//          onSelect(updatedIds, selectedValues); // Trigger onSelect callback
//       }
//    };

//    // Handle search input change
//    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
//       setSearchQuery(e.target.value);
//    };

//    // Filter options based on search query
//    const filteredOptions = [
//       ...options.filter((option) => selectedIds.includes(option.id)), // Selected options
//       ...options
//          .filter((option) => !selectedIds.includes(option.id)) // Non-selected options
//          .filter((option) =>
//             option.value.toLowerCase().includes(searchQuery.toLowerCase())
//          ),
//    ];

//    // Close dropdown on outside click
//    useEffect(() => {
//       const handleClickOutside = (event: MouseEvent) => {
//          if (
//             dropdownRef.current &&
//             !dropdownRef.current.contains(event.target as Node)
//          ) {
//             setIsOpen(false);
//          }
//       };

//       document.addEventListener("mousedown", handleClickOutside);
//       return () => {
//          document.removeEventListener("mousedown", handleClickOutside);
//       };
//    }, []);

//    const [focusedOptionIndex, setFocusedOptionIndex] = useState(-1);
//    const optionsRef = useRef<Array<HTMLDivElement | null>>([]);
//    const toggleDropdown = () => {
//       if (!disabled) {
//          setIsOpen((prev) => !prev);
//       }
//    };

//    const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
//       if (disabled) return;

//       switch (e.key) {
//          case "Enter":
//          case " ": // Space
//             e.preventDefault();
//             if (!isOpen) {
//                setIsOpen(true);
//             } else if (
//                focusedOptionIndex >= 0 &&
//                focusedOptionIndex < filteredOptions.length
//             ) {
//                const option = filteredOptions[focusedOptionIndex];
//                handleSelect(option.id);
//             }
//             break;
//          case "Escape":
//             e.preventDefault();
//             setIsOpen(false);
//             break;
//          case "ArrowDown":
//             e.preventDefault();
//             if (!isOpen) {
//                setIsOpen(true);
//             } else {
//                setFocusedOptionIndex((prev) =>
//                   prev < filteredOptions.length - 1 ? prev + 1 : prev
//                );
//             }
//             break;
//          case "ArrowUp":
//             e.preventDefault();
//             if (isOpen) {
//                setFocusedOptionIndex((prev) => (prev > 0 ? prev - 1 : 0));
//             }
//             break;
//          case "Tab":
//             setIsOpen(false);
//             break;
//       }
//    };

//    useEffect(() => {
//       if (
//          isOpen &&
//          focusedOptionIndex >= 0 &&
//          optionsRef.current[focusedOptionIndex]
//       ) {
//          optionsRef.current[focusedOptionIndex]?.scrollIntoView({
//             behavior: "smooth",
//             block: "nearest",
//          });
//       }
//    }, [focusedOptionIndex, isOpen]);

//    const [selectedColor, setSelectedColor] = useState("#ff0000");

//    return (
//       <div
//          tabIndex={disabled ? -1 : 0}
//          onKeyDown={handleKeyDown}
//          aria-haspopup="listbox"
//          aria-expanded={isOpen}
//          aria-labelledby={label}
//          className={`relative flex flex-row justify-between items-center bg-white rounded-lg p-2 ${disabled ? "opacity-50 cursor-not-allowed" : ""
//             } focus:outline-none focus:ring-1 focus:ring-gray-300 focus:border-gray-300 transition-colors duration-200`}
//          ref={dropdownRef}
//       >
//          <div className="w-full flex flex-col gap-1">
//             {/* Label with optional required indicator */}
//             <label
//                className="flex text-sm gap-1 text-[#707070]"
//                onClick={toggleDropdown}
//             >
//                {label} {required && <span className="text-red-500">*</span>}
//             </label>
//             <div
//                className={`cursor-pointer text-[12px] text-[#A8ADB8] overflow-hidden text-ellipsis whitespace-nowrap mr-12 ${disabled ? "cursor-not-allowed" : ""
//                   }`}
//                onClick={toggleDropdown}
//             >
//                {selectedIds.length > 0 ? (
//                   <span
//                      className="text-[#707070]"
//                      title={
//                         selectedIds.length === 0
//                            ? label
//                            : selectedIds
//                               .map(
//                                  (id) =>
//                                     options.find((option) => option.id === id)?.value // Use full name for tooltip
//                               )
//                               .filter(Boolean) // Remove undefined or null values
//                               .join(", ")
//                      }
//                   >
//                      {options
//                         .filter((option) => selectedIds.includes(option.id))
//                         .map((option) => option.value)
//                         .join(", ")}{" "}
//                   </span>
//                ) : (
//                   <span className="text-[#A8ADB8]">{placeholder}</span>
//                )}
//             </div>
//          </div>

//          {isOpen && !disabled && (
//             <div className="absolute top-full left-0 w-full bg-white border-2 border-gray-300 rounded-xl mt-1 p-2 text-[12px] z-10">
//                {/* Search Input */}
//                <div className="flex justify-between items-center border-2 rounded-xl p-2 text-[#A8ADB8] mb-1">
//                   <input
//                      type="text"
//                      className="w-full outline-none"
//                      placeholder="Search..."
//                      value={searchQuery}
//                      onChange={handleSearch}
//                   />
//                   <button className="ml-2 p-1 flex items-center justify-center text-[#000D3F]">
//                      <Icon name="search" color="#707070" size={16} />
//                   </button>
//                </div>

//                {/* Filtered Options */}
//                <div className="max-h-36 overflow-y-auto scroll">
//                   {filteredOptions.map((option) => (
//                      <>
//                         <div
//                            key={option.id}
//                            className={`p-2 hover:bg-gray-200 cursor-pointer ${selectedIds.includes(option.id)
//                               ? "text-[#000D3F]"
//                               : "text-[#A8ADB8]"
//                               }`}
//                            onClick={() => handleSelect(option.id)} // Handle selecting the option
//                         >
//                            <div className="flex justify-between items-center gap-2">
//                               {option.value}
//                               <span
//                                  className={`-left-8 top-4 min-w-4 min-h-4 border-[2px] rounded-[4px] flex items-center justify-center ${selectedIds.includes(option.id)
//                                     ? "border-[#000D3F] bg-white"
//                                     : "border-[#A8ADB8] bg-white"
//                                     }`}
//                               >
//                                  {selectedIds.includes(option.id) && (
//                                     <svg
//                                        xmlns="http://www.w3.org/2000/svg"
//                                        className={`min-h-2 min-w-2 ${selectedIds.includes(option.id)
//                                           ? "text-[#000D3F]"
//                                           : "text-[#A8ADB8]"
//                                           }`}
//                                        viewBox="0 0 24 24"
//                                        fill="none"
//                                        stroke="currentColor"
//                                        strokeWidth={4}
//                                        strokeLinecap="round"
//                                        strokeLinejoin="round"
//                                     >
//                                        <path d="M5 12l5 5L20 7" />
//                                     </svg>
//                                  )}
//                               </span>
//                            </div>
//                         </div>

//                         {selectedIds.includes(option.id) && (
//                            <div className="mb-2 ml-4 mr-2 flex items-center gap-2">
//                               <input
//                                  type="text"
//                                  className="w-full border-b outline-none"
//                                  placeholder="Role"
//                               />
//                               {/* <input
//                                  type="color"
//                                  className="w-6 h-6 border rounded"
//                                  value={selectedColor}
//                                  onChange={(e) => setSelectedColor(e.target.value)}
//                               /> */}
//                            </div>
//                         )}

//                      </>
//                   ))}

//                   {/* No options found */}
//                   {filteredOptions.length === 0 && (
//                      <div className="p-2 text-gray-500">No options found</div>
//                   )}
//                </div>
//             </div>
//          )}
//          {/* Dropdown toggle icon */}
//          <div
//             className={`absolute right-[1px] h-9 border-l-2 border-l-[#EEEEF0] w-12 flex items-center justify-center cursor-pointer ${disabled ? "cursor-not-allowed" : ""
//                }`}
//             onClick={toggleDropdown}
//          >
//             <div
//                className={`${isOpen ? "rotate-180" : ""
//                   } transition-transform duration-200`}
//             >
//                <Icon name="drop-down" color="#707070" size={16} />
//             </div>
//          </div>
//       </div>
//    );
// };

// export default MultiSelectComponent;



"use client";

import React, { useState, useEffect, useRef } from "react";
import Icon from "@/components/icon/IconComp";

type SelectedSpeaker = {
   id: number;
   name: string;
   role: string;
   bg_color: string;
};

type MultiSelectProps = {
   label?: string;
   options: SelectedSpeaker[]; // from database
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
               id: option.id,
               name: option.name,
               role: option.role || "",
               bg_color: option.bg_color || "#000000",
            },
         ];
      }

      setSelectedSpeakers(updated);
      onSelect?.(updated);
   };

   const handleRoleChange = (id: number, role: string) => {
      const updated = selectedSpeakers.map((s) =>
         s.id === id ? { ...s, role } : s
      );
      setSelectedSpeakers(updated);
      onSelect?.(updated);
   };

   const handleColorChange = (id: number, color: string) => {
      const updated = selectedSpeakers.map((s) =>
         s.id === id ? { ...s, bg_color: color } : s
      );
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
            opt.name.toLowerCase().includes(searchQuery.toLowerCase())
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
            <div className="absolute top-16 left-0 z-10 w-full rounded-xl border-2 border-gray-300 bg-white p-2 text-sm">
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
                              onClick={() => handleSelect(option.id)}
                           >
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

                           {selected && (
                              <div className="mb-2 ml-4 mr-2 flex items-center gap-2">
                                 <input
                                    type="text"
                                    placeholder="Role"
                                    value={selected.role}
                                    onChange={(e) =>
                                       handleRoleChange(option.id, e.target.value)
                                    }
                                    className="flex-grow border-b outline-none"
                                 />
                                 <input
                                    type="color"
                                    value={selected.bg_color}
                                    onChange={(e) =>
                                       handleColorChange(option.id, e.target.value)
                                    }
                                    className="w-6 h-6 rounded border"
                                 />
                              </div>
                           )}
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
