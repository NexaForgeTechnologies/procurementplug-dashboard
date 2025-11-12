"use client";

import React, { useState, useEffect } from "react";
import "flowbite";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Icon from "@/components/icon/IconComp";

export default function SideBar() {
  const pathname = usePathname();

  const businessHubItems = [
    { name: "Events", href: "/events", icon: "event" },
    { name: "Speakers", href: "/speakers", icon: "speaker" },
    { name: "Consulting Partner", href: "/consulting-partner", icon: "consulting-partner" },
    { name: "Legal & Compliance", href: "/legal-compliance", icon: "partner" },
    { name: "Venue Partners", href: "/venue-partner", icon: "venue" },
    { name: "ProcureTech Solution", href: "/procuretech-solution", icon: "procuretech-solution" },
  ];

  const vipLoungeItems = [
    { name: "Exclusive Partners", href: "/exclusive-partners", icon: "consulting-partner" },
    { name: "Innovation Vault", href: "/innovation-vault", icon: "procuretech-solution" },
    { name: "Host Round Table", href: "/host-roundtable", icon: "procuretech-solution" },
  ];

  const [openBusinessHub, setOpenBusinessHub] = useState(false);
  const [openVipLounge, setOpenVipLounge] = useState(false);

  // Detect if current pathname belongs to one of the dropdowns
  const isBusinessHubActive = businessHubItems.some((item) => item.href === pathname);
  const isVipLoungeActive = vipLoungeItems.some((item) => item.href === pathname);

  // Auto-open dropdown when visiting one of its child pages
  useEffect(() => {
    if (isBusinessHubActive) setOpenBusinessHub(true);
    if (isVipLoungeActive) setOpenVipLounge(true);
  }, [isBusinessHubActive, isVipLoungeActive]);

  return (
    <div
      className="h-full px-3 py-4 overflow-y-auto"
      style={{
        background: "linear-gradient(140deg, #85009d, #b08d57)",
        boxShadow: "4px 0 10px rgba(0, 0, 0, 0.5)",
      }}
    >
      <ul className="space-y-2 font-medium">
        {/* Dashboard */}
        <li>
          <Link
            href="/home"
            data-drawer-hide="default-sidebar"
            className={`flex items-center p-2 rounded-lg group transition-colors text-white ${
              pathname === "/home" ? "bg-[#b08d57]" : "hover:bg-[#b08d57]"
            }`}
          >
            <Icon name="venue" />
            <span className="ms-3">Dashboard</span>
          </Link>
        </li>

        {/* Business Hub Dropdown */}
        <li>
          <button
            onClick={() => setOpenBusinessHub(!openBusinessHub)}
            className="flex items-center justify-between w-full p-2 rounded-lg text-white hover:bg-[#b08d57] transition-colors"
          >
            <div className="flex items-center">
              <Icon name="venue" />
              <span className="ms-3">Business Hub</span>
            </div>
            {/* Plus/Minus indicator */}
            <span className="font-bold text-white">
              {openBusinessHub ? "−" : "+"}
            </span>
          </button>

          {openBusinessHub && (
            <ul
              className="mt-1 space-y-1 p-2 rounded-lg backdrop-blur-md bg-white/20"
              style={{ transition: "all 0.3s ease" }}
            >
              {businessHubItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`flex items-center p-2 rounded-lg text-white hover:bg-[#b08d57] transition-colors ${
                      pathname === item.href ? "bg-[#b08d57]" : ""
                    }`}
                  >
                    <Icon name={item.icon} />
                    <span className="ms-3">{item.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </li>

        {/* VIP Lounge Dropdown */}
        <li>
          <button
            onClick={() => setOpenVipLounge(!openVipLounge)}
            className="flex items-center justify-between w-full p-2 rounded-lg text-white hover:bg-[#b08d57] transition-colors"
          >
            <div className="flex items-center">
              <Icon name="venue" />
              <span className="ms-3">VIP Lounge</span>
            </div>
            {/* Plus/Minus indicator */}
            <span className="font-bold text-white">
              {openVipLounge ? "−" : "+"}
            </span>
          </button>

          {openVipLounge && (
            <ul
              className="mt-1 space-y-1 p-2 rounded-lg backdrop-blur-md bg-white/20"
              style={{ transition: "all 0.3s ease" }}
            >
              {vipLoungeItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`flex items-center p-2 rounded-lg text-white hover:bg-[#b08d57] transition-colors ${
                      pathname === item.href ? "bg-[#b08d57]" : ""
                    }`}
                  >
                    <Icon name={item.icon} />
                    <span className="ms-3">{item.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </li>
      </ul>
    </div>
  );
}
