"use client";

import React, { useRef, useState, useEffect } from "react";

type CalendarDateTimePickerProps = {
  label?: string;
  onSelect: (dateTime: string | null) => void;
  value?: string | null;
};

const CalendarDateTimePicker: React.FC<CalendarDateTimePickerProps> = ({
  label,
  onSelect,
  value,
}) => {
  const [selectedDateTime, setSelectedDateTime] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);

  // ✅ Sync external value
  useEffect(() => {
    if (value) setSelectedDateTime(value);
    else setSelectedDateTime("");
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dateValue = e.target.value;
    setSelectedDateTime(dateValue);
    onSelect(dateValue || null);
  };

  const handleContainerClick = () => {
    // ✅ Programmatically open date-time picker (modern browsers)
    inputRef.current?.showPicker?.();
    inputRef.current?.focus();
  };

  return (
    <div
      onClick={handleContainerClick}
      className={`flex flex-col bg-white rounded-lg p-2 gap-1 shadow-input w-full cursor-pointer transition-colors duration-200`}
    >
      {label && <label className="text-sm font-medium">{label}</label>}
      <input
        ref={inputRef}
        type="datetime-local"
        value={selectedDateTime}
        onChange={handleChange}
        className="min-w-0 w-full text-[14px] outline-none placeholder-[#989898] text-[#707070] bg-white cursor-pointer"
      />
    </div>
  );
};

export default CalendarDateTimePicker;
