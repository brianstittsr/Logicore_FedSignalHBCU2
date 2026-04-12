"use client";

import { useEffect, useState } from "react";
import { Shield, Users, Award, TrendingUp } from "lucide-react";

const stats = [
  {
    label: "Years of Service",
    value: 25,
    suffix: "+",
    icon: Award,
    description: "Supporting DoD and federal agencies",
  },
  {
    label: "System Sectors",
    value: 5,
    suffix: "",
    icon: Shield,
    description: "Aviation, Missiles, Comms, Test, Tactical",
  },
  {
    label: "Dedicated Workforce",
    value: 200,
    suffix: "+",
    icon: Users,
    description: "Highly qualified professionals",
  },
  {
    label: "Active Programs",
    value: 30,
    suffix: "+",
    icon: TrendingUp,
    description: "CONUS and OCONUS locations",
  },
];

function AnimatedCounter({ value, suffix }: { value: number; suffix: string }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const increment = value / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [value]);

  return (
    <span>
      {count.toLocaleString()}
      {suffix}
    </span>
  );
}

export function StatsSection() {
  return (
    <section className="py-16 bg-[#0f2a4a] text-white">
      <div className="container">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/20 mb-4">
                <stat.icon className="h-6 w-6 text-primary" />
              </div>
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">
                <AnimatedCounter value={stat.value} suffix={stat.suffix} />
              </div>
              <div className="font-semibold mb-1">{stat.label}</div>
              <div className="text-sm text-gray-400">{stat.description}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
