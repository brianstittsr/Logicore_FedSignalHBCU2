"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ArrowRight, CheckCircle, Play, ChevronLeft, ChevronRight, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export interface HeroSlide {
  id: string;
  badge: string;
  headline: string;
  highlightedText: string;
  subheadline: string;
  benefits: string[];
  primaryCta: {
    text: string;
    href: string;
  };
  secondaryCta: {
    text: string;
    href: string;
  };
  isPublished: boolean;
  order: number;
}

// Default slides - in production these would come from a database
// Only FedSignal slide is active per request
const defaultSlides: HeroSlide[] = [
  {
    id: "2",
    badge: "★ FedSignal — Government Funding Intelligence",
    headline: "HBCU funding intelligence.",
    highlightedText: "FedSignal",
    subheadline: "AI-powered government funding radar for HBCUs. Track opportunities, match capabilities, build consortiums, and win federal awards — all in one command center.",
    benefits: ["47 Active Opportunities", "$14.2M Pipeline", "101 HBCU Network"],
    primaryCta: { text: "Launch FedSignal", href: "/fedsignal" },
    secondaryCta: { text: "Learn More", href: "/about" },
    isPublished: true,
    order: 1,
  },
];

interface HeroCarouselProps {
  slides?: HeroSlide[];
  autoPlayInterval?: number;
}

export function HeroCarousel({ slides = defaultSlides, autoPlayInterval = 6000 }: HeroCarouselProps) {
  const router = useRouter();
  const publishedSlides = slides.filter(s => s.isPublished).sort((a, b) => a.order - b.order);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  
  // Login modal state
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleLogin = useCallback(() => {
    if (!username || !password) return;
    
    setIsLoggingIn(true);
    setLoginError("");
    
    // Validate credentials
    if (username === "HBCU1" && password === "HBCU2026") {
      // Store login state
      sessionStorage.setItem("fedsignal_demo_login", "true");
      sessionStorage.setItem("fedsignal_username", username);
      
      // Close modal and redirect
      setIsLoginModalOpen(false);
      router.push("/fedsignal");
    } else {
      setLoginError("Invalid username or password. Try HBCU1 / HBCU2026");
      setIsLoggingIn(false);
    }
  }, [username, password, router]);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % publishedSlides.length);
  }, [publishedSlides.length]);

  const goToPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + publishedSlides.length) % publishedSlides.length);
  }, [publishedSlides.length]);

  const goToSlide = useCallback((index: number) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
    // Resume auto-play after 10 seconds of inactivity
    setTimeout(() => setIsAutoPlaying(true), 10000);
  }, []);

  useEffect(() => {
    if (!isAutoPlaying || publishedSlides.length <= 1) return;
    
    const interval = setInterval(goToNext, autoPlayInterval);
    return () => clearInterval(interval);
  }, [isAutoPlaying, autoPlayInterval, goToNext, publishedSlides.length]);

  if (publishedSlides.length === 0) {
    return null;
  }

  const currentSlide = publishedSlides[currentIndex];

  return (
    <section className="relative overflow-hidden bg-[#0f2a4a] text-white">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1a3a5c_1px,transparent_1px),linear-gradient(to_bottom,#1a3a5c_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
      
      <div className="relative py-20 md:py-32 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          {/* Slide Content with Fade Animation */}
          <div key={currentSlide.id} className="animate-in fade-in duration-500">
            {/* Badge */}
            <Badge variant="outline" className="mb-6 border-primary/50 text-primary">
              {currentSlide.badge}
            </Badge>

            {/* Headline */}
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
              {currentSlide.headline}{" "}
              <span className="text-[#4d94ff]">{currentSlide.highlightedText}</span>
            </h1>

            {/* Subheadline */}
            <p className="mt-6 text-lg text-gray-300 md:text-xl max-w-2xl mx-auto">
              {currentSlide.subheadline}
            </p>

            {/* Key Benefits */}
            <div className="mt-8 flex flex-wrap justify-center gap-4 text-sm">
              {currentSlide.benefits.map((benefit) => (
                <div key={benefit} className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-primary" />
                  <span>{benefit}</span>
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div className="mt-10 flex justify-center gap-4">
              <Button 
                size="lg" 
                className="text-lg px-8"
                onClick={() => setIsLoginModalOpen(true)}
              >
                {currentSlide.primaryCta.text}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Login Modal */}
          <Dialog open={isLoginModalOpen} onOpenChange={setIsLoginModalOpen}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="text-center text-2xl">FedSignal Login</DialogTitle>
                <DialogDescription className="text-center">
                  Enter your credentials to access the FedSignal portal
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                {loginError && (
                  <div className="flex items-center gap-2 p-3 text-sm text-red-600 bg-red-50 rounded-lg">
                    <AlertCircle className="h-4 w-4" />
                    {loginError}
                  </div>
                )}
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    placeholder="Enter username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && document.getElementById("password")?.focus()}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                  />
                </div>
                <Button 
                  className="w-full" 
                  size="lg"
                  onClick={handleLogin}
                  disabled={isLoggingIn || !username || !password}
                >
                  {isLoggingIn ? "Logging in..." : "Login"}
                </Button>
                <p className="text-xs text-center text-muted-foreground pt-2">
                  Demo credentials: HBCU1 / HBCU2026
                </p>
              </div>
            </DialogContent>
          </Dialog>

          {/* Carousel Navigation */}
          {publishedSlides.length > 1 && (
            <div className="mt-12 flex items-center justify-center gap-4">
              {/* Prev Button */}
              <button
                onClick={() => { goToPrev(); setIsAutoPlaying(false); }}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                aria-label="Previous slide"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>

              {/* Dots */}
              <div className="flex gap-2">
                {publishedSlides.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={cn(
                      "w-3 h-3 rounded-full transition-all duration-300",
                      index === currentIndex
                        ? "bg-primary w-8"
                        : "bg-white/30 hover:bg-white/50"
                    )}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>

              {/* Next Button */}
              <button
                onClick={() => { goToNext(); setIsAutoPlaying(false); }}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                aria-label="Next slide"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          )}

          {/* Trust Indicators */}
          <div className="mt-16 pt-8 border-t border-white/10">
            <p className="text-sm text-gray-400 mb-6">Certifications & Partnerships</p>
            <div className="flex flex-wrap justify-center items-center gap-6 md:gap-10">
              <div className="flex flex-col items-center text-center">
                <span className="text-lg font-bold text-white">ISO 9001</span>
                <span className="text-xs text-gray-400">Certified</span>
              </div>
              <div className="flex flex-col items-center text-center">
                <span className="text-lg font-bold text-white">IATF 16949</span>
                <span className="text-xs text-gray-400">Automotive</span>
              </div>
              <div className="flex flex-col items-center text-center">
                <span className="text-lg font-bold text-white">MEP</span>
                <span className="text-xs text-gray-400">Network Partner</span>
              </div>
              <div className="flex flex-col items-center text-center">
                <span className="text-lg font-bold text-white">Reshoring</span>
                <span className="text-xs text-gray-400">Initiative</span>
              </div>
              <div className="flex flex-col items-center text-center">
                <span className="text-lg font-bold text-white">NIST</span>
                <span className="text-xs text-gray-400">Aligned</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
}
