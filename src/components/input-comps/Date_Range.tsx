import React, { useState, useRef, useEffect } from "react";
import { DateRangePicker, RangeKeyDict } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import IconComponent from "../icon/Icon";

type InputProps = {
  onChange?: (range: { startDate: string; endDate: string } | null) => void;
  isRange?: boolean;
};

const Date_Range: React.FC<InputProps> = ({ onChange }) => {
  const [selectionRange, setSelectionRange] = useState({
    startDate: new Date(new Date().setDate(new Date().getDate() - 30)), // Last 30 days
    endDate: new Date(), // Today
    key: "selection",
  });
  

  const [showPicker, setShowPicker] = useState(false);
  const [isDateSelected, setIsDateSelected] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        setShowPicker(false);
      }
    };

    if (showPicker) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showPicker]);

  const handleRangeSelect = (ranges: RangeKeyDict) => {
    const range = ranges.selection;
    if (range.startDate && range.endDate) {
      setSelectionRange({
        startDate: range.startDate,
        endDate: range.endDate,
        key: "selection",
      });
      setIsDateSelected(true);
    }
  };

  const handleConfirm = () => {
    if (onChange && selectionRange.startDate && selectionRange.endDate) {
      onChange({
        startDate: selectionRange.startDate.toLocaleDateString("en-US"),
        endDate: selectionRange.endDate.toLocaleDateString("en-US"),
      });
      setShowPicker(false);
    }
  };

  const handleReset = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectionRange({
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    });
    setIsDateSelected(false);
    if (onChange) {
      onChange(null);
    }
  };

  const currentDate = new Date(); // Get the current date
  const staticRanges = [
    {
      range: () => {
        const today = new Date();
        return { startDate: today, endDate: today };
      },
      label: "Today",
      isSelected: (range: any) => {
        const today = new Date();
        return range.startDate.toDateString() === today.toDateString() &&
               range.endDate.toDateString() === today.toDateString();
      },
    },
    {
      range: () => {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        return { startDate: yesterday, endDate: yesterday };
      },
      label: "Yesterday",
      isSelected: (range:any) => {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        return range.startDate.toDateString() === yesterday.toDateString() &&
               range.endDate.toDateString() === yesterday.toDateString();
      },
    },
    
    {
      range: () => {
        const startOfWeek = new Date();
        startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        return { startDate: startOfWeek, endDate: endOfWeek };
      },
      label: "This Week",
      isSelected: (range:any) => {
        const startOfWeek = new Date();
        startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        return range.startDate.toDateString() === startOfWeek.toDateString() &&
               range.endDate.toDateString() === endOfWeek.toDateString();
      },
    },
    {
      range: () => {
        const today = new Date();
        const startOfLastWeek = new Date();
        startOfLastWeek.setDate(today.getDate() - today.getDay() - 7);
        const endOfLastWeek = new Date(startOfLastWeek);
        endOfLastWeek.setDate(startOfLastWeek.getDate() + 6);
        return { startDate: startOfLastWeek, endDate: endOfLastWeek };
      },
      label: "Last Week",
      isSelected: (range:any) => {
        const today = new Date();
        const startOfLastWeek = new Date();
        startOfLastWeek.setDate(today.getDate() - today.getDay() - 7);
        const endOfLastWeek = new Date(startOfLastWeek);
        endOfLastWeek.setDate(startOfLastWeek.getDate() + 6);
        return range.startDate.toDateString() === startOfLastWeek.toDateString() &&
               range.endDate.toDateString() === endOfLastWeek.toDateString();
      },
    },
    {
      range: () => {
        const startOfMonth = new Date();
        startOfMonth.setDate(1); // Set to the 1st of the month
        const endOfMonth = new Date(startOfMonth);
        endOfMonth.setMonth(endOfMonth.getMonth() + 1);
        endOfMonth.setDate(0); // Set to the last day of the month
        return { startDate: startOfMonth, endDate: endOfMonth };
      },
      label: "This Month",
      isSelected: (range:any) => {
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        const endOfMonth = new Date(startOfMonth);
        endOfMonth.setMonth(endOfMonth.getMonth() + 1);
        endOfMonth.setDate(0);
        return range.startDate.toDateString() === startOfMonth.toDateString() &&
               range.endDate.toDateString() === endOfMonth.toDateString();
      },
    },
    {
      range: () => {
        const lastMonth = new Date();
        lastMonth.setMonth(lastMonth.getMonth() - 1);
        const startOfLastMonth = new Date(lastMonth.getFullYear(), lastMonth.getMonth(), 1);
        const endOfLastMonth = new Date(lastMonth.getFullYear(), lastMonth.getMonth() + 1, 0);
        return { startDate: startOfLastMonth, endDate: endOfLastMonth };
      },
      label: "Last Month",
      isSelected: (range:any) => {
        const lastMonth = new Date();
        lastMonth.setMonth(lastMonth.getMonth() - 1);
        const startOfLastMonth = new Date(lastMonth.getFullYear(), lastMonth.getMonth(), 1);
        const endOfLastMonth = new Date(lastMonth.getFullYear(), lastMonth.getMonth() + 1, 0);
        return range.startDate.toDateString() === startOfLastMonth.toDateString() &&
               range.endDate.toDateString() === endOfLastMonth.toDateString();
      },
    },
    {
      range: () => {
        const currentYear = new Date().getFullYear();
        const startDate = new Date(currentYear, 0, 1); // January 1st of this year
        const endDate = new Date(currentYear, 11, 31); // December 31st of this year
        return { startDate, endDate };
      },
      isSelected: (range:any) => {
        const currentYear = new Date().getFullYear();
        const startDate = new Date(currentYear, 0, 1);
        const endDate = new Date(currentYear, 11, 31);
        return range.startDate?.getFullYear() === startDate.getFullYear() &&
               range.endDate?.getFullYear() === endDate.getFullYear();
      },
      label: "This Year",
    },
    {
      range: () => {
        const lastYear = new Date().getFullYear() - 1;
        const startDate = new Date(lastYear, 0, 1); // January 1st of last year
        const endDate = new Date(lastYear, 11, 31); // December 31st of last year
        return { startDate, endDate };
      },
      isSelected: (range:any) => {
        const lastYear = new Date().getFullYear() - 1;
        const startDate = new Date(lastYear, 0, 1);
        const endDate = new Date(lastYear, 11, 31);
        return range.startDate?.getFullYear() === startDate.getFullYear() &&
               range.endDate?.getFullYear() === endDate.getFullYear();
      },
      label: "Last Year",
    },  
    
  ];

  const maxDate = new Date(); // Create a new date object
  maxDate.setFullYear(currentDate.getFullYear() + 1); // Set the maximum date to 1 year from the current date

  const displayDate = isDateSelected ? (
    <span className="text-[14px]">
      <span className="text-[#707070]">From:</span> {selectionRange.startDate.toLocaleDateString("en-US")}
      <span className="text-[#707070] pl-3">To:</span> {selectionRange.endDate.toLocaleDateString("en-US")}
    </span>
  ) : (
    "Select date range"
  );

  return (
    <div className="max-w-[550px]" ref={pickerRef}>
      {/* Input Box */}
      <div className="">
        <div
          className="w-[300px] border p-[6px] rounded-md cursor-pointer text-[#707070] bg-white shadow-sm flex justify-between items-center hover:border-gray-400"
          onClick={() => setShowPicker(!showPicker)}
        >
          {displayDate}
          <div className="flex items-center gap-2">
            {isDateSelected && (
              <button
                onClick={handleReset}
                className="p-1 ml-2 hover:bg-gray-100 rounded-full"
              >
                <IconComponent name="close" size={16} />
              </button>
            )}
            <div className="pl-1">
              <IconComponent name="calendar" size={20} />
            </div>
          </div>
        </div>

        {/* Date Picker Dropdown */}
        {showPicker && (
          <div className="absolute mt-2 z-50 bg-white shadow-lg p-4 rounded-md border w-max">
            <DateRangePicker
              ranges={[selectionRange]}
              staticRanges={staticRanges} // All static ranges now include isSelected
              onChange={handleRangeSelect}
              maxDate={maxDate}
              rangeColors={["#31DFD4"]}
            />
            <div className="flex justify-end mt-4">
              <button
                onClick={handleConfirm}
                className="px-4 py-2 bg-[#31DFD4] text-white rounded-md hover:bg-[#31DFD4] text-sm font-medium"
              >
                OK
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Date_Range;