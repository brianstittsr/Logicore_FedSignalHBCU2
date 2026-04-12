import Script from "next/script";

// Organization Schema
export function OrganizationJsonLd() {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "LogiCore Corporation",
    alternateName: "LogiCore HSV",
    url: "https://logicorehsv.com",
    logo: "https://logicorehsv.com/logo.png",
    description:
      "LogiCore Corporation provides cybersecurity, logistics engineering, and software engineering services supporting the Department of Defense and federal agencies.",
    foundingDate: "2000",
    address: {
      "@type": "PostalAddress",
      streetAddress: "100 Church Street, Suite 100",
      addressLocality: "Huntsville",
      addressRegion: "AL",
      postalCode: "35801",
      addressCountry: "US",
    },
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: "+1-256-533-5789",
        contactType: "sales",
        availableLanguage: ["English"],
      },
      {
        "@type": "ContactPoint",
        email: "info@logicorehsv.com",
        contactType: "customer service",
      },
    ],
    sameAs: [
      "https://www.linkedin.com/company/logicore-corporation",
    ],
    areaServed: {
      "@type": "Country",
      name: "United States",
    },
    knowsAbout: [
      "Cybersecurity",
      "Logistics Engineering",
      "Software Engineering",
      "Performance-Based Logistics",
      "Value Engineering",
      "CMMC Compliance",
      "Defense Contracting",
      "HBCU Partnerships",
    ],
  };

  return (
    <Script
      id="organization-jsonld"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
    />
  );
}

// Local Business Schema (for local SEO)
export function LocalBusinessJsonLd() {
  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: "LogiCore Corporation",
    image: "https://logicorehsv.com/logo.png",
    url: "https://logicorehsv.com",
    telephone: "+1-256-533-5789",
    email: "info@logicorehsv.com",
    priceRange: "$$$$",
    address: {
      "@type": "PostalAddress",
      streetAddress: "100 Church Street, Suite 100",
      addressLocality: "Huntsville",
      addressRegion: "AL",
      postalCode: "35801",
      addressCountry: "US",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 34.7304,
      longitude: -86.5861,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "08:00",
        closes: "16:30",
      },
    ],
  };

  return (
    <Script
      id="localbusiness-jsonld"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
    />
  );
}

// Service Schema
interface ServiceJsonLdProps {
  name: string;
  description: string;
  url: string;
  provider?: string;
  areaServed?: string;
}

export function ServiceJsonLd({
  name,
  description,
  url,
  provider = "LogiCore Corporation",
  areaServed = "United States",
}: ServiceJsonLdProps) {
  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    description,
    url,
    provider: {
      "@type": "Organization",
      name: provider,
      url: "https://logicorehsv.com",
    },
    areaServed: {
      "@type": "Country",
      name: areaServed,
    },
    serviceType: "Defense & Government Services",
  };

  return (
    <Script
      id={`service-jsonld-${name.toLowerCase().replace(/\s+/g, "-")}`}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
    />
  );
}

// FAQ Schema
interface FAQItem {
  question: string;
  answer: string;
}

interface FAQJsonLdProps {
  faqs: FAQItem[];
}

export function FAQJsonLd({ faqs }: FAQJsonLdProps) {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <Script
      id="faq-jsonld"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
    />
  );
}

// Breadcrumb Schema
interface BreadcrumbItem {
  name: string;
  url: string;
}

interface BreadcrumbJsonLdProps {
  items: BreadcrumbItem[];
}

export function BreadcrumbJsonLd({ items }: BreadcrumbJsonLdProps) {
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <Script
      id="breadcrumb-jsonld"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
    />
  );
}

// Article/Blog Schema
interface ArticleJsonLdProps {
  title: string;
  description: string;
  url: string;
  image: string;
  datePublished: string;
  dateModified: string;
  authorName: string;
}

export function ArticleJsonLd({
  title,
  description,
  url,
  image,
  datePublished,
  dateModified,
  authorName,
}: ArticleJsonLdProps) {
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    url,
    image,
    datePublished,
    dateModified,
    author: {
      "@type": "Person",
      name: authorName,
    },
    publisher: {
      "@type": "Organization",
      name: "LogiCore Corporation",
      logo: {
        "@type": "ImageObject",
        url: "https://logicorehsv.com/logo.png",
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
  };

  return (
    <Script
      id="article-jsonld"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
    />
  );
}

// WebSite Schema with SearchAction
export function WebsiteJsonLd() {
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "LogiCore HSV",
    alternateName: "LogiCore Corporation",
    url: "https://logicorehsv.com",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: "https://logicorehsv.com/search?q={search_term_string}",
      },
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <Script
      id="website-jsonld"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
    />
  );
}
