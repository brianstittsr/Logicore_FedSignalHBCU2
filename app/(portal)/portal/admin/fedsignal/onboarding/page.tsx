"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Plus, Mail, CheckCircle2, Clock, AlertCircle, GraduationCap, Send, Eye, ChevronRight } from "lucide-react";

interface OnboardingRecord {
  id: string;
  universityName: string;
  state: string;
  primaryContact: string;
  contactEmail: string;
  progress: number;
  status: "in_progress" | "completed" | "pending" | "abandoned";
  startedAt: string;
  lastActivity: string;
  teamMembers: TeamMember[];
  completedSteps: string[];
}

interface TeamMember {
  id: string;
  email: string;
  name: string;
  role: string;
  invitationStatus: "pending" | "accepted" | "expired";
  invitedAt: string;
  acceptedAt?: string;
}

const sampleOnboardings: OnboardingRecord[] = [
  {
    id: "1",
    universityName: "Alcorn State University",
    state: "MS",
    primaryContact: "Dr. Michael Thompson",
    contactEmail: "mthompson@alcorn.edu",
    progress: 85,
    status: "in_progress",
    startedAt: "2025-04-01",
    lastActivity: "2025-04-10",
    completedSteps: ["institution_profile", "capability_assessment", "team_setup"],
    teamMembers: [
      { id: "1", email: "mthompson@alcorn.edu", name: "Dr. Michael Thompson", role: "VP Research", invitationStatus: "accepted", invitedAt: "2025-04-01", acceptedAt: "2025-04-01" },
      { id: "2", email: "research@alcorn.edu", name: "Research Office", role: "Researcher", invitationStatus: "pending", invitedAt: "2025-04-05" },
      { id: "3", email: "bd@alcorn.edu", name: "Business Development", role: "BD Manager", invitationStatus: "pending", invitedAt: "2025-04-08" },
    ],
  },
  {
    id: "2",
    universityName: "Prairie View A&M University",
    state: "TX",
    primaryContact: "Dr. Sarah Williams",
    contactEmail: "swilliams@pvamu.edu",
    progress: 45,
    status: "in_progress",
    startedAt: "2025-04-05",
    lastActivity: "2025-04-09",
    completedSteps: ["institution_profile"],
    teamMembers: [
      { id: "4", email: "swilliams@pvamu.edu", name: "Dr. Sarah Williams", role: "VP Research", invitationStatus: "accepted", invitedAt: "2025-04-05", acceptedAt: "2025-04-05" },
    ],
  },
  {
    id: "3",
    universityName: "Morgan State University",
    state: "MD",
    primaryContact: "Dr. Robert Johnson",
    contactEmail: "rjohnson@morgan.edu",
    progress: 100,
    status: "completed",
    startedAt: "2025-03-15",
    lastActivity: "2025-04-02",
    completedSteps: ["institution_profile", "capability_assessment", "team_setup", "training_completed"],
    teamMembers: [
      { id: "5", email: "rjohnson@morgan.edu", name: "Dr. Robert Johnson", role: "VP Research", invitationStatus: "accepted", invitedAt: "2025-03-15", acceptedAt: "2025-03-15" },
      { id: "6", email: "research@morgan.edu", name: "Research Team", role: "Researcher", invitationStatus: "accepted", invitedAt: "2025-03-16", acceptedAt: "2025-03-17" },
    ],
  },
];

const onboardingSteps = [
  { id: "institution_profile", label: "Institution Profile", description: "Basic info, colors, enrollment" },
  { id: "capability_assessment", label: "Capability Assessment", description: "Research areas, faculty expertise" },
  { id: "team_setup", label: "Team Setup", description: "Add key personnel and send invites" },
  { id: "sam_registration", label: "SAM.gov Registration", description: "Verify federal registration status" },
  { id: "training_completed", label: "Platform Training", description: "Complete onboarding tutorial" },
];

function getStatusColor(status: string) {
  switch (status) {
    case "completed": return "bg-green-100 text-green-800 border-green-200";
    case "in_progress": return "bg-blue-100 text-blue-800 border-blue-200";
    case "pending": return "bg-amber-100 text-amber-800 border-amber-200";
    default: return "bg-gray-100 text-gray-800";
  }
}

function getInvitationStatusColor(status: string) {
  switch (status) {
    case "accepted": return "bg-green-100 text-green-800";
    case "pending": return "bg-amber-100 text-amber-800";
    case "expired": return "bg-red-100 text-red-800";
    default: return "bg-gray-100 text-gray-800";
  }
}

export default function FSOnboardingPage() {
  const [selectedOnboarding, setSelectedOnboarding] = useState<OnboardingRecord | null>(null);
  const [newInviteEmail, setNewInviteEmail] = useState("");
  const [newInviteName, setNewInviteName] = useState("");
  const [newInviteRole, setNewInviteRole] = useState("researcher");

  const handleSendInvitation = () => {
    if (!newInviteEmail || !selectedOnboarding) return;
    // TODO: Send invitation email and create Firebase user
    alert(`Invitation sent to ${newInviteEmail}`);
    setNewInviteEmail("");
    setNewInviteName("");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/portal/admin/fedsignal">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold">HBCU Onboarding</h1>
          <p className="text-sm text-muted-foreground">Manage university registration wizard and team member invitations</p>
        </div>
        <div className="ml-auto">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Start New Onboarding
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "In Progress", value: "2", color: "text-blue-600" },
          { label: "Completed", value: "1", color: "text-green-600" },
          { label: "Pending Invites", value: "3", color: "text-amber-600" },
          { label: "Total Universities", value: "3", color: "text-purple-600" },
        ].map((stat) => (
          <Card key={stat.label}>
            <CardContent className="pt-6">
              <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Onboarding List */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Active Onboardings</h2>
          {sampleOnboardings.map((onboarding) => (
            <Card
              key={onboarding.id}
              className={`cursor-pointer transition-all ${selectedOnboarding?.id === onboarding.id ? "ring-2 ring-primary" : "hover:shadow-md"}`}
              onClick={() => setSelectedOnboarding(onboarding)}
            >
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[#0f2a4a] text-white flex items-center justify-center font-bold">
                      {onboarding.universityName.split(" ").map(n => n[0]).join("").slice(0, 2)}
                    </div>
                    <div>
                      <div className="font-semibold">{onboarding.universityName}</div>
                      <div className="text-xs text-muted-foreground">{onboarding.state} · Started {new Date(onboarding.startedAt).toLocaleDateString()}</div>
                    </div>
                  </div>
                  <Badge className={getStatusColor(onboarding.status)}>
                    {onboarding.status.replace("_", " ")}
                  </Badge>
                </div>
                <div className="mt-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-medium">{onboarding.progress}%</span>
                  </div>
                  <Progress value={onboarding.progress} className="h-2" />
                </div>
                <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3" />
                    {onboarding.completedSteps.length}/{onboardingSteps.length} steps
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    Last active {new Date(onboarding.lastActivity).toLocaleDateString()}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Detail View */}
        {selectedOnboarding ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">{selectedOnboarding.universityName}</h2>
              <Button variant="outline" size="sm">
                <Eye className="h-4 w-4 mr-2" />
                View as User
              </Button>
            </div>

            {/* Progress Steps */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Onboarding Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {onboardingSteps.map((step, index) => {
                    const isCompleted = selectedOnboarding.completedSteps.includes(step.id);
                    return (
                      <div key={step.id} className="flex items-start gap-3">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                          isCompleted ? "bg-green-500 text-white" : "bg-muted text-muted-foreground"
                        }`}>
                          {isCompleted ? <CheckCircle2 className="h-4 w-4" /> : index + 1}
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-sm">{step.label}</div>
                          <div className="text-xs text-muted-foreground">{step.description}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Team Members */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center justify-between">
                  <span>Team Members & Invitations</span>
                  <Badge variant="outline">{selectedOnboarding.teamMembers.length} members</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Invite Form */}
                <div className="p-3 bg-muted rounded-lg space-y-3">
                  <div className="text-sm font-medium">Send New Invitation</div>
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      placeholder="Full Name"
                      value={newInviteName}
                      onChange={(e) => setNewInviteName(e.target.value)}
                      className="text-sm"
                    />
                    <Input
                      placeholder="Email address"
                      value={newInviteEmail}
                      onChange={(e) => setNewInviteEmail(e.target.value)}
                      className="text-sm"
                    />
                  </div>
                  <div className="flex gap-2">
                    <select
                      value={newInviteRole}
                      onChange={(e) => setNewInviteRole(e.target.value)}
                      className="flex-1 border rounded px-2 py-1.5 text-sm bg-background"
                    >
                      <option value="researcher">Researcher</option>
                      <option value="bd_manager">BD Manager</option>
                      <option value="vp_research">VP Research</option>
                    </select>
                    <Button size="sm" onClick={handleSendInvitation} disabled={!newInviteEmail}>
                      <Send className="h-4 w-4 mr-1" />
                      Invite
                    </Button>
                  </div>
                </div>

                {/* Member List */}
                <div className="space-y-2">
                  {selectedOnboarding.teamMembers.map((member) => (
                    <div key={member.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs font-bold">
                          {member.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                        </div>
                        <div>
                          <div className="text-sm font-medium">{member.name}</div>
                          <div className="text-xs text-muted-foreground">{member.email} · {member.role}</div>
                        </div>
                      </div>
                      <Badge className={getInvitationStatusColor(member.invitationStatus)}>
                        {member.invitationStatus}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Primary Contact */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Primary Contact</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <GraduationCap className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="font-medium">{selectedOnboarding.primaryContact}</div>
                    <div className="text-sm text-muted-foreground">{selectedOnboarding.contactEmail}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="flex items-center justify-center h-96 border-2 border-dashed rounded-lg">
            <div className="text-center text-muted-foreground">
              <AlertCircle className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>Select an onboarding record to view details</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
