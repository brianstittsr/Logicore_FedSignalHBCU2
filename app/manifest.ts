import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "LogiCore HSV | Cyber Security, Logistics & Software Engineering",
    short_name: "LogiCore HSV",
    description:
      "LogiCore Corporation provides cybersecurity, logistics engineering, and software engineering services supporting the Department of Defense and federal agencies.",
    start_url: "/",
    display: "standalone",
    background_color: "#0f2a4a",
    theme_color: "#1a56db",
    orientation: "portrait-primary",
    icons: [
      {
        src: "/icons/icon-192x192.svg",
        sizes: "192x192",
        type: "image/svg+xml",
        purpose: "maskable",
      },
      {
        src: "/icons/icon-512x512.svg",
        sizes: "512x512",
        type: "image/svg+xml",
        purpose: "any",
      },
      {
        src: "/VPlus_logo.webp",
        sizes: "any",
        type: "image/webp",
      },
    ],
    categories: ["government", "business"],
    lang: "en-US",
    dir: "ltr",
  };
}
