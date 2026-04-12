"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Save } from "lucide-react";

export default function FSSettingsAdminPage() {
  const [settings, setSettings] = useState({
    platformName: "FedSignal",
    currentFiscalYear: "FY2025",
    currentQuarter: "Q2",
    defaultUniversityId: "tuskegee",
    phaseBannerActive: true,
    phaseBannerLabel: "Phase 2 Active",
    phaseBannerMessage: "Leadership Intelligence + Partnership Marketplace now live. 3 consortiums pending your review.",
    enableProposalPal: true,
    enableRfiCreator: true,
    enableContentStudio: true,
    enableConsortiumWorkspace: true,
    enableSbriMatch: false,
  });

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
          <h1 className="text-2xl font-bold">Platform Settings</h1>
          <p className="text-sm text-muted-foreground">Configure FedSignal platform settings</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* General Settings */}
        <Card>
          <CardHeader>
            <CardTitle>General</CardTitle>
            <CardDescription>Core platform configuration</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="platformName">Platform Name</Label>
              <Input id="platformName" value={settings.platformName} onChange={(e) => setSettings({ ...settings, platformName: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fy">Fiscal Year</Label>
                <Input id="fy" value={settings.currentFiscalYear} onChange={(e) => setSettings({ ...settings, currentFiscalYear: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="q">Quarter</Label>
                <Input id="q" value={settings.currentQuarter} onChange={(e) => setSettings({ ...settings, currentQuarter: e.target.value })} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="defaultUni">Default University</Label>
              <select
                id="defaultUni"
                value={settings.defaultUniversityId}
                onChange={(e) => setSettings({ ...settings, defaultUniversityId: e.target.value })}
                className="w-full border border-input rounded-md px-3 py-2 text-sm bg-background"
              >
                <option value="tuskegee">Tuskegee University</option>
                <option value="howard">Howard University</option>
                <option value="famu">Florida A&M University</option>
                <option value="aamu">Alabama A&M University</option>
                <option value="ncat">NC A&T State University</option>
                <option value="morehouse">Morehouse College</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Phase Banner */}
        <Card>
          <CardHeader>
            <CardTitle>Phase Banner</CardTitle>
            <CardDescription>Configure the announcement banner shown on the dashboard</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="bannerActive"
                checked={settings.phaseBannerActive}
                onChange={(e) => setSettings({ ...settings, phaseBannerActive: e.target.checked })}
                className="rounded border-input"
              />
              <Label htmlFor="bannerActive">Show phase banner</Label>
            </div>
            <div className="space-y-2">
              <Label htmlFor="bannerLabel">Banner Label</Label>
              <Input id="bannerLabel" value={settings.phaseBannerLabel} onChange={(e) => setSettings({ ...settings, phaseBannerLabel: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bannerMessage">Banner Message</Label>
              <textarea
                id="bannerMessage"
                value={settings.phaseBannerMessage}
                onChange={(e) => setSettings({ ...settings, phaseBannerMessage: e.target.value })}
                className="w-full border border-input rounded-md px-3 py-2 text-sm bg-background min-h-[80px] resize-y"
              />
            </div>
          </CardContent>
        </Card>

        {/* Feature Flags */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Feature Flags</CardTitle>
            <CardDescription>Enable or disable FedSignal features</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[
                { key: "enableProposalPal", label: "Proposal Pal (AI)", desc: "AI-powered proposal writing assistant" },
                { key: "enableRfiCreator", label: "RFI Creator (AI)", desc: "Automated RFI response generator" },
                { key: "enableContentStudio", label: "Content Studio (AI)", desc: "Content creation and publishing" },
                { key: "enableConsortiumWorkspace", label: "Consortium Workspace", desc: "Multi-university collaboration" },
                { key: "enableSbriMatch", label: "SBIR/STTR Match", desc: "Small business research matching" },
              ].map((feature) => (
                <div key={feature.key} className="flex items-start gap-3 p-3 rounded-lg border">
                  <input
                    type="checkbox"
                    checked={settings[feature.key as keyof typeof settings] as boolean}
                    onChange={(e) => setSettings({ ...settings, [feature.key]: e.target.checked })}
                    className="mt-1 rounded border-input"
                  />
                  <div>
                    <div className="text-sm font-medium">{feature.label}</div>
                    <div className="text-xs text-muted-foreground">{feature.desc}</div>
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
          Save Settings
        </Button>
      </div>
    </div>
  );
}
