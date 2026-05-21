"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input, Select } from "@/components/ui/form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBus,
  faMapMarkerAlt,
  faCalendar,
  faSearch,
  faCheckCircle,
  faHeadset,
  faLock,
} from "@fortawesome/free-solid-svg-icons";

export default function HomePage() {
  const [fromLocation, setFromLocation] = useState("");
  const [toLocation, setToLocation] = useState("");
  const [departureDate, setDepartureDate] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // This will be connected to the booking page
    const params = new URLSearchParams({
      from: fromLocation,
      to: toLocation,
      date: departureDate,
    });
    window.location.href = `/booking?${params.toString()}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-white/20 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FontAwesomeIcon
              icon={faBus}
              className="text-purple-600 text-2xl"
            />
            <span className="text-xl font-bold text-gray-900">C&C Transport</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/booking">
              <Button variant="ghost">Book Now</Button>
            </Link>
            <Link href="/admin">
              <Button variant="outline">Admin</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-12 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 mb-4">
              Book Your Journey <br />
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                The Easy Way
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Comfortable, safe, and affordable bus bookings. Travel with confidence across Nigeria.
            </p>
          </div>

          {/* Search Form */}
          <Card className="max-w-4xl mx-auto mb-16 glass shadow-2xl">
            <CardContent className="p-8">
              <form onSubmit={handleSearch} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* From Location */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-2" />
                      From
                    </label>
                    <Input
                      type="text"
                      placeholder="Departure city"
                      value={fromLocation}
                      onChange={(e) => setFromLocation(e.target.value)}
                      required
                      className="w-full"
                    />
                  </div>

                  {/* To Location */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-2" />
                      To
                    </label>
                    <Input
                      type="text"
                      placeholder="Arrival city"
                      value={toLocation}
                      onChange={(e) => setToLocation(e.target.value)}
                      required
                      className="w-full"
                    />
                  </div>

                  {/* Departure Date */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <FontAwesomeIcon icon={faCalendar} className="mr-2" />
                      Date
                    </label>
                    <Input
                      type="date"
                      value={departureDate}
                      onChange={(e) => setDepartureDate(e.target.value)}
                      required
                      className="w-full"
                    />
                  </div>

                  {/* Search Button */}
                  <div className="flex items-end">
                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                    >
                      <FontAwesomeIcon icon={faSearch} className="mr-2" />
                      Search Buses
                    </Button>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <Card className="glass border-white/20">
              <CardContent className="p-6 text-center">
                <div className="text-4xl text-purple-600 mb-4 flex justify-center">
                  <FontAwesomeIcon icon={faCheckCircle} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Easy Booking
                </h3>
                <p className="text-gray-600">
                  Book your tickets in just a few clicks. Fast, easy, and secure.
                </p>
              </CardContent>
            </Card>

            <Card className="glass border-white/20">
              <CardContent className="p-6 text-center">
                <div className="text-4xl text-pink-600 mb-4 flex justify-center">
                  <FontAwesomeIcon icon={faLock} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Secure Payment
                </h3>
                <p className="text-gray-600">
                  Multiple payment options with Paystack. Your data is safe with us.
                </p>
              </CardContent>
            </Card>

            <Card className="glass border-white/20">
              <CardContent className="p-6 text-center">
                <div className="text-4xl text-blue-600 mb-4 flex justify-center">
                  <FontAwesomeIcon icon={faHeadset} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  24/7 Support
                </h3>
                <p className="text-gray-600">
                  Our customer support team is always ready to help you.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* CTA Section */}
          <Card className="bg-gradient-to-r from-purple-600 to-pink-600 text-white border-0 glass">
            <CardContent className="p-12 text-center">
              <h2 className="text-3xl font-bold mb-4">Ready to Travel?</h2>
              <p className="text-white/90 mb-8 max-w-2xl mx-auto">
                Search for buses, select your seats, and complete your booking in minutes. 
                No hidden charges, transparent pricing.
              </p>
              <Link href="/booking">
                <Button
                  size="lg"
                  className="bg-white text-purple-600 hover:bg-gray-100"
                >
                  <FontAwesomeIcon icon={faBus} className="mr-2" />
                  Start Booking Now
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
