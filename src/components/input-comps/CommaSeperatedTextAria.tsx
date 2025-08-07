import React from "react";

type CommaInputProps = {
  label?: string;
  placeholder?: string;
  onChange?: (value: string) => void; // Now returns a string
  value?: string; // Accepts a plain string
  required?: boolean;
  disabled?: boolean;
  rows?: number;
  showError?: boolean;
};

const CommaInputTextArea: React.FC<CommaInputProps> = ({
  label,
  placeholder,
  onChange,
  value = "",
  required = false,
  disabled = false,
  rows = 3,
  showError = false,
}) => {
  const [isFocused, setIsFocused] = React.useState(false);
  const [rawInput, setRawInput] = React.useState(value);

  // Sync internal input with external value (if updated externally)
  React.useEffect(() => {
    setRawInput(value);
  }, [value]);

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const inputValue = event.target.value;
    setRawInput(inputValue);
    onChange?.(inputValue); // Send raw string to parent
  };

  return (
    <div
      className={`flex flex-col bg-white rounded-lg p-2 gap-1 shadow-input w-full
        ${showError
          ? "border border-red-500"
          : isFocused
            ? "border border-gray-300 ring-1 ring-gray-300"
            : "border border-transparent"
        }
        transition-colors duration-200`}
    >
      {label && (
        <label className="text-[#707070] text-sm">
          {label}
          {required && <span className="text-red-500">*</span>}
        </label>
      )}

      <textarea
        placeholder={placeholder}
        className={`text-[12px] outline-none placeholder-[#989898] text-[#707070] resize-none ${disabled ? "cursor-not-allowed bg-gray-100" : ""
          }`}
        onChange={handleChange}
        value={rawInput}
        required={required}
        disabled={disabled}
        rows={rows}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
    </div>
  );
};

export default CommaInputTextArea;
