import React, { useState } from "react";
import Icon from "@/components/icon/Icon";

type DifferenceProps = {
  label: string;
  label2: string;
  options: string[];
  placeholder2?: string;
  onSelect?: (value: string) => void;
  onChange?: (value: string) => void; // Optional onSelect
  placeholder?: string;
  required?: boolean; // Optional required prop
};

const DifferenceComponent: React.FC<DifferenceProps> = ({
  label,
  label2,
  placeholder2,
  options,
  onSelect,
  onChange, // Optional prop
  placeholder = "Select an option",
  required = false, // Default to false if not provided
}) => {
  const [selected, setSelected] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (option: string) => {
    setSelected(option);
    setIsOpen(false);
    if (onSelect) {
      onSelect(option); // Call only if onSelect is provided
    }
  };
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      onChange(event.target.value);
    }
  };
  const toggleDropdown = () => setIsOpen(!isOpen);

  return (
    <div className="flex bg-white justify-evenly">
      <div className="relative flex flex-1 flex-row justify-between items-center  rounded-lg pl-2 py-2">
        <div className="w-full">
          <label className="flex text-sm mb-1 text-[#707070] gap-1">
            {label}{" "}
            {required && <span className="text-red-500 items-start">*</span>}{" "}
            {/* Add red asterisk if required */}
          </label>
          <div
            className="cursor-pointer text-[12px] text-[#989898]"
            onClick={toggleDropdown}
          >
            {selected || <span className="text-[#989898]">{placeholder}</span>}{" "}
            {/* Show selected or placeholder */}
          </div>
          {isOpen && (
            <div className="max-h-48 overflow-y-auto scroll absolute top-full left-0 w-full bg-white border mt-1 text-[12px] z-10">
              {options.map((option, index) => (
                <div
                  key={index}
                  className="p-2 hover:bg-gray-200 cursor-pointer text-[#989898]"
                  onClick={() => handleSelect(option)}
                >
                  {option}
                </div>
              ))}
            </div>
          )}
        </div>
        <div
          className="h-9 border-l-2 border-l-[#EEEEF0]  w-12 flex items-center justify-center cursor-pointer"
          onClick={toggleDropdown}
        >
          <div
            className={`${
              isOpen ? "rotate-180" : ""
            } transition-transform  duration-200`}
          >
            <Icon name="drop-down" />
          </div>
        </div>
      </div>
      <div className="w-[1px] bg-[#EEEEF0]"></div>
      <div className="flex flex-col flex-1  rounded-lg p-2 gap-1 shadow-input">
        <label className="text-[#707070] text-sm flex gap-1">
          {label2}
          {required && <span className="text-red-500 items-start">*</span>}
        </label>
        <input
          type="text"
          placeholder={placeholder2}
          className="text-[12px] outline-none placeholder-[#989898] text-[#707070]"
          onChange={handleChange}
          required={required}
        />
      </div>
    </div>
  );
};
export default DifferenceComponent;
