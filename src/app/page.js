import Link from "next/link";

import NavBar          from "./components/Navbar.js";
import Footer          from "./components/Footer.js";
import CommentCarousel from "./components/CommentsCarousel.js";
import ProjectCarousel from "./components/ProjectCarousel.js";
import ServicesSection from "./components/ServicesSection.js";
import HowItWorks      from "./components/HowItWorks.js";
import ServiceArea     from "./components/ServiceArea.js";
import FAQSection      from "./components/FAQSection.js";
import AnimatedShaderHero from "@/components/ui/animated-shader-hero.js";

/* ─── SEO Metadata ─────────────────────────────────────────────────── */
export const metadata = {
  title: "Calgary Landscaping, Fence & Deck Experts | Landscape Craftsmen",
  description:
    "Landscape Craftsmen provides expert fence installation, deck building, pergola construction & sod installation in Calgary. Licensed & insured. Free estimates — call (587) 438-6672.",
  keywords:
    "fence installation Calgary, deck builder Calgary, pergola Calgary, sod installation Calgary, landscaping Calgary, trees shrubs Calgary, Calgary outdoor living",
  openGraph: {
    title: "Calgary Landscaping & Outdoor Living | Landscape Craftsmen",
    description:
      "Expert fence, deck, pergola & sod installation across Calgary. Licensed, insured, free estimates.",
    url: "https://landscapecraftsmen.ca",
    siteName: "Landscape Craftsmen",
    locale: "en_CA",
    type: "website",
  },
};

/* ─── LocalBusiness JSON-LD Schema ─────────────────────────────────── */
const LOCAL_BUSINESS_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "HomeAndConstructionBusiness",
  name: "Landscape Craftsmen",
  url: "https://landscapecraftsmen.ca",
  telephone: "+15874386672",
  email: "landscapecraftsmen@yahoo.com",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Calgary",
    addressRegion: "AB",
    addressCountry: "CA",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 51.0447,
    longitude: -114.0719,
  },
  areaServed: [
    "Calgary", "Airdrie", "Cochrane", "Chestermere", "Okotoks",
  ],
  openingHoursSpecification: [
    { "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday","Tuesday","Wednesday","Thursday","Friday"], opens: "08:00", closes: "18:00" },
    { "@type": "OpeningHoursSpecification", dayOfWeek: ["Saturday"], opens: "09:00", closes: "16:00" },
  ],
  makesOffer: [
    { "@type": "Offer", itemOffered: { "@type": "Service", name: "Fence Installation Calgary" } },
    { "@type": "Offer", itemOffered: { "@type": "Service", name: "Deck Builder Calgary" } },
    { "@type": "Offer", itemOffered: { "@type": "Service", name: "Pergola Calgary" } },
    { "@type": "Offer", itemOffered: { "@type": "Service", name: "Sod Installation Calgary" } },
    { "@type": "Offer", itemOffered: { "@type": "Service", name: "Trees and Shrubs Calgary" } },
  ],
  sameAs: [
    "https://www.facebook.com/p/Landscape-Craftsmen-61575247719417/",
    "https://www.instagram.com/landscape.craftsmen",
  ],
};

const FAQ_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How much does fence installation cost in Calgary?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Fence installation in Calgary typically ranges from $25–$60 per linear foot depending on material. Our free estimates include materials, labour, and permit guidance.",
      },
    },
    {
      "@type": "Question",
      name: "Do I need a permit for a deck or fence in Calgary?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Decks over 0.6 m above grade require a development permit in Calgary. Fences over 1.8 m also require approval. We guide you through the permit process at no extra cost.",
      },
    },
    {
      "@type": "Question",
      name: "When is the best time to install sod in Calgary?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The ideal window for sod installation in Calgary is May through early September when soil temperatures are above 10°C.",
      },
    },
    {
      "@type": "Question",
      name: "How long does pergola installation take in Calgary?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Most pergola installations take 1–3 days depending on size and complexity.",
      },
    },
    {
      "@type": "Question",
      name: "Do you offer free landscaping estimates in Calgary?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes — free, no-obligation estimates for all services across Calgary and surrounding areas.",
      },
    },
  ],
};

/* ─── Page ──────────────────────────────────────────────────────────── */
export default function Home() {
  return (
    <div className="bg-white">
      {/* JSON-LD structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(LOCAL_BUSINESS_SCHEMA) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_SCHEMA) }}
      />

      {/* ── Sticky header ── */}
      <header className="sticky top-0 z-50 w-full bg-white shadow-sm">
        <NavBar />
      </header>

      <main className="flex flex-col w-full bg-white">

        {/* ── H1 Hero ── */}
        <AnimatedShaderHero
          trustBadge={{
            text: "Licensed · Insured · Serving Calgary Since 2020",
            icons: ["🌿"],
          }}
          headline={{
            line1: "Calgary's Trusted",
            line2: "Outdoor Craftsmen.",
          }}
          subtitle="Expert fence installation, deck building, pergola construction & sod installation across Calgary. Clean work, clear communication, results that last."
          buttons={{
            primary:   { text: "Request a Free Quote",    href: "/services-quote" },
            secondary: { text: "Book an Appointment", href: "/book" },
          }}
        />

        {/* ── H2: Landscaping Services in Calgary ── */}
        {/*     ServicesSection renders its own H2 + H3s internally */}
        <ServicesSection />

        {/* ── H2: Our Simple Process ── */}
        <HowItWorks />

        {/* ── H2: Our Calgary Projects ── */}
        <section className="w-full py-12 sm:py-16">
          <div className="flex items-center justify-center mb-6 px-4">
            <h2 className="text-3xl sm:text-4xl font-extrabold border-b-2 border-[#477a40] pb-2 text-black text-center">
              Our Calgary Projects
            </h2>
          </div>
          <ProjectCarousel />
        </section>

        {/* ── H2: Serving All of Calgary & Area ── */}
        <ServiceArea />

        {/* ── H2: What Calgary Homeowners Say ── */}
        <section className="w-full mt-4">
          <div className="text-center mx-auto mb-10 px-4">
            <h2 className="text-3xl sm:text-4xl font-extrabold border-b-2 p-2 border-[#477a40] inline-block">
              What Calgary Homeowners Say
            </h2>
          </div>
          <div className="w-screen left-1/2 pt-1 -ml-[50vw] bg-[url('/backgrounds/wood-background.jpg')] bg-cover bg-no-repeat bg-center pb-10 relative z-0">
            <div className="max-w-5xl mx-auto relative z-10">
              <CommentCarousel />
            </div>
          </div>
        </section>

        {/* ── H2: Frequently Asked Questions ── */}
        <FAQSection />

        {/* ── H2: Get a Free Calgary Landscaping Quote ── */}
        <section className="w-full py-16 sm:py-20 bg-white">
          <div className="max-w-2xl mx-auto px-4 text-center">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">
              Get a Free Calgary Landscaping Quote
            </h2>
            <p className="text-gray-500 mb-8 text-base sm:text-lg">
              Fence installation, deck building, pergola construction, sod &amp; more — serving Calgary and surrounding areas. No pressure, no hidden fees.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/services-quote"
                className="px-8 py-4 bg-[#477a40] hover:bg-[#3a6433] active:bg-[#2f5a29] text-white rounded-full font-semibold text-lg transition-all hover:scale-105 active:scale-95 shadow-lg text-center"
              >
                Request a Free Estimate
              </Link>
              <Link
                href="/book"
                className="px-8 py-4 border-2 border-[#477a40] text-[#477a40] hover:bg-[#477a40] hover:text-white rounded-full font-semibold text-lg transition-all hover:scale-105 active:scale-95 text-center"
              >
                Book an Appointment
              </Link>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
