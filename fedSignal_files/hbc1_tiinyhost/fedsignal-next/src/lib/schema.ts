/**
 * Firestore Collection Constants
 */
export const COLLECTIONS = {
  USERS: 'users',
  UNIVERSITIES: 'universities',
  OPPORTUNITIES: 'opportunities',
  CONTACTS: 'contacts',
  CAPABILITIES: 'capabilities',
  CONSORTIUMS: 'consortiums',
  REPORTS: 'reports',
  ALERTS: 'alerts',
  ACTIVITIES: 'activities',
  PROPOSALS: 'proposals',
  RFIS: 'rfis',
  WIN_LOSS: 'winLoss',
  CALENDAR_EVENTS: 'calendarEvents',
} as const

/**
 * User roles
 */
export type UserRole = 'admin' | 'researcher' | 'vp_research' | 'president' | 'bd_manager'

/**
 * User document interface
 */
export interface UserDoc {
  uid: string
  email: string
  displayName: string
  role: UserRole
  universityId: string
  avatar?: string
  createdAt: Date
  updatedAt: Date
  lastLoginAt?: Date
  preferences?: {
    theme: string
    notifications: boolean
  }
}

/**
 * University document interface
 */
export interface UniversityDoc {
  id: string
  name: string
  acronym: string
  slug: string
  state: string
  type: 'hbcu' | 'msi' | 'tribal'
  control: 'public' | 'private'
  level: '4yr' | '2yr'
  enrollment: number
  research: 'R1' | 'R2' | 'R3' | 'none'
  website: string
  colors: {
    primary: string
    secondary: string
  }
  fedFunding: {
    fy25: number
    fy24: number
    fy23: number
  }
  winRate: number
  capabilities: string[]
  createdAt: Date
  updatedAt: Date
}

/**
 * Opportunity types
 */
export type OpportunityType = 'grant' | 'contract' | 'cooperative' | 'rfi' | 'sbir'
export type OpportunityStatus = 'open' | 'closed' | 'pending' | 'awarded'

/**
 * Opportunity document interface
 */
export interface OpportunityDoc {
  id: string
  title: string
  agency: string
  solicitationNumber: string
  type: OpportunityType
  status: OpportunityStatus
  description: string
  amount: {
    min?: number
    max: number
    type: 'ceiling' | 'total' | 'per_award'
  }
  deadline: Date
  matchScore: number
  tags: string[]
  sourceUrl: string
  isHbcuSetAside: boolean
  hbcuPreferred: boolean
  domains: string[]
  createdAt: Date
  updatedAt: Date
  trackedBy: string[] // university IDs
}

/**
 * Contact types
 */
export type ContactType = 'prime' | 'agency' | 'hbcu' | 'small_business'

/**
 * Contact document interface
 */
export interface ContactDoc {
  id: string
  name: string
  title: string
  organization: string
  type: ContactType
  email?: string
  phone?: string
  linkedin?: string
  notes: {
    text: string
    createdAt: Date
    createdBy: string
  }[]
  lastContactedAt?: Date
  universityId: string
  createdAt: Date
  updatedAt: Date
}

/**
 * Capability document interface
 */
export interface CapabilityDoc {
  id: string
  name: string
  description: string
  department: string
  tags: string[]
  documents: {
    name: string
    url: string
    uploadedAt: Date
  }[]
  universityId: string
  createdAt: Date
  updatedAt: Date
}

/**
 * Consortium document interface
 */
export interface ConsortiumDoc {
  id: string
  name: string
  description: string
  leadUniversityId: string
  memberUniversityIds: string[]
  targetOpportunityId?: string
  status: 'forming' | 'active' | 'completed'
  proposalDueDate?: Date
  createdAt: Date
  updatedAt: Date
}

/**
 * Alert priority
 */
export type AlertPriority = 'high' | 'medium' | 'low'

/**
 * Alert document interface
 */
export interface AlertDoc {
  id: string
  title: string
  description: string
  priority: AlertPriority
  type: 'deadline' | 'opportunity' | 'intelligence' | 'partnership'
  actionUrl?: string
  actionText?: string
  readBy: string[] // user IDs
  universityId: string
  createdAt: Date
  expiresAt?: Date
}

/**
 * Win/Loss record interface
 */
export interface WinLossDoc {
  id: string
  opportunityId: string
  opportunityTitle: string
  agency: string
  amount: number
  result: 'won' | 'lost' | 'pending' | 'no_submit'
  score?: number
  debrief?: string
  lessonsLearned?: string
  universityId: string
  submittedAt?: Date
  decidedAt?: Date
  createdAt: Date
  updatedAt: Date
}

/**
 * Calendar event interface
 */
export interface CalendarEventDoc {
  id: string
  title: string
  description?: string
  type: 'linkedin' | 'blog' | 'email' | 'twitter' | 'proposal' | 'rfi'
  date: Date
  channel?: string
  status: 'draft' | 'scheduled' | 'published'
  universityId: string
  createdAt: Date
  updatedAt: Date
}
