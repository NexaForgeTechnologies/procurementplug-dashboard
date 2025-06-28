"use client";

import React, { useState, useRef } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import IconComponent from "@/components/icon/Icon";

type InputProps = {
  label?: string;
  onChange?: (value: string) => void;
  required?: boolean;
  dateFormat?: string;
  value?: Date;
  showError?: boolean;
  disabled?: boolean;
};

const Calendar: React.FC<InputProps> = ({
  label,
  onChange,
  required = false,
  dateFormat = "MM/dd/yyyy",
  value,
  showError = false,
  disabled = false,
}) => {
  const [selectedDate, setSelectedDate] = useState<Date | null | undefined>(
    value
  );
  const [isFocused, setIsFocused] = useState(false);
  const datePickerRef = useRef<DatePicker>(null);

  const handleDateChange = (date: Date | null) => {
    if (!disabled) {
      setSelectedDate(date);
      if (onChange) {
        const formattedDate = date ? date.toLocaleDateString("en-CA") : "";
        onChange(formattedDate);
      }
    }
  };

  const handleIconClick = () => {
    if (!disabled && datePickerRef.current) {
      datePickerRef.current.setFocus();
    }
  };

  const handleClearDate = () => {
    if (!disabled) {
      setSelectedDate(null);
      if (onChange) onChange("");
    }
  };

  // Add onFocus and onBlur handlers
  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };
  
  return (
    <div
      className={`w-full h-full flex justify-between items-center bg-white rounded-md p-2 gap-2 shadow-input 
        ${showError ? "border border-red-500" : isFocused ? "border border-gray-300 ring-1 ring-gray-300" : "border border-transparent"}
        ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
    >
      <div className="flex flex-col w-full">
        {label && (
          <label className="text-[#707070] text-sm flex gap-1">
            {label}
            {required && <span className="text-red-500 items-start">*</span>}
          </label>
        )}

        <div className="relative w-full">
          <DatePicker
            selected={selectedDate}
            onChange={handleDateChange}
            showPopperArrow={false}
            dateFormat={dateFormat}
            placeholderText="mm/dd/yyyy"
            className="text-[12px] outline-none placeholder-[#989898] text-[#707070] w-full"
            ref={datePickerRef}
            showYearDropdown
            scrollableYearDropdown
            yearDropdownItemNumber={80}
            popperPlacement="bottom-end"
            disabled={disabled}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onCalendarOpen={handleFocus}
            onCalendarClose={handleBlur}
          />
        </div>
      </div>
      {selectedDate && !disabled && (
        <button
          onClick={handleClearDate}
          className="text-gray-500 hover:text-gray-700"
        >
          <IconComponent name="close" size={10} />
        </button>
      )}
      <div
        onClick={handleIconClick}
        className="cursor-pointer relative group flex items-center justify-center"
      >
        <IconComponent name="calendar" size={20} />
        <span className="absolute -top-5 left-1/2 -translate-x-1/2 bg-gray-700 text-white text-xs rounded px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          Calendar
        </span>
      </div>
    </div>
  );
};

export default Calendar;