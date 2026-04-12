"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, Lock, Eye, EyeOff, Shield, AlertTriangle } from "lucide-react";

// This would normally come from validating the token against Firestore
const sampleInvitation = {
  email: "researcher@tuskegee.edu",
  university: "Tuskegee University",
  role: "Researcher",
  invitedBy: "Dr. James Wilson",
  expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
};

export default function InvitationAcceptancePage() {
  const params = useParams();
  const token = params.token as string;
  
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    password: "",
    confirmPassword: "",
    acceptTerms: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors: Record<string, string> = {};
    if (formData.password.length < 12) newErrors.password = "Password must be at least 12 characters";
    if (!/[A-Z]/.test(formData.password)) newErrors.password = "Password must contain an uppercase letter";
    if (!/[a-z]/.test(formData.password)) newErrors.password = "Password must contain a lowercase letter";
    if (!/[0-9]/.test(formData.password)) newErrors.password = "Password must contain a number";
    if (!/[!@#$%^&*]/.test(formData.password)) newErrors.password = "Password must contain a special character";
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Passwords do not match";
    if (!formData.acceptTerms) newErrors.acceptTerms = "You must accept the terms";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
    }
  };

  const handleSubmit = async () => {
    if (!validateStep2()) return;
    
    setIsSubmitting(true);
    // TODO: Create Firebase Auth user and link to invitation
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsSubmitting(false);
    setIsComplete(true);
  };

  if (isComplete) {
    return (
      <div className="min-h-screen bg-[#f4f6f9] flex items-center justify-center p-6">
        <Card className="max-w-md w-full text-center">
          <CardContent className="pt-10 pb-10">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="h-10 w-10 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold mb-3">Welcome to FedSignal!</h1>
            <p className="text-muted-foreground mb-6">
              Your account has been created successfully. You can now log in to access the {sampleInvitation.university} FedSignal dashboard.
            </p>
            <Button className="w-full" asChild>
              <Link href="/sign-in">Log In to FedSignal</Link>
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
        <div className="max-w-md mx-auto flex items-center justify-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-[#1a56db] flex items-center justify-center font-bold text-sm">FS</div>
            <span className="font-bold">FedSignal</span>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto p-6">
        <Card className="mt-8">
          <CardHeader className="text-center">
            <div className="w-12 h-12 bg-[#1a56db]/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="h-6 w-6 text-[#1a56db]" />
            </div>
            <CardTitle>Accept Invitation</CardTitle>
            <CardDescription>
              You've been invited to join {sampleInvitation.university} on FedSignal as a {sampleInvitation.role}.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Progress value={step === 1 ? 50 : 100} className="mb-6" />

            {step === 1 && (
              <div className="space-y-4">
                <div className="p-4 bg-muted rounded-lg">
                  <div className="text-sm text-muted-foreground mb-1">Invitation for</div>
                  <div className="font-medium">{sampleInvitation.email}</div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      placeholder="John"
                    />
                    {errors.firstName && <p className="text-xs text-red-600">{errors.firstName}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      placeholder="Smith"
                    />
                    {errors.lastName && <p className="text-xs text-red-600">{errors.lastName}</p>}
                  </div>
                </div>

                <Button className="w-full" onClick={handleNext}>
                  Continue
                </Button>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="password">Create Password *</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      placeholder="Enter a strong password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {errors.password && <p className="text-xs text-red-600">{errors.password}</p>}
                  <ul className="text-xs text-muted-foreground space-y-1 mt-2">
                    <li className={formData.password.length >= 12 ? "text-green-600" : ""}>• At least 12 characters</li>
                    <li className={/[A-Z]/.test(formData.password) ? "text-green-600" : ""}>• One uppercase letter</li>
                    <li className={/[a-z]/.test(formData.password) ? "text-green-600" : ""}>• One lowercase letter</li>
                    <li className={/[0-9]/.test(formData.password) ? "text-green-600" : ""}>• One number</li>
                    <li className={/[!@#$%^&*]/.test(formData.password) ? "text-green-600" : ""}>• One special character (!@#$%^&*)</li>
                  </ul>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password *</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      placeholder="Confirm your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {errors.confirmPassword && <p className="text-xs text-red-600">{errors.confirmPassword}</p>}
                </div>

                <div className="flex items-start gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="terms"
                    checked={formData.acceptTerms}
                    onChange={(e) => setFormData({ ...formData, acceptTerms: e.target.checked })}
                    className="mt-1 rounded"
                  />
                  <Label htmlFor="terms" className="text-sm cursor-pointer">
                    I agree to the <Link href="/terms" className="text-[#1a56db] hover:underline">Terms of Service</Link> and <Link href="/privacy" className="text-[#1a56db] hover:underline">Privacy Policy</Link>
                  </Label>
                </div>
                {errors.acceptTerms && <p className="text-xs text-red-600">{errors.acceptTerms}</p>}

                <div className="flex gap-3 pt-2">
                  <Button variant="outline" className="flex-1" onClick={() => setStep(1)}>
                    Back
                  </Button>
                  <Button className="flex-1" onClick={handleSubmit} disabled={isSubmitting}>
                    {isSubmitting ? "Creating Account..." : "Create Account"}
                  </Button>
                </div>
              </div>
            )}

            <div className="mt-6 pt-4 border-t text-center">
              <p className="text-xs text-muted-foreground">
                Invitation expires {sampleInvitation.expiresAt.toLocaleDateString()}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Invited by {sampleInvitation.invitedBy}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Security Note */}
        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-3">
          <Lock className="h-5 w-5 text-blue-600 mt-0.5" />
          <div className="text-sm text-blue-800">
            <strong>Secure Account Creation</strong>
            <p className="mt-1">
              Your account will be linked to {sampleInvitation.university}. Never share your login credentials.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
