"use client";

import { useState } from "react";

interface ListProps {
    heading: string;
    initialList?: string[];
    onChange?: (lists: string[]) => void;
}

export default function ServicesList({
    heading,
    initialList = [],
    onChange,
}: ListProps) {
    const [lists, setLists] = useState<string[]>(initialList);
    const [newList, setNewList] = useState("");
    // const [isFocused, setIsFocused] = useState(false);
    // const [showError, setShowError] = useState(false);

    const addList = () => {
        if (!newList.trim()) {
            // setShowError(true);
            return;
        }
        const updated = [...lists, newList.trim()];
        setLists(updated);
        onChange?.(updated);
        setNewList("");
        // setShowError(false);
    };

    const removeService = (index: number) => {
        const updated = lists.filter((_, i) => i !== index);
        setLists(updated);
        onChange?.(updated);
    };

    return (
        <div className="space-y-3 bg-white rounded-lg p-2 border border-gray-200">

            {/* Input box */}
            <div
                className={`flex gap-2 items-center rounded-lg w-full border border-gray-200 p-2`}
            >
                <div className="flex-1 border-r border-r-gray-300 pr-2">
                    <label className="text-[#707070] text-sm flex gap-1">
                        {heading}
                    </label>
                    <input
                        type="text"
                        placeholder={`Enter ${heading.toLowerCase()}`}
                        className="w-full text-[12px] outline-none placeholder-[#989898] text-[#707070]
                         bg-white"
                        onChange={(e) => setNewList(e.target.value)}
                        value={newList}
                        // onFocus={() => setIsFocused(true)}
                        // onBlur={() => setIsFocused(false)}
                    />
                </div>

                {/* Button */}
                <button
                    type="button"
                    onClick={addList}
                    className="text-lg cursor-pointer bg-blue-600 text-white px-4 py-1 rounded-md hover:bg-blue-700"
                >
                    +
                </button>
            </div>

            {/* Render added items */}
            {lists.length > 0 && (
                <div className="mt-4 rounded-lg border border-gray-200">
                    {lists.map((service, idx) => (
                        <div
                            key={idx}
                            className="flex items-baseline px-2 py-1"
                        >
                            <span className="h-2 w-2 rounded-full bg-black mr-2"></span>
                            <span className="flex-1 text-[#707070] text-sm">{service}</span>
                            <button
                                type="button"
                                onClick={() => removeService(idx)}
                                className="text-red-500 hover:text-red-700 cursor-pointer"
                            >
                                ✕
                            </button>
                        </div>
                    ))}
                </div>
            )}

        </div>
    );
}
