'use client';

import { useRef, useEffect, useState } from 'react';
import Link from 'next/link';

const VIDEOS = [
  '/projects/Vid1.mp4',
  '/projects/Vid2.mp4',
  '/projects/Vid3.mp4',
  '/projects/Vid4.mp4',
];

const SLIDE_MS = 7000; // ms per slide before auto-advancing
const FADE_MS  = 1000; // crossfade duration

export default function AnimatedShaderHero({ trustBadge, headline, subtitle, buttons, className = '' }) {
  const [active, setActive] = useState(0);
  const [next,   setNext]   = useState(null); // non-null during crossfade
  const refs  = useRef([]);
  const timer = useRef(null);
  const busy  = useRef(false);

  const jumpTo = (targetIdx) => {
    if (busy.current || targetIdx === active) return;
    busy.current = true;
    clearTimeout(timer.current);

    const v = refs.current[targetIdx];
    if (v) { v.currentTime = 0; v.play().catch(() => {}); }
    setNext(targetIdx);

    setTimeout(() => {
      setActive(targetIdx);
      setNext(null);
      busy.current = false;
    }, FADE_MS);
  };

  // Play first video on mount
  useEffect(() => {
    refs.current[0]?.play().catch(() => {});
  }, []);

  // Arm auto-advance timer + ended listener whenever active settles
  useEffect(() => {
    if (next !== null) return;
    const vid = refs.current[active];
    const nextIdx = (active + 1) % VIDEOS.length;
    const onEnded = () => jumpTo(nextIdx);
    vid?.addEventListener('ended', onEnded);
    timer.current = setTimeout(() => jumpTo(nextIdx), SLIDE_MS);
    return () => {
      vid?.removeEventListener('ended', onEnded);
      clearTimeout(timer.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, next]);

  return (
    <div className={`relative w-full h-screen overflow-hidden bg-black ${className}`}>

      {/* ── Video layers ─────────────────────────────────────────── */}
      {VIDEOS.map((src, i) => (
        <video
          key={src}
          ref={el => { refs.current[i] = el; }}
          src={src}
          muted
          playsInline
          preload={i === 0 ? 'auto' : 'metadata'}
          className="absolute inset-0 w-full h-full object-cover"
          style={{
            opacity: i === active && next === null ? 1   // steady active
                   : i === active                  ? 0   // fading out
                   : i === next                    ? 1   // fading in
                   : 0,                                  // hidden
            transition: `opacity ${FADE_MS}ms ease-in-out`,
            zIndex: i === next ? 2 : 1,
          }}
        />
      ))}

      {/* ── Dark gradient overlay for text legibility ────────────── */}
      <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/55 via-black/25 to-black/55" />

      {/* ── Hero text & buttons ──────────────────────────────────── */}
      <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-white px-5 sm:px-8">
        {trustBadge && (
          <div className="mb-6 sm:mb-8 hero-fade-in-down">
            <div className="flex flex-wrap items-center justify-center gap-1.5 px-4 py-2 sm:px-5 sm:py-2.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-xs sm:text-sm">
              {trustBadge.icons?.map((icon, i) => (
                <span key={i}>{icon}</span>
              ))}
              <span className="text-white/90 font-medium">{trustBadge.text}</span>
            </div>
          </div>
        )}

        <div className="text-center space-y-4 sm:space-y-5 max-w-5xl mx-auto w-full">
          <h1 className="space-y-1">
            <span className="block text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight text-white hero-fade-in-up hero-delay-200 drop-shadow-lg leading-tight">
              {headline.line1}
            </span>
            <span className="block text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight text-[#7dc76a] hero-fade-in-up hero-delay-400 drop-shadow-lg leading-tight">
              {headline.line2}
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-sm sm:text-base md:text-xl text-white/80 font-light leading-relaxed hero-fade-in-up hero-delay-600 px-2">
            {subtitle}
          </p>

          {buttons && (
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mt-8 sm:mt-10 hero-fade-in-up hero-delay-800 w-full max-w-sm sm:max-w-none mx-auto">
              {buttons.primary && (
                buttons.primary.href ? (
                  <Link
                    href={buttons.primary.href}
                    className="w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 bg-[#477a40] hover:bg-[#3a6433] active:bg-[#2f5a29] text-white rounded-full font-semibold text-base sm:text-lg transition-all duration-300 hover:scale-105 active:scale-95 hover:shadow-xl hover:shadow-black/40 text-center"
                  >
                    {buttons.primary.text}
                  </Link>
                ) : (
                  <button
                    onClick={buttons.primary.onClick}
                    className="w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 bg-[#477a40] hover:bg-[#3a6433] active:bg-[#2f5a29] text-white rounded-full font-semibold text-base sm:text-lg transition-all duration-300 hover:scale-105 active:scale-95 hover:shadow-xl hover:shadow-black/40"
                  >
                    {buttons.primary.text}
                  </button>
                )
              )}
              {buttons.secondary && (
                buttons.secondary.href ? (
                  <Link
                    href={buttons.secondary.href}
                    className="w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 bg-white/10 hover:bg-white/20 active:bg-white/30 border border-white/30 hover:border-white/50 text-white rounded-full font-semibold text-base sm:text-lg transition-all duration-300 hover:scale-105 active:scale-95 backdrop-blur-sm text-center"
                  >
                    {buttons.secondary.text}
                  </Link>
                ) : (
                  <button
                    onClick={buttons.secondary.onClick}
                    className="w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 bg-white/10 hover:bg-white/20 active:bg-white/30 border border-white/30 hover:border-white/50 text-white rounded-full font-semibold text-base sm:text-lg transition-all duration-300 hover:scale-105 active:scale-95 backdrop-blur-sm"
                  >
                    {buttons.secondary.text}
                  </button>
                )
              )}
            </div>
          )}
        </div>

        {/* Scroll hint */}
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 hidden xs:flex flex-col items-center gap-2 text-white/50">
          <span className="text-xs tracking-widest uppercase">Scroll</span>
          <div className="w-px h-8 bg-gradient-to-b from-white/40 to-transparent" />
        </div>
      </div>

      {/* ── Dot indicators ───────────────────────────────────────── */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2">
        {VIDEOS.map((_, i) => (
          <button
            key={i}
            onClick={() => jumpTo(i)}
            aria-label={`Go to video ${i + 1}`}
            className={`rounded-full transition-all duration-300 ${
              i === active
                ? 'w-6 h-2.5 bg-white'
                : 'w-2.5 h-2.5 bg-white/40 hover:bg-white/70'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
