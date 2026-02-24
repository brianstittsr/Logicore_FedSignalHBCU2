"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Search, Loader2, ExternalLink, Factory, MapPin, X, CheckSquare, Square } from "lucide-react";
import { toast } from "sonner";

interface SamCompany {
  ueiSAM: string;
  legalBusinessName: string;
  dbaName?: string;
  registrationStatus?: string;
  registrationExpirationDate?: string;
  entityStructure?: string;
  businessTypes?: string[];
  naicsCode?: string;
  naicsCodes?: string[];
  physicalAddress?: { addressLine1?: string; city?: string; stateOrProvinceCode?: string; zipCode?: string; countryCode?: string; };
  cageCode?: string;
  samUrl?: string;
  sbaBusinessTypes?: string[];
  isSmallBusiness?: boolean;
  isWomanOwned?: boolean;
  isVeteranOwned?: boolean;
  isServiceDisabledVeteranOwned?: boolean;
  isHubZone?: boolean;
  is8aProgram?: boolean;
}

const ENTITY_TYPE_OPTIONS = [
  { value: "2L", label: "Corporate Entity, Not Tax Exempt" },
  { value: "8H", label: "Limited Liability Company" },
  { value: "2J", label: "Subchapter S Corporation" },
  { value: "MF", label: "Manufacturer of Goods" },
  { value: "2A", label: "For Profit Entity" },
  { value: "2I", label: "Partnership or Limited Liability Partnership" },
  { value: "2S", label: "Sole Proprietorship" },
  { value: "8W", label: "Business or Organization" },
];

const BUSINESS_TYPE_OPTIONS = [
  { value: "A2", label: "Small Business" },
  { value: "A5", label: "Woman-Owned Small Business (WOSB)" },
  { value: "QF", label: "Veteran-Owned Small Business" },
  { value: "A6", label: "Service-Disabled Veteran-Owned (SDVOSB)" },
  { value: "XX", label: "HUBZone Firm" },
  { value: "27", label: "8(a) Program Participant" },
];

const SUGGESTED_NAICS = [
  { code: "336411", label: "Aircraft Manufacturing" },
  { code: "336412", label: "Aircraft Engine & Parts" },
  { code: "336413", label: "Other Aircraft Parts" },
  { code: "541715", label: "R&D Defense" },
  { code: "541330", label: "Engineering Services" },
  { code: "334511", label: "Navigation/Guidance Instruments" },
];

const US_STATES = [
  { value: "AL", label: "Alabama" }, { value: "AK", label: "Alaska" },
  { value: "AZ", label: "Arizona" }, { value: "AR", label: "Arkansas" },
  { value: "CA", label: "California" }, { value: "CO", label: "Colorado" },
  { value: "CT", label: "Connecticut" }, { value: "DE", label: "Delaware" },
  { value: "FL", label: "Florida" }, { value: "GA", label: "Georgia" },
  { value: "HI", label: "Hawaii" }, { value: "ID", label: "Idaho" },
  { value: "IL", label: "Illinois" }, { value: "IN", label: "Indiana" },
  { value: "IA", label: "Iowa" }, { value: "KS", label: "Kansas" },
  { value: "KY", label: "Kentucky" }, { value: "LA", label: "Louisiana" },
  { value: "ME", label: "Maine" }, { value: "MD", label: "Maryland" },
  { value: "MA", label: "Massachusetts" }, { value: "MI", label: "Michigan" },
  { value: "MN", label: "Minnesota" }, { value: "MS", label: "Mississippi" },
  { value: "MO", label: "Missouri" }, { value: "MT", label: "Montana" },
  { value: "NE", label: "Nebraska" }, { value: "NV", label: "Nevada" },
  { value: "NH", label: "New Hampshire" }, { value: "NJ", label: "New Jersey" },
  { value: "NM", label: "New Mexico" }, { value: "NY", label: "New York" },
  { value: "NC", label: "North Carolina" }, { value: "ND", label: "North Dakota" },
  { value: "OH", label: "Ohio" }, { value: "OK", label: "Oklahoma" },
  { value: "OR", label: "Oregon" }, { value: "PA", label: "Pennsylvania" },
  { value: "RI", label: "Rhode Island" }, { value: "SC", label: "South Carolina" },
  { value: "SD", label: "South Dakota" }, { value: "TN", label: "Tennessee" },
  { value: "TX", label: "Texas" }, { value: "UT", label: "Utah" },
  { value: "VT", label: "Vermont" }, { value: "VA", label: "Virginia" },
  { value: "WA", label: "Washington" }, { value: "WV", label: "West Virginia" },
  { value: "WI", label: "Wisconsin" }, { value: "WY", label: "Wyoming" },
  { value: "DC", label: "District of Columbia" },
];

export function CompanySearchTab() {
  const [keyword, setKeyword] = useState("");
  const [state, setState] = useState("");
  const [naicsCode, setNaicsCode] = useState("");
  const [selectedEntityTypes, setSelectedEntityTypes] = useState<string[]>(["2L", "8H", "2J", "MF", "2A", "2I"]);
  const [selectedBusinessTypes, setSelectedBusinessTypes] = useState<string[]>(["A2"]);
  const [regStatus, setRegStatus] = useState<"active" | "inactive" | "all">("active");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<SamCompany[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [selectedCompany, setSelectedCompany] = useState<SamCompany | null>(null);

  const toggleEntityType = (v: string) =>
    setSelectedEntityTypes((p) => p.includes(v) ? p.filter((x) => x !== v) : [...p, v]);

  const toggleBusinessType = (v: string) =>
    setSelectedBusinessTypes((p) => p.includes(v) ? p.filter((x) => x !== v) : [...p, v]);

  const doSearch = async (pageNum = 0, append = false) => {
    setLoading(true);
    if (!append) setResults([]);
    try {
      const res = await fetch("/api/sam/company-search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          keyword: keyword.trim(),
          state: state || undefined,
          naicsCode: naicsCode.trim() || undefined,
          entityTypes: selectedEntityTypes,
          businessTypes: selectedBusinessTypes,
          registrationStatus: regStatus,
          limit: 100,
          page: pageNum,
        }),
      });
      const data = await res.json();
      if (!res.ok) { toast.error(data.error || "Company search failed"); return; }
      const incoming: SamCompany[] = data.companies || [];
      setResults((p) => append ? [...p, ...incoming] : incoming);
      setTotal(data.total || 0);
      setPage(pageNum);
      if (!append) {
        incoming.length > 0
          ? toast.success(`Found ${(data.total || 0).toLocaleString()} companies (showing ${incoming.length})`)
          : toast.info("No companies found. Try broadening your filters.");
      }
    } catch { toast.error("Failed to search SAM.gov companies"); }
    finally { setLoading(false); }
  };

  const handleReset = () => {
    setKeyword(""); setState(""); setNaicsCode("");
    setSelectedEntityTypes(["2L", "8H", "2J", "MF", "2A", "2I"]);
    setSelectedBusinessTypes(["A2"]); setRegStatus("active");
    setResults([]); setTotal(0);
  };

  return (
    <div className="space-y-5">
      {/* ── Search Form ── */}
      <Card className="border border-slate-200 shadow-sm">
        <CardHeader className="pb-4 border-b border-slate-100 bg-slate-50/60 rounded-t-xl">
          <CardTitle className="text-base font-semibold text-[#1e3a5f] flex items-center gap-2">
            <Factory className="h-4 w-4 text-[#C8A951]" />
            Find Registered Companies on SAM.gov
          </CardTitle>
          <CardDescription className="text-sm">
            Search SAM.gov registered entities using the same criteria as the official SAM.gov company search — aligned with the SVP prospecting SOP.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-5 space-y-6">

          {/* Keyword + State + NAICS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-slate-700">Company Name / Keyword</Label>
              <Input placeholder="e.g., Lockheed, manufacturer..." value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && doSearch()}
                className="border-slate-300 focus-visible:ring-[#C8A951] focus-visible:border-[#C8A951]" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-slate-700">Step 2 — Physical Address State</Label>
              <Select value={state || "__all__"} onValueChange={(v) => setState(v === "__all__" ? "" : v)}>
                <SelectTrigger className="border-slate-300"><SelectValue placeholder="Any state" /></SelectTrigger>
                <SelectContent className="max-h-72">
                  <SelectItem value="__all__">Any State</SelectItem>
                  {US_STATES.map((s) => <SelectItem key={s.value} value={s.value}>{s.label} ({s.value})</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-slate-700">Step 4 — NAICS Code</Label>
              <Input placeholder="e.g., 336411" value={naicsCode}
                onChange={(e) => setNaicsCode(e.target.value)}
                className="font-mono border-slate-300 focus-visible:ring-[#C8A951] focus-visible:border-[#C8A951]" />
              <div className="flex flex-wrap gap-1.5 pt-0.5">
                {SUGGESTED_NAICS.map((n) => (
                  <button key={n.code} type="button" onClick={() => setNaicsCode(n.code)} title={n.label}
                    className={`px-2 py-0.5 rounded text-xs border transition-colors ${naicsCode === n.code ? "bg-[#1e3a5f] text-white border-[#1e3a5f]" : "bg-white text-slate-500 border-slate-200 hover:border-[#1e3a5f]/40 hover:text-[#1e3a5f]"}`}>
                    {n.code}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Step 1: Entity Type */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Label className="text-sm font-semibold text-slate-700">Step 1 — Entity Type</Label>
              <Badge variant="outline" className="text-xs text-[#1e3a5f] border-[#1e3a5f]/30">Select all that apply</Badge>
            </div>
            <p className="text-xs text-slate-400">Exclude: U.S. Federal/State/Local Gov, Education, Foundation, Hospital, Non-Profit, Foreign Gov.</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {ENTITY_TYPE_OPTIONS.map((opt) => (
                <button key={opt.value} type="button" onClick={() => toggleEntityType(opt.value)}
                  className={`flex items-center gap-2 p-2.5 rounded-md border text-left transition-colors ${selectedEntityTypes.includes(opt.value) ? "bg-[#1e3a5f] text-white border-[#1e3a5f]" : "bg-white text-slate-600 border-slate-200 hover:border-[#1e3a5f]/50"}`}>
                  {selectedEntityTypes.includes(opt.value) ? <CheckSquare className="h-3.5 w-3.5 shrink-0" /> : <Square className="h-3.5 w-3.5 shrink-0" />}
                  <span className="text-xs leading-tight">{opt.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Step 3: Entity Status */}
          <div className="space-y-2">
            <Label className="text-sm font-semibold text-slate-700">Step 3 — Entity Status</Label>
            <div className="flex gap-3 flex-wrap">
              {(["active", "inactive", "all"] as const).map((s) => (
                <button key={s} type="button" onClick={() => setRegStatus(s)}
                  className={`px-4 py-2 rounded-md border text-sm font-medium transition-colors ${regStatus === s ? (s === "active" ? "bg-green-600 text-white border-green-600" : "bg-slate-600 text-white border-slate-600") : "bg-white text-slate-600 border-slate-200 hover:border-slate-400"}`}>
                  {s === "active" ? "✓ Active Registration Only" : s === "inactive" ? "Inactive" : "Any Status"}
                </button>
              ))}
            </div>
            <p className="text-xs text-slate-400">Always use <strong>Active Registration only</strong> — Inactive = not currently eligible to bid.</p>
          </div>

          {/* Step 5: Business Type / Set-Aside */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Label className="text-sm font-semibold text-slate-700">Step 5 — Business Type / Set-Aside</Label>
              <Badge variant="outline" className="text-xs text-slate-500">Optional but Recommended</Badge>
            </div>
            <p className="text-xs text-slate-400">Focus on SB, WOSB, Veteran-Owned, SDVOSB — businesses that need your help most and can afford your services.</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {BUSINESS_TYPE_OPTIONS.map((opt) => (
                <button key={opt.value} type="button" onClick={() => toggleBusinessType(opt.value)}
                  className={`flex items-center gap-2 p-2.5 rounded-md border text-left transition-colors ${selectedBusinessTypes.includes(opt.value) ? "bg-[#C8A951]/20 text-[#1e3a5f] border-[#C8A951]" : "bg-white text-slate-600 border-slate-200 hover:border-[#C8A951]/50"}`}>
                  {selectedBusinessTypes.includes(opt.value) ? <CheckSquare className="h-3.5 w-3.5 shrink-0 text-[#C8A951]" /> : <Square className="h-3.5 w-3.5 shrink-0" />}
                  <span className="text-xs leading-tight">{opt.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 flex-wrap pt-1 border-t border-slate-100">
            <Button onClick={() => doSearch(0)} disabled={loading} className="bg-[#1e3a5f] hover:bg-[#152d4a]" size="lg">
              {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Search className="h-4 w-4 mr-2" />}
              Search Companies
            </Button>
            <Button variant="outline" onClick={handleReset} disabled={loading}>
              <X className="h-4 w-4 mr-1" />Reset
            </Button>
            {results.length > 0 && (
              <span className="text-sm text-slate-500 ml-auto">{total.toLocaleString()} total &bull; {results.length} loaded</span>
            )}
          </div>
        </CardContent>
      </Card>

      {/* ── Results ── */}
      {results.length > 0 && (
        <div className="space-y-3">
          {results.map((company) => (
            <Card key={company.ueiSAM} className="hover:shadow-md transition-shadow cursor-pointer border border-slate-200" onClick={() => setSelectedCompany(company)}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                      <h3 className="font-semibold text-[#1e3a5f] text-base">{company.legalBusinessName}</h3>
                      {company.dbaName && <span className="text-xs text-slate-400">dba {company.dbaName}</span>}
                    </div>
                    <div className="flex flex-wrap gap-1.5 text-xs">
                      {company.ueiSAM && <Badge variant="secondary" className="font-mono text-xs">{company.ueiSAM}</Badge>}
                      {company.cageCode && <Badge variant="outline" className="font-mono text-xs">CAGE: {company.cageCode}</Badge>}
                      {company.physicalAddress?.stateOrProvinceCode && (
                        <Badge variant="outline" className="text-xs">
                          <MapPin className="h-2.5 w-2.5 mr-0.5" />
                          {company.physicalAddress.city ? `${company.physicalAddress.city}, ` : ""}{company.physicalAddress.stateOrProvinceCode}
                        </Badge>
                      )}
                      {company.naicsCode && <Badge variant="outline" className="font-mono text-xs bg-blue-50 text-blue-700 border-blue-200">NAICS {company.naicsCode}</Badge>}
                      {company.registrationStatus && (
                        <Badge className={company.registrationStatus === "Active" || company.registrationStatus === "A" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}>
                          {company.registrationStatus === "A" ? "Active" : company.registrationStatus}
                        </Badge>
                      )}
                      {company.isSmallBusiness && <Badge className="bg-amber-100 text-amber-700 text-xs">SB</Badge>}
                      {company.isWomanOwned && <Badge className="bg-purple-100 text-purple-700 text-xs">WOSB</Badge>}
                      {company.isVeteranOwned && <Badge className="bg-blue-100 text-blue-700 text-xs">VOB</Badge>}
                      {company.isServiceDisabledVeteranOwned && <Badge className="bg-red-100 text-red-700 text-xs">SDVOSB</Badge>}
                      {company.isHubZone && <Badge className="bg-green-100 text-green-700 text-xs">HUBZone</Badge>}
                      {company.is8aProgram && <Badge className="bg-indigo-100 text-indigo-700 text-xs">8(a)</Badge>}
                    </div>
                    {company.entityStructure && <p className="text-xs text-slate-400 mt-1">{company.entityStructure}</p>}
                  </div>
                  <Button size="sm" variant="outline" className="shrink-0" onClick={(e) => { e.stopPropagation(); window.open(company.samUrl, "_blank"); }}>
                    <ExternalLink className="h-3.5 w-3.5 mr-1" />SAM.gov
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
          {results.length < total && (
            <div className="text-center pt-2">
              <Button variant="outline" onClick={() => doSearch(page + 1, true)} disabled={loading}>
                {loading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                Load More ({(total - results.length).toLocaleString()} remaining)
              </Button>
            </div>
          )}
        </div>
      )}

      {/* ── Company Detail Modal ── */}
      {selectedCompany && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={() => setSelectedCompany(null)}>
          <Card className="max-w-2xl w-full max-h-[85vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <CardHeader>
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <CardTitle className="text-xl text-[#1e3a5f]">{selectedCompany.legalBusinessName}</CardTitle>
                  {selectedCompany.dbaName && <p className="text-sm text-slate-400 mt-0.5">dba {selectedCompany.dbaName}</p>}
                </div>
                <div className="flex gap-2 shrink-0">
                  <Button size="sm" onClick={() => window.open(selectedCompany.samUrl, "_blank")}>
                    <ExternalLink className="h-4 w-4 mr-1" />View on SAM.gov
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setSelectedCompany(null)}>Close</Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "UEI SAM", value: selectedCompany.ueiSAM, mono: true },
                  { label: "CAGE Code", value: selectedCompany.cageCode, mono: true },
                  { label: "Registration Status", value: selectedCompany.registrationStatus === "A" ? "Active" : selectedCompany.registrationStatus },
                  { label: "Registration Expires", value: selectedCompany.registrationExpirationDate ? new Date(selectedCompany.registrationExpirationDate).toLocaleDateString() : undefined },
                ].map(({ label, value, mono }) => (
                  <div key={label} className="p-3 bg-slate-50 rounded-lg">
                    <div className="text-xs text-slate-400 mb-1">{label}</div>
                    <p className={`font-medium text-sm ${mono ? "font-mono" : ""}`}>{value || "N/A"}</p>
                  </div>
                ))}
                <div className="p-3 bg-slate-50 rounded-lg col-span-2">
                  <div className="text-xs text-slate-400 mb-1">Entity Structure</div>
                  <p className="font-medium text-sm">{selectedCompany.entityStructure || "N/A"}</p>
                </div>
              </div>

              {selectedCompany.physicalAddress && (
                <div>
                  <h3 className="font-semibold mb-2 text-sm text-slate-700">Physical Address</h3>
                  <div className="p-3 bg-slate-50 rounded-lg text-sm space-y-0.5">
                    {selectedCompany.physicalAddress.addressLine1 && <p>{selectedCompany.physicalAddress.addressLine1}</p>}
                    <p>{[selectedCompany.physicalAddress.city, selectedCompany.physicalAddress.stateOrProvinceCode, selectedCompany.physicalAddress.zipCode].filter(Boolean).join(", ")}</p>
                    {selectedCompany.physicalAddress.countryCode && <p className="text-slate-400">{selectedCompany.physicalAddress.countryCode}</p>}
                  </div>
                </div>
              )}

              {selectedCompany.naicsCodes && selectedCompany.naicsCodes.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2 text-sm text-slate-700">NAICS Codes</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedCompany.naicsCodes.map((code) => (
                      <Badge key={code} variant="outline" className="font-mono text-xs bg-blue-50 text-blue-700 border-blue-200">{code}</Badge>
                    ))}
                  </div>
                </div>
              )}

              {selectedCompany.businessTypes && selectedCompany.businessTypes.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2 text-sm text-slate-700">Business Types</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedCompany.businessTypes.map((bt, i) => (
                      <Badge key={i} variant="outline" className="text-xs">{bt}</Badge>
                    ))}
                  </div>
                </div>
              )}

              {selectedCompany.sbaBusinessTypes && selectedCompany.sbaBusinessTypes.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2 text-sm text-slate-700">SBA Certifications</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedCompany.sbaBusinessTypes.map((cert, i) => (
                      <Badge key={i} className="bg-amber-100 text-amber-800 text-xs">{cert}</Badge>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex flex-wrap gap-2 pt-1">
                {selectedCompany.isSmallBusiness && <Badge className="bg-amber-100 text-amber-700">Small Business</Badge>}
                {selectedCompany.isWomanOwned && <Badge className="bg-purple-100 text-purple-700">WOSB</Badge>}
                {selectedCompany.isVeteranOwned && <Badge className="bg-blue-100 text-blue-700">Veteran-Owned</Badge>}
                {selectedCompany.isServiceDisabledVeteranOwned && <Badge className="bg-red-100 text-red-700">SDVOSB</Badge>}
                {selectedCompany.isHubZone && <Badge className="bg-green-100 text-green-700">HUBZone</Badge>}
                {selectedCompany.is8aProgram && <Badge className="bg-indigo-100 text-indigo-700">8(a)</Badge>}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
