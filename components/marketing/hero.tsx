"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, CheckCircle, Play } from "lucide-react";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-[#0f2a4a] text-white">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1a3a5c_1px,transparent_1px),linear-gradient(to_bottom,#1a3a5c_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
      
      <div className="relative py-20 md:py-32 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          {/* Badge */}
          <Badge variant="outline" className="mb-6 border-[#4d94ff]/50 text-[#4d94ff]">
            This Is Our Battlespace
          </Badge>

          {/* Headline */}
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            Cyber Security, Logistics &{" "}
            <span className="text-[#4d94ff]">Software Engineering</span>
          </h1>

          {/* Subheadline */}
          <p className="mt-6 text-lg text-gray-300 md:text-xl max-w-2xl mx-auto">
            LogiCore Corporation provides analytical, advisory, and operational support services 
            across cybersecurity, logistics engineering, and software engineering for the Department of Defense.
          </p>

          {/* Key Benefits */}
          <div className="mt-8 flex flex-wrap justify-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-[#4d94ff]" />
              <span>Cybersecurity & CMMC</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-[#4d94ff]" />
              <span>Performance-Based Logistics</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-[#4d94ff]" />
              <span>HBCU Partnerships</span>
            </div>
          </div>

          {/* CTAs */}
          <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
            <Button size="lg" className="text-lg px-8 bg-[#1a56db] hover:bg-[#1a56db]/90 text-white" asChild>
              <Link href="/contact">
                Find Out More
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 border-white/20 hover:bg-white/10" asChild>
              <Link href="/about">
                <Play className="mr-2 h-5 w-5" />
                Our Company
              </Link>
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="mt-16 pt-8 border-t border-white/10">
            <p className="text-sm text-gray-400 mb-6">Trusted by the Department of Defense & Federal Agencies</p>
            <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
              <div className="h-8 w-24 bg-white/20 rounded" />
              <div className="h-8 w-28 bg-white/20 rounded" />
              <div className="h-8 w-20 bg-white/20 rounded" />
              <div className="h-8 w-32 bg-white/20 rounded" />
              <div className="h-8 w-24 bg-white/20 rounded" />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
}
