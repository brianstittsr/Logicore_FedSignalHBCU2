"use client";

import { useState, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
  ArrowUpDown,
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
      <CollapsibleTrigger className="flex w-full items-center justify-between py-2.5 text-sm font-medium hover:text-primary transition-colors">
        <div className="flex items-center gap-2">
          <Icon className="h-4 w-4 text-muted-foreground" />
          {title}
        </div>
        {open ? <ChevronDown className="h-4 w-4 text-muted-foreground" /> : <ChevronRight className="h-4 w-4 text-muted-foreground" />}
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="pb-3 pt-1">{children}</div>
      </CollapsibleContent>
    </Collapsible>
  );
}

// ─── FilterChip helper ────────────────────────────────────────────────────────

function FilterChip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <Badge variant="secondary" className="gap-1 pr-1 font-normal">
      {label}
      <button onClick={onRemove} className="hover:text-destructive transition-colors ml-0.5 rounded-full">
        <X className="h-3 w-3" />
      </button>
    </Badge>
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
    <div className="container mx-auto p-6 space-y-6">

      {/* ── Page Header ── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <DollarSign className="h-8 w-8 text-primary" />
            Federal Award Search
            <Badge variant="secondary" className="text-xs font-semibold">LIVE</Badge>
          </h1>
          <p className="text-muted-foreground mt-1">
            Search contracts, grants, loans &amp; financial assistance via{" "}
            <a href="https://www.usaspending.gov/search" target="_blank" rel="noopener noreferrer"
              className="text-primary hover:underline font-medium">
              USASpending.gov
            </a>
            {" "}— no API key required
          </p>
        </div>
        <div className="hidden md:flex gap-3">
          {[
            { label: "$6.8T+", sub: "Awards tracked" },
            { label: "400+", sub: "Federal agencies" },
          ].map(({ label, sub }) => (
            <Card key={sub}>
              <CardContent className="p-3 text-center">
                <div className="text-lg font-bold text-primary">{label}</div>
                <div className="text-xs text-muted-foreground">{sub}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* ── Main layout: sidebar filters + results ── */}
      <div className="flex flex-col md:flex-row gap-6 items-start">

        {/* ══ FILTER SIDEBAR ══ */}
        <aside className="w-full md:w-[280px] flex-shrink-0">
          <Card className="sticky top-4">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-muted-foreground" />
                  <CardTitle className="text-base">Search Filters</CardTitle>
                  {activeFilterCount > 0 && (
                    <Badge variant="default" className="h-5 px-1.5 text-xs">{activeFilterCount}</Badge>
                  )}
                </div>
                {activeFilterCount > 0 && (
                  <Button variant="ghost" size="sm" onClick={handleReset} className="h-7 px-2 text-xs text-muted-foreground hover:text-destructive">
                    <RotateCcw className="h-3 w-3 mr-1" /> Clear all
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="pb-2 space-y-0 divide-y max-h-[calc(100vh-240px)] overflow-y-auto">

              <FilterSection title="Keyword Search" icon={Search}>
                <Input
                  placeholder="e.g. cybersecurity, construction..."
                  value={filters.keywords}
                  onChange={(e) => setFilter("keywords", e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  className="h-8 text-sm"
                />
              </FilterSection>

              <FilterSection title="Time Period (Fiscal Year)" icon={TrendingUp}>
                <div className="grid grid-cols-4 gap-1.5">
                  {FISCAL_YEARS.map((yr) => (
                    <button
                      key={yr}
                      type="button"
                      onClick={() => toggleFiscalYear(yr)}
                      className={`text-xs py-1.5 rounded border transition-colors font-medium ${
                        filters.fiscalYears.includes(yr)
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-background text-muted-foreground border-border hover:border-primary hover:text-primary"
                      }`}
                    >
                      {yr}
                    </button>
                  ))}
                </div>
              </FilterSection>

              <FilterSection title="Award Type" icon={FileText}>
                <div className="space-y-3">
                  {AWARD_TYPE_GROUPS.map(({ group, types }) => (
                    <div key={group}>
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">{group}</p>
                      <div className="space-y-1.5">
                        {types.map(({ code, label }) => (
                          <div key={code} className="flex items-center gap-2">
                            <Checkbox
                              id={`at-${code}`}
                              checked={filters.awardTypes.includes(code)}
                              onCheckedChange={() => toggleAwardType(code)}
                              className="h-3.5 w-3.5"
                            />
                            <label htmlFor={`at-${code}`} className="text-xs text-muted-foreground cursor-pointer leading-none">
                              {label}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </FilterSection>

              <FilterSection title="Agency" icon={Building2}>
                <div className="space-y-2">
                  <div>
                    <Label className="text-xs text-muted-foreground mb-1 block">Awarding Agency</Label>
                    <Select value={filters.awardingAgency} onValueChange={(v) => setFilter("awardingAgency", v === "__all__" ? "" : v)}>
                      <SelectTrigger className="h-8 text-xs">
                        <SelectValue placeholder="Any agency" />
                      </SelectTrigger>
                      <SelectContent className="max-h-60">
                        <SelectItem value="__all__">Any Agency</SelectItem>
                        {TOP_AGENCIES.map((a) => <SelectItem key={a} value={a} className="text-xs">{a}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground mb-1 block">Funding Agency</Label>
                    <Select value={filters.fundingAgency} onValueChange={(v) => setFilter("fundingAgency", v === "__all__" ? "" : v)}>
                      <SelectTrigger className="h-8 text-xs">
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

              <FilterSection title="Recipient" icon={Building2} defaultOpen={false}>
                <div className="space-y-2">
                  <div>
                    <Label className="text-xs text-muted-foreground mb-1 block">Recipient Name</Label>
                    <Input
                      placeholder="Company or org name..."
                      value={filters.recipientName}
                      onChange={(e) => setFilter("recipientName", e.target.value)}
                      className="h-8 text-sm"
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground mb-1 block">Recipient State</Label>
                    <Select value={filters.recipientState} onValueChange={(v) => setFilter("recipientState", v === "__all__" ? "" : v)}>
                      <SelectTrigger className="h-8 text-xs">
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

              <FilterSection title="Award Amount" icon={DollarSign} defaultOpen={false}>
                <div className="space-y-2">
                  <div>
                    <Label className="text-xs text-muted-foreground mb-1 block">Minimum ($)</Label>
                    <Input
                      placeholder="e.g. 100000"
                      value={filters.awardAmountMin}
                      onChange={(e) => setFilter("awardAmountMin", e.target.value)}
                      className="h-8 text-sm"
                      type="number"
                      min={0}
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground mb-1 block">Maximum ($)</Label>
                    <Input
                      placeholder="e.g. 10000000"
                      value={filters.awardAmountMax}
                      onChange={(e) => setFilter("awardAmountMax", e.target.value)}
                      className="h-8 text-sm"
                      type="number"
                      min={0}
                    />
                  </div>
                </div>
              </FilterSection>

              <FilterSection title="Industry Codes" icon={Hash} defaultOpen={false}>
                <div className="space-y-2">
                  <div>
                    <Label className="text-xs text-muted-foreground mb-1 block">NAICS Code</Label>
                    <div className="flex gap-1.5">
                      <Input
                        placeholder="e.g. 541512"
                        value={naicsInput}
                        onChange={(e) => setNaicsInput(e.target.value.replace(/\D/g, ""))}
                        className="h-8 text-sm"
                        maxLength={6}
                      />
                      <Button type="button" size="sm" variant="outline" className="h-8 px-3 text-xs flex-shrink-0"
                        onClick={() => { if (naicsInput) { setFilter("naicsCode", naicsInput); } }}>
                        Set
                      </Button>
                    </div>
                    {filters.naicsCode && (
                      <div className="mt-1.5">
                        <FilterChip label={filters.naicsCode} onRemove={() => { setFilter("naicsCode", ""); setNaicsInput(""); }} />
                      </div>
                    )}
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground mb-1 block">PSC Code</Label>
                    <div className="flex gap-1.5">
                      <Input
                        placeholder="e.g. D302"
                        value={pscInput}
                        onChange={(e) => setPscInput(e.target.value.toUpperCase())}
                        className="h-8 text-sm"
                        maxLength={4}
                      />
                      <Button type="button" size="sm" variant="outline" className="h-8 px-3 text-xs flex-shrink-0"
                        onClick={() => { if (pscInput) { setFilter("pscCode", pscInput); } }}>
                        Set
                      </Button>
                    </div>
                    {filters.pscCode && (
                      <div className="mt-1.5">
                        <FilterChip label={filters.pscCode} onRemove={() => { setFilter("pscCode", ""); setPscInput(""); }} />
                      </div>
                    )}
                  </div>
                </div>
              </FilterSection>

              <FilterSection title="Award ID" icon={Hash} defaultOpen={false}>
                <Input
                  placeholder="e.g. CONT_AWD_..."
                  value={filters.awardIdSearch}
                  onChange={(e) => setFilter("awardIdSearch", e.target.value)}
                  className="h-8 text-sm"
                />
              </FilterSection>

            </CardContent>

            <div className="p-4 pt-3">
              <Button
                onClick={handleSearch}
                disabled={isLoading}
                className="w-full gap-2"
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

          {/* Error */}
          {fetchError && (
            <Card className="border-destructive/50 bg-destructive/5">
              <CardContent className="flex items-start gap-3 py-4">
                <AlertCircle className="h-4 w-4 text-destructive flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-destructive">Search Error</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{fetchError}</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Empty / initial state */}
          {!hasSearched && !isLoading && (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-16">
                <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
                  <Search className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Search Federal Awards</h3>
                <p className="text-sm text-muted-foreground text-center max-w-md mb-6">
                  Use the filters on the left to search contracts, grants, loans and other financial assistance.
                  Data is fetched live from USASpending.gov — no API key required.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-lg">
                  {[
                    { label: "Defense contracts 2024", action: () => { setFilter("awardTypes", ["A","B","C","D"]); setFilter("fiscalYears",["2024"]); setFilter("awardingAgency","Department of Defense"); } },
                    { label: "HHS grants 2024", action: () => { setFilter("awardTypes", ["02","03","04","05"]); setFilter("fiscalYears",["2024"]); setFilter("awardingAgency","Department of Health and Human Services"); } },
                    { label: "NASA contracts 2023–2024", action: () => { setFilter("awardTypes", ["A","B","C","D"]); setFilter("fiscalYears",["2023","2024"]); setFilter("awardingAgency","National Aeronautics and Space Administration"); } },
                    { label: "VA IT contracts", action: () => { setFilter("awardTypes", ["A","B","C","D"]); setFilter("naicsCode","541512"); setNaicsInput("541512"); setFilter("awardingAgency","Department of Veterans Affairs"); } },
                  ].map(({ label, action }) => (
                    <button key={label} onClick={() => { action(); setTimeout(handleSearch, 100); }}
                      className="text-left text-sm px-3 py-2.5 rounded-lg border bg-card hover:bg-muted transition-colors flex items-center gap-2">
                      <ChevronRight className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                      {label}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Results header bar */}
          {hasSearched && (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <p className="text-sm text-muted-foreground">
                {isLoading ? "Searching…" : (
                  <><span className="font-semibold text-foreground">{total.toLocaleString()}</span> awards found · showing {results.length}</>
                )}
              </p>
              <div className="flex items-center gap-2">
                <Select value={sortField} onValueChange={setSortField}>
                  <SelectTrigger className="h-8 text-xs w-[160px]">
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
                  <ArrowUpDown className="h-3 w-3" />
                  {sortDir === "desc" ? "Desc" : "Asc"}
                </Button>
                {results.length > 0 && (
                  <Button variant="outline" size="sm" className="h-8 text-xs gap-1.5"
                    onClick={() => exportCsv(results)}>
                    <Download className="h-3.5 w-3.5" /> Export CSV
                  </Button>
                )}
                <a href="https://www.usaspending.gov/search" target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" size="sm" className="h-8 text-xs gap-1.5">
                    USASpending.gov <ExternalLink className="h-3 w-3" />
                  </Button>
                </a>
              </div>
            </div>
          )}

          {/* Loading skeleton */}
          {isLoading && (
            <Card>
              <CardContent className="py-12">
                <div className="flex items-center justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Results table */}
          {!isLoading && results.length > 0 && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Results</CardTitle>
                <CardDescription>{results.length} of {total.toLocaleString()} awards</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Recipient</TableHead>
                        <TableHead>Award Amount</TableHead>
                        <TableHead className="hidden sm:table-cell">Type</TableHead>
                        <TableHead className="hidden md:table-cell">Awarding Agency</TableHead>
                        <TableHead className="hidden lg:table-cell">Description</TableHead>
                        <TableHead className="hidden lg:table-cell">Start Date</TableHead>
                        <TableHead className="text-right">Link</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {results.map((r, i) => {
                        const name = String(r["Recipient Name"] || "—");
                        const amount = r["Award Amount"];
                        const type = r["Award Type"] || "";
                        const agency = String(r["Awarding Agency"] || "—");
                        const desc = String(r["Description"] || "—");
                        const startDate = r["Start Date"] ? new Date(r["Start Date"]).toLocaleDateString() : "—";
                        const link = awardPermalink(r);

                        return (
                          <TableRow key={i} className="hover:bg-muted/50">
                            <TableCell className="font-medium max-w-[180px]">
                              <span className="block truncate" title={name}>{name}</span>
                            </TableCell>
                            <TableCell className="font-semibold text-green-600 whitespace-nowrap">
                              {formatCurrency(amount)}
                            </TableCell>
                            <TableCell className="hidden sm:table-cell">
                              {type ? <Badge variant="outline" className="text-xs font-normal whitespace-nowrap">{type}</Badge> : "—"}
                            </TableCell>
                            <TableCell className="hidden md:table-cell max-w-[160px]">
                              <span className="block truncate text-xs text-muted-foreground" title={agency}>{agency}</span>
                            </TableCell>
                            <TableCell className="hidden lg:table-cell max-w-[200px]">
                              <span className="block truncate text-xs text-muted-foreground" title={desc}>{desc}</span>
                            </TableCell>
                            <TableCell className="hidden lg:table-cell text-xs text-muted-foreground whitespace-nowrap">
                              {startDate}
                            </TableCell>
                            <TableCell className="text-right">
                              <a href={link} target="_blank" rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-xs text-primary hover:underline whitespace-nowrap">
                                View <ExternalLink className="h-3 w-3" />
                              </a>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          )}

          {/* No results */}
          {!isLoading && hasSearched && results.length === 0 && !fetchError && (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Search className="h-10 w-10 text-muted-foreground mb-3" />
                <p className="font-semibold">No awards found</p>
                <p className="text-sm text-muted-foreground mt-1 text-center max-w-sm">
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
