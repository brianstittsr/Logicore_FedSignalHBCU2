"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import {
  FileSignature,
  CheckCircle,
  Loader2,
  AlertTriangle,
  Download,
  Eraser,
  Shield,
  CreditCard,
  Eye,
  Pen,
  ArrowRight,
  ArrowLeft,
  Lock,
  FileText,
} from "lucide-react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";

// Initialize Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "");

interface SigningData {
  id: string;
  proposalName: string;
  proposalType: string;
  proposalHtml: string;
  senderName: string;
  senderEmail: string;
  recipientName: string;
  recipientEmail: string;
  status: string;
  createdAt: string;
  // Hosting/payment info
  hostingEnabled?: boolean;
  monthlyFee?: number;
  clientName?: string;
}

// Payment Form Component
function PaymentForm({
  clientSecret,
  monthlyAmount,
  onSuccess,
}: {
  clientSecret: string;
  monthlyAmount: number;
  onSuccess: () => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setIsProcessing(true);
    setError(null);

    const { error: confirmError, setupIntent } = await stripe.confirmCardSetup(clientSecret, {
      payment_method: { card: elements.getElement(CardElement)! },
    });

    if (confirmError) {
      setError(confirmError.message || "Payment failed");
      setIsProcessing(false);
      return;
    }

    if (setupIntent.status === "succeeded") {
      onSuccess();
    }
    setIsProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-2">
          <CreditCard className="h-5 w-5 text-amber-600" />
          <span className="font-semibold text-amber-800">Monthly Subscription</span>
        </div>
        <p className="text-2xl font-bold text-amber-900">${monthlyAmount.toFixed(2)}/month</p>
        <p className="text-sm text-amber-700 mt-1">Your card will be charged automatically each month</p>
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-medium">Card Information</Label>
        <div className="p-4 border-2 border-gray-200 rounded-lg bg-white focus-within:border-[#C8A951] transition-colors">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: "16px",
                  color: "#1e293b",
                  "::placeholder": { color: "#94a3b8" },
                },
                invalid: { color: "#dc2626" },
              },
            }}
          />
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 p-3 rounded-lg">
          <AlertTriangle className="h-4 w-4" />
          {error}
        </div>
      )}

      <Button
        type="submit"
        className="w-full h-12 bg-[#C8A951] hover:bg-[#b89a42] text-[#1e3a5f] font-semibold text-lg"
        disabled={!stripe || isProcessing}
      >
        {isProcessing ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Processing...
          </>
        ) : (
          <>
            <Lock className="mr-2 h-5 w-5" />
            Save Payment Method & Subscribe
          </>
        )}
      </Button>

      <p className="text-xs text-gray-500 text-center">
        <Lock className="h-3 w-3 inline mr-1" />
        Secured by Stripe. Your card information is encrypted and never stored on our servers.
      </p>
    </form>
  );
}

export default function SigningPage() {
  const router = useRouter();
  const params = useParams();
  const token = params.token as string;

  const [loading, setLoading] = useState(true);
  const [signingData, setSigningData] = useState<SigningData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [alreadySigned, setAlreadySigned] = useState(false);

  // Signer info
  const [signerName, setSignerName] = useState("");
  const [signerTitle, setSignerTitle] = useState("");
  const [signerCompany, setSignerCompany] = useState("");

  // Signature canvas
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);
  const [signatureMode, setSignatureMode] = useState<"draw" | "type">("draw");
  const [typedSignature, setTypedSignature] = useState("");

  // Submission
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState("");
  const [signatureData, setSignatureData] = useState<{
    hostingEnabled?: boolean;
    monthlyFee?: number;
    clientName?: string;
    signatureId?: string;
  }>({});

  // Fetch signing data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/proposals/sign?token=${token}`);
        const data = await response.json();

        if (!response.ok) {
          if (data.alreadySigned) {
            setAlreadySigned(true);
          }
          setError(data.error || "Failed to load document");
          return;
        }

        setSigningData(data);
        if (data.recipientName) {
          setSignerName(data.recipientName);
        }
      } catch (err) {
        setError("Failed to connect to signing service");
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchData();
    }
  }, [token]);

  // Canvas drawing handlers
  const getCanvasCoords = useCallback((e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    if ("touches" in e) {
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top,
      };
    }
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  }, []);

  const startDrawing = useCallback((e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!ctx) return;

    setIsDrawing(true);
    const { x, y } = getCanvasCoords(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
  }, [getCanvasCoords]);

  const draw = useCallback((e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!ctx) return;

    const { x, y } = getCanvasCoords(e);
    ctx.lineWidth = 2.5;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = "#1e293b";
    ctx.lineTo(x, y);
    ctx.stroke();
    setHasSignature(true);
  }, [isDrawing, getCanvasCoords]);

  const stopDrawing = useCallback(() => {
    setIsDrawing(false);
  }, []);

  const clearSignature = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (ctx && canvas) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    setHasSignature(false);
    setTypedSignature("");
  };

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.scale(dpr, dpr);
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, rect.width, rect.height);
      }
    }
  }, [signatureMode, signingData]);

  const getSignatureData = (): string | null => {
    if (signatureMode === "type") {
      if (!typedSignature.trim()) return null;
      // Generate signature image from typed text
      const canvas = document.createElement("canvas");
      canvas.width = 400;
      canvas.height = 100;
      const ctx = canvas.getContext("2d");
      if (!ctx) return null;
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, 400, 100);
      ctx.font = "italic 36px 'Georgia', 'Times New Roman', serif";
      ctx.fillStyle = "#1e293b";
      ctx.textBaseline = "middle";
      ctx.fillText(typedSignature, 20, 50);
      return canvas.toDataURL("image/png");
    } else {
      if (!hasSignature) return null;
      return canvasRef.current?.toDataURL("image/png") || null;
    }
  };

  const handleSubmit = async () => {
    if (!signerName.trim()) {
      alert("Please enter your full name");
      return;
    }

    const signatureData = getSignatureData();
    if (!signatureData) {
      alert("Please provide your signature");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/proposals/sign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          signerName: signerName.trim(),
          signerTitle: signerTitle.trim(),
          signerCompany: signerCompany.trim(),
          signatureData,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Failed to submit signature");
        return;
      }

      // Store signature data for potential payment redirect
      setSignatureData({
        hostingEnabled: data.hostingEnabled,
        monthlyFee: data.monthlyFee,
        clientName: data.clientName,
        signatureId: data.signatureId,
      });

      setIsComplete(true);
      setDownloadUrl(data.downloadUrl || "");
    } catch (err) {
      alert("Failed to submit signature. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-[#C8A951] mx-auto mb-4" />
          <p className="text-slate-600 text-lg">Loading document...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-8 text-center">
            {alreadySigned ? (
              <>
                <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                <h2 className="text-xl font-bold mb-2">Already Signed</h2>
                <p className="text-muted-foreground">This document has already been signed. Check your email for the signed copy.</p>
              </>
            ) : (
              <>
                <AlertTriangle className="h-16 w-16 text-amber-500 mx-auto mb-4" />
                <h2 className="text-xl font-bold mb-2">Unable to Load Document</h2>
                <p className="text-muted-foreground">{error}</p>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  // Success state
  if (isComplete) {
    // If hosting is enabled, show payment setup option
    if (signatureData.hostingEnabled && signatureData.monthlyFee && signatureData.monthlyFee > 0) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <Card className="max-w-lg w-full">
            <CardContent className="pt-8 text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="h-12 w-12 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-green-800 mb-2">Document Signed Successfully!</h2>
              <p className="text-green-700 mb-4">
                Thank you, <strong>{signerName}</strong>. Your signature has been recorded.
              </p>
              
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
                <h3 className="font-semibold text-amber-800 mb-2">Monthly Payment Required</h3>
                <p className="text-sm text-amber-700 mb-2">
                  To complete your agreement setup, please setup your monthly recurring payment of:
                </p>
                <p className="text-2xl font-bold text-amber-900">${signatureData.monthlyFee.toFixed(2)}/month</p>
              </div>

              <div className="space-y-3">
                <Button
                  size="lg"
                  className="w-full bg-[#C8A951] text-[#1e3a5f] hover:bg-[#b89a42] font-semibold"
                  onClick={() => {
                    // Redirect to payment setup
                    const params = new URLSearchParams({
                      signatureId: signatureData.signatureId || "",
                      email: signingData?.recipientEmail || "",
                      name: signerName,
                      amount: signatureData.monthlyFee?.toString() || "0",
                      agreement: signingData?.proposalName || "Agreement",
                    });
                    window.location.href = `/payment/setup?${params.toString()}`;
                  }}
                >
                  <CreditCard className="mr-2 h-5 w-5" />
                  Setup Monthly Payment
                </Button>
                
                {downloadUrl && (
                  <Button asChild variant="outline" size="lg" className="w-full">
                    <a href={downloadUrl} target="_blank" rel="noopener noreferrer">
                      <Download className="mr-2 h-5 w-5" />
                      Download Signed Document
                    </a>
                  </Button>
                )}
              </div>
              
              <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700">
                <Shield className="h-4 w-4 inline mr-1" />
                Your document is signed. Complete the payment setup to activate your services.
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    // Standard success (no payment required)
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="max-w-lg w-full">
          <CardContent className="pt-8 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-green-800 mb-2">Document Signed Successfully!</h2>
            <p className="text-green-700 mb-6">
              Thank you, <strong>{signerName}</strong>. Your signature has been recorded. A signed copy has been sent to your email.
            </p>
            {downloadUrl && (
              <Button asChild size="lg" className="bg-[#C8A951] text-[#1e3a5f] hover:bg-[#b89a42] font-semibold">
                <a href={downloadUrl} target="_blank" rel="noopener noreferrer">
                  <Download className="mr-2 h-5 w-5" />
                  Download Signed Document
                </a>
              </Button>
            )}
            <div className="mt-8 p-4 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700">
              <Shield className="h-4 w-4 inline mr-1" />
              This electronic signature is legally binding under the ESIGN Act and UETA.
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Main signing view
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-[#1e3a5f] text-white py-6 px-6 shadow-lg border-b-4 border-[#C8A951]">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image src="/VPlus_logo.webp" alt="Strategic Value+" width={50} height={50} className="rounded" />
            <div>
              <p className="font-bold text-lg">Strategic Value+</p>
              <p className="text-xs text-gray-300">Secure Document Signing</p>
            </div>
          </div>
          <Badge className="bg-[#C8A951] text-[#1e3a5f] border-[#C8A951] font-semibold">
            <FileSignature className="h-4 w-4 mr-1" />
            Signature Required
          </Badge>
        </div>
      </header>

      <div className="flex-1 flex justify-center">
        <div className="w-full max-w-4xl p-6 space-y-6">
        {/* Document Info */}
        <Card className="border-t-4 border-t-[#C8A951]">
          <CardHeader className="pb-4">
            <CardTitle className="text-2xl font-bold text-[#1e3a5f]">{signingData?.proposalName}</CardTitle>
            <CardDescription className="text-base">
              Sent by <strong>{signingData?.senderName}</strong> &bull; <Badge variant="outline" className="ml-1">{signingData?.proposalType}</Badge>
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Document Preview */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <FileSignature className="h-4 w-4 text-[#C8A951]" />
              Document Preview
            </CardTitle>
            <CardDescription>Review the full document before signing</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[500px] border rounded-lg bg-white">
              <div
                className="p-6"
                dangerouslySetInnerHTML={{ __html: signingData?.proposalHtml || "" }}
              />
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Signer Information */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Your Information</CardTitle>
            <CardDescription>Please confirm your details</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Full Name *</Label>
                <Input
                  value={signerName}
                  onChange={(e) => setSignerName(e.target.value)}
                  placeholder="John Smith"
                />
              </div>
              <div className="space-y-2">
                <Label>Title</Label>
                <Input
                  value={signerTitle}
                  onChange={(e) => setSignerTitle(e.target.value)}
                  placeholder="e.g., CEO, Director"
                />
              </div>
              <div className="space-y-2">
                <Label>Company</Label>
                <Input
                  value={signerCompany}
                  onChange={(e) => setSignerCompany(e.target.value)}
                  placeholder="Company name"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Signature Pad */}
        <Card className="border-[#C8A951]/50">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base">Electronic Signature</CardTitle>
                <CardDescription>Sign using your mouse, touchscreen, or type your name</CardDescription>
              </div>
              <div className="flex gap-2">
                <Button
                  variant={signatureMode === "draw" ? "default" : "outline"}
                  size="sm"
                  onClick={() => { setSignatureMode("draw"); clearSignature(); }}
                >
                  Draw
                </Button>
                <Button
                  variant={signatureMode === "type" ? "default" : "outline"}
                  size="sm"
                  onClick={() => { setSignatureMode("type"); clearSignature(); }}
                >
                  Type
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {signatureMode === "draw" ? (
              <div className="space-y-3">
                <div className="relative border-2 border-dashed border-slate-300 rounded-lg bg-white overflow-hidden"
                  style={{ touchAction: "none" }}
                >
                  <canvas
                    ref={canvasRef}
                    className="w-full cursor-crosshair"
                    style={{ height: "150px", display: "block" }}
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                    onTouchStart={startDrawing}
                    onTouchMove={draw}
                    onTouchEnd={stopDrawing}
                  />
                  {!hasSignature && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <p className="text-slate-400 text-sm">Sign here</p>
                    </div>
                  )}
                </div>
                <Button variant="outline" size="sm" onClick={clearSignature}>
                  <Eraser className="h-4 w-4 mr-1" />
                  Clear
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                <Input
                  value={typedSignature}
                  onChange={(e) => setTypedSignature(e.target.value)}
                  placeholder="Type your full name"
                  className="text-lg"
                />
                {typedSignature && (
                  <div className="p-4 bg-white border rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">Preview:</p>
                    <p className="text-3xl italic font-serif text-slate-800">{typedSignature}</p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Submit */}
        <div className="flex flex-col items-center gap-4 pb-8">
          <p className="text-sm text-muted-foreground text-center max-w-md">
            By clicking &quot;Sign Document&quot;, you agree that your electronic signature is the legal equivalent of your manual signature on this document.
          </p>
          <Button
            size="lg"
            className="w-full max-w-md bg-[#C8A951] text-[#1e3a5f] hover:bg-[#b89a42] font-bold text-lg py-7 shadow-lg"
            onClick={handleSubmit}
            disabled={isSubmitting || !signerName.trim() || (signatureMode === "draw" ? !hasSignature : !typedSignature.trim())}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Processing Signature...
              </>
            ) : (
              <>
                <FileSignature className="mr-2 h-5 w-5" />
                Sign Document
              </>
            )}
          </Button>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Shield className="h-3 w-3" />
            <span>Secured by Strategic Value+ &bull; ESIGN Act Compliant</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-[#1e3a5f] text-white py-6 px-6 mt-12">
        <div className="max-w-5xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Image src="/VPlus_logo.webp" alt="Strategic Value+" width={30} height={30} className="rounded" />
            <p className="font-bold text-lg">Strategic Value+</p>
          </div>
          <p className="text-sm text-gray-300 mb-1">Transforming U.S. Manufacturing</p>
          <p className="text-xs text-gray-400">8 The Green #13351, Dover, DE 19901</p>
          <p className="text-xs text-gray-400 mt-1">strategicvalueplus.com</p>
        </div>
      </footer>
    </div>
  );
}
