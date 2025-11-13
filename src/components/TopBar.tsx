"use client";
import Link from "next/link";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState, useRef, useEffect } from "react";

// Type definition
type RoundTableDM = {
  id: number;
  name?: string;
  title?: string;
  description?: string;
  status: string;
  createdAt?: string;
};

export default function TopBar() {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  // --- Fetch round tables dynamically ---
  const fetchRoundTable = async (): Promise<RoundTableDM[]> => {
    const response = await axios.get<RoundTableDM[]>("/api/round-table");
    return response.data;
  };

  const { data: roundTables } = useQuery<RoundTableDM[]>({
    queryKey: ["round-tables"],
    queryFn: fetchRoundTable,
    refetchInterval: 10000, // refresh every 10s
  });

  // --- Filter only pending ones ---
  const pendingTables = useMemo(() => {
    if (!roundTables) return [];
    return roundTables.filter(
      (table) =>
        table.status?.toLowerCase() ===
        "payment done, but pending from admin"
    );
  }, [roundTables]);

  const pendingCount = pendingTables.length;

  // --- Close dropdown when clicked outside ---
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <section className="border-2 border-dashed flex justify-between sm:items-center p-4 gap-3 mb-4 rounded relative">
      {/* Left side: Logo */}
      <div className="flex items-center justify-center">
        <img
          src="/images/logo.png"
          alt="Logo"
          className="h-9 sm:h-10 md:h-12 w-auto"
        />
      </div>

      {/* Right side: Icons */}
      <div className="flex gap-2 sm:gap-3 items-center justify-end">
        {/* Login / Signout */}
        <Link href="/auth/login" className="cursor-pointer">
          <span className="flex items-center justify-center shrink-0 w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-[#B08D57] bg-[#B08D574D]">
            <img
              src="/images/signOut.png"
              alt="Sign Out"
              className="object-contain"
            />
          </span>
        </Link>

        {/* Notification Icon with dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setShowDropdown((prev) => !prev)}
            className="cursor-pointer relative flex items-center justify-center shrink-0 w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-[#B08D57] bg-[#B08D574D]"
          >
            <img
              src="/images/notification.png"
              alt="Notifications"
              className="object-contain"
            />
            {pendingCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] sm:text-xs font-semibold rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center">
                {pendingCount}
              </span>
            )}
          </button>

          {/* Dropdown */}
          {showDropdown && (
            <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-white shadow-xl rounded-xl border border-gray-200 overflow-hidden z-50">
              <div className="p-3 border-b border-gray-100">
                <h4 className="text-sm font-semibold text-gray-700">
                  Pending Round Tables
                </h4>
              </div>

              {/* Rows */}
              <div className="max-h-60 overflow-y-auto">
                {pendingTables.length > 0 ? (
                  pendingTables.slice(0, 4).map((table) => (
                    <Link
                      onClick={() => setShowDropdown(false)}
                      href="/host-roundtable"
                      key={table.id}
                      className="block px-4 py-2 hover:bg-gray-50 transition-colors"
                    >
                      <p className="text-sm font-medium text-gray-800 line-clamp-1">
                        {table.title || `Round Table #${table.id}`}
                      </p>
                      <p className="text-xs text-gray-500 line-clamp-1">
                        {table.description || "No description available."}
                      </p>
                    </Link>
                  ))
                ) : (
                  <p className="text-center text-gray-500 text-sm py-4">
                    No pending tables.
                  </p>
                )}
              </div>

              {/* Footer */}
              {pendingTables.length > 4 && (
                <div className="border-t border-gray-100 p-2 text-center">
                  <Link
                    href="/host-roundtable"
                    onClick={() => setShowDropdown(false)}
                    className="text-sm font-medium text-[#B08D57] hover:underline"
                  >
                    View All
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
