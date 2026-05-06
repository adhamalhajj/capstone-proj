'use client';

import { useState } from 'react';

const FAQS = [
  {
    q: "How much does fence installation cost in Calgary?",
    a: "Fence installation in Calgary typically ranges from $25–$60 per linear foot depending on material (pressure-treated wood, vinyl, cedar, or chain-link). Our free estimates include materials, labour, and permit guidance so there are no surprises.",
  },
  {
    q: "Do I need a permit for a deck or fence in Calgary?",
    a: "Decks over 0.6 m (24\") above grade require a development permit in Calgary. Fences over 1.8 m also require approval from the City. We help guide you through Calgary's permit process at no extra cost.",
  },
  {
    q: "When is the best time to install sod in Calgary?",
    a: "The ideal window for sod installation in Calgary is May through early September when soil temperatures are consistently above 10°C. We recommend daily watering for the first two weeks to establish roots.",
  },
  {
    q: "How long does pergola installation take in Calgary?",
    a: "Most pergola installations take 1–3 days depending on size and complexity. We use materials rated for Calgary's climate — including freeze-thaw cycles and UV exposure — so your pergola lasts for years.",
  },
  {
    q: "Do you offer free estimates?",
    a: "Yes — free, no-obligation estimates for all services: fence installation, deck building, pergola construction, sod installation, and trees & shrubs across Calgary and surrounding areas.",
  },
  {
    q: "Are you licensed and insured in Alberta?",
    a: "Absolutely. Landscape Craftsmen is fully licensed and insured to work in Calgary and throughout Alberta. We carry liability insurance on every job for your complete peace of mind.",
  },
];

function FAQItem({ faq, index }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-gray-200 last:border-0">
      <button
        className="w-full flex items-center justify-between gap-4 py-5 text-left"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
      >
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 pr-2">
          {faq.q}
        </h3>
        <span
          className={`shrink-0 w-7 h-7 flex items-center justify-center rounded-full border-2 border-[#477a40] text-[#477a40] font-bold transition-transform duration-300 ${open ? 'rotate-45' : ''}`}
          aria-hidden="true"
        >
          +
        </span>
      </button>

      <div
        className={`overflow-hidden transition-all duration-300 ${open ? 'max-h-96 pb-5' : 'max-h-0'}`}
      >
        <p className="text-gray-500 leading-relaxed text-sm sm:text-base">
          {faq.a}
        </p>
      </div>
    </div>
  );
}

export default function FAQSection() {
  return (
    <section className="w-full py-16 sm:py-20 bg-[#f8fbf8]">
      <div className="max-w-3xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 border-b-2 border-[#477a40] pb-2 inline-block">
            Frequently Asked Questions
          </h2>
          <p className="mt-3 text-base sm:text-lg text-gray-500 font-light">
            Common questions about Calgary landscaping, permits, and our services.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 px-6 sm:px-8">
          {FAQS.map((faq, i) => (
            <FAQItem key={i} faq={faq} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
