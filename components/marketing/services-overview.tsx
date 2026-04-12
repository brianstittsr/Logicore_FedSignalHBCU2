"use client";

import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Shield, Code, Truck, CheckCircle } from "lucide-react";

const services = [
  {
    title: "Cybersecurity",
    tagline: "Defend the mission.",
    description:
      "Information assurance, CMMC compliance, and cyber defense solutions protecting critical DoD and federal systems.",
    icon: Shield,
    color: "text-primary",
    bgColor: "bg-primary/10",
    href: "/cybersecurity",
    features: [
      "Cyber defense solutions",
      "CMMC compliance and training",
      "Information assurance",
      "Risk management framework",
    ],
  },
  {
    title: "Software Engineering",
    tagline: "Build mission-critical systems.",
    description:
      "Full-spectrum software engineering services for defense and government programs, from design through deployment.",
    icon: Code,
    color: "text-secondary",
    bgColor: "bg-secondary/10",
    href: "/engineering",
    features: [
      "Software engineering and development",
      "Systems engineering and integration",
      "Data analytics and visualization",
      "Agile program management",
    ],
  },
  {
    title: "Logistics Engineering",
    tagline: "Sustain readiness.",
    description:
      "Performance-based logistics and value engineering supporting Army Aviation, Missiles, and tactical systems.",
    icon: Truck,
    color: "text-accent",
    bgColor: "bg-accent/10",
    href: "/logistics",
    features: [
      "Performance-based logistics (PBL)",
      "Value engineering (VE/LCCR)",
      "Sustainment and readiness",
      "Reliability, availability, maintainability",
    ],
  },
];

export function ServicesOverview() {
  return (
    <section className="py-20 md:py-28">
      <div className="container">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge variant="outline" className="mb-4">
            Centers of Excellence
          </Badge>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            Mission-Ready Support Services
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Our highly qualified workforce provides analytical, advisory, and operational support across multiple system sectors within the Department of the Army.
          </p>
        </div>

        {/* Service Cards */}
        <div className="grid md:grid-cols-3 gap-8">
          {services.map((service) => (
            <Card key={service.title} className="relative overflow-hidden group hover:shadow-lg transition-shadow">
              <div className={`absolute top-0 left-0 w-full h-1 ${service.bgColor}`} />
              <CardHeader>
                <div className={`w-12 h-12 rounded-lg ${service.bgColor} flex items-center justify-center mb-4`}>
                  <service.icon className={`h-6 w-6 ${service.color}`} />
                </div>
                <CardTitle className="text-2xl">{service.title}</CardTitle>
                <CardDescription className="text-base font-medium">
                  {service.tagline}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">{service.description}</p>
                <ul className="space-y-2">
                  {service.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm">
                      <CheckCircle className={`h-4 w-4 mt-0.5 shrink-0 ${service.color}`} />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button variant="ghost" className="group/btn p-0 h-auto" asChild>
                  <Link href={service.href}>
                    {"Learn more"}
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <p className="text-muted-foreground mb-4">
            Ready to learn how we can support your mission?
          </p>
          <Button size="lg" asChild>
            <Link href="/contact">
              Contact Us Today
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
