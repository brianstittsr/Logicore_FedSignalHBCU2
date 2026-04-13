import Link from "next/link";
import Image from "next/image";
import { Mail, Phone, MapPin } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const footerLinks = {
  services: [
    // Links removed as requested
  ],
  company: [
    // Links removed as requested
  ],
  resources: [
    // Links removed as requested
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
                <span className="text-white font-bold text-lg">FS</span>
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold leading-none">FedSignal</span>
                <span className="text-xs text-gray-400">A Logicore HSV Product</span>
              </div>
            </Link>
            <p className="text-sm text-gray-400 max-w-xs">
              LogiCore Corporation provides cybersecurity, logistics engineering, and 
              software engineering services supporting the Department of Defense and federal agencies.
            </p>
            {/* Social icons removed as requested */}
          </div>

          {/* Services section removed as requested */}

          {/* Company section removed as requested */}

          {/* Resources section removed as requested */}

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
