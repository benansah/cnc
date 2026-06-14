"use client";

import { useState, type FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBus,
  faSearch,
  faCheckCircle,
  faLock,
  faArrowRight,
  faLocationDot,
  faCalendar,
} from "@fortawesome/free-solid-svg-icons";
import { Footer } from "@/components/layout/footer";

export default function HomePage() {
  const [fromLocation, setFromLocation] = useState("");
  const [toLocation, setToLocation] = useState("");
  const [departureDate, setDepartureDate] = useState("");

  const handleSearch = (event: FormEvent) => {
    event.preventDefault();
    const query = new URLSearchParams({
      from: fromLocation,
      to: toLocation,
      date: departureDate,
    }).toString();
    window.location.href = `/booking?${query}`;
  };

  return (
    <div className="min-h-screen bg-white">

      {/* Announcement banner */}
      <div className="bg-[#FF6F00] px-4 py-2 text-center text-sm text-white">
        C&C Transport is now live across 10+ campuses in Ghana.{" "}
        <Link href="/booking" className="font-semibold underline underline-offset-2 hover:no-underline">
          Book your seat today →
        </Link>
      </div>

      {/* Sticky header */}
      <header className="sticky top-0 z-50 border-b border-[#E5E7EB] bg-white/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-3">
            <Image src="/cnc_logo.png" alt="C&C Transport" width={40} height={40} className="object-contain" />
            <div className="leading-tight">
              <span className="block text-[10px] font-bold uppercase tracking-[0.25em] text-[#425066]">
                C&C Transport
              </span>
              <span className="block text-sm font-bold text-[#425066]">
                Campus Bus Booking
              </span>
            </div>
          </Link>

          <nav className="hidden items-center gap-7 md:flex">
            {[
              { label: "Home", href: "/" },
              { label: "Book", href: "/booking" },
              { label: "Terms", href: "/terms" },
            ].map(({ label, href }) => (
              <Link
                key={href}
                href={href}
                className="text-sm font-medium text-[#425066] transition-colors hover:text-[#425066]"
              >
                {label}
              </Link>
            ))}
          </nav>

          <Link
            href="/booking"
            className="rounded-full bg-[#FF6F00] px-5 py-2 text-sm font-semibold text-white transition-all duration-200 hover:bg-[#F57C00] hover:scale-[1.03] active:scale-100"
          >
            Book Now
          </Link>
        </div>
      </header>

      <main>

        {/* ── Hero ─────────────────────────────────────────── */}
        <section className="relative overflow-hidden border-b border-[#E5E7EB] bg-white px-4 py-16 sm:px-6 lg:px-8 animate-fade-in">

          {/* Concentric arcs — top right */}
          <svg
            aria-hidden="true"
            className="pointer-events-none absolute -right-24 -top-24 h-[480px] w-[480px] opacity-[0.07]"
            viewBox="0 0 480 480"
            fill="none"
          >
            <circle cx="420" cy="60" r="180" stroke="#425066" strokeWidth="1.5" />
            <circle cx="420" cy="60" r="240" stroke="#425066" strokeWidth="1" />
            <circle cx="420" cy="60" r="300" stroke="#425066" strokeWidth="0.75" />
            <circle cx="420" cy="60" r="360" stroke="#425066" strokeWidth="0.5" />
          </svg>

          {/* Dot grid — bottom left */}
          <svg
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-4 -left-4 h-52 w-52 opacity-[0.09]"
            viewBox="0 0 200 200"
          >
            <defs>
              <pattern id="hero-dots" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                <circle cx="3" cy="3" r="2" fill="#425066" />
              </pattern>
            </defs>
            <rect width="200" height="200" fill="url(#hero-dots)" />
          </svg>

          {/* Small diamond accent — left-center */}
          <svg
            aria-hidden="true"
            className="pointer-events-none absolute left-8 top-1/2 -translate-y-1/2 h-16 w-16 opacity-[0.08]"
            viewBox="0 0 64 64"
            fill="none"
          >
            <rect x="8" y="8" width="48" height="48" stroke="#425066" strokeWidth="1.5" transform="rotate(45 32 32)" />
            <rect x="18" y="18" width="28" height="28" stroke="#425066" strokeWidth="1" transform="rotate(45 32 32)" />
          </svg>

          <div className="relative mx-auto max-w-7xl">
            <div className="grid gap-12 lg:grid-cols-2 lg:items-start">

              {/* Left */}
              <div className="space-y-7">
                <div className="inline-flex items-center gap-2 rounded-full border border-[#E5E7EB] bg-[#F8F9FA] px-4 py-1.5 text-xs font-medium text-[#425066]">
                  <FontAwesomeIcon icon={faCheckCircle} className="text-[#34A853]" />
                  Trusted by campus travelers across Ghana
                </div>

                <h1 className="text-4xl font-bold leading-tight text-[#425066] sm:text-5xl">
                  The campus bus booking platform for{" "}
                  <span className="text-[#425066]">students, staff, and visitors.</span>
                </h1>

                <p className="text-base leading-7 text-[#425066]">
                  Search schedules, pick your preferred seat, and pay securely with Paystack.
                  Travel smart with C&C Transport — comfortable rides, clear fares, and reliable
                  service across Ghana's leading campuses.
                </p>

                <div className="flex flex-wrap gap-3">
                  <Link
                    href="/booking"
                    className="inline-flex items-center gap-2 rounded-full bg-[#FF6F00] px-6 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:bg-[#F57C00] hover:scale-[1.03] active:scale-100 shadow-sm"
                  >
                    Start booking
                    <FontAwesomeIcon icon={faArrowRight} className="h-3 w-3" />
                  </Link>
                  <Link
                    href="/terms"
                    className="inline-flex items-center gap-2 rounded-full border border-[#E5E7EB] bg-white px-6 py-2.5 text-sm font-semibold text-[#425066] transition-all duration-200 hover:bg-[#F3F4F6] hover:scale-[1.03] active:scale-100"
                  >
                    Terms & Conditions
                  </Link>
                </div>

                <div className="flex flex-wrap gap-8 border-t border-[#E5E7EB] pt-6">
                  {[
                    { value: "50+", label: "Daily routes" },
                    { value: "10+", label: "Trusted campuses" },
                    { value: "Paystack", label: "Secure checkout" },
                  ].map(({ value, label }) => (
                    <div key={label}>
                      <p className="text-2xl font-bold text-[#425066]">{value}</p>
                      <p className="mt-0.5 text-xs text-[#80868B]">{label}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right: quick search */}
              <div className="rounded-2xl border border-[#E5E7EB] bg-[#F8F9FA] p-8 shadow-card">
                <h2 className="text-base font-bold text-[#425066]">Quick route search</h2>
                <p className="mt-1 text-sm text-[#425066]">
                  Enter your route and date to find available buses.
                </p>

                <form onSubmit={handleSearch} className="mt-6 space-y-4">
                  <div>
                    <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-[#425066]">
                      From
                    </label>
                    <div className="relative">
                      <FontAwesomeIcon icon={faLocationDot} className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#CCCCCC]" />
                      <input
                        value={fromLocation}
                        onChange={(e) => setFromLocation(e.target.value)}
                        required
                        placeholder="Departure city"
                        className="w-full rounded-xl border border-[#E5E7EB] bg-white py-2.5 pl-9 pr-3 text-sm text-[#425066] placeholder:text-[#80868B] outline-none transition focus:border-[#425066] focus:ring-2 focus:ring-[#425066]/20"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-[#425066]">
                      To
                    </label>
                    <div className="relative">
                      <FontAwesomeIcon icon={faLocationDot} className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#CCCCCC]" />
                      <input
                        value={toLocation}
                        onChange={(e) => setToLocation(e.target.value)}
                        required
                        placeholder="Arrival city"
                        className="w-full rounded-xl border border-[#E5E7EB] bg-white py-2.5 pl-9 pr-3 text-sm text-[#425066] placeholder:text-[#80868B] outline-none transition focus:border-[#425066] focus:ring-2 focus:ring-[#425066]/20"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-[#425066]">
                      Date
                    </label>
                    <div className="relative">
                      <FontAwesomeIcon icon={faCalendar} className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#CCCCCC]" />
                      <input
                        type="date"
                        value={departureDate}
                        onChange={(e) => setDepartureDate(e.target.value)}
                        required
                        className="w-full rounded-xl border border-[#E5E7EB] bg-white py-2.5 pl-9 pr-3 text-sm text-[#425066] outline-none transition focus:border-[#425066] focus:ring-2 focus:ring-[#425066]/20"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#425066] px-4 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-[#3a4559] hover:scale-[1.02] active:scale-100"
                  >
                    <FontAwesomeIcon icon={faSearch} className="h-3.5 w-3.5" />
                    Search buses
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>

        {/* ── Features ─────────────────────────────────────── */}
        <section className="relative overflow-hidden border-b border-[#E5E7EB] bg-[#F8F9FA] px-4 py-14 sm:px-6 lg:px-8">

          {/* Diagonal line grid — right side */}
          <svg
            aria-hidden="true"
            className="pointer-events-none absolute right-0 top-0 h-full w-72 opacity-[0.055]"
            preserveAspectRatio="xMidYMid slice"
          >
            <defs>
              <pattern id="feat-diag" x="0" y="0" width="28" height="28" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                <line x1="0" y1="0" x2="0" y2="28" stroke="#425066" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#feat-diag)" />
          </svg>

          {/* Large rounded-square outline — top left */}
          <svg
            aria-hidden="true"
            className="pointer-events-none absolute -left-16 -top-16 h-64 w-64 opacity-[0.07]"
            viewBox="0 0 240 240"
            fill="none"
          >
            <rect x="12" y="12" width="216" height="216" rx="40" stroke="#425066" strokeWidth="1.5" />
            <rect x="36" y="36" width="168" height="168" rx="28" stroke="#425066" strokeWidth="1" />
          </svg>

          {/* Route-stop line — left margin */}
          <svg
            aria-hidden="true"
            className="pointer-events-none absolute left-6 top-1/2 -translate-y-1/2 h-48 w-6 opacity-[0.12]"
            viewBox="0 0 24 192"
            fill="none"
          >
            <line x1="12" y1="0" x2="12" y2="192" stroke="#425066" strokeWidth="1.5" strokeDasharray="4 6" />
            <circle cx="12" cy="24" r="5" fill="#425066" />
            <circle cx="12" cy="96" r="5" fill="#425066" />
            <circle cx="12" cy="168" r="5" fill="#425066" />
          </svg>

          <div className="relative mx-auto max-w-7xl">
            <p className="text-xs font-bold uppercase tracking-widest text-[#425066]">
              Why C&C Transport
            </p>
            <h2 className="mt-2 text-2xl font-bold text-[#425066]">
              Everything you need for hassle-free campus travel
            </h2>

            <div className="mt-10 grid gap-5 sm:grid-cols-3 stagger-children">
              {[
                {
                  icon: faSearch,
                  title: "Search with ease",
                  body: "Filter routes by campus, pick the date, and compare schedules — all from one page.",
                  cta: "Search routes",
                },
                {
                  icon: faBus,
                  title: "Choose your seat",
                  body: "Select seats on an interactive 49-seater bus layout and reserve your spot instantly.",
                  cta: "View buses",
                },
                {
                  icon: faLock,
                  title: "Pay securely",
                  body: "Complete payment with Paystack and receive your ticket confirmation by email immediately.",
                  cta: "Book now",
                },
              ].map(({ icon, title, body, cta }) => (
                <div
                  key={title}
                  className="group rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-card transition-all duration-250 hover:-translate-y-1 hover:shadow-card-hover"
                >
                  <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#e8ebf0]">
                    <FontAwesomeIcon icon={icon} className="h-5 w-5 text-[#425066]" />
                  </div>
                  <h3 className="font-bold text-[#425066]">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-[#425066]">{body}</p>
                  <Link
                    href="/booking"
                    className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-[#425066] hover:underline"
                  >
                    {cta}
                    <FontAwesomeIcon icon={faArrowRight} className="h-2.5 w-2.5" />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── How it works ─────────────────────────────────── */}
        <section className="relative overflow-hidden border-b border-[#E5E7EB] bg-white px-4 py-14 sm:px-6 lg:px-8">

          {/* Large ghost text */}
          <svg
            aria-hidden="true"
            className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 h-64 opacity-[0.035] select-none"
            viewBox="0 0 320 120"
          >
            <text x="0" y="100" fontFamily="Inter, sans-serif" fontWeight="900" fontSize="120" fill="#425066">HOW</text>
          </svg>

          {/* Dot columns — far left */}
          <svg
            aria-hidden="true"
            className="pointer-events-none absolute left-0 top-0 h-full w-16 opacity-[0.07]"
            preserveAspectRatio="xMidYMid slice"
          >
            <defs>
              <pattern id="hiw-dots" x="0" y="0" width="16" height="16" patternUnits="userSpaceOnUse">
                <circle cx="4" cy="4" r="1.5" fill="#425066" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#hiw-dots)" />
          </svg>

          {/* Arc — bottom right */}
          <svg
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-20 -right-20 h-72 w-72 opacity-[0.07]"
            viewBox="0 0 280 280"
            fill="none"
          >
            <circle cx="280" cy="280" r="130" stroke="#425066" strokeWidth="1.5" />
            <circle cx="280" cy="280" r="90" stroke="#425066" strokeWidth="1" />
            <circle cx="280" cy="280" r="50" stroke="#425066" strokeWidth="0.75" />
          </svg>

          <div className="relative mx-auto max-w-7xl">
            <p className="text-xs font-bold uppercase tracking-widest text-[#425066]">
              How it works
            </p>
            <h2 className="mt-2 text-2xl font-bold text-[#425066]">
              Travel planning made simple
            </h2>

            <div className="mt-10 grid gap-10 md:grid-cols-3">
              {[
                {
                  step: "01",
                  title: "Search routes",
                  body: "Enter your origin, destination, and travel date to see all matching departures.",
                },
                {
                  step: "02",
                  title: "Pick your seat",
                  body: "View available seats on the bus layout and reserve the best spot for your trip.",
                },
                {
                  step: "03",
                  title: "Confirm & travel",
                  body: "Pay securely and get your ticket confirmation instantly. Head to your pickup point with confidence.",
                },
              ].map(({ step, title, body }) => (
                <div key={step} className="flex gap-5">
                  <span className="shrink-0 text-5xl font-black leading-none text-[#F1F3F4]">
                    {step}
                  </span>
                  <div>
                    <div className="mb-3 h-0.5 w-8 bg-[#425066]" />
                    <h3 className="font-bold text-[#425066]">{title}</h3>
                    <p className="mt-2 text-sm leading-6 text-[#425066]">{body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA banner ───────────────────────────────────── */}
        <section className="relative overflow-hidden border-b border-[#E5E7EB] bg-[#F8F9FA] px-4 py-16 sm:px-6 lg:px-8">

          {/* Two large overlapping rings — left */}
          <svg
            aria-hidden="true"
            className="pointer-events-none absolute -left-32 top-1/2 -translate-y-1/2 h-80 w-80 opacity-[0.08]"
            viewBox="0 0 320 320"
            fill="none"
          >
            <circle cx="100" cy="160" r="140" stroke="#425066" strokeWidth="1.5" />
            <circle cx="160" cy="160" r="140" stroke="#425066" strokeWidth="1.5" />
            <circle cx="130" cy="160" r="80" stroke="#425066" strokeWidth="1" />
          </svg>

          {/* Two large overlapping rings — right */}
          <svg
            aria-hidden="true"
            className="pointer-events-none absolute -right-32 top-1/2 -translate-y-1/2 h-80 w-80 opacity-[0.08]"
            viewBox="0 0 320 320"
            fill="none"
          >
            <circle cx="220" cy="160" r="140" stroke="#425066" strokeWidth="1.5" />
            <circle cx="160" cy="160" r="140" stroke="#425066" strokeWidth="1.5" />
            <circle cx="190" cy="160" r="80" stroke="#425066" strokeWidth="1" />
          </svg>

          {/* Cross / plus pattern — centre faint */}
          <svg
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.035]"
            preserveAspectRatio="xMidYMid slice"
          >
            <defs>
              <pattern id="cta-cross" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                <line x1="20" y1="10" x2="20" y2="30" stroke="#425066" strokeWidth="1" />
                <line x1="10" y1="20" x2="30" y2="20" stroke="#425066" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#cta-cross)" />
          </svg>

          <div className="relative mx-auto flex max-w-7xl flex-col items-center gap-6 text-center">
            <h2 className="text-2xl font-bold text-[#425066] sm:text-3xl">
              Ready to book your campus bus?
            </h2>
            <p className="max-w-xl text-sm leading-7 text-[#425066]">
              Join thousands of students, staff, and campus visitors who book their rides through
              C&C Transport every day.
            </p>
            <Link
              href="/booking"
              className="rounded-full bg-[#FF6F00] px-8 py-3 text-sm font-bold text-white shadow-sm transition-all duration-200 hover:bg-[#F57C00] hover:scale-[1.03]"
            >
              Book a seat now
            </Link>
          </div>
        </section>

        {/* ── Trusted campuses ─────────────────────────────── */}
        <section className="relative overflow-hidden border-b border-[#E5E7EB] bg-white px-4 py-14 sm:px-6 lg:px-8">

          {/* Horizontal dot row — top */}
          <svg
            aria-hidden="true"
            className="pointer-events-none absolute left-0 right-0 top-0 h-8 w-full opacity-[0.08]"
            preserveAspectRatio="xMidYMid slice"
          >
            <defs>
              <pattern id="campus-dots" x="0" y="0" width="24" height="16" patternUnits="userSpaceOnUse">
                <circle cx="4" cy="8" r="2" fill="#425066" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#campus-dots)" />
          </svg>

          {/* Corner bracket — bottom right */}
          <svg
            aria-hidden="true"
            className="pointer-events-none absolute bottom-4 right-6 h-20 w-20 opacity-[0.1]"
            viewBox="0 0 80 80"
            fill="none"
          >
            <path d="M80 0 L80 80 L0 80" stroke="#425066" strokeWidth="2" strokeLinecap="round" />
            <path d="M80 20 L80 80 L20 80" stroke="#425066" strokeWidth="1" strokeLinecap="round" />
          </svg>

          {/* Corner bracket — top left */}
          <svg
            aria-hidden="true"
            className="pointer-events-none absolute left-6 top-4 h-20 w-20 opacity-[0.1]"
            viewBox="0 0 80 80"
            fill="none"
          >
            <path d="M0 80 L0 0 L80 0" stroke="#425066" strokeWidth="2" strokeLinecap="round" />
            <path d="M0 60 L0 0 L60 0" stroke="#425066" strokeWidth="1" strokeLinecap="round" />
          </svg>

          <div className="relative mx-auto max-w-7xl">
            <p className="text-center text-xs font-bold uppercase tracking-widest text-[#80868B]">
              Serving students across Ghana's top universities
            </p>
            <div className="mt-10 grid grid-cols-2 items-center justify-items-center gap-10 sm:grid-cols-4">
              {[
                { src: "/images/ug-logo.png", alt: "UG logo", name: "University of Ghana" },
                { src: "/images/uhas-logo.png", alt: "UHAS logo", name: null },
                { src: "/images/knust-logo.png", alt: "KNUST logo", name: null },
                { src: "/images/ucc-logo.webp", alt: "UCC logo", name: "University of Cape Coast" },
              ].map(({ src, alt, name }) => (
                <div
                  key={alt}
                  className="flex items-center gap-3 opacity-50 grayscale transition-all duration-250 hover:opacity-100 hover:grayscale-0"
                >
                  <div className="relative h-14 w-28 shrink-0">
                    <Image src={src} alt={alt} fill className="object-contain" />
                  </div>
                  {name && (
                    <span className="text-left text-[11px] font-semibold uppercase tracking-wider text-[#425066] leading-tight max-w-[80px]">
                      {name}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
