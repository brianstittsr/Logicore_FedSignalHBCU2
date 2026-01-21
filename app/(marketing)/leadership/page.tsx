"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";

const leadershipTeam = [
  {
    name: "Nelinia Varenas",
    title: "V+ CEO",
    imageKey: "nelinia",
    expertise: [
      "AI, Automation, & Digital Twins",
      "Reshoring",
      "Sales & Marketing",
      "ISO",
      "Six Sigma",
      "Affiliate Marketing",
    ],
  },
  {
    name: "Roy Dickan",
    title: "V+ CRO",
    imageKey: "roy",
    expertise: [
      "AI Optimization Architect",
      "Automations",
      "Sales & Marketing",
      "Lead Generation",
      "Int/Ext Communication",
    ],
  },
  {
    name: "Brian Stitt",
    title: "V+ CTO",
    imageKey: "brian",
    expertise: [
      "AI Visionary & Developer",
      "Digital Transformation Expert",
      "Robotics and Digital Twins Innovator",
    ],
  },
];

const strategicPartners = [
  {
    name: "Keith Moore",
    title: "Strategic Partner",
    imageKey: "keith",
    expertise: [
      "Business Development",
      "Strategic Partnerships",
    ],
  },
  {
    name: "Icy Williams",
    title: "Strategic Partner",
    imageKey: "icy",
    expertise: [
      "Operations Excellence",
      "Process Improvement",
    ],
  },
  {
    name: "Nate Hallums",
    title: "Strategic Partner",
    imageKey: "nate",
    expertise: [
      "Manufacturing Solutions",
      "Supply Chain",
    ],
  },
];

export default function LeadershipPage() {
  const [imageUrls, setImageUrls] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchImages = async () => {
      if (!db) return;
      try {
        const imagesRef = collection(db, "image_assets");
        const snapshot = await getDocs(imagesRef);
        const urls: Record<string, string> = {};
        
        snapshot.docs.forEach((doc) => {
          const data = doc.data();
          const name = data.name?.toLowerCase() || "";
          
          // Match images by name keywords
          if (name.includes("nelinia") || name.includes("varenas") || name.includes("nel")) {
            urls["nelinia"] = data.url;
          } else if (name.includes("roy") || name.includes("dickan")) {
            urls["roy"] = data.url;
          } else if (name.includes("brian") || name.includes("stitt")) {
            urls["brian"] = data.url;
          } else if (name.includes("keith") || name.includes("moore")) {
            urls["keith"] = data.url;
          } else if (name.includes("icy") || name.includes("williams")) {
            urls["icy"] = data.url;
          } else if (name.includes("nate") || name.includes("hallums")) {
            urls["nate"] = data.url;
          }
        });
        
        setImageUrls(urls);
      } catch (error) {
        console.error("Error fetching images:", error);
      }
    };
    
    fetchImages();
  }, []);

  const renderMemberCard = (member: typeof leadershipTeam[0]) => (
    <Card key={member.name} className="overflow-hidden">
      <CardContent className="p-0">
        <div className="flex flex-col sm:flex-row">
          {/* Image */}
          <div className="sm:w-48 sm:h-auto h-64 bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center shrink-0 overflow-hidden">
            {imageUrls[member.imageKey] ? (
              <img
                src={imageUrls[member.imageKey]}
                alt={member.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-32 h-32 sm:w-36 sm:h-36 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-4xl font-bold">
                {member.name.split(" ").map(n => n[0]).slice(0, 2).join("")}
              </div>
            )}
          </div>
          
          {/* Content */}
          <div className="p-6 flex-1">
            <h3 className="text-2xl font-bold">{member.name}</h3>
            <p className="text-lg text-primary font-semibold mt-1">{member.title}</p>
            
            <div className="mt-4">
              <div className="flex flex-wrap gap-2">
                {member.expertise.map((skill) => (
                  <Badge 
                    key={skill} 
                    variant="secondary" 
                    className="text-xs"
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <>
      {/* Hero Section */}
      <section className="py-20 md:py-28 bg-black text-white">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <Badge variant="outline" className="mb-6 border-primary/50 text-primary">
              Our Leadership
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              Leadership <span className="text-primary">Team</span>
            </h1>
            <p className="mt-6 text-xl text-gray-300">
              Veteran experts with decades of combined experience in manufacturing, 
              technology, and business transformation.
            </p>
          </div>
        </div>
      </section>

      {/* Leadership Team Grid */}
      <section className="py-20 md:py-28">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Strategic Value Plus Leadership</h2>
            <p className="mt-4 text-lg text-muted-foreground">Our core leadership team driving transformation.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
            {leadershipTeam.map(renderMemberCard)}
          </div>
        </div>
      </section>

      {/* Strategic Partners Grid */}
      <section className="py-20 md:py-28 bg-muted/30">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Strategic Partners</h2>
            <p className="mt-4 text-lg text-muted-foreground">Trusted partners extending our capabilities.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
            {strategicPartners.map(renderMemberCard)}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-28 bg-muted/30">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Ready to Work With Our Team?
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Schedule a free consultation to discuss how our leadership team can help 
            transform your manufacturing operations.
          </p>
          <Button size="lg" className="mt-8 text-lg px-8" asChild>
            <Link href="/contact">
              Schedule a Consultation
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>
    </>
  );
}
