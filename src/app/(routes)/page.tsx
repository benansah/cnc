"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBus,
  faMapMarkerAlt,
  faCalendar,
  faSearch,
  faCheckCircle,
  faHeadset,
  faLock,
  faArrowRight,
} from "@fortawesome/free-solid-svg-icons";

export default function HomePage() {
  const [fromLocation, setFromLocation] = useState("");
  const [toLocation, setToLocation] = useState("");
  const [departureDate, setDepartureDate] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams({ from: fromLocation, to: toLocation, date: departureDate });
    window.location.href = `/booking?${params.toString()}`;
  };

  const inputClass =
    "w-full rounded-xl border border-[#E5E7EB] bg-white px-4 py-2.5 text-sm text-[#425066] placeholder:text-[#80868B] outline-none transition focus:border-[#425066] focus:ring-2 focus:ring-[#425066]/20";

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      {/* Nav */}
      <header className="sticky top-0 z-50 border-b border-[#E5E7EB] bg-white/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8 h-14">
          <Link href="/" className="flex items-center gap-3">
            <Image src="/cnc_logo.png" alt="C&C Transport" width={40} height={40} className="object-contain" />
            <span className="text-base font-bold text-[#425066]">C&C Transport</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/booking" className="text-sm font-medium text-[#425066] hover:text-[#425066] transition-colors">Book Now</Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="border-b border-[#E5E7EB] bg-white px-4 pt-14 pb-16 sm:px-6 lg:px-8 animate-fade-in">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-[#425066] mb-4">
            Book Your Journey{" "}
            <span className="text-[#425066]">The Easy Way</span>
          </h1>
          <p className="text-lg text-[#425066] mb-10 max-w-2xl mx-auto">
            Comfortable, safe, and affordable bus bookings. Travel with confidence across Ghana.
          </p>

          {/* Search */}
          <div className="max-w-3xl mx-auto rounded-2xl border border-[#E5E7EB] bg-[#F8F9FA] p-6 shadow-card">
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#425066] mb-2 flex items-center gap-1">
                    <FontAwesomeIcon icon={faMapMarkerAlt} className="text-[#425066] h-3 w-3" />
                    From
                  </label>
                  <input type="text" placeholder="Departure city" value={fromLocation} onChange={(e) => setFromLocation(e.target.value)} required className={inputClass} />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#425066] mb-2 flex items-center gap-1">
                    <FontAwesomeIcon icon={faMapMarkerAlt} className="text-[#425066] h-3 w-3" />
                    To
                  </label>
                  <input type="text" placeholder="Arrival city" value={toLocation} onChange={(e) => setToLocation(e.target.value)} required className={inputClass} />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#425066] mb-2 flex items-center gap-1">
                    <FontAwesomeIcon icon={faCalendar} className="text-[#425066] h-3 w-3" />
                    Date
                  </label>
                  <input type="date" value={departureDate} onChange={(e) => setDepartureDate(e.target.value)} required className={inputClass} />
                </div>
              </div>
              <button
                type="submit"
                className="w-full rounded-full bg-[#FF6F00] px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-[#F57C00] hover:scale-[1.02] inline-flex items-center justify-center gap-2"
              >
                <FontAwesomeIcon icon={faSearch} className="h-3.5 w-3.5" />
                Search Buses
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-4 py-14 sm:px-6 lg:px-8 bg-[#F8F9FA]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-5 stagger-children">
          {[
            { icon: faCheckCircle, label: "Easy Booking", body: "Book your tickets in just a few clicks. Fast, easy, and secure.", color: "#34A853" },
            { icon: faLock, label: "Secure Payment", body: "Multiple payment options with Paystack. Your data is safe with us.", color: "#FF6F00" },
            { icon: faHeadset, label: "24/7 Support", body: "Our customer support team is always ready to help you.", color: "#1A73E8" },
          ].map(({ icon, label, body, color }) => (
            <div
              key={label}
              className="rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-card transition-all duration-250 hover:-translate-y-1 hover:shadow-card-hover"
            >
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl" style={{ backgroundColor: `${color}15` }}>
                <FontAwesomeIcon icon={icon} className="h-6 w-6" style={{ color }} />
              </div>
              <h3 className="font-bold text-[#425066] mb-2">{label}</h3>
              <p className="text-sm text-[#425066]">{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#FF6F00] px-4 py-14 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">Ready to Travel?</h2>
          <p className="text-white/85 mb-8 max-w-xl mx-auto text-sm leading-7">
            Search for buses, select your seats, and complete your booking in minutes. No hidden charges, transparent pricing.
          </p>
          <Link
            href="/booking"
            className="inline-flex items-center gap-2 rounded-full border-2 border-white px-8 py-3 text-sm font-bold text-white transition-all duration-200 hover:bg-white hover:text-[#425066] hover:scale-[1.03]"
          >
            <FontAwesomeIcon icon={faBus} className="h-3.5 w-3.5" />
            Start Booking Now
            <FontAwesomeIcon icon={faArrowRight} className="h-3 w-3" />
          </Link>
        </div>
      </section>
    </div>
  );
}
