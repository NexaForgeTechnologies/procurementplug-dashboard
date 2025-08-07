"use client";

import React from "react";
import "flowbite";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Icon from "@/components/icon/IconComp";

export default function SideBar() {
  const pathname = usePathname();

  const navItems = [
    { name: "Events", href: "/events", icon: "event" },
    { name: "Speakers", href: "/speakers", icon: "speaker" },
    { name: "Consulting Partner", href: "/consulting-partner", icon: "consulting-partner" },
    { name: "Legal & Compliance", href: "/legal-compliance", icon: "consulting-partner" },
  ];

  return (
    <div
      className="h-full px-3 py-4 overflow-y-auto"
      style={{
        background: "linear-gradient(140deg, #85009d, #b08d57)",
        boxShadow: "4px 0 10px rgba(0, 0, 0, 0.5)", // right-side shadow
      }}
    >
      <ul className="space-y-2 font-medium">
        {navItems.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              data-drawer-hide="default-sidebar"
              className={`flex items-center p-2 rounded-lg group transition-colors
                        text-white
                        ${pathname === item.href
                  ? "bg-[#b08d57]"
                  : "hover:bg-[#b08d57]"
                }
                     `}
            >
              <Icon name={item.icon} />
              <span className="ms-3">{item.name}</span>
            </Link>
          </li>
        ))}

        <hr className="text-white mt-8" />
        <li>
          <Link
            href="/auth/login"
            className={`flex items-center p-2 rounded-lg group transition-colors
                        text-white hover:bg-[#b08d57]
                     `}
          >
            <Icon name="signout" />
            <span className="ms-3">Sign Out</span>
          </Link>
        </li>
      </ul>
    </div>
  );
}
