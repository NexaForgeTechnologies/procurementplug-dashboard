"use client";

import Link from "next/link";
import { useMemo, useState, useRef, useEffect } from "react";

import { useRoundTables } from "@/hooks/UseRoundTable";
import { useInsightPosts } from "@/hooks/UseInsightPost";

export default function TopBar() {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  // --- Fetch Data ---
  const { data: roundTables } = useRoundTables();
  const { data: insightPosts } = useInsightPosts();

  // -------------------------------------------------
  // PENDING LOGIC (Different rules per type)
  // -------------------------------------------------

  // 🔵 Round Table:
  // is_approved === 0 AND status === "pending" → NOT REVIEWED
  const pendingTables = useMemo(() => {
    if (!roundTables) return [];
    return roundTables.filter(
      (table) =>
        table.is_approved === 0 &&
        table.status?.toLowerCase().trim() === "pending"
    );
  }, [roundTables]);

  // 🟢 Insight Post:
  // is_approved === null → NOT REVIEWED
  const pendingInsights = useMemo(() => {
    if (!insightPosts) return [];
    return insightPosts.filter(
      (post) => post.is_approved === null
    );
  }, [insightPosts]);

  // -------------------------------------------------
  // MERGE FOR NOTIFICATIONS
  // -------------------------------------------------
  const pendingItems = useMemo(() => {
    return [
      ...pendingTables.map((t) => ({
        type: "roundtable" as const,
        id: t.id,
        title: t.title || `Round Table #${t.id}`,
        description: t.description,
        href: "/host-roundtable",
      })),
      ...pendingInsights.map((p) => ({
        type: "insight" as const,
        id: p.id,
        title: p.heading || `Insight Post #${p.id}`,
        description: p.description,
        href: "/insights-post",
      })),
    ];
  }, [pendingTables, pendingInsights]);

  const pendingCount = pendingItems.length;

  // -------------------------------------------------
  // CLOSE DROPDOWN ON OUTSIDE CLICK
  // -------------------------------------------------
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
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // -------------------------------------------------
  // UI
  // -------------------------------------------------
  return (
    <section className="border-2 border-dashed flex justify-between sm:items-center p-4 gap-3 mb-4 rounded relative">
      {/* Logo */}
      <div className="flex items-center justify-center">
        <img
          src="/images/logo.png"
          alt="Logo"
          className="h-9 sm:h-10 md:h-12 w-auto"
        />
      </div>

      {/* Right Side */}
      <div className="flex gap-2 sm:gap-3 items-center justify-end">
        {/* Logout */}
        <Link href="/auth/login">
          <span className="flex items-center justify-center shrink-0 w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-[#B08D57] bg-[#B08D574D]">
            <img src="/images/signOut.png" alt="Sign Out" />
          </span>
        </Link>

        {/* Notifications */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setShowDropdown((prev) => !prev)}
            className="cursor-pointer relative flex items-center justify-center shrink-0 w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-[#B08D57] bg-[#B08D574D]"
          >
            <img
              src="/images/notification.png"
              alt="Notifications"
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
                  Pending Reviews
                </h4>
              </div>

              <div className="max-h-60 overflow-y-auto">
                {pendingItems.length > 0 ? (
                  pendingItems.slice(0, 4).map((item) => (
                    <Link
                      key={`${item.type}-${item.id}`}
                      href={item.href}
                      onClick={() => setShowDropdown(false)}
                      className="block px-4 py-2 hover:bg-gray-50 transition-colors"
                    >
                      <p className="text-sm font-medium text-gray-800 line-clamp-1">
                        {item.title}
                      </p>

                      <p className="text-xs text-gray-500 line-clamp-1">
                        {item.description || "No description available."}
                      </p>

                      <span className="inline-block mt-1 text-[10px] px-2 py-[2px] rounded-full bg-gray-100 text-gray-600">
                        {item.type === "roundtable"
                          ? "Round Table"
                          : "Insight Post"}
                      </span>
                    </Link>
                  ))
                ) : (
                  <p className="text-center text-gray-500 text-sm py-4">
                    No pending tasks.
                  </p>
                )}
              </div>

              {pendingItems.length > 4 && (
                <div className="border-t border-gray-100 p-2 text-center">
                  <Link
                    href="/dashboard/pending"
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
