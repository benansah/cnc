"use client";

import { useState, type FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBus,
  faSearch,
  faCheckCircle,
  faLock,
} from "@fortawesome/free-solid-svg-icons";

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
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <div className="relative overflow-hidden">
        <div className="absolute -top-24 left-1/2 h-96 w-96 rounded-full bg-purple-600/20 blur-3xl" />
        <div className="absolute -right-24 top-24 h-80 w-80 rounded-full bg-pink-500/20 blur-3xl" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-slate-950 to-transparent" />

        <nav className="relative z-10 border-b border-slate-800/50 bg-slate-950/90 backdrop-blur-xl">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/20">
                <FontAwesomeIcon icon={faBus} className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-slate-400">C&C Transport</p>
                <p className="text-lg font-semibold text-white">Campus Bus Booking</p>
              </div>
            </div>
            <div className="hidden items-center gap-8 md:flex">
              <Link href="/booking" className="text-slate-200 hover:text-white transition">
                Book
              </Link>
              <Link href="/admin" className="text-slate-200 hover:text-white transition">
                Admin
              </Link>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/booking">
                <Button className="bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:opacity-95">
                  Book Now
                </Button>
              </Link>
            </div>
          </div>
        </nav>

        <main className="relative z-10 px-4 pb-20 pt-10 sm:px-6 lg:px-8">
          <div className="mx-auto flex max-w-7xl flex-col gap-16 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl space-y-8">
              <div className="inline-flex items-center rounded-full border border-slate-700/60 bg-slate-900/60 px-4 py-1 text-sm text-slate-300 shadow-sm shadow-slate-950/20">
                <FontAwesomeIcon icon={faCheckCircle} className="mr-2 text-emerald-400" />
                Trusted by campus travelers across Ghana
              </div>

              <div className="space-y-6">
                <h1 className="text-5xl font-semibold tracking-tight text-white sm:text-6xl">
                  Seamless bus booking for students, staff, and campus visitors.
                </h1>
                <p className="text-lg leading-8 text-slate-300">
                  Search schedules, pick your preferred seat, and pay securely with Paystack. Travel smart with C&C Transport — comfortable rides, clear fares, and reliable service.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <Link href="/booking" className="rounded-2xl bg-white px-6 py-4 text-center text-sm font-semibold text-slate-950 shadow-lg shadow-slate-950/20 transition hover:-translate-y-0.5 hover:shadow-xl">
                  Start booking now
                </Link>
                <Link href="/admin" className="rounded-2xl border border-slate-700 px-6 py-4 text-center text-sm font-semibold text-slate-100 transition hover:border-slate-500 hover:text-white">
                  Admin dashboard
                </Link>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="rounded-3xl bg-slate-900/80 p-5 shadow-lg shadow-slate-950/20">
                  <p className="text-sm text-slate-400">Daily routes</p>
                  <p className="mt-2 text-2xl font-semibold text-white">50+</p>
                </div>
                <div className="rounded-3xl bg-slate-900/80 p-5 shadow-lg shadow-slate-950/20">
                  <p className="text-sm text-slate-400">Trusted campuses</p>
                  <p className="mt-2 text-2xl font-semibold text-white">10+</p>
                </div>
                <div className="rounded-3xl bg-slate-900/80 p-5 shadow-lg shadow-slate-950/20">
                  <p className="text-sm text-slate-400">Secure checkout</p>
                  <p className="mt-2 text-2xl font-semibold text-white">Paystack</p>
                </div>
              </div>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-slate-900/80 p-8 shadow-2xl shadow-black/20 backdrop-blur-xl">
              <h2 className="text-xl font-semibold text-white">Quick search to book your ride</h2>
              <p className="mt-3 text-sm leading-6 text-slate-400">
                Enter your route and departure date below, then continue to the booking page.
              </p>
              <form onSubmit={handleSearch} className="mt-8 space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block">
                    <span className="text-sm text-slate-300">From</span>
                    <input
                      value={fromLocation}
                      onChange={(event) => setFromLocation(event.target.value)}
                      required
                      placeholder="Departure city"
                      className="mt-2 w-full rounded-3xl border border-slate-700 bg-slate-950/90 px-4 py-3 text-white outline-none transition focus:border-purple-500"
                    />
                  </label>
                  <label className="block">
                    <span className="text-sm text-slate-300">To</span>
                    <input
                      value={toLocation}
                      onChange={(event) => setToLocation(event.target.value)}
                      required
                      placeholder="Arrival city"
                      className="mt-2 w-full rounded-3xl border border-slate-700 bg-slate-950/90 px-4 py-3 text-white outline-none transition focus:border-purple-500"
                    />
                  </label>
                </div>

                <label className="block">
                  <span className="text-sm text-slate-300">Date</span>
                  <input
                    type="date"
                    value={departureDate}
                    onChange={(event) => setDepartureDate(event.target.value)}
                    required
                    className="mt-2 w-full rounded-3xl border border-slate-700 bg-slate-950/90 px-4 py-3 text-white outline-none transition focus:border-purple-500"
                  />
                </label>

                <button
                  type="submit"
                  className="inline-flex w-full items-center justify-center rounded-3xl bg-gradient-to-r from-purple-600 to-pink-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-purple-500/20 transition hover:opacity-95"
                >
                  <FontAwesomeIcon icon={faSearch} className="mr-2" />
                  Search buses
                </button>
              </form>
            </div>

            <div className="rounded-[2rem] bg-gradient-to-br from-purple-600/15 to-pink-500/10 p-8 shadow-2xl shadow-black/10 border border-white/10">
              <p className="text-sm uppercase tracking-[0.3em] text-pink-300">Featured service</p>
              <h2 className="mt-4 text-3xl font-semibold text-white">Campus route support</h2>
              <p className="mt-3 text-slate-300">
                Real-time seat availability and clear pricing for every trip. Book with confidence and ride in comfort.
              </p>
            </div>
          </div>

          <div className="mx-auto mt-16 max-w-7xl rounded-[2rem] border border-white/10 bg-slate-900/80 p-6 shadow-2xl shadow-black/20">
            <div className="grid gap-6 lg:grid-cols-3">
              <div className="rounded-3xl bg-slate-950/90 p-6">
                <FontAwesomeIcon icon={faSearch} className="text-3xl text-purple-400" />
                <h3 className="mt-4 text-xl font-semibold text-white">Search with ease</h3>
                <p className="mt-2 text-sm leading-6 text-slate-400">
                  Filter routes by campus, pick the date, and compare schedules in one place.
                </p>
              </div>
              <div className="rounded-3xl bg-slate-950/90 p-6">
                <FontAwesomeIcon icon={faBus} className="text-3xl text-pink-400" />
                <h3 className="mt-4 text-xl font-semibold text-white">Choose your seat</h3>
                <p className="mt-2 text-sm leading-6 text-slate-400">
                  Select the seats you want on a 49-seater bus layout and reserve them instantly.
                </p>
              </div>
              <div className="rounded-3xl bg-slate-950/90 p-6">
                <FontAwesomeIcon icon={faLock} className="text-3xl text-sky-400" />
                <h3 className="mt-4 text-xl font-semibold text-white">Pay securely</h3>
                <p className="mt-2 text-sm leading-6 text-slate-400">
                  Complete payment with Paystack and receive confirmation by email right away.
                </p>
              </div>
            </div>
          </div>

          <section className="mt-20">
            <div className="flex flex-col items-center gap-4 text-center">
              <p className="text-sm uppercase tracking-[0.4em] text-pink-300">How it works</p>
              <h2 className="text-3xl font-semibold text-white sm:text-4xl">Travel planning made simple</h2>
            </div>

            <div className="mt-10 grid gap-6 md:grid-cols-3">
              <div className="rounded-[2rem] border border-white/10 bg-slate-900/80 p-8 text-center shadow-xl shadow-black/10">
                <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-purple-600/10 text-purple-300">
                  1
                </div>
                <h3 className="text-xl font-semibold text-white">Search routes</h3>
                <p className="mt-3 text-slate-400">
                  Enter your origin, destination, and travel date to see matching departures.
                </p>
              </div>
              <div className="rounded-[2rem] border border-white/10 bg-slate-900/80 p-8 text-center shadow-xl shadow-black/10">
                <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-pink-500/10 text-pink-300">
                  2
                </div>
                <h3 className="text-xl font-semibold text-white">Pick your seat</h3>
                <p className="mt-3 text-slate-400">
                  View available seats on the bus layout and reserve the best spot for your trip.
                </p>
              </div>
              <div className="rounded-[2rem] border border-white/10 bg-slate-900/80 p-8 text-center shadow-xl shadow-black/10">
                <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-sky-500/10 text-sky-300">
                  3
                </div>
                <h3 className="text-xl font-semibold text-white">Confirm & travel</h3>
                <p className="mt-3 text-slate-400">
                  Pay securely and get your ticket confirmation instantly. Head to the pickup point with confidence.
                </p>
              </div>
            </div>
          </section>

          <section className="mt-20 rounded-[2rem] border border-white/10 bg-slate-900/80 p-8 shadow-2xl shadow-black/20">
            <div className="mx-auto flex max-w-6xl flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.4em] text-purple-300">Campus trusted</p>
                <h2 className="mt-4 text-3xl font-semibold text-white">Connecting students with safe campus travel.</h2>
                <p className="mt-4 max-w-2xl text-slate-400">
                  From lecture halls to home trips, C&C Transport gives you a stress-free way to book campus buses with transparent pricing and fast checkout.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                <div className="relative h-12 w-full opacity-80 transition hover:opacity-100">
                  <Image src="/images/ug-logo.png" alt="UG logo" fill className="object-contain" />
                </div>
                <div className="relative h-12 w-full opacity-80 transition hover:opacity-100">
                  <Image src="/images/uhas-logo.png" alt="UHAS logo" fill className="object-contain" />
                </div>
                <div className="relative h-12 w-full opacity-80 transition hover:opacity-100">
                  <Image src="/images/knust-logo.png" alt="KNUST logo" fill className="object-contain" />
                </div>
                <div className="relative h-12 w-full opacity-80 transition hover:opacity-100">
                  <Image src="/images/ucc-logo.webp" alt="UCC logo" fill className="object-contain" />
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
