"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import Image from "next/image";
import DropDownMenu from "./DropDownMenu.js";

export default function NavBar() {
  const [open, setOpen] = useState(false);
  const [animatingOut, setAnimatingOut] = useState(false);

  const toggleMenu = () => {
    if (!open) {
      setOpen(true);
      setAnimatingOut(false);
    } else {
      setAnimatingOut(true);
    }
  };

  const closeMenu = () => setAnimatingOut(true);

  // Close after slide-out animation completes
  useEffect(() => {
    if (!animatingOut) return;
    const t = setTimeout(() => {
      setOpen(false);
      setAnimatingOut(false);
    }, 280);
    return () => clearTimeout(t);
  }, [animatingOut]);

  // Lock body scroll while menu is open
  useEffect(() => {
    document.body.style.overflow = open && !animatingOut ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open, animatingOut]);

  return (
    <>
      {/* Dim backdrop */}
      {(open || animatingOut) && (
        <div
          className="fixed inset-0 bg-black/35 z-40 animate-fadeIn"
          onClick={closeMenu}
        />
      )}

      <nav className="bg-[#477a40] w-full px-4 sm:px-6 py-3 flex items-center justify-between text-white">

        {/* Logo */}
        <Link href="/" className="flex items-center shrink-0">
          <Image
            src="/icons/official_title_logo.svg"
            alt="Landscape Craftsmen"
            height={40}
            width={110}
            className="h-10 sm:h-11 w-auto object-contain"
            priority
          />
        </Link>

        {/* Desktop nav links */}
        <ul className="hidden lg:flex items-center gap-8 font-medium text-sm">
          <li><Link href="/about"    className="hover:opacity-70 transition-opacity">About</Link></li>
          <li><Link href="/services" className="hover:opacity-70 transition-opacity">Services</Link></li>
          <li><Link href="/projects" className="hover:opacity-70 transition-opacity">Projects</Link></li>
          <li><Link href="/contact"  className="hover:opacity-70 transition-opacity">Contact</Link></li>
        </ul>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {/* CTA — desktop only */}
          <Link
            href="/services-quote"
            className="hidden lg:inline-flex items-center px-5 py-2 bg-white text-[#477a40] rounded-full font-semibold text-sm hover:bg-gray-100 active:bg-gray-200 transition-colors shadow-sm"
          >
            Get a Quote
          </Link>

          {/* Hamburger / close button */}
          <button
            onClick={toggleMenu}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            className="relative w-10 h-10 flex flex-col items-center justify-center gap-[6px] p-2 hover:opacity-70 active:opacity-50 transition-opacity"
          >
            <span className={`block w-6 h-0.5 bg-white rounded-full transition-all duration-300 origin-center ${open && !animatingOut ? 'rotate-45 translate-y-[8px]' : ''}`} />
            <span className={`block w-6 h-0.5 bg-white rounded-full transition-all duration-300 ${open && !animatingOut ? 'opacity-0 scale-x-0' : ''}`} />
            <span className={`block w-6 h-0.5 bg-white rounded-full transition-all duration-300 origin-center ${open && !animatingOut ? '-rotate-45 -translate-y-[8px]' : ''}`} />
          </button>
        </div>
      </nav>

      {/* Dropdown */}
      {(open || animatingOut) && (
        <DropDownMenu onClose={closeMenu} isAnimatingOut={animatingOut} />
      )}
    </>
  );
}
