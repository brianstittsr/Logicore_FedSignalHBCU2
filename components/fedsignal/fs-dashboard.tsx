"use client";

import { cn } from "@/lib/utils";
import { getMatchColor, getDeadlineColor } from "@/lib/fedsignal/utils";
import type { TagVariant } from "@/lib/fedsignal/types";

// ── KPI Card ──
function KPICard({
  label,
  value,
  subtext,
  trend,
  color,
}: {
  label: string;
  value: string;
  subtext: string;
  trend: "up" | "down" | "neutral";
  color: "radar" | "green" | "amber" | "red" | "uni";
}) {
  const colorMap = {
    radar: "bg-[#1a56db]",
    green: "bg-green-600",
    amber: "bg-amber-600",
    red: "bg-red-600",
    uni: "bg-[#7A0019]",
  };

  return (
    <div className="relative bg-white border border-[#e2e8f0] rounded-lg shadow-sm p-5 overflow-hidden hover:shadow-md transition-shadow">
      <div className={cn("absolute bottom-0 left-0 right-0 h-[3px]", colorMap[color])} />
      <div className="text-[11px] font-semibold uppercase tracking-wide text-[#64748b] mb-1.5">
        {label}
      </div>
      <div className="text-[28px] font-extrabold text-[#0f172a] leading-none">
        {value}
      </div>
      <div
        className={cn(
          "text-xs font-medium mt-1.5",
          trend === "up" ? "text-green-700" : trend === "down" ? "text-red-700" : "text-[#9ca3af]"
        )}
      >
        {trend === "up" ? "↑ " : trend === "down" ? "↓ " : ""}
        {subtext}
      </div>
    </div>
  );
}

// ── Opportunity Row ──
function OpportunityRow({
  match,
  title,
  agency,
  solicitation,
  tags,
  amount,
  amountLabel,
  deadline,
  deadlineLabel,
}: {
  match: number;
  title: string;
  agency: string;
  solicitation: string;
  tags: { label: string; variant: TagVariant }[];
  amount: string;
  amountLabel: string;
  deadline: string;
  deadlineLabel: string;
}) {
  const matchColor = getMatchColor(match);
  const deadlineColor = getDeadlineColor(parseInt(deadline) || 0);

  const tagStyles: Record<TagVariant, string> = {
    hbcu: "text-amber-800 bg-amber-50 border-amber-200",
    cyber: "text-rose-800 bg-rose-50 border-rose-200",
    contract: "text-blue-800 bg-blue-50 border-blue-200",
    grant: "text-purple-800 bg-purple-50 border-purple-200",
    ai: "text-cyan-800 bg-cyan-50 border-cyan-200",
    defense: "text-indigo-800 bg-indigo-50 border-indigo-200",
    stem: "text-amber-800 bg-amber-50 border-amber-200",
  };

  const deadlineStyles: Record<string, string> = {
    red: "bg-red-50 text-red-700 border-red-200",
    amber: "bg-amber-50 text-amber-700 border-amber-200",
    green: "bg-green-50 text-green-700 border-green-200",
    gray: "bg-slate-100 text-slate-600 border-slate-200",
  };

  const matchStyles: Record<string, string> = {
    green: "bg-green-50 text-green-700 border-green-300",
    amber: "bg-amber-50 text-amber-700 border-amber-300",
    red: "bg-red-50 text-red-700 border-red-300",
  };

  return (
    <div className="grid grid-cols-[48px_1fr_auto_auto] items-center gap-4 px-5 py-3.5 border-b border-[#f1f5f9] hover:bg-[#f8faff] transition-colors cursor-pointer">
      <div
        className={cn(
          "w-11 h-11 rounded-full flex items-center justify-center font-mono text-xs font-semibold border-2",
          matchStyles[matchColor]
        )}
      >
        {match}
      </div>
      <div>
        <div className="text-sm font-semibold text-[#0f172a] mb-1">{title}</div>
        <div className="font-mono text-[11px] text-[#64748b] mb-2">
          {agency} · {solicitation}
        </div>
        <div className="flex gap-1 flex-wrap">
          {tags.map((tag, i) => (
            <span
              key={i}
              className={cn("text-[10px] font-semibold px-1.5 py-0.5 rounded border", tagStyles[tag.variant])}
            >
              {tag.label}
            </span>
          ))}
        </div>
      </div>
      <div className="text-right">
        <div className="font-mono text-sm font-semibold text-[#0f172a]">{amount}</div>
        <div className="text-[11px] text-[#9ca3af]">{amountLabel}</div>
      </div>
      <div
        className={cn(
          "px-2.5 py-1 rounded text-center text-[11px] font-semibold whitespace-nowrap border",
          deadlineStyles[deadlineColor]
        )}
      >
        {deadline} {deadlineLabel}
      </div>
    </div>
  );
}

// ── Alert Item ──
function AlertItem({
  icon,
  title,
  description,
  time,
  color = "radar",
}: {
  icon: string;
  title: string;
  description: string;
  time: string;
  color?: "green" | "amber" | "red" | "radar";
}) {
  const iconBg = {
    green: "bg-green-100",
    amber: "bg-amber-100",
    red: "bg-red-100",
    radar: "bg-blue-100",
  };

  return (
    <div className="flex gap-3.5 py-3.5 border-b border-[#f1f5f9] items-start">
      <div className={cn("w-9 h-9 rounded-md flex items-center justify-center text-base flex-shrink-0", iconBg[color])}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-semibold text-[#0f172a] mb-1 leading-tight">{title}</div>
        <div className="text-[13px] text-[#64748b] leading-relaxed">{description}</div>
      </div>
      <div className="font-mono text-[11px] text-[#9ca3af] whitespace-nowrap">{time}</div>
    </div>
  );
}

// ── Funding Bar ──
function FundingBar({ name, value, percent, color }: { name: string; value: string; percent: number; color: string }) {
  return (
    <div className="mb-3">
      <div className="flex justify-between mb-1.5 text-[13px]">
        <span className="text-[#0f172a] font-medium">{name}</span>
        <span className="font-mono text-[#1a56db] font-semibold">{value}</span>
      </div>
      <div className="h-1.5 bg-[#eef1f6] rounded-sm overflow-hidden">
        <div
          className="h-full rounded-sm transition-all duration-1000"
          style={{ width: `${percent}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}

// ── Card Wrapper ──
function FSCard({ children, accent }: { children: React.ReactNode; accent?: string }) {
  return (
    <div className={cn("bg-white border border-[#e2e8f0] rounded-lg shadow-sm overflow-hidden", accent && `border-t-2 border-t-[${accent}]`)}>
      {children}
    </div>
  );
}

// ── Main Dashboard ──
export function FSDashboard() {
  return (
    <div className="space-y-6">
      {/* Phase Banner */}
      <div className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-blue-50 to-green-50 border border-blue-200 rounded-lg">
        <span className="bg-[#1a56db] text-white text-[11px] font-bold px-2.5 py-1 rounded whitespace-nowrap">
          Phase 2 Active
        </span>
        <span className="text-[13px] text-[#334155]">
          <strong>Leadership Intelligence + Partnership Marketplace</strong> now live. 3 consortiums pending your review.
        </span>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        <KPICard label="Active Opportunities" value="47" subtext="12 new this month" trend="up" color="radar" />
        <KPICard label="Avg Match Score" value="76%" subtext="11pts vs last quarter" trend="up" color="green" />
        <KPICard label="FY25 Awards" value="$2.1M" subtext="91% vs FY24" trend="up" color="uni" />
        <KPICard label="Pipeline Value" value="$14.2M" subtext="$3.1M vs Q1" trend="up" color="amber" />
        <KPICard label="Deadlines 30d" value="6" subtext="3 urgent — action needed" trend="down" color="red" />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-4">
        {/* Left Column */}
        <div className="space-y-4">
          {/* Opportunities Card */}
          <FSCard>
            <div className="px-5 pt-5 pb-3">
              <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide text-[#64748b] mb-4">
                <span>Top Matching Opportunities</span>
                <div className="flex-1 h-px bg-[#dde1e9]" />
              </div>

              <div className="-mx-5">
                <OpportunityRow
                  match={94}
                  title="NSA HBCU/MSI Cybersecurity Research Initiative — Phase II"
                  agency="NSA"
                  solicitation="W52P1J-25-R-0044"
                  tags={[
                    { label: "HBCU Set-Aside", variant: "hbcu" },
                    { label: "Cyber", variant: "cyber" },
                    { label: "Contract", variant: "contract" },
                  ]}
                  amount="$750K"
                  amountLabel="ceiling"
                  deadline="14"
                  deadlineLabel="days"
                />
                <OpportunityRow
                  match={91}
                  title="NSF EHR Core Research — Broadening Participation in STEM"
                  agency="National Science Foundation"
                  solicitation="NSF 25-537"
                  tags={[
                    { label: "HBCU Eligible", variant: "hbcu" },
                    { label: "STEM", variant: "stem" },
                    { label: "Grant", variant: "grant" },
                  ]}
                  amount="$500K"
                  amountLabel="per award"
                  deadline="22"
                  deadlineLabel="days"
                />
                <OpportunityRow
                  match={88}
                  title="DoD HBCU/MSI Science & Technology — FY2025"
                  agency="Office of Naval Research"
                  solicitation="BAA N00014-25-S-B001"
                  tags={[
                    { label: "HBCU Set-Aside", variant: "hbcu" },
                    { label: "Defense", variant: "defense" },
                    { label: "Grant", variant: "grant" },
                  ]}
                  amount="$1.2M"
                  amountLabel="avg award"
                  deadline="31"
                  deadlineLabel="days"
                />
                <OpportunityRow
                  match={77}
                  title="AFRL HBCU Autonomy & AI Research Partnership"
                  agency="Air Force Research Lab"
                  solicitation="FA8750-25-S-7001"
                  tags={[
                    { label: "HBCU Preferred", variant: "hbcu" },
                    { label: "AI/ML", variant: "ai" },
                    { label: "Defense", variant: "defense" },
                  ]}
                  amount="$850K"
                  amountLabel="ceiling"
                  deadline="45"
                  deadlineLabel="days"
                />
              </div>
            </div>
          </FSCard>

          {/* Bottom Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FSCard>
              <div className="p-5">
                <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide text-[#64748b] mb-4">
                  <span>Funding by Domain</span>
                  <div className="flex-1 h-px bg-[#dde1e9]" />
                </div>
                <FundingBar name="Cybersecurity" value="$218M" percent={100} color="#1a56db" />
                <FundingBar name="Defense R&D" value="$320M" percent={85} color="#166534" />
                <FundingBar name="AI / ML" value="$142M" percent={60} color="#5b21b6" />
                <FundingBar name="Energy / Grid" value="$185M" percent={70} color="#0e7490" />
                <FundingBar name="STEM Education" value="$96M" percent={40} color="#92400e" />
              </div>
            </FSCard>

            <FSCard>
              <div className="p-5">
                <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide text-[#64748b] mb-4">
                  <span>Strategic Alerts</span>
                  <div className="flex-1 h-px bg-[#dde1e9]" />
                </div>
                <AlertItem icon="⚡" title="3 Priority Deadlines" description="NSA Cyber RFP closes in 14 days. Proposal not started." time="Now" color="red" />
                <AlertItem icon="📈" title="DoD AI Funding +61%" description="AI research spend surging. 8 new opportunities this week." time="2h ago" color="green" />
                <AlertItem icon="🤝" title="SAIC Seeking HBCU Partner" description="Cyber research program. Tuskegee is a 92% match." time="4h ago" color="amber" />
                <AlertItem icon="🏆" title="Funding Gap: $275M vs Peers" description="Howard received $320M NSF. Tuskegee received $45M." time="1d ago" color="radar" />
              </div>
            </FSCard>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          {/* Institution Score */}
          <FSCard>
            <div className="p-5">
              <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide mb-4 text-[#1a56db]">
                <span>Institution Score</span>
                <div className="flex-1 h-px bg-[#dde1e9]" />
              </div>
              <div className="text-center py-2.5">
                <div className="text-[52px] font-extrabold leading-none text-[#7A0019]">76</div>
                <div className="text-[9px] uppercase tracking-[0.15em] text-[#9ca3af]">GovCon Readiness Score</div>
                <div className="text-[10px] text-[#64748b] mt-2 px-2 leading-relaxed">
                  Above average. SAM.gov registration gap limiting 6 opportunities.
                </div>
              </div>
              <div className="h-px bg-[#dde1e9] my-4" />
              <div className="flex flex-col gap-2">
                {[
                  { label: "Past Performance", score: "82/100", color: "green" },
                  { label: "Faculty Expertise Coverage", score: "68/100", color: "amber" },
                  { label: "Agency Relationships", score: "74/100", color: "green" },
                  { label: "SAM.gov Compliance", score: "61/100", color: "red" },
                ].map((item) => (
                  <div key={item.label} className="flex justify-between text-[10px]">
                    <span className="text-[#64748b]">{item.label}</span>
                    <span
                      className={cn(
                        "font-mono",
                        item.color === "green" ? "text-green-700" : item.color === "amber" ? "text-amber-700" : "text-red-700"
                      )}
                    >
                      {item.score}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </FSCard>

          {/* Upcoming Deadlines */}
          <FSCard>
            <div className="p-5">
              <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide text-[#64748b] mb-4">
                <span>Upcoming Deadlines</span>
                <div className="flex-1 h-px bg-[#dde1e9]" />
              </div>
              <div className="flex flex-col gap-2">
                {[
                  { title: "NSA Cyber RFP", days: "14 days", amount: "$750K", color: "red" },
                  { title: "NSF EHR Grant", days: "22 days", amount: "$500K", color: "amber" },
                  { title: "ONR HBCU BAA", days: "31 days", amount: "$1.2M", color: "amber" },
                  { title: "AFRL AI Partnership", days: "45 days", amount: "$850K", color: "gray" },
                ].map((item) => (
                  <div
                    key={item.title}
                    className={cn(
                      "p-2 rounded border text-[11px]",
                      item.color === "red"
                        ? "bg-red-50/50 border-red-200"
                        : item.color === "amber"
                          ? "bg-amber-50/50 border-amber-200"
                          : "bg-white border-[#dde1e9]"
                    )}
                  >
                    <div className="font-semibold mb-0.5">{item.title}</div>
                    <div
                      className={cn(
                        "text-[9px]",
                        item.color === "red" ? "text-red-600" : item.color === "amber" ? "text-amber-600" : "text-[#9ca3af]"
                      )}
                    >
                      ⏱ {item.days} · {item.amount}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </FSCard>

          {/* Active Consortium */}
          <FSCard>
            <div className="p-5">
              <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide text-[#64748b] mb-4">
                <span>Active Consortium</span>
                <div className="flex-1 h-px bg-[#dde1e9]" />
              </div>
              <div className="text-xs font-semibold mb-1">HBCU Cyber Defense Alliance</div>
              <div className="text-[10px] text-[#64748b] mb-2.5">Led by Tuskegee · 4 member institutions</div>
              <div className="flex gap-1 flex-wrap mb-2.5">
                {["Tuskegee", "Howard", "FAMU", "Morgan State"].map((m) => (
                  <span key={m} className="text-[11px] px-2 py-0.5 bg-[#f8f9fc] border border-[#dde1e9] rounded-full text-[#64748b]">
                    {m}
                  </span>
                ))}
              </div>
              <div className="text-[10px] text-[#64748b] mb-3">
                Targeting: ONR Cyber BAA $3.5M · Proposal due Apr 30
              </div>
              <button className="w-full text-xs font-semibold bg-[#1a56db] text-white py-2 rounded hover:bg-[#1549c0] transition-colors">
                Open Workspace →
              </button>
            </div>
          </FSCard>
        </div>
      </div>
    </div>
  );
}
