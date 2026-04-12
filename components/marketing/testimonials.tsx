"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";

const testimonials = [
  {
    quote:
      "LogiCore's cybersecurity team helped us achieve CMMC Level 2 compliance ahead of schedule. Their expertise in DoD requirements is unmatched.",
    author: "Col. James Mitchell (Ret.)",
    title: "Program Director",
    company: "Defense Systems Integration",
    industry: "Cybersecurity",
    employees: "DoD Program",
    initials: "JM",
  },
  {
    quote:
      "The logistics engineering support from LogiCore transformed our sustainment operations. We achieved a 35% improvement in system readiness rates.",
    author: "Dr. Patricia Holmes",
    title: "VP Research",
    company: "Army Aviation Program",
    industry: "Logistics Engineering",
    employees: "AMCOM Support",
    initials: "PH",
  },
  {
    quote:
      "Their software engineering team delivered a mission-critical analytics platform on time and under budget. The quality of their work speaks for itself.",
    author: "Mark Richardson",
    title: "Chief Engineer",
    company: "Missile Defense Agency",
    industry: "Software Engineering",
    employees: "Federal Program",
    initials: "MR",
  },
  {
    quote:
      "LogiCore's HBCU partnership program has been transformative for our university. We've secured multiple DoD research grants through their guidance.",
    author: "Dr. Angela Washington",
    title: "VP of Research",
    company: "Tuskegee University",
    industry: "HBCU Partnership",
    employees: "Research University",
    initials: "AW",
  },
];

export function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const next = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prev = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section className="py-20 md:py-28">
      <div className="container">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            What Our Clients Say
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Real results from partners who trust LogiCore Corporation for mission-critical support.
          </p>
        </div>

        {/* Testimonial Carousel */}
        <div className="relative max-w-4xl mx-auto">
          <Card className="bg-card border-2">
            <CardContent className="p-8 md:p-12">
              <Quote className="h-12 w-12 text-primary/20 mb-6" />
              
              <blockquote className="text-xl md:text-2xl font-medium mb-8 leading-relaxed">
                "{testimonials[currentIndex].quote}"
              </blockquote>

              <div className="flex items-center gap-4">
                <Avatar className="h-14 w-14">
                  <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                    {testimonials[currentIndex].initials}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-semibold">{testimonials[currentIndex].author}</div>
                  <div className="text-sm text-muted-foreground">
                    {testimonials[currentIndex].title}, {testimonials[currentIndex].company}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {testimonials[currentIndex].industry} • {testimonials[currentIndex].employees}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex justify-center items-center gap-4 mt-8">
            <Button variant="outline" size="icon" onClick={prev}>
              <ChevronLeft className="h-5 w-5" />
            </Button>
            
            <div className="flex gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentIndex ? "bg-primary" : "bg-muted-foreground/30"
                  }`}
                />
              ))}
            </div>

            <Button variant="outline" size="icon" onClick={next}>
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
