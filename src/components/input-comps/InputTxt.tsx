import React from "react";

type InputProps = {
  label?: string;
  extraLabel?: string;
  placeholder?: string;
  onChange?: (value: string) => void;
  required?: boolean;
  value?: string;
  disabled?: boolean;
  rows?: number;
  isTextArea?: boolean;
  showError?: boolean;
  type?: string;
  range?: boolean; // Added range prop
};

const InputComponent: React.FC<InputProps> = ({
  label,
  extraLabel = "",
  placeholder,
  onChange,
  value = "",
  required = false,
  disabled = false,
  rows = 1,
  isTextArea = false,
  showError = false,
  type = "text",
  range = false, // Default to false if not provided
}) => {
  const [isFocused, setIsFocused] = React.useState(false);

  // const handleChange = (
  //   event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  // ) => {
  //   if (onChange) {
  //     onChange(event.target.value);
  //   }
  // };

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    let val = event.target.value;

    if (type === "number" && range) {
      // Disallow non-digit characters except empty
      if (val === "") {
        onChange?.(val);
        return;
      }

      // Remove leading zeros
      if (/^0\d+/.test(val)) {
        val = String(Number(val)); // Converts "007" -> "7"
      }

      const numVal = Number(val);

      // Reject non-numeric
      if (isNaN(numVal)) return;

      // Clamp value between 0 and 100
      if (numVal < 0) val = "0";
      else if (numVal > 100) val = "100";
    }

    onChange?.(val);
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  return (
    <div
      className={`flex flex-col bg-white rounded-lg p-2 gap-1 shadow-input w-full
        ${
          showError
            ? "border border-red-500"
            : isFocused
            ? "border border-gray-300 ring-1 ring-gray-300"
            : "border border-transparent"
        }
        transition-colors duration-200`}
    >
      <label className="text-[#707070] text-sm flex gap-1">
        {label}
        {required && <span className="text-red-500 items-start">*</span>}
      </label>
      {isTextArea ? (
        <textarea
          placeholder={placeholder}
          className={`text-[12px] outline-none placeholder-[#989898] text-[#707070] resize-none ${
            disabled ? "cursor-not-allowed" : ""
          }`}
          onChange={handleChange}
          required={required}
          value={value}
          disabled={disabled}
          rows={rows}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
      ) : (
        <div className="flex gap-1 items-center">
          {extraLabel && (
            <span className="text-[12px] text-[#707070] bg-white">
              {extraLabel}
            </span>
          )}
          <input
            type={type}
            placeholder={placeholder}
            className={`w-full text-[12px] outline-none placeholder-[#989898] text-[#707070]
               bg-white ${disabled ? "cursor-not-allowed" : ""}`}
            onChange={handleChange}
            required={required}
            value={value}
            disabled={disabled}
            onFocus={handleFocus}
            onBlur={handleBlur}
            {...(type === "number" ? { min: 0, max: 100 } : {})}
          />
        </div>
      )}
    </div>
  );
};

export default InputComponent;
