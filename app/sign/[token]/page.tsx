"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  FileSignature,
  CheckCircle,
  Loader2,
  AlertTriangle,
  Download,
  Eraser,
  Shield,
} from "lucide-react";
import Image from "next/image";
import { useParams } from "next/navigation";

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
}

export default function SigningPage() {
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
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
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center p-4">
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
              <Button asChild size="lg" className="bg-[#C8A951] text-black hover:bg-[#b89a42]">
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-slate-900 text-white py-4 px-6 shadow-lg">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image src="/VPlus_logo.webp" alt="Strategic Value+" width={40} height={40} className="rounded" />
            <div>
              <p className="font-semibold text-sm">Strategic Value+</p>
              <p className="text-xs text-slate-400">Secure Document Signing</p>
            </div>
          </div>
          <Badge className="bg-amber-500/20 text-amber-300 border-amber-500/30">
            <FileSignature className="h-3 w-3 mr-1" />
            Signature Required
          </Badge>
        </div>
      </header>

      <div className="max-w-5xl mx-auto p-6 space-y-6">
        {/* Document Info */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-xl">{signingData?.proposalName}</CardTitle>
            <CardDescription>
              Sent by <strong>{signingData?.senderName}</strong> &bull; {signingData?.proposalType}
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
        <div className="flex flex-col items-center gap-4 pb-12">
          <p className="text-xs text-muted-foreground text-center max-w-md">
            By clicking &quot;Sign Document&quot;, you agree that your electronic signature is the legal equivalent of your manual signature on this document.
          </p>
          <Button
            size="lg"
            className="w-full max-w-md bg-[#C8A951] text-black hover:bg-[#b89a42] font-bold text-lg py-6"
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
    </div>
  );
}
