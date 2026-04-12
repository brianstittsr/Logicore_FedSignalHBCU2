"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

interface FSTopbarProps {
  title: string;
  universityName: string;
  subtitle?: string;
}

export function FSTopbar({ title, universityName, subtitle = "FY2025 Q2" }: FSTopbarProps) {
  return (
    <div className="h-[60px] bg-white border-b border-[#e2e8f0] shadow-[0_1px_3px_rgba(0,0,0,0.06)] flex items-center px-6 gap-3.5 flex-shrink-0 sticky top-0 z-50">
      {/* Title Section */}
      <div className="flex flex-col min-w-0 flex-1">
        <div className="flex items-baseline gap-2.5">
          <h1 className="text-lg font-bold text-[#0f172a]">
            {title}
          </h1>
          <span className="text-[11px] text-[#9ca3af] font-mono whitespace-nowrap">
            {subtitle}
          </span>
        </div>
        <div
          className="text-[13px] font-bold tracking-wide leading-none text-[#1a56db]"
        >
          {universityName} — FedSignal Intelligence Platform
        </div>
      </div>

      {/* Search */}
      <div className="flex items-center gap-2 bg-[#f8f9fc] border border-[#dde1e9] rounded-md py-1.5 px-3.5 w-[300px]">
        <span className="text-[#9ca3af] text-sm">⌕</span>
        <input
          type="text"
          placeholder="Search opportunities, agencies, grants…"
          className="bg-transparent border-none text-[#111827] text-[13px] outline-none flex-1 w-full placeholder:text-[#9ca3af]"
        />
      </div>

      {/* Alert Dot */}
      <div
        className="w-2 h-2 rounded-full bg-[#991b1b] shadow-[0_0_8px_#991b1b] animate-pulse"
        title="6 unread alerts"
      />

      {/* Action Button */}
      <Button size="sm" asChild>
        <Link href="/fedsignal/opportunities">
          + Track Opportunity
        </Link>
      </Button>
    </div>
  );
}
