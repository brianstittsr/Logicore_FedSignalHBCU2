import Link from "next/link";
import Image from "next/image";
import { Linkedin, Twitter, Youtube, Mail, Phone, MapPin } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const footerLinks = {
  services: [
    { title: "Cybersecurity", href: "/cybersecurity" },
    { title: "Engineering", href: "/engineering" },
    { title: "Logistics Engineering", href: "/logistics" },
    { title: "CMMC Training", href: "/cmmc-training" },
    { title: "HBCU Partnerships", href: "/hbcu" },
    { title: "Contact", href: "/contact" },
  ],
  company: [
    { title: "Our Company", href: "/about" },
    { title: "Leadership", href: "/leadership" },
    { title: "Customer/Programs", href: "/programs" },
    { title: "Customer Care/Quality", href: "/quality" },
    { title: "News", href: "/news" },
  ],
  resources: [
    { title: "Our Community", href: "/community" },
    { title: "Our Jobs", href: "/jobs" },
    { title: "Why Choose LogiCore?", href: "/why-logicore" },
    { title: "Blog", href: "/blog" },
  ],
  legal: [
    { title: "Privacy Policy", href: "/privacy" },
    { title: "Terms of Service", href: "/terms" },
    { title: "Accessibility", href: "/accessibility" },
  ],
};

export function Footer() {
  return (
    <footer className="bg-black text-white">
      <div className="container py-12 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-4 lg:col-span-1 space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-md bg-[#1a56db] flex items-center justify-center">
                <span className="text-white font-bold text-lg">LC</span>
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold leading-none">LogiCore HSV</span>
                <span className="text-xs text-gray-400">Cyber Security, Logistics & Engineering</span>
              </div>
            </Link>
            <p className="text-sm text-gray-400 max-w-xs">
              LogiCore Corporation provides cybersecurity, logistics engineering, and 
              software engineering services supporting the Department of Defense and federal agencies.
            </p>
            <div className="flex gap-4">
              <Link href="https://linkedin.com" className="text-gray-400 hover:text-primary transition-colors">
                <Linkedin className="h-5 w-5" />
              </Link>
              <Link href="https://twitter.com" className="text-gray-400 hover:text-primary transition-colors">
                <Twitter className="h-5 w-5" />
              </Link>
              <Link href="https://youtube.com" className="text-gray-400 hover:text-primary transition-colors">
                <Youtube className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h3 className="font-semibold text-accent">Services</h3>
            <ul className="space-y-2">
              {footerLinks.services.map((link) => (
                <li key={link.title}>
                  <Link href={link.href} className="text-sm text-gray-400 hover:text-white transition-colors">
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div className="space-y-4">
            <h3 className="font-semibold text-accent">Company</h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.title}>
                  <Link href={link.href} className="text-sm text-gray-400 hover:text-white transition-colors">
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div className="space-y-4">
            <h3 className="font-semibold text-accent">Resources</h3>
            <ul className="space-y-2">
              {footerLinks.resources.map((link) => (
                <li key={link.title}>
                  <Link href={link.href} className="text-sm text-gray-400 hover:text-white transition-colors">
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="font-semibold text-accent">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-sm text-gray-400">
                <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
                <span>100 Church Street, Suite 100<br />Huntsville, AL 35801</span>
              </li>
              <li>
                <Link href="mailto:info@logicorehsv.com" className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors">
                  <Mail className="h-4 w-4" />
                  info@logicorehsv.com
                </Link>
              </li>
              <li>
                <Link href="tel:+1-256-533-5789" className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors">
                  <Phone className="h-4 w-4" />
                  (256) 533-5789
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <Separator className="my-8 bg-gray-800" />

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-400">
            © {new Date().getFullYear()} LogiCore Corporation. All rights reserved.
          </p>
          <div className="flex gap-6">
            {footerLinks.legal.map((link) => (
              <Link
                key={link.title}
                href={link.href}
                className="text-sm text-gray-400 hover:text-white transition-colors"
              >
                {link.title}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
