"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Database, AlertTriangle, CheckCircle2, Loader2 } from "lucide-react";

interface SeedCollection {
  name: string;
  firestoreName: string;
  recordCount: number;
  description: string;
  status: "ready" | "seeded" | "seeding";
}

export default function FSSeedAdminPage() {
  const [collections, setCollections] = useState<SeedCollection[]>([
    { name: "Universities", firestoreName: "fs_universities", recordCount: 6, description: "HBCU/MSI institutions with colors, capabilities, and GovCon scores", status: "ready" },
    { name: "Opportunities", firestoreName: "fs_opportunities", recordCount: 12, description: "Government funding opportunities with match scores and deadlines", status: "ready" },
    { name: "Alerts", firestoreName: "fs_alerts", recordCount: 6, description: "Strategic alerts for deadline, intelligence, and partnership events", status: "ready" },
    { name: "Consortiums", firestoreName: "fs_consortiums", recordCount: 3, description: "Multi-university partnerships for collaborative proposals", status: "ready" },
    { name: "Contacts", firestoreName: "fs_contacts", recordCount: 10, description: "Prime contractors, agency contacts, and partner relationships", status: "ready" },
    { name: "Capabilities", firestoreName: "fs_capabilities", recordCount: 15, description: "Research capabilities and department expertise", status: "ready" },
    { name: "Settings", firestoreName: "fs_settings", recordCount: 1, description: "Platform configuration, feature flags, and phase banner", status: "ready" },
  ]);

  const [seedingAll, setSeedingAll] = useState(false);

  const seedCollection = async (index: number) => {
    const updated = [...collections];
    updated[index].status = "seeding";
    setCollections(updated);

    // Simulate seeding delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    updated[index].status = "seeded";
    setCollections([...updated]);
  };

  const seedAll = async () => {
    setSeedingAll(true);
    for (let i = 0; i < collections.length; i++) {
      await seedCollection(i);
    }
    setSeedingAll(false);
  };

  const allSeeded = collections.every((c) => c.status === "seeded");
  const totalRecords = collections.reduce((sum, c) => sum + c.recordCount, 0);

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
          <h1 className="text-2xl font-bold">Database Seeder</h1>
          <p className="text-sm text-muted-foreground">Seed Firestore with sample FedSignal data for development</p>
        </div>
      </div>

      {/* Warning */}
      <div className="flex items-center gap-3 p-4 bg-amber-50 border border-amber-200 rounded-lg text-amber-800">
        <AlertTriangle className="h-5 w-5 flex-shrink-0" />
        <div className="text-sm">
          <strong>Development Only:</strong> This will write sample data to your Firestore database. Existing documents in these collections will not be overwritten, but new sample data will be added.
        </div>
      </div>

      {/* Summary */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          {collections.length} collections · {totalRecords} total records
        </div>
        <Button onClick={seedAll} disabled={seedingAll || allSeeded}>
          {seedingAll ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Seeding...
            </>
          ) : allSeeded ? (
            <>
              <CheckCircle2 className="h-4 w-4 mr-2" />
              All Seeded
            </>
          ) : (
            <>
              <Database className="h-4 w-4 mr-2" />
              Seed All Collections
            </>
          )}
        </Button>
      </div>

      {/* Collections */}
      <div className="grid grid-cols-1 gap-3">
        {collections.map((col, index) => (
          <Card key={col.firestoreName} className="hover:shadow-sm transition-shadow">
            <CardContent className="py-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-[#0f2a4a]/5 flex items-center justify-center">
                  <Database className="h-5 w-5 text-[#1a56db]" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{col.name}</span>
                    <code className="text-[10px] bg-muted px-1.5 py-0.5 rounded font-mono">{col.firestoreName}</code>
                    <Badge variant="outline" className="text-[10px]">{col.recordCount} records</Badge>
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5">{col.description}</div>
                </div>
              </div>
              <Button
                variant={col.status === "seeded" ? "outline" : "default"}
                size="sm"
                onClick={() => seedCollection(index)}
                disabled={col.status === "seeding" || col.status === "seeded"}
              >
                {col.status === "seeding" ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : col.status === "seeded" ? (
                  <>
                    <CheckCircle2 className="h-4 w-4 mr-1" />
                    Done
                  </>
                ) : (
                  "Seed"
                )}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
