/**
 * FedSignal — Government Funding Intelligence for HBCUs
 * 
 * Firebase/Firestore type definitions and collection constants
 * for the FedSignal platform integrated into LogiCore HSV.
 */

import { Timestamp } from "firebase/firestore";

// ============================================================================
// Collection Constants
// ============================================================================

export const FS_COLLECTIONS = {
  UNIVERSITIES: "fs_universities",
  OPPORTUNITIES: "fs_opportunities",
  CONTACTS: "fs_contacts",
  CAPABILITIES: "fs_capabilities",
  CONSORTIUMS: "fs_consortiums",
  ALERTS: "fs_alerts",
  PROPOSALS: "fs_proposals",
  WIN_LOSS: "fs_winLoss",
  CALENDAR_EVENTS: "fs_calendarEvents",
  ACTIVITIES: "fs_activities",
  REPORTS: "fs_reports",
  SETTINGS: "fs_settings",
} as const;

// ============================================================================
// Enums & Union Types
// ============================================================================

export type FSUserRole = "admin" | "researcher" | "vp_research" | "president" | "bd_manager";

export type UniversityType = "hbcu" | "msi" | "tribal";
export type UniversityControl = "public" | "private";
export type UniversityLevel = "4yr" | "2yr";
export type ResearchClassification = "R1" | "R2" | "R3" | "none";

export type OpportunityType = "grant" | "contract" | "cooperative" | "rfi" | "sbir";
export type OpportunityStatus = "open" | "closed" | "pending" | "awarded";
export type AmountType = "ceiling" | "total" | "per_award";

export type ContactType = "prime" | "agency" | "hbcu" | "small_business";

export type ConsortiumStatus = "forming" | "active" | "completed";

export type AlertPriority = "high" | "medium" | "low";
export type AlertType = "deadline" | "opportunity" | "intelligence" | "partnership";

export type WinLossResult = "won" | "lost" | "pending" | "no_submit";

export type CalendarEventType = "linkedin" | "blog" | "email" | "twitter" | "proposal" | "rfi";
export type CalendarEventStatus = "draft" | "scheduled" | "published";

export type TagVariant = "hbcu" | "cyber" | "contract" | "grant" | "ai" | "defense" | "stem";

// ============================================================================
// Document Interfaces
// ============================================================================

/** University / HBCU Institution */
export interface FSUniversityDoc {
  id: string;
  name: string;
  acronym: string;
  slug: string;
  state: string;
  type: UniversityType;
  control: UniversityControl;
  level: UniversityLevel;
  enrollment: number;
  research: ResearchClassification;
  website: string;
  colors: {
    primary: string;
    secondary: string;
  };
  fedFunding: {
    fy25: number;
    fy24: number;
    fy23: number;
  };
  winRate: number;
  capabilities: string[];
  govConScore: number;
  scoreBreakdown: {
    pastPerformance: number;
    facultyExpertise: number;
    agencyRelationships: number;
    samGovCompliance: number;
  };
  isActive: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

/** Funding Opportunity */
export interface FSOpportunityDoc {
  id: string;
  title: string;
  agency: string;
  solicitationNumber: string;
  type: OpportunityType;
  status: OpportunityStatus;
  description: string;
  amount: {
    min?: number;
    max: number;
    type: AmountType;
  };
  deadline: Timestamp;
  matchScore: number;
  tags: { label: string; variant: TagVariant }[];
  sourceUrl: string;
  isHbcuSetAside: boolean;
  hbcuPreferred: boolean;
  domains: string[];
  trackedBy: string[];
  isPublished: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

/** Contact / Partner */
export interface FSContactDoc {
  id: string;
  name: string;
  title: string;
  organization: string;
  type: ContactType;
  email?: string;
  phone?: string;
  linkedin?: string;
  notes: {
    text: string;
    createdAt: Timestamp;
    createdBy: string;
  }[];
  lastContactedAt?: Timestamp;
  universityId: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

/** Research Capability */
export interface FSCapabilityDoc {
  id: string;
  name: string;
  description: string;
  department: string;
  tags: string[];
  documents: {
    name: string;
    url: string;
    uploadedAt: Timestamp;
  }[];
  universityId: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

/** Consortium (multi-university partnership) */
export interface FSConsortiumDoc {
  id: string;
  name: string;
  description: string;
  leadUniversityId: string;
  memberUniversityIds: string[];
  targetOpportunityId?: string;
  status: ConsortiumStatus;
  proposalDueDate?: Timestamp;
  targetAmount?: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

/** Strategic Alert */
export interface FSAlertDoc {
  id: string;
  title: string;
  description: string;
  icon: string;
  priority: AlertPriority;
  type: AlertType;
  color: "green" | "amber" | "red" | "radar";
  actionUrl?: string;
  actionText?: string;
  readBy: string[];
  universityId?: string;
  isGlobal: boolean;
  createdAt: Timestamp;
  expiresAt?: Timestamp;
}

/** Win/Loss Record */
export interface FSWinLossDoc {
  id: string;
  opportunityId: string;
  opportunityTitle: string;
  agency: string;
  amount: number;
  result: WinLossResult;
  score?: number;
  debrief?: string;
  lessonsLearned?: string;
  universityId: string;
  submittedAt?: Timestamp;
  decidedAt?: Timestamp;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

/** Calendar Event */
export interface FSCalendarEventDoc {
  id: string;
  title: string;
  description?: string;
  type: CalendarEventType;
  date: Timestamp;
  channel?: string;
  status: CalendarEventStatus;
  universityId: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

/** FedSignal Platform Settings (admin-configurable) */
export interface FSSettingsDoc {
  id: string;
  platformName: string;
  currentFiscalYear: string;
  currentQuarter: string;
  defaultUniversityId: string;
  enabledFeatures: {
    proposalPal: boolean;
    rfiCreator: boolean;
    contentStudio: boolean;
    consortiumWorkspace: boolean;
    sbriMatch: boolean;
  };
  fundingDomains: {
    name: string;
    totalFunding: number;
    color: string;
  }[];
  phaseBanner: {
    isActive: boolean;
    label: string;
    message: string;
  };
  updatedAt: Timestamp;
  updatedBy: string;
}

// ============================================================================
// KPI & Dashboard Types (not stored, computed)
// ============================================================================

export interface FSKpiData {
  activeOpportunities: number;
  newThisMonth: number;
  avgMatchScore: number;
  matchScoreTrend: number;
  fyAwards: number;
  fyAwardsTrend: number;
  pipelineValue: number;
  pipelineValueTrend: number;
  deadlines30d: number;
  urgentDeadlines: number;
}

export interface FSFundingDomain {
  name: string;
  value: string;
  percent: number;
  color: string;
}
