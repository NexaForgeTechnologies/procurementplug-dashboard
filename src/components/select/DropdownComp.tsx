import React, { useState, useRef, useEffect, KeyboardEvent } from "react";

import Icon from "@/components/icon/IconComp";

type Option = { id: number; value: string };

type SelectProps = {
    label?: string;
    placeholder?: string;
    options: Option[];
    onSelect?: (id: number | null, value: string | null) => void; // Allow clearing
    value?: string;
    required?: boolean;
    enableSearch?: boolean; // Optional prop for search functionality
    showError?: boolean; // New prop to control error state
    disabled?: boolean; // New prop to control disabled state
};

const DropdownComp: React.FC<SelectProps> = ({
    label,
    placeholder = "Select an option",
    options,
    onSelect,
    value,
    required = false,
    enableSearch = false,
    showError = false,
    disabled = false,
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const dropdownRef = useRef<HTMLDivElement>(null);

    const [selectedValue, setSelectedValue] = useState<string | null>(null);

    const handleSelect = (id: number | null, value: string | null) => {
        setSelectedValue(value);
        setIsOpen(false);
        setSearchTerm("");
        onSelect?.(id, value);
    };

    const handleClear = () => {
        setSelectedValue(null);
        onSelect?.(null, null);
    };

    const toggleDropdown = () => {
        if (!disabled) {
            setIsOpen((prev) => !prev);
        }
    };

    const [focusedOptionIndex, setFocusedOptionIndex] = useState(-1);
    const optionsRef = useRef<Array<HTMLDivElement | null>>([]);

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

    // Filter options if search is enabled
    const filteredOptions = enableSearch
        ? options.filter((option) =>
            option.value.toLowerCase().includes(searchTerm.toLowerCase())
        )
        : options;

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
                    handleSelect(option.id, option.value);
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
            ref={dropdownRef}
            tabIndex={disabled ? -1 : 0}
            onKeyDown={handleKeyDown}
            aria-haspopup="listbox"
            aria-expanded={isOpen}
            aria-labelledby={label}
            className={`relative flex flex-row justify-between items-center bg-white rounded-lg pl-2 py-2 ${showError ? "border border-red-500" : "border border-transparent"
                } ${disabled ? "opacity-50 cursor-not-allowed" : ""
                } focus:outline-none focus:ring-1 focus:ring-gray-300 focus:border-gray-300 transition-colors duration-200`}
        >
            <div className="w-full">
                <label className="flex text-sm mb-1 text-[#707070] gap-1">
                    {label}
                    {required && <span className="text-red-500">*</span>}
                </label>
                <div className="flex items-center gap-2">
                    <div
                        className={`cursor-pointer text-[12px] text-[#707070] flex-1 ${disabled ? "cursor-not-allowed" : ""
                            }`}
                        onClick={toggleDropdown}
                    >
                        {value || <span className="text-[#989898]">{placeholder}</span>}
                    </div>
                </div>
                {isOpen && !disabled && (
                    <div className="shadow-lg rounded-md scroll max-h-48 overflow-y-auto absolute top-full left-0 w-full bg-white border-2 border-gray-300 mt-1 text-[12px] z-10">
                        {/* Conditionally render search input */}
                        {enableSearch && (
                            <div className="p-2 sticky top-0 bg-white">
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full p-2 border rounded text-sm outline-none"
                                />
                            </div>
                        )}
                        {/* Render options */}
                        {filteredOptions.map((option) => (
                            <div
                                key={option.id}
                                className="p-2 hover:bg-gray-200 cursor-pointer text-[#989898]"
                                onClick={() => handleSelect(option.id, option.value)}
                            >
                                {option.value}
                            </div>
                        ))}
                        {/* Empty state for filtered results */}
                        {filteredOptions.length === 0 && (
                            <div className="p-2 text-sm text-gray-500">No options found</div>
                        )}
                    </div>
                )}
            </div>
            {value && !disabled && (
                <div
                    className="px-2 cursor-pointer"
                    aria-label="Clear selection"
                    tabIndex={-1} // Don't include in tab sequence, but remain clickable
                    onClick={handleClear}
                >
                    <Icon name="close" size={10} color="#989898" />
                </div>
            )}

            <div
                className={`h-9 border-l-2 border-l-[#EEEEF0] min-w-12 flex items-center justify-center cursor-pointer ${disabled ? "cursor-not-allowed" : ""
                    }`}
                onClick={toggleDropdown}
                tabIndex={-1} // Don't include in tab sequence, but remain clickable
            >
                <div
                    className={`${isOpen ? "rotate-180" : ""
                        } transition-transform duration-200`}
                >
                    <Icon name="drop-down" color="#989898" size={18} />
                </div>
            </div>
        </div>
    );
};

export default DropdownComp;