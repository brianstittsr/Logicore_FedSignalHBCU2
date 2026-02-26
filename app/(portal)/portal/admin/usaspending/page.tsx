"use client";

import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Search,
  Sparkles,
  Loader2,
  ExternalLink,
  DollarSign,
  Building2,
  FileText,
  TrendingUp,
  RotateCcw,
  ChevronRight,
  Info,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";
/** Lightweight markdown renderer — bold, bullets, links only */
function SimpleMarkdown({ children }: { children: string }) {
  const lines = children.split("\n");
  const elements: React.ReactNode[] = [];
  let listItems: string[] = [];

  const flushList = (key: string) => {
    if (listItems.length > 0) {
      elements.push(
        <ul key={key} className="list-disc pl-4 my-1 space-y-0.5">
          {listItems.map((li, i) => (
            <li key={i} dangerouslySetInnerHTML={{ __html: renderInline(li) }} />
          ))}
        </ul>
      );
      listItems = [];
    }
  };

  const renderInline = (text: string): string =>
    text
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replace(/\[(.+?)\]\((https?:\/\/[^\)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:underline">$1</a>');

  lines.forEach((line, idx) => {
    if (/^[-*] /.test(line)) {
      listItems.push(line.replace(/^[-*] /, ""));
    } else {
      flushList(`list-${idx}`);
      if (line.trim() === "") {
        elements.push(<br key={idx} />);
      } else {
        elements.push(
          <p key={idx} className="mb-1" dangerouslySetInnerHTML={{ __html: renderInline(line) }} />
        );
      }
    }
  });
  flushList("list-end");

  return <div className="prose prose-sm max-w-none text-slate-800">{elements}</div>;
}

// ─── Types ────────────────────────────────────────────────────────────────────

interface ConversationMessage {
  role: "user" | "assistant";
  content: string;
  results?: AwardResult[];
  total?: number;
  intent?: ParsedIntent;
  fetchError?: string | null;
  timestamp: Date;
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
  name?: string;
  amount?: number;
  [key: string]: unknown;
}

interface ParsedIntent {
  endpoint: string;
  filters: Record<string, unknown>;
  summary: string;
  keywords: string[];
}

// ─── Example prompts ─────────────────────────────────────────────────────────

const EXAMPLE_PROMPTS = [
  "Show me the top 10 defense contracts awarded in 2024",
  "Find all NASA grants over $1 million in the last 2 years",
  "What companies received the most HHS contracts in North Carolina?",
  "List cybersecurity contracts awarded by DHS in fiscal year 2023",
  "Show me SBA small business grants awarded in 2024",
  "Find contracts with Lockheed Martin over $500 million",
  "What are the top recipients of DOE energy research grants?",
  "Show all VA contracts for medical equipment in 2023",
];

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

function getAwardTypeLabel(code: string): string {
  const map: Record<string, string> = {
    A: "BPA Call", B: "Purchase Order", C: "Delivery Order", D: "Definitive Contract",
    "02": "Block Grant", "03": "Formula Grant", "04": "Project Grant", "05": "Cooperative Agreement",
    "06": "Direct Loan", "07": "Guaranteed/Insured Loan", "08": "Insurance", "09": "Direct Payment",
    "10": "Loan",
  };
  return map[code] || code;
}

function awardPermalink(result: AwardResult): string {
  const id = result.generated_internal_id || result["Award ID"];
  if (!id) return "https://www.usaspending.gov/search";
  return `https://www.usaspending.gov/award/${encodeURIComponent(String(id))}`;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function ResultsTable({ results }: { results: AwardResult[] }) {
  if (!results || results.length === 0) return null;

  return (
    <div className="mt-4 overflow-x-auto rounded-lg border border-slate-200">
      <table className="min-w-full text-sm">
        <thead className="bg-slate-50 border-b border-slate-200">
          <tr>
            <th className="px-3 py-2.5 text-left font-semibold text-slate-700">Recipient</th>
            <th className="px-3 py-2.5 text-left font-semibold text-slate-700">Award Amount</th>
            <th className="px-3 py-2.5 text-left font-semibold text-slate-700 hidden md:table-cell">Type</th>
            <th className="px-3 py-2.5 text-left font-semibold text-slate-700 hidden lg:table-cell">Agency</th>
            <th className="px-3 py-2.5 text-left font-semibold text-slate-700 hidden lg:table-cell">Start Date</th>
            <th className="px-3 py-2.5 text-right font-semibold text-slate-700">Link</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {results.map((r, i) => {
            const name = r["Recipient Name"] || r.name || "Unknown";
            const amount = r["Award Amount"] ?? r.amount;
            const type = r["Award Type"] || "";
            const agency = r["Awarding Agency"] || "";
            const startDate = r["Start Date"] ? new Date(r["Start Date"]).toLocaleDateString() : "—";
            const link = awardPermalink(r);

            return (
              <tr key={i} className="hover:bg-slate-50 transition-colors">
                <td className="px-3 py-2.5 font-medium text-slate-800 max-w-[200px] truncate" title={String(name)}>
                  {String(name)}
                </td>
                <td className="px-3 py-2.5 text-emerald-700 font-semibold whitespace-nowrap">
                  {formatCurrency(amount)}
                </td>
                <td className="px-3 py-2.5 text-slate-600 hidden md:table-cell">
                  {type ? (
                    <Badge variant="outline" className="text-xs font-normal">
                      {getAwardTypeLabel(type)}
                    </Badge>
                  ) : "—"}
                </td>
                <td className="px-3 py-2.5 text-slate-600 hidden lg:table-cell max-w-[180px] truncate" title={agency}>
                  {agency || "—"}
                </td>
                <td className="px-3 py-2.5 text-slate-500 hidden lg:table-cell text-xs">
                  {startDate}
                </td>
                <td className="px-3 py-2.5 text-right">
                  <a
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 hover:underline"
                  >
                    View <ExternalLink className="h-3 w-3" />
                  </a>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function IntentChip({ intent }: { intent: ParsedIntent }) {
  return (
    <div className="flex flex-wrap gap-1.5 mt-2">
      <Badge variant="secondary" className="text-xs gap-1">
        <Search className="h-3 w-3" /> {intent.endpoint.replace(/_/g, " ")}
      </Badge>
      {intent.keywords.slice(0, 4).map((kw) => (
        <Badge key={kw} variant="outline" className="text-xs text-slate-600">{kw}</Badge>
      ))}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function USASpendingSearchPage() {
  const [query, setQuery] = useState("");
  const [conversation, setConversation] = useState<ConversationMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversation]);

  const handleSearch = async (q?: string) => {
    const searchQuery = (q || query).trim();
    if (!searchQuery) return;

    const userMsg: ConversationMessage = {
      role: "user",
      content: searchQuery,
      timestamp: new Date(),
    };

    setConversation((prev) => [...prev, userMsg]);
    setQuery("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/usaspending/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: searchQuery,
          conversationHistory: conversation.map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Search failed");
      }

      const assistantMsg: ConversationMessage = {
        role: "assistant",
        content: data.summary || "No summary returned.",
        results: data.results || [],
        total: data.total || 0,
        intent: data.intent,
        fetchError: data.fetchError || null,
        timestamp: new Date(),
      };

      setConversation((prev) => [...prev, assistantMsg]);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Search failed");
      setConversation((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, I encountered an error searching USASpending.gov. Please try again.",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  const handleClear = () => {
    setConversation([]);
    setQuery("");
    inputRef.current?.focus();
  };

  return (
    <div className="flex flex-col h-full max-h-[calc(100vh-6rem)] space-y-4 p-6">
      {/* ── Header ── */}
      <div className="flex items-start justify-between gap-4 flex-shrink-0">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <DollarSign className="h-6 w-6 text-emerald-600" />
            <h1 className="text-2xl font-bold text-slate-900">USASpending AI Search</h1>
            <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 text-xs">LIVE DATA</Badge>
          </div>
          <p className="text-sm text-slate-500 max-w-2xl">
            Ask plain-language questions about federal spending. Data pulled live from{" "}
            <a href="https://www.usaspending.gov" target="_blank" rel="noopener noreferrer"
              className="text-blue-600 hover:underline font-medium">
              USASpending.gov
            </a>
            {" "}— no API key required.
          </p>
        </div>
        {conversation.length > 0 && (
          <Button variant="outline" size="sm" onClick={handleClear} className="flex-shrink-0 gap-1.5">
            <RotateCcw className="h-3.5 w-3.5" /> New Search
          </Button>
        )}
      </div>

      {/* ── Stats bar ── */}
      <div className="flex gap-3 flex-shrink-0">
        {[
          { icon: TrendingUp, label: "Federal Awards", value: "$6.8T+ tracked" },
          { icon: Building2, label: "Agencies", value: "400+ covered" },
          { icon: FileText, label: "Contracts & Grants", value: "Real-time data" },
        ].map(({ icon: Icon, label, value }) => (
          <div key={label} className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm">
            <Icon className="h-4 w-4 text-slate-400" />
            <span className="text-slate-500 hidden sm:inline">{label}:</span>
            <span className="font-semibold text-slate-700">{value}</span>
          </div>
        ))}
      </div>

      {/* ── Conversation / Results area ── */}
      <div className="flex-1 overflow-y-auto min-h-0 space-y-4 pr-1">
        {conversation.length === 0 ? (
          /* ── Empty state with example prompts ── */
          <Card className="border-dashed border-slate-300 bg-slate-50/50">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-emerald-500" />
                <CardTitle className="text-base text-slate-700">Try a question below or type your own</CardTitle>
              </div>
              <CardDescription>
                Powered by AI + the USASpending.gov public API. Ask anything about federal contracts, grants, or recipients.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {EXAMPLE_PROMPTS.map((prompt) => (
                  <button
                    key={prompt}
                    onClick={() => handleSearch(prompt)}
                    className="text-left text-sm px-3 py-2.5 rounded-lg border border-slate-200 bg-white hover:border-emerald-400 hover:bg-emerald-50 hover:text-emerald-800 transition-colors group flex items-center gap-2"
                  >
                    <ChevronRight className="h-3.5 w-3.5 text-slate-400 group-hover:text-emerald-500 flex-shrink-0" />
                    <span>{prompt}</span>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        ) : (
          /* ── Message thread ── */
          conversation.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              {msg.role === "user" ? (
                <div className="max-w-[80%] bg-[#1e3a5f] text-white rounded-2xl rounded-br-sm px-4 py-3 shadow-sm">
                  <p className="text-sm font-medium">{msg.content}</p>
                  <p className="text-xs text-blue-200 mt-1">{msg.timestamp.toLocaleTimeString()}</p>
                </div>
              ) : (
                <div className="max-w-[95%] space-y-3 w-full">
                  {/* AI Summary card */}
                  <Card className="border-slate-200 shadow-sm">
                    <CardContent className="pt-4 pb-3">
                      <div className="flex items-start gap-2 mb-2">
                        <div className="h-7 w-7 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <SimpleMarkdown>{msg.content}</SimpleMarkdown>
                          {msg.intent && <IntentChip intent={msg.intent} />}
                        </div>
                      </div>

                      {msg.fetchError && (
                        <div className="mt-3 flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 text-xs text-amber-800">
                          <AlertCircle className="h-3.5 w-3.5 flex-shrink-0 mt-0.5" />
                          <span>API note: {msg.fetchError}</span>
                        </div>
                      )}

                      {msg.total != null && msg.total > 0 && (
                        <div className="mt-3 flex items-center gap-3 text-xs text-slate-500">
                          <Info className="h-3.5 w-3.5" />
                          <span>{msg.total.toLocaleString()} total records found • Showing top {msg.results?.length || 0}</span>
                          <a
                            href="https://www.usaspending.gov/search"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="ml-auto flex items-center gap-1 text-blue-600 hover:underline font-medium"
                          >
                            Full results on USASpending.gov <ExternalLink className="h-3 w-3" />
                          </a>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Results table */}
                  {msg.results && msg.results.length > 0 && (
                    <ResultsTable results={msg.results} />
                  )}
                </div>
              )}
            </div>
          ))
        )}

        {/* Loading state */}
        {isLoading && (
          <div className="flex justify-start">
            <Card className="border-slate-200 shadow-sm">
              <CardContent className="pt-4 pb-3 flex items-center gap-3">
                <div className="h-7 w-7 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                  <Loader2 className="h-3.5 w-3.5 text-emerald-600 animate-spin" />
                </div>
                <div className="space-y-1.5">
                  <div className="h-2 w-48 bg-slate-200 rounded animate-pulse" />
                  <div className="h-2 w-64 bg-slate-100 rounded animate-pulse" />
                  <div className="h-2 w-40 bg-slate-100 rounded animate-pulse" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* ── Input bar ── */}
      <div className="flex-shrink-0">
        <Separator className="mb-3" />
        <form
          onSubmit={(e) => { e.preventDefault(); handleSearch(); }}
          className="flex gap-2"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
            <Input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask about federal spending… e.g. 'Top 10 defense contractors in 2024'"
              className="pl-9 border-slate-300 focus-visible:ring-emerald-500 focus-visible:border-emerald-500"
              disabled={isLoading}
            />
          </div>
          <Button
            type="submit"
            disabled={isLoading || !query.trim()}
            className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2 px-5"
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
            <span className="hidden sm:inline">Search</span>
          </Button>
        </form>
        <p className="text-xs text-slate-400 mt-2 text-center">
          Data sourced live from{" "}
          <a href="https://www.usaspending.gov" target="_blank" rel="noopener noreferrer" className="hover:underline">
            USASpending.gov
          </a>{" "}
          public API • No API key required • AI summaries require OpenAI key
        </p>
      </div>
    </div>
  );
}
