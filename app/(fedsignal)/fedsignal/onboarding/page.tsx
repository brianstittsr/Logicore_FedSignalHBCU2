"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, CheckCircle2, ChevronRight, ChevronLeft, GraduationCap, Users, Shield, FileText, Mail, Sparkles } from "lucide-react";

interface OnboardingFormData {
  // Step 1: Institution Profile
  universityName: string;
  acronym: string;
  state: string;
  website: string;
  enrollment: string;
  researchClassification: string;
  primaryColor: string;
  secondaryColor: string;

  // Step 2: Primary Contact
  primaryContactName: string;
  primaryContactTitle: string;
  primaryContactEmail: string;
  primaryContactPhone: string;

  // Step 3: Capabilities
  capabilities: string[];

  // Step 4: Team Members
  teamMembers: { name: string; email: string; role: string }[];

  // Step 5: SAM.gov
  samRegistered: boolean;
  ueiNumber: string;
  cageCode: string;
}

const researchClassifications = ["R1", "R2", "R3", "none"];
const capabilityOptions = [
  "Cybersecurity",
  "AI / Machine Learning",
  "Aerospace Engineering",
  "Biomedical Research",
  "Agricultural Science",
  "Renewable Energy",
  "STEM Education",
  "Data Science",
  "Materials Science",
  "Defense Research",
];

const roleOptions = [
  { value: "vp_research", label: "VP Research / Research Director" },
  { value: "researcher", label: "Faculty / Researcher" },
  { value: "bd_manager", label: "Business Development" },
  { value: "admin_staff", label: "Administrative Staff" },
];

const steps = [
  { id: 1, label: "Institution Profile", icon: GraduationCap },
  { id: 2, label: "Primary Contact", icon: Shield },
  { id: 3, label: "Capabilities", icon: Sparkles },
  { id: 4, label: "Team Setup", icon: Users },
  { id: 5, label: "SAM.gov Status", icon: FileText },
  { id: 6, label: "Review & Submit", icon: CheckCircle2 },
];

export default function HBCUOnboardingWizard() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  
  const [formData, setFormData] = useState<OnboardingFormData>({
    universityName: "",
    acronym: "",
    state: "",
    website: "",
    enrollment: "",
    researchClassification: "R2",
    primaryColor: "#1a56db",
    secondaryColor: "#0f2a4a",
    primaryContactName: "",
    primaryContactTitle: "",
    primaryContactEmail: "",
    primaryContactPhone: "",
    capabilities: [],
    teamMembers: [{ name: "", email: "", role: "researcher" }],
    samRegistered: false,
    ueiNumber: "",
    cageCode: "",
  });

  const progress = ((currentStep - 1) / (steps.length - 1)) * 100;

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    // TODO: Save to Firestore and send invitation emails
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsSubmitting(false);
    setIsComplete(true);
  };

  const updateFormData = (field: keyof OnboardingFormData, value: any) => {
    setFormData({ ...formData, [field]: value });
  };

  const addTeamMember = () => {
    setFormData({
      ...formData,
      teamMembers: [...formData.teamMembers, { name: "", email: "", role: "researcher" }],
    });
  };

  const updateTeamMember = (index: number, field: string, value: string) => {
    const updated = [...formData.teamMembers];
    updated[index] = { ...updated[index], [field]: value };
    setFormData({ ...formData, teamMembers: updated });
  };

  const removeTeamMember = (index: number) => {
    setFormData({
      ...formData,
      teamMembers: formData.teamMembers.filter((_, i) => i !== index),
    });
  };

  const toggleCapability = (capability: string) => {
    setFormData({
      ...formData,
      capabilities: formData.capabilities.includes(capability)
        ? formData.capabilities.filter(c => c !== capability)
        : [...formData.capabilities, capability],
    });
  };

  if (isComplete) {
    return (
      <div className="min-h-screen bg-[#f4f6f9] flex items-center justify-center p-6">
        <Card className="max-w-lg w-full text-center">
          <CardContent className="pt-10 pb-10">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="h-10 w-10 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold mb-3">Registration Submitted!</h1>
            <p className="text-muted-foreground mb-6">
              Thank you for registering {formData.universityName} with FedSignal. 
              Your team will receive invitation emails to create their accounts.
            </p>
            <div className="bg-muted p-4 rounded-lg mb-6 text-left">
              <div className="text-sm text-muted-foreground mb-1">Registration ID</div>
              <div className="font-mono font-bold">FS-{Date.now().toString(36).toUpperCase()}</div>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">What happens next?</p>
              <ul className="text-sm text-left space-y-2 max-w-sm mx-auto">
                <li className="flex items-start gap-2">
                  <Mail className="h-4 w-4 mt-0.5 text-primary" />
                  <span>Invitation emails sent to {formData.teamMembers.length} team members</span>
                </li>
                <li className="flex items-start gap-2">
                  <Shield className="h-4 w-4 mt-0.5 text-primary" />
                  <span>Platform admin will review and approve your registration</span>
                </li>
                <li className="flex items-start gap-2">
                  <Sparkles className="h-4 w-4 mt-0.5 text-primary" />
                  <span>You'll receive access to the full FedSignal platform</span>
                </li>
              </ul>
            </div>
            <Button className="mt-8" asChild>
              <Link href="/fedsignal">Go to FedSignal Home</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f4f6f9]">
      {/* Header */}
      <div className="bg-[#0f2a4a] text-white p-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/fedsignal" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-[#1a56db] flex items-center justify-center font-bold text-sm">FS</div>
            <span className="font-bold">FedSignal</span>
          </Link>
          <div className="text-sm text-white/70">HBCU Registration</div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            {steps.map((step) => (
              <div key={step.id} className={`flex flex-col items-center ${step.id <= currentStep ? "text-[#1a56db]" : "text-muted-foreground"}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-1 ${
                  step.id < currentStep ? "bg-green-500 text-white" :
                  step.id === currentStep ? "bg-[#1a56db] text-white" :
                  "bg-muted"
                }`}>
                  {step.id < currentStep ? <CheckCircle2 className="h-5 w-5" /> : <step.icon className="h-5 w-5" />}
                </div>
                <span className="text-xs font-medium">{step.label}</span>
              </div>
            ))}
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Step Content */}
        <Card>
          <CardHeader>
            <CardTitle>{steps[currentStep - 1].label}</CardTitle>
            <CardDescription>
              {currentStep === 1 && "Tell us about your institution"}
              {currentStep === 2 && "Who is the primary point of contact?"}
              {currentStep === 3 && "What are your research capabilities?"}
              {currentStep === 4 && "Add team members who need access"}
              {currentStep === 5 && "SAM.gov registration status"}
              {currentStep === 6 && "Review your information before submitting"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Step 1: Institution Profile */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>University Name *</Label>
                    <Input
                      value={formData.universityName}
                      onChange={(e) => updateFormData("universityName", e.target.value)}
                      placeholder="e.g., Tuskegee University"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Acronym *</Label>
                    <Input
                      value={formData.acronym}
                      onChange={(e) => updateFormData("acronym", e.target.value)}
                      placeholder="e.g., TU"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>State *</Label>
                    <select
                      value={formData.state}
                      onChange={(e) => updateFormData("state", e.target.value)}
                      className="w-full border rounded-md px-3 py-2 bg-background"
                    >
                      <option value="">Select State</option>
                      {["AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA", "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD", "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ", "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC", "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY", "DC"].map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label>Enrollment</Label>
                    <Input
                      type="number"
                      value={formData.enrollment}
                      onChange={(e) => updateFormData("enrollment", e.target.value)}
                      placeholder="e.g., 2800"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Website</Label>
                  <Input
                    value={formData.website}
                    onChange={(e) => updateFormData("website", e.target.value)}
                    placeholder="https://www.university.edu"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Research Classification</Label>
                  <div className="flex gap-2">
                    {researchClassifications.map((rc) => (
                      <button
                        key={rc}
                        type="button"
                        onClick={() => updateFormData("researchClassification", rc)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                          formData.researchClassification === rc
                            ? "bg-[#1a56db] text-white"
                            : "bg-muted hover:bg-muted/80"
                        }`}
                      >
                        {rc.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Brand Colors</Label>
                  <div className="flex gap-4">
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={formData.primaryColor}
                        onChange={(e) => updateFormData("primaryColor", e.target.value)}
                        className="w-10 h-10 rounded cursor-pointer"
                      />
                      <span className="text-sm">Primary</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={formData.secondaryColor}
                        onChange={(e) => updateFormData("secondaryColor", e.target.value)}
                        className="w-10 h-10 rounded cursor-pointer"
                      />
                      <span className="text-sm">Secondary</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Primary Contact */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Full Name *</Label>
                  <Input
                    value={formData.primaryContactName}
                    onChange={(e) => updateFormData("primaryContactName", e.target.value)}
                    placeholder="Dr. Jane Smith"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Title *</Label>
                  <Input
                    value={formData.primaryContactTitle}
                    onChange={(e) => updateFormData("primaryContactTitle", e.target.value)}
                    placeholder="Vice President of Research"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Email Address *</Label>
                  <Input
                    type="email"
                    value={formData.primaryContactEmail}
                    onChange={(e) => updateFormData("primaryContactEmail", e.target.value)}
                    placeholder="vp.research@university.edu"
                  />
                  <p className="text-xs text-muted-foreground">This will be your platform admin account</p>
                </div>
                <div className="space-y-2">
                  <Label>Phone Number</Label>
                  <Input
                    value={formData.primaryContactPhone}
                    onChange={(e) => updateFormData("primaryContactPhone", e.target.value)}
                    placeholder="(555) 123-4567"
                  />
                </div>
              </div>
            )}

            {/* Step 3: Capabilities */}
            {currentStep === 3 && (
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">Select all research areas where your institution has expertise:</p>
                <div className="flex flex-wrap gap-2">
                  {capabilityOptions.map((capability) => (
                    <button
                      key={capability}
                      type="button"
                      onClick={() => toggleCapability(capability)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                        formData.capabilities.includes(capability)
                          ? "bg-[#1a56db] text-white"
                          : "bg-muted hover:bg-muted/80"
                      }`}
                    >
                      {formData.capabilities.includes(capability) && "✓ "}
                      {capability}
                    </button>
                  ))}
                </div>
                <div className="pt-4">
                  <div className="text-sm font-medium mb-2">Selected ({formData.capabilities.length}):</div>
                  <div className="flex flex-wrap gap-2">
                    {formData.capabilities.map((cap) => (
                      <span key={cap} className="px-3 py-1 bg-[#1a56db]/10 text-[#1a56db] rounded-full text-sm">
                        {cap}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Team Members */}
            {currentStep === 4 && (
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Add team members who need access to FedSignal. They will receive invitation emails to create their accounts.
                </p>
                {formData.teamMembers.map((member, index) => (
                  <div key={index} className="p-4 border rounded-lg space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Team Member {index + 1}</span>
                      {index > 0 && (
                        <button
                          type="button"
                          onClick={() => removeTeamMember(index)}
                          className="text-red-600 text-sm hover:underline"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <Input
                        placeholder="Full Name"
                        value={member.name}
                        onChange={(e) => updateTeamMember(index, "name", e.target.value)}
                      />
                      <Input
                        type="email"
                        placeholder="Email Address"
                        value={member.email}
                        onChange={(e) => updateTeamMember(index, "email", e.target.value)}
                      />
                    </div>
                    <select
                      value={member.role}
                      onChange={(e) => updateTeamMember(index, "role", e.target.value)}
                      className="w-full border rounded-md px-3 py-2 bg-background"
                    >
                      {roleOptions.map((role) => (
                        <option key={role.value} value={role.value}>{role.label}</option>
                      ))}
                    </select>
                  </div>
                ))}
                <Button type="button" variant="outline" onClick={addTeamMember} className="w-full">
                  + Add Another Team Member
                </Button>
              </div>
            )}

            {/* Step 5: SAM.gov */}
            {currentStep === 5 && (
              <div className="space-y-4">
                <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <FileText className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div className="text-sm text-blue-800">
                    <strong>SAM.gov Registration</strong>
                    <p className="mt-1">
                      FedSignal tracks your SAM.gov status to show relevant opportunities. You can complete registration later.
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="flex items-center gap-3 p-4 border rounded-lg cursor-pointer hover:bg-muted/50">
                    <input
                      type="radio"
                      name="samStatus"
                      checked={formData.samRegistered}
                      onChange={() => updateFormData("samRegistered", true)}
                      className="w-4 h-4"
                    />
                    <div>
                      <div className="font-medium">Registered in SAM.gov</div>
                      <div className="text-sm text-muted-foreground">I have an active SAM.gov registration</div>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 p-4 border rounded-lg cursor-pointer hover:bg-muted/50">
                    <input
                      type="radio"
                      name="samStatus"
                      checked={!formData.samRegistered}
                      onChange={() => updateFormData("samRegistered", false)}
                      className="w-4 h-4"
                    />
                    <div>
                      <div className="font-medium">Not Yet Registered</div>
                      <div className="text-sm text-muted-foreground">I will complete SAM.gov registration soon</div>
                    </div>
                  </label>
                </div>

                {formData.samRegistered && (
                  <div className="space-y-4 pt-2">
                    <div className="space-y-2">
                      <Label>Unique Entity ID (UEI)</Label>
                      <Input
                        value={formData.ueiNumber}
                        onChange={(e) => updateFormData("ueiNumber", e.target.value)}
                        placeholder="12-character UEI"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>CAGE Code (if assigned)</Label>
                      <Input
                        value={formData.cageCode}
                        onChange={(e) => updateFormData("cageCode", e.target.value)}
                        placeholder="5-character CAGE"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Step 6: Review */}
            {currentStep === 6 && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-muted-foreground">University</div>
                    <div className="font-medium">{formData.universityName || "-"}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">State</div>
                    <div className="font-medium">{formData.state || "-"}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Primary Contact</div>
                    <div className="font-medium">{formData.primaryContactName || "-"}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Contact Email</div>
                    <div className="font-medium">{formData.primaryContactEmail || "-"}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Capabilities</div>
                    <div className="font-medium">{formData.capabilities.length} selected</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Team Members</div>
                    <div className="font-medium">{formData.teamMembers.length} invited</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">SAM.gov</div>
                    <div className="font-medium">{formData.samRegistered ? "Registered" : "Not yet registered"}</div>
                  </div>
                </div>

                <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                  <p className="text-sm text-amber-800">
                    By submitting, you confirm that you are authorized to register this institution with FedSignal and that all information provided is accurate.
                  </p>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex justify-between pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleBack}
                disabled={currentStep === 1}
              >
                <ChevronLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              
              {currentStep < steps.length ? (
                <Button type="button" onClick={handleNext}>
                  Next
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              ) : (
                <Button onClick={handleSubmit} disabled={isSubmitting}>
                  {isSubmitting ? "Submitting..." : (
                    <>
                      Submit Registration
                      <CheckCircle2 className="h-4 w-4 ml-2" />
                    </>
                  )}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
