"use client";

import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Search,
  Loader2,
  ExternalLink,
  DollarSign,
  ChevronDown,
  ChevronRight,
  X,
  RotateCcw,
  Download,
  Building2,
  FileText,
  TrendingUp,
  Hash,
  Filter,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";
// ─── Constants ────────────────────────────────────────────────────────────────

const FISCAL_YEARS = ["2025", "2024", "2023", "2022", "2021", "2020", "2019", "2018"];

const AWARD_TYPE_GROUPS = [
  {
    group: "Contracts",
    types: [
      { code: "A", label: "BPA Call" },
      { code: "B", label: "Purchase Order" },
      { code: "C", label: "Delivery Order" },
      { code: "D", label: "Definitive Contract" },
    ],
  },
  {
    group: "Grants",
    types: [
      { code: "02", label: "Block Grant" },
      { code: "03", label: "Formula Grant" },
      { code: "04", label: "Project Grant" },
      { code: "05", label: "Cooperative Agreement" },
    ],
  },
  {
    group: "Loans",
    types: [
      { code: "06", label: "Direct Loan" },
      { code: "07", label: "Guaranteed / Insured Loan" },
      { code: "10", label: "Loan" },
    ],
  },
  {
    group: "Other Financial",
    types: [
      { code: "08", label: "Insurance" },
      { code: "09", label: "Direct Payment" },
      { code: "11", label: "Other Financial Assistance" },
    ],
  },
];

const TOP_AGENCIES = [
  "Department of Defense",
  "Department of Health and Human Services",
  "Department of Veterans Affairs",
  "Department of Homeland Security",
  "Department of Transportation",
  "Department of Energy",
  "National Aeronautics and Space Administration",
  "Small Business Administration",
  "Department of Agriculture",
  "Department of State",
  "Department of Justice",
  "Department of Education",
  "Department of Housing and Urban Development",
  "Department of the Interior",
  "Environmental Protection Agency",
  "General Services Administration",
  "Department of Commerce",
  "Department of Labor",
  "Department of the Treasury",
];

const US_STATES = [
  "AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA",
  "HI","ID","IL","IN","IA","KS","KY","LA","ME","MD",
  "MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ",
  "NM","NY","NC","ND","OH","OK","OR","PA","RI","SC",
  "SD","TN","TX","UT","VT","VA","WA","WV","WI","WY",
  "DC","PR","GU","VI",
];

// ─── Types ────────────────────────────────────────────────────────────────────

interface SearchFilters {
  keywords: string;
  awardTypes: string[];
  fiscalYears: string[];
  awardingAgency: string;
  fundingAgency: string;
  recipientName: string;
  recipientState: string;
  naicsCode: string;
  pscCode: string;
  awardAmountMin: string;
  awardAmountMax: string;
  awardIdSearch: string;
}

interface AwardResult {
  "Award ID"?: string;
  "Recipient Name"?: string;
  "Award Amount"?: number;
  "Total Outlays"?: number;
  "Description"?: string;
  "Award Type"?: string;
  "Awarding Agency"?: string;
  "Awarding Sub Agency"?: string;
  "Start Date"?: string;
  "End Date"?: string;
  generated_internal_id?: string;
  [key: string]: unknown;
}

const EMPTY_FILTERS: SearchFilters = {
  keywords: "",
  awardTypes: [],
  fiscalYears: [],
  awardingAgency: "",
  fundingAgency: "",
  recipientName: "",
  recipientState: "",
  naicsCode: "",
  pscCode: "",
  awardAmountMin: "",
  awardAmountMax: "",
  awardIdSearch: "",
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatCurrency(val: unknown): string {
  if (val == null) return "—";
  const num = typeof val === "number" ? val : parseFloat(String(val));
  if (isNaN(num)) return "—";
  if (Math.abs(num) >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
  if (Math.abs(num) >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
  if (Math.abs(num) >= 1e3) return `$${(num / 1e3).toFixed(1)}K`;
  return `$${num.toLocaleString()}`;
}

function awardPermalink(result: AwardResult): string {
  const id = result.generated_internal_id || result["Award ID"];
  if (!id) return "https://www.usaspending.gov/search";
  return `https://www.usaspending.gov/award/${encodeURIComponent(String(id))}`;
}

function exportCsv(results: AwardResult[]) {
  const headers = ["Recipient Name", "Award Amount", "Award Type", "Awarding Agency", "Start Date", "End Date", "Award ID", "Description"];
  const rows = results.map((r) => headers.map((h) => {
    const val = r[h];
    const s = val == null ? "" : String(val);
    return `"${s.replace(/"/g, "'")}"` ;
  }).join(","));
  const csv = [headers.join(","), ...rows].join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `usaspending-${new Date().toISOString().split("T")[0]}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

// ─── FilterSection wrapper ────────────────────────────────────────────────────

function FilterSection({
  title, icon: Icon, children, defaultOpen = true,
}: {
  title: string;
  icon: React.ElementType;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger className="flex w-full items-center justify-between py-2 text-sm font-semibold text-slate-700 hover:text-slate-900 transition-colors">
        <div className="flex items-center gap-2">
          <Icon className="h-4 w-4 text-slate-500" />
          {title}
        </div>
        {open ? <ChevronDown className="h-4 w-4 text-slate-400" /> : <ChevronRight className="h-4 w-4 text-slate-400" />}
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="pb-4 pt-1">{children}</div>
      </CollapsibleContent>
    </Collapsible>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function USASpendingSearchPage() {
  const [filters, setFilters] = useState<SearchFilters>(EMPTY_FILTERS);
  const [naicsInput, setNaicsInput] = useState("");
  const [pscInput, setPscInput] = useState("");
  const [results, setResults] = useState<AwardResult[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [sortField, setSortField] = useState("Award Amount");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const resultsRef = useRef<HTMLDivElement>(null);

  const setFilter = <K extends keyof SearchFilters>(key: K, val: SearchFilters[K]) =>
    setFilters((prev) => ({ ...prev, [key]: val }));

  const toggleAwardType = (code: string) =>
    setFilter("awardTypes", filters.awardTypes.includes(code)
      ? filters.awardTypes.filter((c) => c !== code)
      : [...filters.awardTypes, code]);

  const toggleFiscalYear = (yr: string) =>
    setFilter("fiscalYears", filters.fiscalYears.includes(yr)
      ? filters.fiscalYears.filter((y) => y !== yr)
      : [...filters.fiscalYears, yr]);

  const activeFilterCount = [
    filters.keywords, filters.awardingAgency, filters.fundingAgency,
    filters.recipientName, filters.recipientState, filters.naicsCode,
    filters.pscCode, filters.awardAmountMin, filters.awardAmountMax, filters.awardIdSearch,
  ].filter(Boolean).length + filters.awardTypes.length + filters.fiscalYears.length;

  const handleSearch = async () => {
    setIsLoading(true);
    setFetchError(null);
    try {
      // Build USASpending-compatible filters
      const apiFilters: Record<string, unknown> = {};

      if (filters.keywords) apiFilters.keywords = [filters.keywords];
      if (filters.awardTypes.length) apiFilters.award_type_codes = filters.awardTypes;
      if (filters.recipientName) apiFilters.recipient_search_text = [filters.recipientName];
      if (filters.recipientState) apiFilters.recipient_locations = [{ country: "USA", state: filters.recipientState }];
      if (filters.naicsCode) apiFilters.naics_codes = { require: [filters.naicsCode] };
      if (filters.pscCode) apiFilters.psc_codes = { require: [filters.pscCode] };

      if (filters.awardingAgency) {
        apiFilters.agencies = [{ type: "awarding", tier: "toptier", name: filters.awardingAgency }];
      } else if (filters.fundingAgency) {
        apiFilters.agencies = [{ type: "funding", tier: "toptier", name: filters.fundingAgency }];
      }

      if (filters.fiscalYears.length) {
        apiFilters.time_period = filters.fiscalYears.map((fy) => ({
          start_date: `${parseInt(fy) - 1}-10-01`,
          end_date: `${fy}-09-30`,
        }));
      }

      const amtMin = filters.awardAmountMin ? parseFloat(filters.awardAmountMin.replace(/[^0-9.]/g, "")) : null;
      const amtMax = filters.awardAmountMax ? parseFloat(filters.awardAmountMax.replace(/[^0-9.]/g, "")) : null;
      if (amtMin != null || amtMax != null) {
        apiFilters.award_amounts = [{ lower_bound: amtMin ?? 0, upper_bound: amtMax ?? 9_999_999_999_999 }];
      }

      const body = {
        filters: Object.keys(apiFilters).length ? apiFilters : { keywords: ["services"] },
        fields: [
          "Award ID", "Recipient Name", "Award Amount", "Total Outlays",
          "Description", "Award Type", "Awarding Agency", "Awarding Sub Agency",
          "Start Date", "End Date", "generated_internal_id",
        ],
        page: 1,
        limit: 50,
        sort: sortField,
        order: sortDir,
        subawards: false,
      };

      const res = await fetch("https://api.usaspending.gov/api/v2/search/spending_by_award/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`USASpending API error ${res.status}: ${text.substring(0, 200)}`);
      }

      const data = await res.json();
      setResults(data.results || []);
      setTotal(data.page_metadata?.total || 0);
      setHasSearched(true);
      setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Search failed";
      setFetchError(msg);
      toast.error("Search failed — see error below");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setFilters(EMPTY_FILTERS);
    setNaicsInput("");
    setPscInput("");
    setResults([]);
    setTotal(0);
    setHasSearched(false);
    setFetchError(null);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* ── Page Header ── */}
      <div className="bg-[#112e51] text-white px-6 py-5">
        <div className="max-w-screen-2xl mx-auto flex items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <DollarSign className="h-6 w-6 text-yellow-400" />
              <h1 className="text-xl font-bold tracking-tight">Federal Award Search</h1>
              <Badge className="bg-yellow-400 text-[#112e51] font-bold text-xs hover:bg-yellow-400">LIVE</Badge>
            </div>
            <p className="text-blue-200 text-sm">
              Search federal contracts, grants, loans & other financial assistance from{" "}
              <a href="https://www.usaspending.gov/search" target="_blank" rel="noopener noreferrer"
                className="text-yellow-300 hover:underline font-medium">
                USASpending.gov
              </a>
            </p>
          </div>
          <div className="flex gap-3 text-center hidden md:flex">
            {[
              { label: "$6.8T+", sub: "Awards tracked" },
              { label: "400+", sub: "Federal agencies" },
              { label: "No API key", sub: "Required" },
            ].map(({ label, sub }) => (
              <div key={sub} className="bg-white/10 rounded-lg px-4 py-2">
                <div className="text-lg font-bold text-yellow-300">{label}</div>
                <div className="text-xs text-blue-200">{sub}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Main layout: sidebar filters + results ── */}
      <div className="max-w-screen-2xl mx-auto flex gap-0 md:gap-5 p-4 md:p-6 items-start">

        {/* ══ FILTER SIDEBAR ══ */}
        <aside className="w-full md:w-[300px] flex-shrink-0 space-y-1">
          <Card className="border-slate-200 shadow-sm sticky top-4">
            <CardHeader className="pb-2 pt-4 px-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-slate-600" />
                  <CardTitle className="text-sm font-bold text-slate-800">Search Filters</CardTitle>
                  {activeFilterCount > 0 && (
                    <Badge className="bg-[#112e51] text-white text-xs h-5 px-1.5">{activeFilterCount}</Badge>
                  )}
                </div>
                {activeFilterCount > 0 && (
                  <button onClick={handleReset} className="text-xs text-slate-400 hover:text-red-500 flex items-center gap-1 transition-colors">
                    <RotateCcw className="h-3 w-3" /> Clear
                  </button>
                )}
              </div>
            </CardHeader>
            <CardContent className="px-4 pb-4 space-y-0 divide-y divide-slate-100 max-h-[calc(100vh-220px)] overflow-y-auto">

              {/* Keyword */}
              <FilterSection title="Keyword Search" icon={Search}>
                <Input
                  placeholder="e.g. cybersecurity, construction..."
                  value={filters.keywords}
                  onChange={(e) => setFilter("keywords", e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  className="border-slate-300 text-sm h-8"
                />
              </FilterSection>

              {/* Time Period */}
              <FilterSection title="Time Period (Fiscal Year)" icon={TrendingUp}>
                <div className="grid grid-cols-4 gap-1.5">
                  {FISCAL_YEARS.map((yr) => (
                    <button
                      key={yr}
                      type="button"
                      onClick={() => toggleFiscalYear(yr)}
                      className={`text-xs py-1.5 rounded border transition-colors font-medium ${
                        filters.fiscalYears.includes(yr)
                          ? "bg-[#112e51] text-white border-[#112e51]"
                          : "bg-white text-slate-600 border-slate-200 hover:border-[#112e51] hover:text-[#112e51]"
                      }`}
                    >
                      {yr}
                    </button>
                  ))}
                </div>
              </FilterSection>

              {/* Award Type */}
              <FilterSection title="Award Type" icon={FileText}>
                <div className="space-y-3">
                  {AWARD_TYPE_GROUPS.map(({ group, types }) => (
                    <div key={group}>
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">{group}</p>
                      <div className="space-y-1.5">
                        {types.map(({ code, label }) => (
                          <div key={code} className="flex items-center gap-2">
                            <Checkbox
                              id={`at-${code}`}
                              checked={filters.awardTypes.includes(code)}
                              onCheckedChange={() => toggleAwardType(code)}
                              className="h-3.5 w-3.5"
                            />
                            <label htmlFor={`at-${code}`} className="text-xs text-slate-600 cursor-pointer leading-none">
                              {label}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </FilterSection>

              {/* Agencies */}
              <FilterSection title="Agency" icon={Building2}>
                <div className="space-y-2">
                  <div>
                    <Label className="text-xs text-slate-500 mb-1 block">Awarding Agency</Label>
                    <Select value={filters.awardingAgency} onValueChange={(v) => setFilter("awardingAgency", v === "__all__" ? "" : v)}>
                      <SelectTrigger className="h-8 text-xs border-slate-300">
                        <SelectValue placeholder="Any agency" />
                      </SelectTrigger>
                      <SelectContent className="max-h-60">
                        <SelectItem value="__all__">Any Agency</SelectItem>
                        {TOP_AGENCIES.map((a) => <SelectItem key={a} value={a} className="text-xs">{a}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-xs text-slate-500 mb-1 block">Funding Agency</Label>
                    <Select value={filters.fundingAgency} onValueChange={(v) => setFilter("fundingAgency", v === "__all__" ? "" : v)}>
                      <SelectTrigger className="h-8 text-xs border-slate-300">
                        <SelectValue placeholder="Any agency" />
                      </SelectTrigger>
                      <SelectContent className="max-h-60">
                        <SelectItem value="__all__">Any Agency</SelectItem>
                        {TOP_AGENCIES.map((a) => <SelectItem key={a} value={a} className="text-xs">{a}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </FilterSection>

              {/* Recipient */}
              <FilterSection title="Recipient" icon={Building2} defaultOpen={false}>
                <div className="space-y-2">
                  <div>
                    <Label className="text-xs text-slate-500 mb-1 block">Recipient Name</Label>
                    <Input
                      placeholder="Company or org name..."
                      value={filters.recipientName}
                      onChange={(e) => setFilter("recipientName", e.target.value)}
                      className="border-slate-300 text-sm h-8"
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-slate-500 mb-1 block">Recipient State</Label>
                    <Select value={filters.recipientState} onValueChange={(v) => setFilter("recipientState", v === "__all__" ? "" : v)}>
                      <SelectTrigger className="h-8 text-xs border-slate-300">
                        <SelectValue placeholder="Any state" />
                      </SelectTrigger>
                      <SelectContent className="max-h-60">
                        <SelectItem value="__all__">Any State</SelectItem>
                        {US_STATES.map((s) => <SelectItem key={s} value={s} className="text-xs">{s}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </FilterSection>

              {/* Award Amount */}
              <FilterSection title="Award Amount" icon={DollarSign} defaultOpen={false}>
                <div className="space-y-2">
                  <div>
                    <Label className="text-xs text-slate-500 mb-1 block">Minimum Amount</Label>
                    <Input
                      placeholder="e.g. 100000"
                      value={filters.awardAmountMin}
                      onChange={(e) => setFilter("awardAmountMin", e.target.value)}
                      className="border-slate-300 text-sm h-8"
                      type="number"
                      min={0}
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-slate-500 mb-1 block">Maximum Amount</Label>
                    <Input
                      placeholder="e.g. 10000000"
                      value={filters.awardAmountMax}
                      onChange={(e) => setFilter("awardAmountMax", e.target.value)}
                      className="border-slate-300 text-sm h-8"
                      type="number"
                      min={0}
                    />
                  </div>
                </div>
              </FilterSection>

              {/* NAICS & PSC */}
              <FilterSection title="Industry Codes" icon={Hash} defaultOpen={false}>
                <div className="space-y-2">
                  <div>
                    <Label className="text-xs text-slate-500 mb-1 block">NAICS Code</Label>
                    <div className="flex gap-1">
                      <Input
                        placeholder="e.g. 541512"
                        value={naicsInput}
                        onChange={(e) => setNaicsInput(e.target.value.replace(/\D/g, ""))}
                        className="border-slate-300 text-sm h-8"
                        maxLength={6}
                      />
                      <Button type="button" size="sm" variant="outline" className="h-8 px-3 text-xs"
                        onClick={() => { if (naicsInput) { setFilter("naicsCode", naicsInput); } }}>
                        Set
                      </Button>
                    </div>
                    {filters.naicsCode && (
                      <div className="mt-1 flex items-center gap-1">
                        <Badge variant="secondary" className="text-xs">{filters.naicsCode}</Badge>
                        <button onClick={() => { setFilter("naicsCode", ""); setNaicsInput(""); }} className="text-slate-400 hover:text-red-500">
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    )}
                  </div>
                  <div>
                    <Label className="text-xs text-slate-500 mb-1 block">PSC Code</Label>
                    <div className="flex gap-1">
                      <Input
                        placeholder="e.g. D302"
                        value={pscInput}
                        onChange={(e) => setPscInput(e.target.value.toUpperCase())}
                        className="border-slate-300 text-sm h-8"
                        maxLength={4}
                      />
                      <Button type="button" size="sm" variant="outline" className="h-8 px-3 text-xs"
                        onClick={() => { if (pscInput) { setFilter("pscCode", pscInput); } }}>
                        Set
                      </Button>
                    </div>
                    {filters.pscCode && (
                      <div className="mt-1 flex items-center gap-1">
                        <Badge variant="secondary" className="text-xs">{filters.pscCode}</Badge>
                        <button onClick={() => { setFilter("pscCode", ""); setPscInput(""); }} className="text-slate-400 hover:text-red-500">
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </FilterSection>

              {/* Award ID */}
              <FilterSection title="Award ID" icon={Hash} defaultOpen={false}>
                <Input
                  placeholder="e.g. CONT_AWD_..."
                  value={filters.awardIdSearch}
                  onChange={(e) => setFilter("awardIdSearch", e.target.value)}
                  className="border-slate-300 text-sm h-8"
                />
              </FilterSection>

            </CardContent>

            {/* Search button */}
            <div className="px-4 pb-4">
              <Button
                onClick={handleSearch}
                disabled={isLoading}
                className="w-full bg-[#112e51] hover:bg-[#1a3d6b] text-white gap-2"
              >
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                {isLoading ? "Searching…" : "Search Awards"}
              </Button>
            </div>
          </Card>
        </aside>

        {/* ══ RESULTS PANEL ══ */}
        <div ref={resultsRef} className="flex-1 min-w-0 space-y-4">

          {/* Active filter chips */}
          {activeFilterCount > 0 && (
            <div className="flex flex-wrap gap-2">
              {filters.keywords && <FilterChip label={`Keyword: ${filters.keywords}`} onRemove={() => setFilter("keywords", "")} />}
              {filters.fiscalYears.map((yr) => <FilterChip key={yr} label={`FY ${yr}`} onRemove={() => toggleFiscalYear(yr)} />)}
              {filters.awardTypes.map((code) => {
                const label = AWARD_TYPE_GROUPS.flatMap((g) => g.types).find((t) => t.code === code)?.label || code;
                return <FilterChip key={code} label={label} onRemove={() => toggleAwardType(code)} />;
              })}
              {filters.awardingAgency && <FilterChip label={`Awarding: ${filters.awardingAgency}`} onRemove={() => setFilter("awardingAgency", "")} />}
              {filters.fundingAgency && <FilterChip label={`Funding: ${filters.fundingAgency}`} onRemove={() => setFilter("fundingAgency", "")} />}
              {filters.recipientName && <FilterChip label={`Recipient: ${filters.recipientName}`} onRemove={() => setFilter("recipientName", "")} />}
              {filters.recipientState && <FilterChip label={`State: ${filters.recipientState}`} onRemove={() => setFilter("recipientState", "")} />}
              {filters.naicsCode && <FilterChip label={`NAICS: ${filters.naicsCode}`} onRemove={() => { setFilter("naicsCode", ""); setNaicsInput(""); }} />}
              {filters.pscCode && <FilterChip label={`PSC: ${filters.pscCode}`} onRemove={() => { setFilter("pscCode", ""); setPscInput(""); }} />}
              {filters.awardAmountMin && <FilterChip label={`Min: $${Number(filters.awardAmountMin).toLocaleString()}`} onRemove={() => setFilter("awardAmountMin", "")} />}
              {filters.awardAmountMax && <FilterChip label={`Max: $${Number(filters.awardAmountMax).toLocaleString()}`} onRemove={() => setFilter("awardAmountMax", "")} />}
            </div>
          )}

          {/* Results header */}
          {hasSearched && (
            <div className="flex items-center justify-between gap-3">
              <div className="text-sm text-slate-600">
                {isLoading ? "Searching…" : (
                  <><span className="font-bold text-slate-900">{total.toLocaleString()}</span> awards found · showing {results.length}</>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Select value={sortField} onValueChange={setSortField}>
                  <SelectTrigger className="h-8 text-xs w-[160px] border-slate-300">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {["Award Amount", "Start Date", "End Date", "Recipient Name"].map((f) => (
                      <SelectItem key={f} value={f} className="text-xs">{f}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button variant="outline" size="sm" className="h-8 text-xs gap-1"
                  onClick={() => setSortDir((d) => d === "asc" ? "desc" : "asc")}>
                  {sortDir === "desc" ? "↓ Desc" : "↑ Asc"}
                </Button>
                {results.length > 0 && (
                  <Button variant="outline" size="sm" className="h-8 text-xs gap-1.5"
                    onClick={() => exportCsv(results)}>
                    <Download className="h-3.5 w-3.5" /> Export CSV
                  </Button>
                )}
                <a href="https://www.usaspending.gov/search" target="_blank" rel="noopener noreferrer"
                  className="h-8 inline-flex items-center gap-1.5 text-xs px-3 rounded-md border border-slate-200 text-blue-600 hover:bg-blue-50 transition-colors">
                  View on USASpending <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>
          )}

          {/* Error */}
          {fetchError && (
            <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-lg p-4 text-sm text-red-800">
              <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold mb-1">Search Error</p>
                <p className="text-xs">{fetchError}</p>
              </div>
            </div>
          )}

          {/* Empty / initial state */}
          {!hasSearched && !isLoading && (
            <Card className="border-dashed border-slate-300 bg-white">
              <CardContent className="flex flex-col items-center justify-center py-16">
                <div className="h-16 w-16 rounded-full bg-[#112e51]/10 flex items-center justify-center mb-4">
                  <Search className="h-8 w-8 text-[#112e51]" />
                </div>
                <h3 className="text-lg font-semibold text-slate-800 mb-2">Search Federal Awards</h3>
                <p className="text-sm text-slate-500 text-center max-w-md mb-6">
                  Use the filters on the left to search contracts, grants, loans and other financial assistance from USASpending.gov.
                  Data is fetched live — no API key required.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-lg">
                  {[
                    { label: "Defense contracts 2024", action: () => { setFilter("awardTypes", ["A","B","C","D"]); setFilter("fiscalYears",["2024"]); setFilter("awardingAgency","Department of Defense"); } },
                    { label: "HHS grants 2024", action: () => { setFilter("awardTypes", ["02","03","04","05"]); setFilter("fiscalYears",["2024"]); setFilter("awardingAgency","Department of Health and Human Services"); } },
                    { label: "NASA contracts 2023–2024", action: () => { setFilter("awardTypes", ["A","B","C","D"]); setFilter("fiscalYears",["2023","2024"]); setFilter("awardingAgency","National Aeronautics and Space Administration"); } },
                    { label: "VA IT contracts", action: () => { setFilter("awardTypes", ["A","B","C","D"]); setFilter("naicsCode","541512"); setNaicsInput("541512"); setFilter("awardingAgency","Department of Veterans Affairs"); } },
                  ].map(({ label, action }) => (
                    <button key={label} onClick={() => { action(); setTimeout(handleSearch, 100); }}
                      className="text-left text-sm px-3 py-2.5 rounded-lg border border-slate-200 bg-white hover:border-[#112e51] hover:bg-blue-50 transition-colors flex items-center gap-2">
                      <ChevronRight className="h-3.5 w-3.5 text-slate-400 flex-shrink-0" />
                      {label}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Loading skeleton */}
          {isLoading && (
            <div className="space-y-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg border border-slate-200 p-4 space-y-2 animate-pulse">
                  <div className="h-3.5 bg-slate-200 rounded w-1/3" />
                  <div className="h-3 bg-slate-100 rounded w-2/3" />
                  <div className="h-3 bg-slate-100 rounded w-1/2" />
                </div>
              ))}
            </div>
          )}

          {/* Results table */}
          {!isLoading && results.length > 0 && (
            <Card className="border-slate-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead className="bg-[#112e51] text-white">
                    <tr>
                      <th className="px-4 py-3 text-left font-semibold text-xs uppercase tracking-wide">Recipient</th>
                      <th className="px-4 py-3 text-left font-semibold text-xs uppercase tracking-wide">Award Amount</th>
                      <th className="px-4 py-3 text-left font-semibold text-xs uppercase tracking-wide hidden sm:table-cell">Type</th>
                      <th className="px-4 py-3 text-left font-semibold text-xs uppercase tracking-wide hidden md:table-cell">Awarding Agency</th>
                      <th className="px-4 py-3 text-left font-semibold text-xs uppercase tracking-wide hidden lg:table-cell">Description</th>
                      <th className="px-4 py-3 text-left font-semibold text-xs uppercase tracking-wide hidden lg:table-cell">Start Date</th>
                      <th className="px-4 py-3 text-right font-semibold text-xs uppercase tracking-wide">Link</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {results.map((r, i) => {
                      const name = String(r["Recipient Name"] || "—");
                      const amount = r["Award Amount"];
                      const type = r["Award Type"] || "";
                      const agency = String(r["Awarding Agency"] || "—");
                      const desc = String(r["Description"] || "—");
                      const startDate = r["Start Date"] ? new Date(r["Start Date"]).toLocaleDateString() : "—";
                      const link = awardPermalink(r);

                      return (
                        <tr key={i} className={`hover:bg-blue-50 transition-colors ${i % 2 === 0 ? "" : "bg-slate-50/50"}`}>
                          <td className="px-4 py-3 font-medium text-slate-800 max-w-[180px]">
                            <span className="block truncate" title={name}>{name}</span>
                          </td>
                          <td className="px-4 py-3 text-emerald-700 font-bold whitespace-nowrap">
                            {formatCurrency(amount)}
                          </td>
                          <td className="px-4 py-3 hidden sm:table-cell">
                            {type ? <Badge variant="outline" className="text-xs font-normal whitespace-nowrap">{type}</Badge> : "—"}
                          </td>
                          <td className="px-4 py-3 text-slate-600 hidden md:table-cell max-w-[160px]">
                            <span className="block truncate text-xs" title={agency}>{agency}</span>
                          </td>
                          <td className="px-4 py-3 text-slate-500 hidden lg:table-cell max-w-[200px]">
                            <span className="block truncate text-xs" title={desc}>{desc}</span>
                          </td>
                          <td className="px-4 py-3 text-slate-500 hidden lg:table-cell text-xs whitespace-nowrap">
                            {startDate}
                          </td>
                          <td className="px-4 py-3 text-right">
                            <a href={link} target="_blank" rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 hover:underline whitespace-nowrap">
                              View <ExternalLink className="h-3 w-3" />
                            </a>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </Card>
          )}

          {/* No results */}
          {!isLoading && hasSearched && results.length === 0 && !fetchError && (
            <Card className="border-slate-200">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Search className="h-10 w-10 text-slate-300 mb-3" />
                <p className="font-semibold text-slate-700">No awards found</p>
                <p className="text-sm text-slate-500 mt-1 text-center max-w-sm">
                  Try broadening your search — remove some filters or change the fiscal year range.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── FilterChip helper ────────────────────────────────────────────────────────

function FilterChip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-[#112e51]/10 text-[#112e51] border border-[#112e51]/20">
      {label}
      <button onClick={onRemove} className="hover:text-red-600 transition-colors ml-0.5">
        <X className="h-3 w-3" />
      </button>
    </span>
  );
}
