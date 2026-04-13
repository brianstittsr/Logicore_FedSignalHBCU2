"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import {
  Menu,
  ChevronDown,
  Shield,
  Cpu,
  Brain,
  FileCheck,
  Users,
  Wrench,
  BarChart3,
  Globe,
  Zap,
  Truck,
  Code,
  Award,
  Briefcase,
  GraduationCap,
  Newspaper,
} from "lucide-react";
import { cn } from "@/lib/utils";

const services = [
  {
    title: "Cybersecurity",
    href: "/cybersecurity",
    description: "Information assurance, CMMC compliance, and cyber defense solutions",
    icon: Shield,
    items: [
      { title: "Cyber Defense Solutions", href: "/cybersecurity" },
      { title: "CMMC Training", href: "/cmmc-training" },
      { title: "Information Assurance", href: "/cybersecurity" },
    ],
  },
  {
    title: "Engineering",
    href: "/engineering",
    description: "Software engineering services for defense and government programs",
    icon: Code,
    items: [
      { title: "Software Engineering", href: "/engineering" },
      { title: "Systems Engineering", href: "/engineering" },
      { title: "Data Analytics", href: "/engineering" },
    ],
  },
  {
    title: "Logistics Engineering",
    href: "/logistics",
    description: "Performance-based logistics and value engineering",
    icon: Truck,
    items: [
      { title: "Performance-Based Logistics", href: "/logistics" },
      { title: "Value Engineering", href: "/logistics" },
      { title: "Sustainment Services", href: "/logistics" },
    ],
  },
];

const resources = [
  { title: "News", href: "/news", icon: Newspaper },
  { title: "Our Community", href: "/community", icon: GraduationCap },
  { title: "Our Jobs", href: "/jobs", icon: Briefcase },
  { title: "Why Choose LogiCore?", href: "/why-logicore", icon: Award },
];

const companyLinks = [
  { title: "Our Company", href: "/about", icon: Globe },
  { title: "Leadership Team", href: "/leadership", icon: Users },
  { title: "Customer/Programs", href: "/programs", icon: BarChart3 },
  { title: "Customer Care/Quality", href: "/quality", icon: Award },
  { title: "HBCU Partnerships", href: "/hbcu", icon: GraduationCap },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 flex h-16 items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-md bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-lg">LC</span>
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold leading-none">LogiCore HSV</span>
            <span className="text-xs text-muted-foreground">Cyber Security, Logistics & Engineering</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <NavigationMenu className="hidden lg:flex">
          <NavigationMenuList>
            {/* Services, Company, Resources hidden per request */}

            <NavigationMenuItem>
              <NavigationMenuLink asChild className={cn(
                "group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50"
              )}>
                <Link href="/contact">Contact</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        {/* CTA Buttons */}
        <div className="hidden lg:flex items-center gap-3">
          <Button variant="ghost" asChild>
            <Link href="/sign-in">Sign In</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/sign-up">Sign Up</Link>
          </Button>
          <Button asChild>
            <Link href="/contact">Contact Us</Link>
          </Button>
        </div>

        {/* Mobile Menu */}
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild className="lg:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px] sm:w-[400px]">
            <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
            <nav className="flex flex-col gap-4 mt-8">
              {/* Services, Company, Resources hidden per request */}
              <div className="space-y-2">
                <Link
                  href="/contact"
                  className="block py-2 font-medium"
                  onClick={() => setMobileOpen(false)}
                >
                  Contact
                </Link>
              </div>

              <div className="border-t pt-4 space-y-2">
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/sign-in" onClick={() => setMobileOpen(false)}>
                    Sign In
                  </Link>
                </Button>
                <Button variant="secondary" className="w-full" asChild>
                  <Link href="/sign-up" onClick={() => setMobileOpen(false)}>
                    Sign Up
                  </Link>
                </Button>
                <Button className="w-full" asChild>
                  <Link href="/contact" onClick={() => setMobileOpen(false)}>
                    Contact Us
                  </Link>
                </Button>
              </div>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
