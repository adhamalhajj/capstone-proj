'use client';

import { useRef, useState, useCallback, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const SLIDES = [
  { src: '/projects/Img5.JPG', alt: 'Fence installation' },
  { src: '/projects/Img1.JPG', alt: 'Deck project' },
  { src: '/projects/Img2.JPG', alt: 'Pergola build' },
  { src: '/projects/Img4.JPG', alt: 'Landscaping project' },
  { src: '/projects/Img3.JPG', alt: 'Sod installation' },
  { src: '/projects/Img6.JPG', alt: 'Trees & shrubs' },
];

export default function ProjectCarousel() {
  const [current, setCurrent] = useState(0);
  const touchStartX = useRef(null);
  const total = SLIDES.length;

  const prev = useCallback(() => setCurrent(c => (c - 1 + total) % total), [total]);
  const next = useCallback(() => setCurrent(c => (c + 1) % total), [total]);

  // Keyboard navigation
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [prev, next]);

  const onTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const delta = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(delta) > 40) delta > 0 ? next() : prev();
    touchStartX.current = null;
  };

  const goTo = (i) => setCurrent(i);

  return (
    <div className="w-full max-w-6xl mx-auto px-4">
      {/* Slide window */}
      <div className="relative group">
        <div
          className="overflow-hidden rounded-2xl shadow-2xl cursor-grab active:cursor-grabbing"
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          {/* Track */}
          <div
            className="flex transition-transform duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]"
            style={{ transform: `translateX(-${current * 100}%)` }}
          >
            {SLIDES.map((slide, i) => (
              <div
                key={i}
                className="relative w-full shrink-0 h-64 sm:h-96 md:h-[480px] lg:h-[560px]"
                aria-hidden={i !== current}
              >
                <Image
                  src={slide.src}
                  alt={slide.alt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 90vw"
                  priority={i === 0}
                />
                {/* Gradient scrim for counter legibility */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
              </div>
            ))}
          </div>
        </div>

        {/* Slide counter */}
        <div className="absolute bottom-4 left-4 text-white text-sm font-medium bg-black/40 backdrop-blur-sm px-3 py-1 rounded-full">
          {current + 1} / {total}
        </div>

        {/* Prev arrow */}
        <button
          onClick={prev}
          aria-label="Previous project"
          className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full bg-black/50 hover:bg-black/75 active:bg-black/90 text-white text-xl font-bold transition-all duration-200 opacity-0 group-hover:opacity-100 focus:opacity-100 shadow-lg"
        >
          ‹
        </button>

        {/* Next arrow */}
        <button
          onClick={next}
          aria-label="Next project"
          className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full bg-black/50 hover:bg-black/75 active:bg-black/90 text-white text-xl font-bold transition-all duration-200 opacity-0 group-hover:opacity-100 focus:opacity-100 shadow-lg"
        >
          ›
        </button>
      </div>

      {/* Dot indicators */}
      <div className="flex items-center justify-center gap-2 mt-5" role="tablist" aria-label="Project slides">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            role="tab"
            aria-selected={i === current}
            aria-label={`Go to project ${i + 1}`}
            onClick={() => goTo(i)}
            className={`rounded-full transition-all duration-300 ${
              i === current
                ? 'w-6 h-2.5 bg-[#477a40]'
                : 'w-2.5 h-2.5 bg-gray-300 hover:bg-gray-400'
            }`}
          />
        ))}
      </div>

      {/* Thumbnail strip — visible on md+ */}
      <div className="hidden md:flex gap-2 mt-4 overflow-x-auto pb-1">
        {SLIDES.map((slide, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            aria-label={`Jump to ${slide.alt}`}
            className={`relative shrink-0 w-20 h-14 rounded-lg overflow-hidden transition-all duration-200 ${
              i === current
                ? 'ring-2 ring-[#477a40] ring-offset-2 opacity-100'
                : 'opacity-50 hover:opacity-80'
            }`}
          >
            <Image
              src={slide.src}
              alt={slide.alt}
              fill
              className="object-cover"
              sizes="80px"
            />
          </button>
        ))}
      </div>

      {/* See more link */}
      <div className="mt-6 border-t-4 border-[#477a40] max-w-xs md:max-w-2xl mx-auto p-4 text-xl md:text-2xl text-center">
        <Link href="/projects" className="font-bold text-black hover:underline underline-offset-4">
          See More Projects →
        </Link>
      </div>
    </div>
  );
}
