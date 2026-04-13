"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { universityList } from "@/lib/fedsignal/utils";

interface NavItem {
  id: string;
  label: string;
  icon: string;
  badge?: string;
  badgeColor?: "red" | "amber" | "default";
  href: string;
}

interface NavSection {
  label: string;
  items: NavItem[];
}

const navSections: NavSection[] = [
  {
    label: "Intelligence",
    items: [
      { id: "dashboard", label: "Command Center", icon: "⬡", href: "/fedsignal" },
      { id: "opportunities", label: "Opportunity Feed", icon: "📡", badge: "47", href: "/fedsignal/opportunities" },
      { id: "radar", label: "FedSignal Radar", icon: "📊", href: "/fedsignal/radar" },
      { id: "alerts", label: "Strategic Alerts", icon: "🔔", badge: "6", badgeColor: "red", href: "/fedsignal/alerts" },
    ],
  },
  {
    label: "University",
    items: [
      { id: "capabilities", label: "Capability Graph", icon: "🔬", href: "/fedsignal/capabilities" },
      { id: "leadership", label: "Leadership", icon: "👤", href: "/fedsignal/leadership" },
      { id: "scoreboard", label: "HBCU Scoreboard", icon: "🏆", href: "/fedsignal/scoreboard" },
    ],
  },
  {
    label: "Partnerships",
    items: [
      { id: "directory", label: "HBCU Network", icon: "🎓", badge: "101", href: "/fedsignal/directory" },
      { id: "marketplace", label: "Contractor Market", icon: "🤝", href: "/fedsignal/marketplace" },
      { id: "consortium", label: "Consortiums", icon: "⬡", badge: "3", badgeColor: "amber", href: "/fedsignal/consortium" },
    ],
  },
  {
    label: "Win Tools",
    items: [
      { id: "proposalpal", label: "Proposal Pal", icon: "🏆", badge: "AI", href: "/fedsignal/proposalpal" },
      { id: "rficreator", label: "RFI Creator", icon: "📝", badge: "AI", href: "/fedsignal/rficreator" },
    ],
  },
  {
    label: "Content & Growth",
    items: [
      { id: "capvault", label: "Capability Vault", icon: "🗂️", href: "/fedsignal/capvault" },
      { id: "contentstudio", label: "Content Studio", icon: "✨", badge: "AI", href: "/fedsignal/contentstudio" },
      { id: "calendar", label: "Content Calendar", icon: "📅", href: "/fedsignal/calendar" },
    ],
  },
  {
    label: "BD & CRM",
    items: [
      { id: "crm", label: "CRM & Contacts", icon: "👥", badge: "PRO", badgeColor: "amber", href: "/fedsignal/crm" },
      { id: "winloss", label: "Win/Loss Tracker", icon: "📊", href: "/fedsignal/winloss" },
    ],
  },
  {
    label: "Reports",
    items: [
      { id: "grants", label: "Grant Tracker", icon: "📋", href: "/fedsignal/grants" },
      { id: "board", label: "Board Report", icon: "📑", href: "/fedsignal/board" },
    ],
  },
];

interface FSSidebarProps {
  universityId?: string;
  onUniversityChange?: (id: string) => void;
}

export function FSSidebar({ universityId = "tuskegee", onUniversityChange }: FSSidebarProps) {
  const pathname = usePathname();
  const [selectedUni, setSelectedUni] = useState(universityId);

  const handleUniChange = (value: string) => {
    setSelectedUni(value);
    onUniversityChange?.(value);
  };

  const isActive = (href: string) => {
    if (href === "/fedsignal" && pathname === "/fedsignal") return true;
    if (href !== "/fedsignal" && pathname.startsWith(href)) return true;
    return false;
  };

  return (
    <nav className="w-[230px] flex-shrink-0 flex flex-col h-screen overflow-y-auto overflow-x-hidden bg-[#0f2a4a] text-white">
      {/* Logo */}
      <div className="p-4 border-b border-white/10 flex items-center gap-2.5">
        <div className="w-9 h-9 rounded-md flex items-center justify-center text-sm font-extrabold text-white bg-[#1a56db]">
          FS
        </div>
        <div className="text-lg font-extrabold tracking-tight">
          Fed<span className="text-[#4d94ff]">Signal</span>
        </div>
      </div>

      {/* University Selector */}
      <div className="p-3 border-b border-white/10">
        <div className="text-[10px] font-bold tracking-[0.12em] uppercase text-white/40 mb-1.5">
          Institution
        </div>
        <select
          value={selectedUni}
          onChange={(e) => handleUniChange(e.target.value)}
          className="w-full bg-white/[0.08] border border-white/[0.12] text-white text-xs py-2 px-2.5 rounded outline-none focus:border-[#4d94ff] cursor-pointer"
        >
          {universityList.map((u) => (
            <option key={u.value} value={u.value} className="bg-[#0f2a4a] text-white">
              {u.label}
            </option>
          ))}
        </select>
      </div>

      {/* Navigation Sections */}
      <div className="flex-1 py-2">
        {navSections.map((section) => (
          <div key={section.label} className="py-1">
            <div className="px-4 py-1.5 text-[9px] font-bold tracking-[0.15em] uppercase text-white/35">
              {section.label}
            </div>
            {section.items.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                className={cn(
                  "w-full flex items-center gap-2.5 px-4 py-2 text-[13px] text-white/70 border-l-[3px] transition-all duration-150",
                  isActive(item.href)
                    ? "bg-[rgba(26,86,219,0.25)] text-white border-l-[#4d94ff] font-semibold"
                    : "border-l-transparent hover:bg-white/[0.07] hover:text-white hover:border-l-[rgba(77,148,255,0.5)]"
                )}
              >
                <span className="text-[15px] w-4 text-center flex-shrink-0">{item.icon}</span>
                <span className="flex-1 text-left truncate">{item.label}</span>
                {item.badge && (
                  <span
                    className={cn(
                      "px-1.5 py-0.5 rounded-full text-[10px] font-semibold whitespace-nowrap",
                      item.badgeColor === "red" && "bg-red-600/75 text-white",
                      item.badgeColor === "amber" && "bg-amber-600/75 text-white",
                      !item.badgeColor && "bg-white/20 text-white"
                    )}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            ))}
          </div>
        ))}
      </div>

      {/* Back to main site */}
      <div className="p-3 border-t border-white/10">
        <Link
          href="/"
          className="flex items-center gap-2.5 p-2.5 bg-white/[0.08] border border-white/15 rounded text-xs text-white/70 hover:bg-white/[0.15] hover:text-white transition-colors"
        >
          ← Back to LogiCore HSV
        </Link>
      </div>
    </nav>
  );
}
