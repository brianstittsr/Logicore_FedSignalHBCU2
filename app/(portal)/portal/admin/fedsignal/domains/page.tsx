"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Plus, Save, Trash2 } from "lucide-react";

interface FundingDomain {
  id: string;
  name: string;
  totalFunding: number;
  color: string;
}

const initialDomains: FundingDomain[] = [
  { id: "1", name: "Cybersecurity", totalFunding: 218000000, color: "#1a56db" },
  { id: "2", name: "Defense R&D", totalFunding: 320000000, color: "#166534" },
  { id: "3", name: "AI / ML", totalFunding: 142000000, color: "#5b21b6" },
  { id: "4", name: "Energy / Grid", totalFunding: 185000000, color: "#0e7490" },
  { id: "5", name: "STEM Education", totalFunding: 96000000, color: "#92400e" },
];

function formatCurrency(value: number): string {
  if (value >= 1000000) return `$${(value / 1000000).toFixed(0)}M`;
  if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
  return `$${value}`;
}

export default function FSDomainsAdminPage() {
  const [domains, setDomains] = useState<FundingDomain[]>(initialDomains);

  const maxFunding = Math.max(...domains.map((d) => d.totalFunding));

  const updateDomain = (id: string, field: keyof FundingDomain, value: string | number) => {
    setDomains(domains.map((d) => (d.id === id ? { ...d, [field]: value } : d)));
  };

  const removeDomain = (id: string) => {
    setDomains(domains.filter((d) => d.id !== id));
  };

  const addDomain = () => {
    const newId = String(Date.now());
    setDomains([...domains, { id: newId, name: "New Domain", totalFunding: 0, color: "#6b7280" }]);
  };

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
          <h1 className="text-2xl font-bold">Funding Domains</h1>
          <p className="text-sm text-muted-foreground">Configure funding domains and their totals shown on the dashboard</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Domain Editor */}
        <Card>
          <CardHeader>
            <CardTitle>Domains</CardTitle>
            <CardDescription>Edit domain names, funding totals, and colors</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {domains.map((domain) => (
              <div key={domain.id} className="flex items-center gap-3 p-3 border rounded-lg">
                <input
                  type="color"
                  value={domain.color}
                  onChange={(e) => updateDomain(domain.id, "color", e.target.value)}
                  className="w-8 h-8 rounded cursor-pointer border-0"
                />
                <Input
                  value={domain.name}
                  onChange={(e) => updateDomain(domain.id, "name", e.target.value)}
                  className="flex-1"
                  placeholder="Domain name"
                />
                <Input
                  type="number"
                  value={domain.totalFunding}
                  onChange={(e) => updateDomain(domain.id, "totalFunding", parseInt(e.target.value) || 0)}
                  className="w-36"
                  placeholder="Total funding"
                />
                <Button variant="ghost" size="sm" onClick={() => removeDomain(domain.id)}>
                  <Trash2 className="h-4 w-4 text-muted-foreground" />
                </Button>
              </div>
            ))}
            <Button variant="outline" onClick={addDomain} className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Add Domain
            </Button>
          </CardContent>
        </Card>

        {/* Preview */}
        <Card>
          <CardHeader>
            <CardTitle>Preview</CardTitle>
            <CardDescription>How funding domains appear on the dashboard</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {domains.map((domain) => (
                <div key={domain.id}>
                  <div className="flex justify-between mb-1.5 text-[13px]">
                    <span className="font-medium">{domain.name}</span>
                    <span className="font-mono font-semibold" style={{ color: domain.color }}>
                      {formatCurrency(domain.totalFunding)}
                    </span>
                  </div>
                  <div className="h-1.5 bg-muted rounded-sm overflow-hidden">
                    <div
                      className="h-full rounded-sm transition-all duration-500"
                      style={{
                        width: maxFunding > 0 ? `${(domain.totalFunding / maxFunding) * 100}%` : "0%",
                        backgroundColor: domain.color,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end">
        <Button>
          <Save className="h-4 w-4 mr-2" />
          Save Domains
        </Button>
      </div>
    </div>
  );
}
