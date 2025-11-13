"use client";

import React, { useState, useEffect } from "react";
import "flowbite";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Icon from "@/components/icon/IconComp";

type SidebarItem = {
  name: string;
  href: string;
  icon: string;
  children?: SidebarItem[];
};

export default function SideBar() {
  const pathname = usePathname();


  const businessHubItems: SidebarItem[] = [
    { name: "Events", href: "/events", icon: "event" },
    { name: "Speakers", href: "/speakers", icon: "speaker" },
    { name: "Consulting Partner", href: "/consulting-partner", icon: "consulting-partner" },
    { name: "Legal & Compliance", href: "/legal-compliance", icon: "partner" },
    { name: "Venue Partners", href: "/venue-partner", icon: "venue" },
    { name: "ProcureTech Solution", href: "/procuretech-solution", icon: "procuretech-solution" },
  ];

  const vipLoungeItems: SidebarItem[] = [
    { name: "Exclusive Partners", href: "/exclusive-partners", icon: "consulting-partner" },
    { name: "Host Round Table", href: "/host-roundtable", icon: "procuretech-solution" },
    { name: "Innovation Vault", href: "/innovation-vault", icon: "procuretech-solution" },
    { name: "Talent Hiring Intelligence", href: "/talent-hiring-intelligence", icon: "speaker" },
  ];

  const talentHiringItems: SidebarItem[] = [
    { name: "Professionals", href: "/talent-hiring-intelligence/professionals", icon: "speaker" },
    { name: "VIP Recruitment Partners", href: "/talent-hiring-intelligence/vip-recruitment", icon: "speaker" },
  ];

  // Add nested children
  const vipLoungeStructure: SidebarItem[] = vipLoungeItems.map((item) =>
    item.name === "Talent Hiring Intelligence"
      ? { ...item, children: talentHiringItems }
      : item
  );

  // State: track which dropdowns are open, using href as key
  const [openDropdowns, setOpenDropdowns] = useState<Record<string, boolean>>({});

  // Open dropdowns if current path is active
  // Inside your useEffect:
  useEffect(() => {
    const newState: Record<string, boolean> = {};

    const checkActive = (item: SidebarItem): boolean => {
      let active = item.href === pathname;
      if (item.children) {
        const childActive = item.children.some(checkActive);
        active = active || childActive;
        newState[item.href] = childActive; // open parent if child is active
      }
      return active;
    };

    // Check Business Hub
    businessHubItems.forEach(checkActive);
    // Check VIP Lounge
    vipLoungeStructure.forEach(checkActive);

    // Optionally open top-level dropdowns if a child is active
    if (businessHubItems.some((i) => i.href === pathname || i.children?.some((c) => c.href === pathname))) {
      newState["business-hub"] = true;
    }
    if (vipLoungeStructure.some((i) => i.href === pathname || i.children?.some((c) => c.href === pathname))) {
      newState["vip-lounge"] = true;
    }

    setOpenDropdowns(newState);
  }, [pathname]);

  const toggleDropdown = (href: string) => {
    setOpenDropdowns((prev) => ({ ...prev, [href]: !prev[href] }));
  };

  const isActive = (item: SidebarItem): boolean => {
    if (item.href === pathname) return true;
    if (item.children) return item.children.some(isActive);
    return false;
  };

const renderDropdown = (items: SidebarItem[]) => (
  <ul className="mt-1 space-y-1 p-2 rounded-lg backdrop-blur-md bg-white/10">
    {items.map((item) => (
      <li key={item.href}>
        {item.children ? (
          <div>
            <button
              onClick={() => toggleDropdown(item.href)}
              className={`flex items-center justify-between w-full p-2 rounded-lg text-white hover:bg-[#b08d57] transition-colors ${
                isActive(item)
                  ? "bg-[#b08d57]"
                  : ""
              }`}
            >
              <div className="flex items-center text-start">
                <Icon name={item.icon} />
                <span className="ms-3">{item.name}</span>
              </div>
              <span className="font-bold text-white">
                {openDropdowns[item.href] ? "−" : "+"}
              </span>
            </button>
            {openDropdowns[item.href] && (
              <ul className="mt-1 space-y-1 pl-4">
                {renderDropdown(item.children)}
              </ul>
            )}
          </div>
        ) : (
          <Link
            href={item.href}
            className={`flex items-center p-2 rounded-lg text-white hover:bg-[#b08d57] transition-colors ${
              pathname === item.href
                ? "bg-[#b08d57] border-1 border-white/50"
                : ""
            }`}
          >
            <Icon name={item.icon} />
            <span className="ms-3">{item.name}</span>
          </Link>
        )}
      </li>
    ))}
  </ul>
);


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
            className={`flex items-center p-2 rounded-lg group transition-colors text-white ${pathname === "/home" ? "bg-[#b08d57]" : "hover:bg-[#b08d57]"
              }`}
          >
            <Icon name="venue" />
            <span className="ms-3">Dashboard</span>
          </Link>
        </li>

        {/* Business Hub */}
        <li>
          <button
            onClick={() => toggleDropdown("business-hub")}
            className={`flex items-center justify-between w-full p-2 rounded-lg text-white hover:bg-[#b08d57] transition-colors ${businessHubItems.some(isActive) ? "bg-[#b08d57]" : ""
              }`}
          >
            <div className="flex items-center">
              <Icon name="venue" />
              <span className="ms-3">Business Hub</span>
            </div>
            <span className="font-bold text-white">
              {openDropdowns["business-hub"] ? "−" : "+"}
            </span>
          </button>
          {openDropdowns["business-hub"] && renderDropdown(businessHubItems)}
        </li>

        {/* VIP Lounge */}
        <li>
          <button
            onClick={() => toggleDropdown("vip-lounge")}
            className={`flex items-center justify-between w-full p-2 rounded-lg text-white hover:bg-[#b08d57] transition-colors ${vipLoungeStructure.some(isActive) ? "bg-[#b08d57]" : ""
              }`}
          >
            <div className="flex items-center">
              <Icon name="venue" />
              <span className="ms-3">VIP Lounge</span>
            </div>
            <span className="font-bold text-white">
              {openDropdowns["vip-lounge"] ? "−" : "+"}
            </span>
          </button>
          {openDropdowns["vip-lounge"] && renderDropdown(vipLoungeStructure)}
        </li>
      </ul>
    </div>
  );
}
