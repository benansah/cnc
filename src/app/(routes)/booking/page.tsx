"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SeatSelection } from "@/components/seats/seat-selection";
import { formatCurrency, formatDate, formatTime } from "@/lib/utils";
import {
  getAvailableSchedules,
  getSeatsForSchedule,
  createBooking,
  getRoutes,
} from "@/actions";
import { BusSchedule, Seat } from "@/types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBus,
  faMapMarkerAlt,
  faCalendar,
  faArrowRight,
  faCreditCard,
  faCheckCircle,
  faBox,
  faUser,
  faCheck,
  faArrowLeft,
  faClock,
} from "@fortawesome/free-solid-svg-icons";
import { Toaster, toast } from "sonner";

const STEPS = [
  { id: 1, label: "Trip", icon: faMapMarkerAlt },
  { id: 2, label: "Bus", icon: faBus },
  { id: 3, label: "Seat", icon: faCheckCircle },
  { id: 4, label: "Storage", icon: faBox },
  { id: 5, label: "Passenger", icon: faUser },
  { id: 6, label: "Payment", icon: faCreditCard },
  { id: 7, label: "Done", icon: faCheck },
];

const inputClass =
  "w-full rounded-xl border border-[#E5E7EB] bg-white px-4 py-3 text-sm text-[#425066] placeholder:text-[#80868B] outline-none transition focus:border-[#425066] focus:ring-2 focus:ring-[#425066]/20 disabled:opacity-50";

const selectClass =
  "w-full rounded-xl border border-[#E5E7EB] bg-white px-4 py-3 text-sm text-[#425066] outline-none transition focus:border-[#425066] focus:ring-2 focus:ring-[#425066]/20 appearance-none cursor-pointer disabled:opacity-50";

function BookingPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [schedules, setSchedules] = useState<BusSchedule[]>([]);
  const [selectedSchedule, setSelectedSchedule] = useState<BusSchedule | null>(null);
  const [seats, setSeats] = useState<Seat[]>([]);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialRouteLoading, setInitialRouteLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const [dbFromLocations, setDbFromLocations] = useState<string[]>([]);
  const [dbToLocations, setDbToLocations] = useState<string[]>([]);

  const [fromLocation, setFromLocation] = useState(() => searchParams.get("from") || "");
  const [toLocation, setToLocation] = useState(() => searchParams.get("to") || "");
  const [storageType, setStorageType] = useState("none");

  const [passengerName, setPassengerName] = useState("");
  const [passengerEmail, setPassengerEmail] = useState("");
  const [passengerPhone, setPassengerPhone] = useState("");

  useEffect(() => {
    const fetchDropdownMetadata = async () => {
      setInitialRouteLoading(true);
      try {
        const result = await getRoutes();
        if (result.success && result.data) {
          setDbFromLocations(Array.from(new Set(result.data.map((r) => r.from_location).filter(Boolean))));
          setDbToLocations(Array.from(new Set(result.data.map((r) => r.to_location).filter(Boolean))));
        }
      } catch (error) {
        console.error("Could not fetch dropdown parameters:", error);
      } finally {
        setInitialRouteLoading(false);
      }
    };
    fetchDropdownMetadata();
  }, []);

  const fetchSchedules = async () => {
    if (!fromLocation || !toLocation) {
      toast.error("Please select both origin and destination");
      return;
    }
    setLoading(true);
    try {
      const result = await getAvailableSchedules(fromLocation, toLocation, "");
      if (result.success && result.data) {
        setSchedules(result.data);
        setCurrentStep(2);
      } else {
        toast.error("Failed to load schedules");
      }
    } catch {
      toast.error("An error occurred while loading schedules");
    } finally {
      setLoading(false);
    }
  };

  const handleSearchTrip = (e: React.FormEvent) => {
    e.preventDefault();
    fetchSchedules();
  };

  const handleScheduleSelect = async (schedule: BusSchedule) => {
    setSelectedSchedule(schedule);
    const result = await getSeatsForSchedule(schedule.id);
    if (result.success && result.data) setSeats(result.data);
  };

  const handleSelectSeats = () => {
    if (selectedSeats.length === 0) { toast.error("Please select at least one seat"); return; }
    setCurrentStep(4);
  };

  const handleStorageSelect = () => setCurrentStep(5);

  const handleProceedToPayment = () => {
    if (!passengerName || !passengerEmail || !passengerPhone) {
      toast.error("Please fill in all passenger details");
      return;
    }
    setCurrentStep(6);
  };

  const handleCompleteBooking = async () => {
    if (!selectedSchedule) { toast.error("Please select a schedule"); return; }
    try {
      setLoading(true);
      const result = await createBooking({
        schedule_id: selectedSchedule.id,
        passenger_email: passengerEmail,
        passenger_name: passengerName,
        passenger_phone: passengerPhone,
        seats: selectedSeats,
      });
      if (result.success && result.data) {
        window.location.href = result.data.paymentUrl;
      } else {
        toast.error(result.error || "Failed to create booking");
      }
    } catch {
      toast.error("An error occurred while creating booking");
    } finally {
      setLoading(false);
    }
  };

  const totalPrice =
    selectedSchedule && selectedSeats.length > 0
      ? selectedSchedule.fare_price * selectedSeats.length
      : 0;

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#425066]">
      <Toaster richColors closeButton />

      {/* Nav */}
      <header className="sticky top-0 z-50 border-b border-[#E5E7EB] bg-white/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-3">
            <Image src="/cnc_logo.png" alt="C&C Transport" width={40} height={40} className="object-contain" />
            <div className="leading-tight">
              <span className="block text-[10px] font-bold uppercase tracking-[0.25em] text-[#425066]">C&C Transport</span>
              <span className="block text-sm font-bold text-[#425066]">Campus Bus Booking</span>
            </div>
          </Link>
          <nav className="hidden items-center gap-7 md:flex">
            <Link href="/" className="text-sm font-medium text-[#425066] hover:text-[#425066] transition-colors">Home</Link>
            <Link href="/terms" className="text-sm font-medium text-[#425066] hover:text-[#425066] transition-colors">Terms</Link>
          </nav>
        </div>
      </header>

      <main className="px-4 pb-24 pt-8 sm:px-6 lg:px-8">

        {/* Stepper */}
        <div className="mx-auto mb-10 max-w-4xl rounded-2xl border border-[#E5E7EB] bg-white p-4 shadow-card sm:p-5">
          <div className="flex items-center justify-between gap-1 overflow-x-auto pb-1 scrollbar-none">
            {STEPS.map((step, index) => (
              <div key={step.id} className="flex flex-1 min-w-[60px] items-center last:flex-none">
                <div className="flex flex-col items-center mx-auto">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center text-sm transition-all duration-300 ${
                      currentStep >= step.id
                        ? "bg-[#425066] text-white shadow-sm"
                        : "bg-[#F3F4F6] text-[#80868B] border border-[#E5E7EB]"
                    }`}
                  >
                    <FontAwesomeIcon icon={step.icon} className="h-3.5 w-3.5" />
                  </div>
                  <p
                    className={`text-[10px] mt-1.5 font-semibold uppercase tracking-wider text-center transition-colors ${
                      currentStep >= step.id ? "text-[#425066]" : "text-[#80868B]"
                    }`}
                  >
                    {step.label}
                  </p>
                </div>

                {index < STEPS.length - 1 && (
                  <div
                    className={`hidden sm:block flex-1 h-0.5 mx-1 self-start mt-4 transition-all duration-500 ${
                      currentStep > step.id ? "bg-[#425066]" : "bg-[#E5E7EB]"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="mx-auto max-w-7xl">

          {/* Step 1: Trip Search */}
          {currentStep === 1 && (
            <div className="max-w-2xl mx-auto animate-fade-in">
              <Card>
                <CardHeader>
                  <CardTitle>Trip Details</CardTitle>
                  <CardDescription>
                    Select your origin and destination to find available shuttle departures.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {initialRouteLoading ? (
                    <div className="flex flex-col items-center justify-center py-12 gap-3">
                      <div className="h-7 w-7 animate-spin rounded-full border-2 border-[#E5E7EB] border-t-[#425066]" />
                      <p className="text-xs tracking-wider text-[#80868B] uppercase">Loading routes…</p>
                    </div>
                  ) : (
                    <form onSubmit={handleSearchTrip} className="space-y-5">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <label className="block">
                          <span className="text-xs font-bold uppercase tracking-wider text-[#425066] flex items-center gap-1.5 mb-2">
                            <FontAwesomeIcon icon={faMapMarkerAlt} className="text-[#425066] h-3 w-3" />
                            From Location
                          </span>
                          <select value={fromLocation} onChange={(e) => setFromLocation(e.target.value)} required className={selectClass}>
                            <option value="" disabled>Select origin</option>
                            {dbFromLocations.map((loc) => <option key={loc} value={loc}>{loc}</option>)}
                          </select>
                        </label>
                        <label className="block">
                          <span className="text-xs font-bold uppercase tracking-wider text-[#425066] flex items-center gap-1.5 mb-2">
                            <FontAwesomeIcon icon={faMapMarkerAlt} className="text-[#425066] h-3 w-3" />
                            To Location
                          </span>
                          <select value={toLocation} onChange={(e) => setToLocation(e.target.value)} required className={selectClass}>
                            <option value="" disabled>Select destination</option>
                            {dbToLocations.map((loc) => <option key={loc} value={loc}>{loc}</option>)}
                          </select>
                        </label>
                      </div>
                      <Button type="submit" disabled={loading} className="w-full h-11">
                        {loading ? "Searching…" : "Find Buses"}
                        {!loading && <FontAwesomeIcon icon={faArrowRight} className="ml-2 h-3.5 w-3.5" />}
                      </Button>
                    </form>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {/* Step 2: Bus Selection */}
          {currentStep === 2 && (
            <div className="max-w-3xl mx-auto animate-fade-in">
              <Card>
                <CardHeader>
                  <CardTitle>Select Bus</CardTitle>
                  <CardDescription>Choose your preferred departure time and date.</CardDescription>
                </CardHeader>
                <CardContent>
                  {schedules.length === 0 ? (
                    <div className="text-center py-12 rounded-2xl border-2 border-dashed border-[#E5E7EB] bg-[#F8F9FA]">
                      <p className="text-[#425066] mb-5 text-sm">No buses available for this route.</p>
                      <Button variant="outline" onClick={() => setCurrentStep(1)}>Back to Search</Button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {schedules.map((schedule) => (
                        <div
                          key={schedule.id}
                          onClick={() => handleScheduleSelect(schedule)}
                          className={`relative border-2 rounded-2xl p-5 cursor-pointer transition-all duration-200 ${
                            selectedSchedule?.id === schedule.id
                              ? "border-[#425066] bg-[#f5f7fa] shadow-card"
                              : "border-[#E5E7EB] bg-white hover:border-[#425066]/40 hover:-translate-y-0.5 hover:shadow-card-hover"
                          }`}
                        >
                          {schedule.departure_date && (
                            <div className="absolute top-0 right-0 rounded-bl-xl rounded-tr-2xl bg-[#F8F9FA] border-b border-l border-[#E5E7EB] px-3 py-1 text-[10px] font-semibold text-[#425066] flex items-center gap-1.5">
                              <FontAwesomeIcon icon={faCalendar} className="text-[#425066] h-2.5 w-2.5" />
                              {formatDate(schedule.departure_date)}
                            </div>
                          )}

                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 pt-1">
                            <div className="flex-1">
                              <div className="flex items-center justify-between sm:justify-start gap-4 sm:gap-10 mb-4">
                                <div>
                                  <p className="text-xl font-bold text-[#425066]">{formatTime(schedule.departure_time)}</p>
                                  <p className="text-xs text-[#80868B] mt-0.5">{schedule.route?.from_location}</p>
                                </div>
                                <div className="flex flex-col items-center flex-1 max-w-[80px]">
                                  <div className="w-full h-px bg-[#E5E7EB] relative">
                                    <FontAwesomeIcon
                                      icon={faBus}
                                      className="text-[#425066] h-3.5 w-3.5 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-1"
                                    />
                                  </div>
                                </div>
                                <div className="text-right">
                                  <p className="text-xl font-bold text-[#425066]">{formatTime(schedule.arrival_time)}</p>
                                  <p className="text-xs text-[#80868B] mt-0.5">{schedule.route?.to_location}</p>
                                </div>
                              </div>

                              <div className="grid grid-cols-3 gap-2 pt-4 border-t border-[#F1F3F4] text-center">
                                <div>
                                  <p className="text-[10px] text-[#80868B] uppercase tracking-wider">Bus</p>
                                  <p className="font-semibold text-[#425066] text-sm mt-0.5 truncate">{schedule.bus?.name}</p>
                                </div>
                                <div>
                                  <p className="text-[10px] text-[#80868B] uppercase tracking-wider">Fare</p>
                                  <p className="font-bold text-[#425066] text-sm mt-0.5">{formatCurrency(schedule.fare_price)}</p>
                                </div>
                                <div>
                                  <p className="text-[10px] text-[#80868B] uppercase tracking-wider">Available</p>
                                  <p className="font-semibold text-[#34A853] text-sm mt-0.5">{schedule.available_seats} seats</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row gap-3 mt-7">
                    <Button variant="outline" onClick={() => setCurrentStep(1)} className="w-full sm:flex-1 h-11">
                      <FontAwesomeIcon icon={faArrowLeft} className="mr-2 h-3.5 w-3.5" />
                      Back
                    </Button>
                    <Button onClick={() => setCurrentStep(3)} disabled={!selectedSchedule} className="w-full sm:flex-1 h-11">
                      Choose Seats
                      <FontAwesomeIcon icon={faArrowRight} className="ml-2 h-3.5 w-3.5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Step 3: Seat Selection */}
          {currentStep === 3 && selectedSchedule && (
            <div className="max-w-3xl mx-auto animate-fade-in">
              <Card>
                <CardHeader>
                  <CardTitle>Select Seats</CardTitle>
                  <CardDescription>Click seats on the 49-seater bus layout to choose yours.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-5 rounded-xl bg-[#F8F9FA] border border-[#E5E7EB] p-4 flex flex-wrap gap-4 items-center justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-wider text-[#80868B]">Bus</p>
                      <p className="font-bold text-[#425066] text-sm mt-0.5">{selectedSchedule.bus?.name}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wider text-[#80868B]">Selected</p>
                      <p className="font-bold text-[#425066] text-sm mt-0.5">
                        {selectedSeats.length > 0 ? selectedSeats.join(", ") : "None"}
                      </p>
                    </div>
                  </div>

                  <div className="p-4 sm:p-8 rounded-2xl border border-[#E5E7EB] bg-[#F8F9FA] flex justify-center">
                    <SeatSelection
                      seats={seats}
                      onSeatsSelected={setSelectedSeats}
                      maxSelection={Math.min(5, selectedSchedule.available_seats)}
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 mt-7">
                    <Button variant="outline" onClick={() => setCurrentStep(2)} className="w-full sm:flex-1 h-11">
                      <FontAwesomeIcon icon={faArrowLeft} className="mr-2 h-3.5 w-3.5" />
                      Back
                    </Button>
                    <Button onClick={handleSelectSeats} disabled={selectedSeats.length === 0} className="w-full sm:flex-1 h-11">
                      Continue
                      <FontAwesomeIcon icon={faArrowRight} className="ml-2 h-3.5 w-3.5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Step 4: Luggage / Storage */}
          {currentStep === 4 && (
            <div className="max-w-xl mx-auto animate-fade-in">
              <Card>
                <CardHeader>
                  <CardTitle>Luggage Options</CardTitle>
                  <CardDescription>Choose your storage configuration for this journey.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 mb-7">
                    {[
                      { value: "none", label: "Standard Carry-on Only", desc: "Fits in overhead compartments — included free" },
                      { value: "small", label: "Extra Cargo Bag (+GH₵2,000)", desc: "Under-bus storage for small extra bags" },
                      { value: "large", label: "Heavy Trunk / Box (+GH₵5,000)", desc: "Priority terminal check-in for large items" },
                    ].map((option) => (
                      <label
                        key={option.value}
                        className={`flex items-start gap-4 border-2 rounded-xl p-4 cursor-pointer transition-all duration-200 ${
                          storageType === option.value
                            ? "border-[#425066] bg-[#f5f7fa]"
                            : "border-[#E5E7EB] bg-white hover:border-[#425066]/40"
                        }`}
                      >
                        <input
                          type="radio"
                          name="storage"
                          value={option.value}
                          checked={storageType === option.value}
                          onChange={(e) => setStorageType(e.target.value)}
                          className="mt-1 accent-[#425066]"
                        />
                        <div>
                          <span className="block font-semibold text-[#425066] text-sm">{option.label}</span>
                          <span className="block text-xs text-[#425066] mt-0.5 leading-normal">{option.desc}</span>
                        </div>
                      </label>
                    ))}
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button variant="outline" onClick={() => setCurrentStep(3)} className="w-full sm:flex-1 h-11">
                      <FontAwesomeIcon icon={faArrowLeft} className="mr-2 h-3.5 w-3.5" />
                      Back
                    </Button>
                    <Button onClick={handleStorageSelect} className="w-full sm:flex-1 h-11">
                      Passenger Info
                      <FontAwesomeIcon icon={faArrowRight} className="ml-2 h-3.5 w-3.5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Step 5: Passenger Details */}
          {currentStep === 5 && (
            <div className="max-w-xl mx-auto animate-fade-in">
              <Card>
                <CardHeader>
                  <CardTitle>Passenger Details</CardTitle>
                  <CardDescription>Enter your details for the booking confirmation.</CardDescription>
                </CardHeader>
                <CardContent>
                  <form className="space-y-5">
                    <label className="block">
                      <span className="text-xs font-bold uppercase tracking-wider text-[#425066] mb-2 block">Full Name *</span>
                      <input type="text" value={passengerName} onChange={(e) => setPassengerName(e.target.value)} required placeholder="e.g. Kwame Mensah" className={inputClass} />
                    </label>
                    <label className="block">
                      <span className="text-xs font-bold uppercase tracking-wider text-[#425066] mb-2 block">Email Address *</span>
                      <input type="email" value={passengerEmail} onChange={(e) => setPassengerEmail(e.target.value)} required placeholder="kwame@university.edu.gh" className={inputClass} />
                    </label>
                    <label className="block">
                      <span className="text-xs font-bold uppercase tracking-wider text-[#425066] mb-2 block">Phone Number *</span>
                      <input type="tel" value={passengerPhone} onChange={(e) => setPassengerPhone(e.target.value)} required placeholder="+233 24 000 0000" className={inputClass} />
                    </label>
                    <div className="flex flex-col sm:flex-row gap-3 pt-2">
                      <Button type="button" variant="outline" onClick={() => setCurrentStep(4)} className="w-full sm:flex-1 h-11">
                        <FontAwesomeIcon icon={faArrowLeft} className="mr-2 h-3.5 w-3.5" />
                        Back
                      </Button>
                      <Button type="button" onClick={handleProceedToPayment} className="w-full sm:flex-1 h-11">
                        Review Checkout
                        <FontAwesomeIcon icon={faArrowRight} className="ml-2 h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Step 6: Payment Summary */}
          {currentStep === 6 && selectedSchedule && (
            <div className="max-w-xl mx-auto animate-fade-in">
              <Card>
                <CardHeader>
                  <CardTitle>Payment Summary</CardTitle>
                  <CardDescription>Review your trip details before completing payment.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 mb-5 pb-5 border-b border-[#F1F3F4] text-sm">
                    {[
                      { label: "Route", value: `${selectedSchedule.route?.from_location} → ${selectedSchedule.route?.to_location}` },
                      {
                        label: "Date & Time",
                        value: `${formatDate(selectedSchedule.departure_date)} at ${formatTime(selectedSchedule.departure_time)}`,
                      },
                      { label: "Bus", value: selectedSchedule.bus?.name ?? "" },
                      { label: "Seats", value: selectedSeats.join(", ") },
                      { label: "Passenger", value: passengerName },
                    ].map(({ label, value }) => (
                      <div key={label} className="flex justify-between items-start py-0.5">
                        <span className="text-[#80868B]">{label}</span>
                        <span className="font-semibold text-[#425066] text-right max-w-[60%]">{value}</span>
                      </div>
                    ))}
                  </div>

                  <div className="rounded-xl border border-[#E5E7EB] bg-[#F8F9FA] p-4 mb-7 space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-[#425066]">
                        Fare × {selectedSeats.length} seat{selectedSeats.length !== 1 ? "s" : ""}
                      </span>
                      <span className="font-semibold text-[#425066]">{formatCurrency(totalPrice)}</span>
                    </div>
                    <div className="border-t border-[#E5E7EB] pt-3 flex justify-between items-center">
                      <span className="text-sm font-bold text-[#425066]">Total</span>
                      <span className="text-xl font-bold text-[#425066]">{formatCurrency(totalPrice)}</span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button variant="outline" onClick={() => setCurrentStep(5)} className="w-full sm:flex-1 h-11">
                      <FontAwesomeIcon icon={faArrowLeft} className="mr-2 h-3.5 w-3.5" />
                      Back
                    </Button>
                    <Button onClick={handleCompleteBooking} disabled={loading} className="w-full sm:flex-1 h-12 text-base">
                      <FontAwesomeIcon icon={faCreditCard} className="mr-2 h-4 w-4" />
                      {loading ? "Redirecting to Paystack…" : "Pay Now"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Step 7: Confirmed */}
          {currentStep === 7 && (
            <div className="max-w-xl mx-auto animate-fade-in">
              <Card>
                <CardContent className="p-10 text-center space-y-6">
                  <div className="mx-auto h-20 w-20 rounded-full bg-[#E6F4EA] border border-[#34A853]/20 flex items-center justify-center text-[#34A853]">
                    <FontAwesomeIcon icon={faCheck} className="h-8 w-8" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-[#425066]">Booking Confirmed!</h2>
                    <p className="mt-2 text-sm text-[#425066] leading-relaxed max-w-sm mx-auto">
                      Your ticket has been reserved. Check your email for the confirmation.
                    </p>
                  </div>
                  <Button onClick={() => router.push("/")} className="px-8 h-11">
                    Return to Home
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}

export default function BookingPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#F8F9FA] flex flex-col items-center justify-center gap-4">
          <div className="h-9 w-9 animate-spin rounded-full border-2 border-[#E5E7EB] border-t-[#425066]" />
          <p className="text-sm font-medium text-[#80868B] uppercase tracking-widest">Loading…</p>
        </div>
      }
    >
      <BookingPageContent />
    </Suspense>
  );
}
