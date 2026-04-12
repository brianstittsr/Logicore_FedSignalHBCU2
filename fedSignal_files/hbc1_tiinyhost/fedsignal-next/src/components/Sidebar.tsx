'use client'

import React from 'react'
import { cn } from '@/lib/utils'
import { usePathname, useRouter } from 'next/navigation'

interface NavItem {
  id: string
  label: string
  icon: string
  badge?: string
  badgeColor?: 'red' | 'amber' | 'default'
  href: string
}

interface NavSection {
  label: string
  items: NavItem[]
}

const navSections: NavSection[] = [
  {
    label: 'Intelligence',
    items: [
      { id: 'dashboard', label: 'Command Center', icon: '⬡', href: '/' },
      { id: 'opportunities', label: 'Opportunity Feed', icon: '📡', badge: '47', href: '/opportunities' },
      { id: 'radar', label: 'FedSignal', icon: '📊', href: '/radar' },
      { id: 'alerts', label: 'Strategic Alerts', icon: '🔔', badge: '6', badgeColor: 'red', href: '/alerts' },
    ],
  },
  {
    label: 'University',
    items: [
      { id: 'capabilities', label: 'Capability Graph', icon: '🔬', href: '/capabilities' },
      { id: 'leadership', label: 'Leadership', icon: '👤', href: '/leadership' },
      { id: 'scoreboard', label: 'HBCU Scoreboard', icon: '🏆', href: '/scoreboard' },
    ],
  },
  {
    label: 'Partnerships',
    items: [
      { id: 'directory', label: 'HBCU Network', icon: '🎓', badge: '101', href: '/directory' },
      { id: 'marketplace', label: 'Contractor Market', icon: '🤝', href: '/marketplace' },
      { id: 'consortium', label: 'Consortiums', icon: '⬡', badge: '3', badgeColor: 'amber', href: '/consortium' },
    ],
  },
  {
    label: 'Win Tools',
    items: [
      { id: 'proposalpal', label: 'Proposal Pal', icon: '🏆', badge: 'AI', href: '/proposalpal' },
      { id: 'rficreator', label: 'RFI Creator', icon: '📝', badge: 'AI', href: '/rficreator' },
    ],
  },
  {
    label: 'Content & Growth',
    items: [
      { id: 'capvault', label: 'Capability Vault', icon: '🗂️', href: '/capvault' },
      { id: 'contentstudio', label: 'Content Studio', icon: '✨', badge: 'AI', href: '/contentstudio' },
      { id: 'calendar', label: 'Content Calendar', icon: '📅', href: '/calendar' },
    ],
  },
  {
    label: 'BD & CRM',
    items: [
      { id: 'crm', label: 'CRM & Contacts', icon: '👥', badge: 'PRO', badgeColor: 'amber', href: '/crm' },
      { id: 'winloss', label: 'Win/Loss Tracker', icon: '📊', href: '/winloss' },
      { id: 'subplan', label: 'Sub Plan Finder', icon: '🔍', href: '/subplan' },
      { id: 'teaming', label: 'Teaming Generator', icon: '🤝', href: '/teaming' },
    ],
  },
  {
    label: 'Research Tools',
    items: [
      { id: 'sbir', label: 'SBIR/STTR Match', icon: '🚀', href: '/sbir' },
      { id: 'fanda', label: 'F&A Calculator', icon: '🧮', href: '/fanda' },
    ],
  },
  {
    label: 'Publish',
    items: [
      { id: 'newsletter', label: 'Newsletter Builder', icon: '📨', badge: 'PRO', badgeColor: 'amber', href: '/newsletter' },
      { id: 'gammadeck', label: 'Gamma Deck', icon: '🎯', badge: 'AI', href: '/gammadeck' },
    ],
  },
  {
    label: 'Reports',
    items: [
      { id: 'grants', label: 'Grant Tracker', icon: '📋', href: '/grants' },
      { id: 'board', label: 'Board Report', icon: '📑', href: '/board' },
      { id: 'reporthub', label: 'Report Hub', icon: '📁', href: '/reporthub' },
    ],
  },
  {
    label: 'Intelligence',
    items: [
      { id: 'nationallabs', label: 'National Labs', icon: '⚛️', badge: '17 Labs', href: '/nationallabs' },
      { id: 'hbcudir', label: 'HBCU/MSI Directory', icon: '🏛️', href: '/hbcudir' },
    ],
  },
  {
    label: 'Executive',
    items: [
      { id: 'presbrief', label: "President's Brief", icon: '⭐', badge: '$4,800/yr', href: '/presbrief' },
      { id: 'pricing', label: 'Plans & Pricing', icon: '💳', href: '/pricing' },
    ],
  },
]

const universities = [
  { value: 'tuskegee', label: 'Tuskegee University' },
  { value: 'howard', label: 'Howard University' },
  { value: 'famu', label: 'Florida A&M University' },
  { value: 'aamu', label: 'Alabama A&M University' },
  { value: 'ncat', label: 'NC A&T State University' },
  { value: 'morehouse', label: 'Morehouse College' },
]

interface SidebarProps {
  universityId?: string
  onUniversityChange?: (id: string) => void
}

export function Sidebar({ universityId = 'tuskegee', onUniversityChange }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()

  const handleNav = (href: string) => {
    router.push(href)
  }

  const isActive = (href: string) => {
    if (href === '/' && pathname === '/') return true
    if (href !== '/' && pathname.startsWith(href)) return true
    return false
  }

  return (
    <nav className="sidebar-nav w-[230px] flex-shrink-0 flex flex-col h-screen overflow-y-auto overflow-x-hidden text-white">
      {/* Logo */}
      <div className="p-4 border-b border-white/10 flex items-center gap-2.5">
        <div 
          className="w-9 h-9 rounded-md flex items-center justify-center font-display text-sm font-extrabold text-white"
          style={{ backgroundColor: '#1a56db' }}
        >
          FS
        </div>
        <div className="font-display text-lg font-extrabold tracking-tight">
          Fed<span className="text-[#4d94ff]">Signal</span>
        </div>
      </div>

      {/* University Selector */}
      <div className="p-3 border-b border-white/10">
        <div className="text-[10px] font-bold tracking-[0.12em] uppercase text-white/40 mb-1.5">
          Institution
        </div>
        <select
          value={universityId}
          onChange={(e) => onUniversityChange?.(e.target.value)}
          className="w-full bg-white/[0.08] border border-white/[0.12] text-white text-xs py-2 px-2.5 rounded outline-none focus:border-[#4d94ff] cursor-pointer"
        >
          {universities.map((u) => (
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
              <button
                key={item.id}
                onClick={() => handleNav(item.href)}
                className={cn(
                  'w-full flex items-center gap-2.5 px-4 py-2 text-[13px] text-white/70 border-l-[3px] transition-all duration-150 cursor-pointer',
                  isActive(item.href)
                    ? 'bg-[rgba(26,86,219,0.25)] text-white border-l-[#4d94ff] font-semibold'
                    : 'border-l-transparent hover:bg-white/[0.07] hover:text-white hover:border-l-[rgba(77,148,255,0.5)]'
                )}
              >
                <span className="text-[15px] w-4 text-center flex-shrink-0">{item.icon}</span>
                <span className="flex-1 text-left truncate">{item.label}</span>
                {item.badge && (
                  <span
                    className={cn(
                      'px-1.5 py-0.5 rounded-full text-[10px] font-semibold whitespace-nowrap',
                      item.badgeColor === 'red' && 'bg-red-600/75 text-white',
                      item.badgeColor === 'amber' && 'bg-amber-600/75 text-white',
                      !item.badgeColor && 'bg-white/20 text-white'
                    )}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            ))}
          </div>
        ))}
      </div>

      {/* User Chip */}
      <div className="p-3 border-t border-white/10">
        <div className="flex items-center gap-2.5 p-2.5 bg-white/[0.12] border border-white/20 rounded cursor-pointer hover:bg-white/[0.18] transition-colors">
          <div className="w-8 h-8 rounded-full bg-white/25 flex items-center justify-center text-[11px] font-bold text-white flex-shrink-0">
            DR
          </div>
          <div className="min-w-0">
            <div className="text-[13px] font-semibold text-white truncate">Dr. Research</div>
            <div className="text-[10px] text-white/60 uppercase tracking-[0.08em]">Research Admin</div>
          </div>
        </div>
      </div>
    </nav>
  )
}
