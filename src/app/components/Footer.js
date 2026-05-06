import Image from "next/image";
import Link from "next/link";

const FOOTER_LINKS = [
  {
    title: "Services",
    links: [
      { href: "/services?service=fence",        label: "Fence Installation Calgary" },
      { href: "/services?service=deck-railing", label: "Deck Builder Calgary" },
      { href: "/services?service=pergola",       label: "Pergola Calgary" },
      { href: "/services?service=sod",           label: "Sod Installation Calgary" },
      { href: "/services?service=trees-shrubs",  label: "Trees & Shrubs" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/about",   label: "About Us" },
      { href: "/projects", label: "Our Projects" },
      { href: "/contact",  label: "Contact" },
      { href: "/book",     label: "Book Appointment" },
    ],
  },
  {
    title: "Get a Quote",
    links: [
      { href: "/services-quote", label: "Request Free Estimate" },
      { href: "/services-quote", label: "Fence Quote" },
      { href: "/services-quote", label: "Deck Quote" },
      { href: "/services-quote", label: "Pergola Quote" },
      { href: "/services-quote", label: "Sod Quote" },
    ],
  },
  {
    title: "Legal",
    links: [
      { href: "/terms",   label: "Terms & Conditions" },
      { href: "/contact", label: "Privacy Policy" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="bg-[#1a1f1a] w-full text-white">
      {/* Main grid */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 md:gap-8">

          {/* Brand column — spans 2 on desktop */}
          <div className="md:col-span-2 flex flex-col gap-5">
            <Link href="/" aria-label="Landscape Craftsmen home">
              <Image
                src="/icons/official_title_logo.svg"
                alt="Landscape Craftsmen — Calgary Landscaping"
                width={140}
                height={42}
                className="h-10 w-auto object-contain brightness-200"
              />
            </Link>

            <p className="text-sm text-gray-400 leading-relaxed max-w-xs">
              Calgary&apos;s trusted landscaping contractor — fence installation, deck building, pergola construction, sod &amp; more. Licensed &amp; insured.
            </p>

            <div className="space-y-1.5 text-sm">
              <a
                href="tel:+15874386672"
                className="flex items-center gap-2 text-gray-300 hover:text-[#7dc76a] transition-colors"
              >
                <span>📞</span> (587) 438-6672
              </a>
              <a
                href="mailto:landscapecraftsmen@yahoo.com"
                className="flex items-center gap-2 text-gray-300 hover:text-[#7dc76a] transition-colors break-all"
              >
                <span>✉️</span> landscapecraftsmen@yahoo.com
              </a>
              <p className="flex items-center gap-2 text-gray-400">
                <span>📍</span> Calgary, AB, Canada
              </p>
            </div>

            {/* Social icons */}
            <div className="flex gap-3 mt-1">
              <a
                href="https://www.facebook.com/p/Landscape-Craftsmen-61575247719417/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Landscape Craftsmen on Facebook"
                className="w-9 h-9 flex items-center justify-center rounded-full bg-white/10 hover:bg-[#477a40] transition-colors"
              >
                <Image src="/icons/facebook.png" alt="Facebook" width={18} height={18} className="w-4 h-4 object-contain brightness-200" />
              </a>
              <a
                href="https://www.instagram.com/landscape.craftsmen"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Landscape Craftsmen on Instagram"
                className="w-9 h-9 flex items-center justify-center rounded-full bg-white/10 hover:bg-[#477a40] transition-colors"
              >
                <Image src="/icons/instagram.png" alt="Instagram" width={18} height={18} className="w-4 h-4 object-contain brightness-200" />
              </a>
            </div>
          </div>

          {/* Link columns */}
          {FOOTER_LINKS.map((col) => (
            <div key={col.title}>
              <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-4">
                {col.title}
              </h3>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-gray-400 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500">
          <p>&copy; {new Date().getFullYear()} Landscape Craftsmen. All rights reserved. Calgary, AB.</p>
          <p>
            Fence · Deck · Pergola · Sod ·{" "}
            <Link href="/services-quote" className="hover:text-[#7dc76a] transition-colors">
              Free Estimate
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
