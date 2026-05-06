'use client';

import { useRef, useState, useCallback, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const SERVICES = [
  {
    id: 'fence',
    title: 'Fence Installation Calgary',
    description: 'Custom wood, vinyl & chain-link fences designed for Calgary properties.',
    href: '/services?service=fence',
    images: ['/projects/Img1.JPG', '/projects/Img6.JPG'],
  },
  {
    id: 'deck-railing',
    title: 'Deck Builder Calgary',
    description: 'Cedar, composite & pressure-treated decks built to Alberta code.',
    href: '/services?service=deck-railing',
    images: ['/projects/Img2.JPG', '/projects/Img5.JPG'],
  },
  {
    id: 'pergola',
    title: 'Pergola Calgary',
    description: "Backyard pergolas engineered for Calgary's freeze-thaw climate.",
    href: '/services?service=pergola',
    images: ['/projects/Img3.JPG', '/projects/Img4.JPG'],
  },
  {
    id: 'sod',
    title: 'Sod Installation Calgary',
    description: "Site prep, grading & fresh sod — ready to grow in Calgary's soil.",
    href: '/services?service=sod',
    images: ['/projects/Img4.JPG', '/projects/Img1.JPG'],
  },
  {
    id: 'trees-shrubs',
    title: 'Trees & Shrubs Calgary',
    description: "Planting, pruning & seasonal care selected for Calgary's climate.",
    href: '/services?service=trees-shrubs',
    images: ['/projects/Img5.JPG', '/projects/Img3.JPG'],
  },
];

function ServiceCard({ service }) {
  return (
    <Link
      href={service.href}
      className="group w-full bg-gray-50 hover:bg-[#f0f7ee] rounded-3xl p-6 flex flex-col h-72 sm:h-80 transition-all duration-300 shadow-sm hover:shadow-md"
    >
      {/* Stacked rotating images */}
      <div className="relative flex-grow flex items-center justify-center">
        <div className="absolute w-36 sm:w-44 aspect-[4/3] rounded-xl overflow-hidden shadow-md
          -rotate-6 transition-all duration-500
          group-hover:-rotate-[10deg] group-hover:scale-105">
          <Image
            src={service.images[0]}
            alt={service.title}
            fill
            className="object-cover"
            sizes="(max-width:640px) 144px, 176px"
          />
        </div>
        <div className="absolute w-36 sm:w-44 aspect-[4/3] rounded-xl overflow-hidden shadow-lg
          rotate-3 transition-all duration-500
          group-hover:rotate-[5deg] group-hover:scale-105">
          <Image
            src={service.images[1]}
            alt={service.title}
            fill
            className="object-cover"
            sizes="(max-width:640px) 144px, 176px"
          />
        </div>
      </div>

      {/* Title + description */}
      <div className="mt-auto pt-3 border-t border-gray-200 group-hover:border-[#477a40]/30 transition-colors">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 group-hover:text-[#477a40] transition-colors">
          {service.title}
        </h3>
        <p className="text-sm text-gray-500 mt-0.5">{service.description}</p>
      </div>
    </Link>
  );
}

export default function ServicesSection() {
  const [current, setCurrent] = useState(0);
  const touchStartX = useRef(null);
  const total = SERVICES.length;

  const prev = useCallback(() => setCurrent(c => (c - 1 + total) % total), [total]);
  const next = useCallback(() => setCurrent(c => (c + 1) % total), [total]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [prev, next]);

  const onTouchStart = (e) => { touchStartX.current = e.touches[0].clientX; };
  const onTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const delta = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(delta) > 40) delta > 0 ? next() : prev();
    touchStartX.current = null;
  };

  return (
    <section className="w-full py-12 sm:py-16 overflow-hidden">
      {/* Header */}
      <div className="text-center mb-8 sm:mb-12 px-4">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 border-b-2 border-[#477a40] pb-2 inline-block">
          Landscaping Services in Calgary
        </h2>
        <p className="mt-3 text-base sm:text-lg text-gray-500 font-light">
          Expert fence installation, deck building, pergola construction, sod &amp; more — built to last in Calgary's climate.
        </p>
      </div>

      {/* Carousel track — scroll-snap on mobile, full translateX per slide on all sizes */}
      <div className="relative group">
        {/* Clipping window */}
        <div
          className="overflow-hidden"
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          {/* Slides: each slide is 100% of the container → translateX(-100% * current) is exact */}
          <div
            className="flex transition-transform duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]"
            style={{ transform: `translateX(-${current * 100}%)` }}
          >
            {SERVICES.map((service) => (
              /* Each slide fills the container; card is centred inside it */
              <div key={service.id} className="w-full shrink-0 flex justify-center px-4 sm:px-12">
                <div className="w-full max-w-sm">
                  <ServiceCard service={service} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Prev arrow */}
        <button
          onClick={prev}
          aria-label="Previous service"
          className="absolute left-2 top-1/2 -translate-y-8 w-10 h-10 flex items-center justify-center rounded-full bg-black/40 hover:bg-black/65 active:bg-black/85 text-white text-xl font-bold transition-all opacity-0 group-hover:opacity-100 focus:opacity-100 shadow-lg"
        >
          ‹
        </button>

        {/* Next arrow */}
        <button
          onClick={next}
          aria-label="Next service"
          className="absolute right-2 top-1/2 -translate-y-8 w-10 h-10 flex items-center justify-center rounded-full bg-black/40 hover:bg-black/65 active:bg-black/85 text-white text-xl font-bold transition-all opacity-0 group-hover:opacity-100 focus:opacity-100 shadow-lg"
        >
          ›
        </button>
      </div>

      {/* Dot indicators */}
      <div className="flex items-center justify-center gap-2 mt-6">
        {SERVICES.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            aria-label={`Go to ${SERVICES[i].title}`}
            className={`rounded-full transition-all duration-300 ${
              i === current
                ? 'w-6 h-2.5 bg-[#477a40]'
                : 'w-2.5 h-2.5 bg-gray-300 hover:bg-gray-400'
            }`}
          />
        ))}
      </div>

      {/* Learn more */}
      <div className="text-center mt-8 px-4">
        <Link
          href="/about"
          className="inline-block font-bold text-[#477a40] hover:underline underline-offset-4 text-base"
        >
          Learn More About Us →
        </Link>
      </div>
    </section>
  );
}
