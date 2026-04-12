'use client'

import React from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

interface TopbarProps {
  title: string
  universityName: string
  subtitle?: string
}

export function Topbar({ title, universityName, subtitle = 'FY2025 Q2' }: TopbarProps) {
  const router = useRouter()

  return (
    <div className="h-[60px] bg-white border-b border-[#e2e8f0] shadow-[0_1px_3px_rgba(0,0,0,0.06)] flex items-center px-6 gap-3.5 flex-shrink-0 sticky top-0 z-50">
      {/* Title Section */}
      <div className="flex flex-col min-w-0 flex-1">
        <div className="flex items-baseline gap-2.5">
          <h1 className="font-display text-lg font-bold text-[#0f172a]">
            {title}
          </h1>
          <span className="text-[11px] text-[#9ca3af] font-mono whitespace-nowrap">
            {subtitle}
          </span>
        </div>
        <div 
          className="font-display text-[13px] font-bold tracking-wide leading-none"
          style={{ color: 'var(--uni-primary)' }}
        >
          {universityName} — FedSignal Intelligence Platform
        </div>
      </div>

      {/* Search */}
      <div className="flex items-center gap-2 bg-[var(--bg-2)] border border-[var(--border-color)] rounded-md py-1.5 px-3.5 w-[300px]">
        <span className="text-[var(--t3)] text-sm">⌕</span>
        <input
          type="text"
          placeholder="Search opportunities, agencies, primes, grants…"
          className="bg-transparent border-none text-[var(--t1)] text-[13px] outline-none flex-1 w-full placeholder:text-[var(--t3)]"
        />
      </div>

      {/* Alert Dot */}
      <div 
        className="w-2 h-2 rounded-full bg-[var(--red)] shadow-[0_0_8px_var(--red)] animate-[alertPulse_2s_infinite]"
        title="6 unread alerts"
      />

      {/* Action Button */}
      <Button
        variant="primaryUni"
        size="sm"
        onClick={() => router.push('/opportunities')}
      >
        + Track Opportunity
      </Button>
    </div>
  )
}
