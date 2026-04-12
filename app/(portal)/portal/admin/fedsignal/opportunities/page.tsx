"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Plus, Search } from "lucide-react";

interface OpportunityRow {
  id: string;
  title: string;
  agency: string;
  solicitation: string;
  type: string;
  status: string;
  matchScore: number;
  amount: string;
  deadline: string;
  isHbcuSetAside: boolean;
  tags: string[];
}

const sampleOpportunities: OpportunityRow[] = [
  { id: "1", title: "NSA HBCU/MSI Cybersecurity Research Initiative — Phase II", agency: "NSA", solicitation: "W52P1J-25-R-0044", type: "contract", status: "open", matchScore: 94, amount: "$750K", deadline: "2025-05-01", isHbcuSetAside: true, tags: ["Cyber", "HBCU Set-Aside"] },
  { id: "2", title: "NSF EHR Core Research — Broadening Participation in STEM", agency: "NSF", solicitation: "NSF 25-537", type: "grant", status: "open", matchScore: 91, amount: "$500K", deadline: "2025-05-10", isHbcuSetAside: false, tags: ["STEM", "Grant"] },
  { id: "3", title: "DoD HBCU/MSI Science & Technology — FY2025", agency: "ONR", solicitation: "BAA N00014-25-S-B001", type: "grant", status: "open", matchScore: 88, amount: "$1.2M", deadline: "2025-05-20", isHbcuSetAside: true, tags: ["Defense", "Grant"] },
  { id: "4", title: "AFRL HBCU Autonomy & AI Research Partnership", agency: "AFRL", solicitation: "FA8750-25-S-7001", type: "contract", status: "open", matchScore: 77, amount: "$850K", deadline: "2025-06-01", isHbcuSetAside: false, tags: ["AI/ML", "Defense"] },
  { id: "5", title: "DOE HBCU Clean Energy Research", agency: "DOE", solicitation: "DE-FOA-0003100", type: "grant", status: "open", matchScore: 72, amount: "$400K", deadline: "2025-06-15", isHbcuSetAside: true, tags: ["Energy", "HBCU"] },
];

function getScoreColor(score: number): string {
  if (score >= 90) return "text-green-700 bg-green-50 border-green-200";
  if (score >= 70) return "text-amber-700 bg-amber-50 border-amber-200";
  return "text-red-700 bg-red-50 border-red-200";
}

function getStatusColor(status: string): "default" | "secondary" | "destructive" | "outline" {
  switch (status) {
    case "open": return "default";
    case "closed": return "secondary";
    case "awarded": return "outline";
    default: return "secondary";
  }
}

export default function FSOpportunitiesAdminPage() {
  const [search, setSearch] = useState("");
  const filtered = sampleOpportunities.filter(
    (o) => o.title.toLowerCase().includes(search.toLowerCase()) || o.agency.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/portal/admin/fedsignal">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Opportunities</h1>
          <p className="text-sm text-muted-foreground">Manage government funding opportunities for HBCUs</p>
        </div>
      </div>

      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search opportunities..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Opportunity
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/40">
                  <th className="text-center px-3 py-3 font-medium w-16">Match</th>
                  <th className="text-left px-4 py-3 font-medium">Opportunity</th>
                  <th className="text-left px-4 py-3 font-medium">Type</th>
                  <th className="text-right px-4 py-3 font-medium">Amount</th>
                  <th className="text-left px-4 py-3 font-medium">Deadline</th>
                  <th className="text-center px-4 py-3 font-medium">Status</th>
                  <th className="text-right px-4 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((opp) => (
                  <tr key={opp.id} className="border-b hover:bg-muted/20 transition-colors">
                    <td className="px-3 py-3 text-center">
                      <span className={`inline-flex items-center justify-center w-10 h-10 rounded-full border-2 font-mono text-xs font-semibold ${getScoreColor(opp.matchScore)}`}>
                        {opp.matchScore}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium text-sm">{opp.title}</div>
                      <div className="text-xs text-muted-foreground font-mono mt-0.5">{opp.agency} · {opp.solicitation}</div>
                      <div className="flex gap-1 mt-1.5 flex-wrap">
                        {opp.isHbcuSetAside && <Badge variant="outline" className="text-[10px] border-amber-300 text-amber-700 bg-amber-50">HBCU Set-Aside</Badge>}
                        {opp.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="text-[10px]">{tag}</Badge>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3 capitalize">{opp.type}</td>
                    <td className="px-4 py-3 text-right font-mono font-semibold">{opp.amount}</td>
                    <td className="px-4 py-3 text-sm">{new Date(opp.deadline).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</td>
                    <td className="px-4 py-3 text-center">
                      <Badge variant={getStatusColor(opp.status)} className="text-[10px] capitalize">{opp.status}</Badge>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Button variant="ghost" size="sm">Edit</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
