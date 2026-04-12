/**
 * FedSignal utility functions
 */

/** Format currency with $ and locale */
export function formatFSCurrency(value: number, compact = false): string {
  if (compact && value >= 1000000) {
    return `$${(value / 1000000).toFixed(1)}M`;
  }
  if (compact && value >= 1000) {
    return `$${(value / 1000).toFixed(0)}K`;
  }
  return `$${value.toLocaleString()}`;
}

/** Get deadline badge color based on days remaining */
export function getDeadlineColor(days: number): "red" | "amber" | "green" | "gray" {
  if (days <= 14) return "red";
  if (days <= 30) return "amber";
  if (days <= 60) return "green";
  return "gray";
}

/** Get match score color */
export function getMatchColor(score: number): "green" | "amber" | "red" {
  if (score >= 90) return "green";
  if (score >= 70) return "amber";
  return "red";
}

/** Calculate days from now */
export function daysFromNow(date: Date | string): number {
  const target = typeof date === "string" ? new Date(date) : date;
  const now = new Date();
  const diff = target.getTime() - now.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

/** Format date relative or absolute */
export function formatFSDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: d.getFullYear() !== new Date().getFullYear() ? "numeric" : undefined,
  });
}

/** University theme class mapping */
export const universityThemes: Record<string, { primary: string; secondary: string }> = {
  tuskegee: { primary: "#7A0019", secondary: "#9a6b00" },
  howard: { primary: "#003A63", secondary: "#7a0000" },
  famu: { primary: "#b45309", secondary: "#14532d" },
  ncat: { primary: "#1e3a8a", secondary: "#78350f" },
  morehouse: { primary: "#1c1917", secondary: "#991b1b" },
  aamu: { primary: "#1e3a8a", secondary: "#881337" },
};

/** University list for selectors */
export const universityList = [
  { value: "tuskegee", label: "Tuskegee University" },
  { value: "howard", label: "Howard University" },
  { value: "famu", label: "Florida A&M University" },
  { value: "aamu", label: "Alabama A&M University" },
  { value: "ncat", label: "NC A&T State University" },
  { value: "morehouse", label: "Morehouse College" },
];
