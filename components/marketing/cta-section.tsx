import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar, Phone } from "lucide-react";

export function CTASection() {
  return (
    <section className="py-20 md:py-28 bg-primary text-primary-foreground">
      <div className="container">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            Ready to Support Your Mission?
          </h2>
          <p className="mt-6 text-lg opacity-90 max-w-2xl mx-auto">
            Contact us today to learn how LogiCore Corporation can support your company, 
            agency, or government group with cybersecurity, logistics, and engineering services.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
            <Button
              size="lg"
              variant="secondary"
              className="text-lg px-8 bg-white text-primary hover:bg-white/90"
              asChild
            >
              <Link href="/contact">
                <Calendar className="mr-2 h-5 w-5" />
                Contact Us
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-lg px-8 border-white/30 text-white hover:bg-white/10"
              asChild
            >
              <Link href="tel:+1-256-533-5789">
                <Phone className="mr-2 h-5 w-5" />
                Call (256) 533-5789
              </Link>
            </Button>
          </div>

          <div className="mt-12 grid grid-cols-3 gap-8 max-w-lg mx-auto text-center">
            <div>
              <div className="text-3xl font-bold">5</div>
              <div className="text-sm opacity-80">System Sectors</div>
            </div>
            <div>
              <div className="text-3xl font-bold">CONUS</div>
              <div className="text-sm opacity-80">& OCONUS</div>
            </div>
            <div>
              <div className="text-3xl font-bold">DoD</div>
              <div className="text-sm opacity-80">Trusted Partner</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
