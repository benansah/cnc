"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
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

// Stepper Steps
const STEPS = [
  { id: 1, label: "Trip", icon: faMapMarkerAlt },
  { id: 2, label: "Bus", icon: faBus },
  { id: 3, label: "Seat", icon: faCheckCircle },
  { id: 4, label: "Storage", icon: faBox },
  { id: 5, label: "Passenger", icon: faUser },
  { id: 6, label: "Payment", icon: faCreditCard },
  { id: 7, label: "Done", icon: faCheck },
];

function BookingPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [schedules, setSchedules] = useState<BusSchedule[]>([]);
  const [selectedSchedule, setSelectedSchedule] = useState<BusSchedule | null>(
    null
  );
  const [seats, setSeats] = useState<Seat[]>([]);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialRouteLoading, setInitialRouteLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  // Dynamic dropdown metadata options pulled from active db schedules
  const [dbFromLocations, setDbFromLocations] = useState<string[]>([]);
  const [dbToLocations, setDbToLocations] = useState<string[]>([]);

  // Form states
  const [fromLocation, setFromLocation] = useState(
    () => searchParams.get("from") || ""
  );
  const [toLocation, setToLocation] = useState(
    () => searchParams.get("to") || ""
  );
  const [storageType, setStorageType] = useState("none");

  // Passenger form
  const [passengerName, setPassengerName] = useState("");
  const [passengerEmail, setPassengerEmail] = useState("");
  const [passengerPhone, setPassengerPhone] = useState("");

  // Fetch initial route paths from database configurations to build active dropdown arrays
  useEffect(() => {
    const fetchDropdownMetadata = async () => {
      setInitialRouteLoading(true);
      try {
        // Querying data through your standard schedule channel to get valid positions
        const result = await getAvailableSchedules("", "", ""); 
        if (result.success && result.data) {
          const rawSchedules: BusSchedule[] = result.data;

          // Extract unique 'From' items
          const uniqueFrom = Array.from(
            new Set(rawSchedules.map((s) => s.route?.from_location).filter(Boolean))
          ) as string[];
          setDbFromLocations(uniqueFrom);

          // Extract unique 'To' items
          const uniqueTo = Array.from(
            new Set(rawSchedules.map((s) => s.route?.to_location).filter(Boolean))
          ) as string[];
          setDbToLocations(uniqueTo);
        }
      } catch (error) {
        console.error("Could not fetch database dropdown parameters:", error);
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
      // Passing empty string for the date filter so backend grabs all upcoming dates
      const result = await getAvailableSchedules(
        fromLocation,
        toLocation,
        ""
      );
      if (result.success && result.data) {
        setSchedules(result.data);
        setCurrentStep(2);
      } else {
        toast.error("Failed to load schedules");
      }
    } catch (error) {
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
    if (result.success && result.data) {
      setSeats(result.data);
    }
  };

  const handleSelectSeats = () => {
    if (selectedSeats.length === 0) {
      toast.error("Please select at least one seat");
      return;
    }
    setCurrentStep(4);
  };

  const handleStorageSelect = () => {
    setCurrentStep(5);
  };

  const handleProceedToPayment = () => {
    if (!passengerName || !passengerEmail || !passengerPhone) {
      toast.error("Please fill in all passenger details");
      return;
    }
    setCurrentStep(6);
  };

  const handleCompleteBooking = async () => {
    if (!selectedSchedule) {
      toast.error("Please select a schedule");
      return;
    }

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
    } catch (error) {
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
    <div className="min-h-screen bg-slate-950 text-slate-50 antialiased selection:bg-purple-500/30">
      <Toaster theme="dark" closeButton richColors />

      {/* Atmospheric Glow Effects */}
      <div className="absolute -top-24 left-1/2 h-96 w-96 rounded-full bg-purple-600/10 blur-3xl" />
      <div className="absolute -right-24 top-24 h-80 w-80 rounded-full bg-pink-500/10 blur-3xl" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-slate-950 to-transparent pointer-events-none" />

      {/* Global Brand Navigation Bar */}
      <nav className="relative z-50 border-b border-slate-800/50 bg-slate-950/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/20">
              <FontAwesomeIcon icon={faBus} className="h-5 w-5" />
            </Link>
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">C&C Transport</p>
              <p className="text-md font-semibold text-white">Campus Bus Booking</p>
            </div>
          </div>
          <div className="hidden items-center gap-8 md:flex">
            <Link href="/" className="text-slate-200 hover:text-white transition text-sm">
              Home
            </Link>
            <Link href="/admin" className="text-slate-200 hover:text-white transition text-sm">
              Admin
            </Link>
          </div>
        </div>
      </nav>

      <main className="relative z-10 px-4 pb-24 pt-8 sm:px-6 lg:px-8">
        {/* Stepper Infrastructure */}
        <div className="mx-auto max-w-4xl mb-12 rounded-3xl border border-white/5 bg-slate-900/40 p-4 sm:p-6 backdrop-blur-xl">
          <div className="flex items-center justify-between gap-1 overflow-x-auto pb-2 scrollbar-none">
            {STEPS.map((step, index) => (
              <div key={step.id} className="flex items-center flex-1 min-w-[65px] last:flex-none">
                <div className="flex flex-col items-center mx-auto">
                  <div
                    className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-md ${
                      currentStep >= step.id
                        ? "bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-purple-500/20"
                        : "bg-slate-950 border border-slate-800 text-slate-500"
                    }`}
                  >
                    <FontAwesomeIcon icon={step.icon} className="text-sm" />
                  </div>
                  <p
                    className={`text-[10px] mt-2 font-medium uppercase tracking-wider text-center transition-colors duration-300 ${
                      currentStep >= step.id ? "text-pink-400 font-semibold" : "text-slate-500"
                    }`}
                  >
                    {step.label}
                  </p>
                </div>

                {index < STEPS.length - 1 && (
                  <div
                    className={`hidden sm:block flex-1 h-[2px] mx-2 self-start mt-5 transition-all duration-500 ${
                      currentStep > step.id ? "bg-gradient-to-r from-purple-500 to-pink-500" : "bg-slate-800"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Modular Workspace Area */}
        <div className="mx-auto max-w-7xl">
          
          {/* Step 1: Trip Configuration (Date Selection Removed) */}
          {currentStep === 1 && (
            <div className="max-w-2xl mx-auto">
              <Card className="rounded-[2rem] border border-white/10 bg-slate-900/80 shadow-2xl shadow-black/40 backdrop-blur-xl text-slate-50">
                <CardHeader className="space-y-2">
                  <CardTitle className="text-2xl font-semibold text-white">Trip Details</CardTitle>
                  <CardDescription className="text-slate-400 text-sm">
                    Select your origin and destination stations to find all available shuttle departures
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {initialRouteLoading ? (
                    <div className="flex flex-col items-center justify-center py-12 space-y-3">
                      <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-800 border-t-purple-500" />
                      <p className="text-xs tracking-wider text-slate-400 uppercase animate-pulse">Syncing Active Fleet Routes...</p>
                    </div>
                  ) : (
                    <form onSubmit={handleSearchTrip} className="space-y-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <label className="block">
                          <span className="text-sm font-medium text-slate-300 flex items-center gap-2">
                            <FontAwesomeIcon icon={faMapMarkerAlt} className="text-purple-400 text-xs" />
                            From Location
                          </span>
                          <select
                            value={fromLocation}
                            onChange={(e) => setFromLocation(e.target.value)}
                            required
                            className="mt-2 w-full rounded-3xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-purple-500 text-sm appearance-none cursor-pointer"
                          >
                            <option value="" disabled className="bg-slate-950 text-slate-500">Select origin station</option>
                            {dbFromLocations.map((loc) => (
                              <option key={loc} value={loc} className="bg-slate-950 text-white">
                                {loc}
                              </option>
                            ))}
                          </select>
                        </label>

                        <label className="block">
                          <span className="text-sm font-medium text-slate-300 flex items-center gap-2">
                            <FontAwesomeIcon icon={faMapMarkerAlt} className="text-pink-400 text-xs" />
                            To Location
                          </span>
                          <select
                            value={toLocation}
                            onChange={(e) => setToLocation(e.target.value)}
                            required
                            className="mt-2 w-full rounded-3xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-purple-500 text-sm appearance-none cursor-pointer"
                          >
                            <option value="" disabled className="bg-slate-950 text-slate-500">Select destination station</option>
                            {dbToLocations.map((loc) => (
                              <option key={loc} value={loc} className="bg-slate-950 text-white">
                                {loc}
                              </option>
                            ))}
                          </select>
                        </label>
                      </div>

                      <Button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-3xl bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-lg shadow-purple-500/20 transition h-12 text-sm font-semibold hover:opacity-95"
                      >
                        {loading ? "Searching schedules..." : "Continue to Select Bus"}
                        {!loading && <FontAwesomeIcon icon={faArrowRight} className="ml-2" />}
                      </Button>
                    </form>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {/* Step 2: Live Bus Fleet Picker */}
          {currentStep === 2 && (
            <div className="max-w-3xl mx-auto">
              <Card className="rounded-[2rem] border border-white/10 bg-slate-900/80 shadow-2xl shadow-black/40 backdrop-blur-xl text-slate-50">
                <CardHeader>
                  <CardTitle className="text-2xl font-semibold text-white">Select Bus</CardTitle>
                  <CardDescription className="text-slate-400 text-sm">
                    Choose your preferred bus departure time and date
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {schedules.length === 0 ? (
                    <div className="text-center py-12 border border-dashed border-slate-800 rounded-3xl bg-slate-950/40">
                      <p className="text-slate-400 mb-6 text-sm">No buses available for this active corridor.</p>
                      <Button
                        variant="outline"
                        onClick={() => setCurrentStep(1)}
                        className="rounded-3xl border-slate-700 text-slate-200 hover:bg-slate-800 hover:text-white"
                      >
                        Back to Search
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {schedules.map((schedule) => (
                        <div
                          key={schedule.id}
                          onClick={() => handleScheduleSelect(schedule)}
                          className={`border-2 rounded-3xl p-5 sm:p-6 cursor-pointer transition-all duration-300 relative overflow-hidden ${
                            selectedSchedule?.id === schedule.id
                              ? "border-purple-500 bg-purple-500/5 shadow-lg shadow-purple-500/10"
                              : "border-slate-800 bg-slate-950/60 hover:border-slate-700"
                          }`}
                        >
                          {/* Departure Badge displaying date prominently inside selection item */}
                          {schedule.departure_time && (
                            <div className="absolute top-0 right-0 rounded-bl-2xl bg-slate-800/80 border-b border-l border-white/5 px-3 py-1 text-[10px] font-medium tracking-wide text-slate-300 flex items-center gap-1.5">
                              <FontAwesomeIcon icon={faCalendar} className="text-purple-400 text-[9px]" />
                              {formatDate(schedule.departure_time.split("T")[0])}
                            </div>
                          )}

                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pt-2">
                            <div className="flex-1">
                              <div className="flex items-center justify-between sm:justify-start gap-4 sm:gap-12 mb-4">
                                <div>
                                  <p className="text-xl font-bold text-white tracking-tight">
                                    {formatTime(schedule.departure_time)}
                                  </p>
                                  <p className="text-xs text-slate-400 mt-1">
                                    {schedule.route?.from_location}
                                  </p>
                                </div>

                                <div className="flex flex-col items-center justify-center flex-1 max-w-[100px]">
                                  <div className="w-full h-[2px] bg-gradient-to-r from-purple-500/50 to-pink-500/50 relative">
                                    <FontAwesomeIcon
                                      icon={faBus}
                                      className="text-pink-400 text-sm absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-slate-900 px-2"
                                    />
                                  </div>
                                </div>

                                <div className="text-right">
                                  <p className="text-xl font-bold text-white tracking-tight">
                                    {formatTime(schedule.arrival_time)}
                                  </p>
                                  <p className="text-xs text-slate-400 mt-1">
                                    {schedule.route?.to_location}
                                  </p>
                                </div>
                              </div>

                              <div className="grid grid-cols-3 gap-2 sm:gap-4 pt-4 border-t border-slate-800/80 text-center sm:text-left">
                                <div>
                                  <p className="text-[11px] text-slate-400 uppercase tracking-wider">Bus Fleet</p>
                                  <p className="font-semibold text-slate-200 text-sm mt-0.5 truncate">
                                    {schedule.bus?.name}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-[11px] text-slate-400 uppercase tracking-wider">Fare Price</p>
                                  <p className="font-bold text-pink-400 text-sm mt-0.5">
                                    {formatCurrency(schedule.fare_price)}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-[11px] text-slate-400 uppercase tracking-wider">Available</p>
                                  <p className="font-semibold text-emerald-400 text-sm mt-0.5">
                                    {schedule.available_seats} seats
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row gap-3 mt-8">
                    <Button
                      variant="outline"
                      onClick={() => setCurrentStep(1)}
                      className="w-full sm:flex-1 rounded-3xl border-slate-700 bg-transparent text-slate-300 hover:bg-slate-800 hover:text-white h-11 text-sm"
                    >
                      <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
                      Modify Routes
                    </Button>
                    <Button
                      onClick={() => setCurrentStep(3)}
                      disabled={!selectedSchedule}
                      className="w-full sm:flex-1 rounded-3xl bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-lg shadow-purple-500/20 h-11 text-sm font-semibold hover:opacity-95 disabled:opacity-40"
                    >
                      Choose Seats
                      <FontAwesomeIcon icon={faArrowRight} className="ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Step 3: Immersive Matrix Seat Selection */}
          {currentStep === 3 && selectedSchedule && (
            <div className="max-w-3xl mx-auto">
              <Card className="rounded-[2rem] border border-white/10 bg-slate-900/80 shadow-2xl shadow-black/40 backdrop-blur-xl text-slate-50">
                <CardHeader>
                  <CardTitle className="text-2xl font-semibold text-white">Select Seat</CardTitle>
                  <CardDescription className="text-slate-400 text-sm">
                    Click preferred coordinates on the 49-seater campus shuttle framework
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-6 rounded-2xl bg-slate-950/60 border border-slate-800 p-4 flex flex-wrap gap-4 items-center justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-wider text-slate-400">Selected Shuttle</p>
                      <p className="font-semibold text-white text-base mt-0.5">{selectedSchedule.bus?.name}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wider text-slate-400">Current Selection</p>
                      <p className="font-bold text-pink-400 text-base mt-0.5">
                        {selectedSeats.length > 0 ? selectedSeats.join(", ") : "None Selected"}
                      </p>
                    </div>
                  </div>

                  <div className="p-4 sm:p-8 rounded-3xl border border-slate-800 bg-slate-950/40 flex justify-center">
                    <SeatSelection
                      seats={seats}
                      onSeatsSelected={setSelectedSeats}
                      maxSelection={Math.min(5, selectedSchedule.available_seats)}
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 mt-8">
                    <Button
                      variant="outline"
                      onClick={() => setCurrentStep(2)}
                      className="w-full sm:flex-1 rounded-3xl border-slate-700 bg-transparent text-slate-300 hover:bg-slate-800 hover:text-white h-11 text-sm"
                    >
                      <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
                      Back to Fleet
                    </Button>
                    <Button
                      onClick={handleSelectSeats}
                      disabled={selectedSeats.length === 0}
                      className="w-full sm:flex-1 rounded-3xl bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-lg shadow-purple-500/20 h-11 text-sm font-semibold hover:opacity-95 disabled:opacity-40"
                    >
                      Configure Luggage
                      <FontAwesomeIcon icon={faArrowRight} className="ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Step 4: Storage Configurations */}
          {currentStep === 4 && (
            <div className="max-w-xl mx-auto">
              <Card className="rounded-[2rem] border border-white/10 bg-slate-900/80 shadow-2xl shadow-black/40 backdrop-blur-xl text-slate-50">
                <CardHeader>
                  <CardTitle className="text-2xl font-semibold text-white">Storage Ecosystem</CardTitle>
                  <CardDescription className="text-slate-400 text-sm">
                    Select your storage configuration for the cargo bays
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 mb-8">
                    {[
                      { value: "none", label: "Standard Carry-on Only", desc: "Fits in overhead campus compartments" },
                      { value: "small", label: "Extra Small Cargo (+GH₵2,000)", desc: "Assigned lower under-bus storage container allocation" },
                      { value: "large", label: "Heavy Trunk / Box Allocation (+GH₵5,000)", desc: "Priority terminal check-in trunk space" },
                    ].map((option) => (
                      <label
                        key={option.value}
                        className={`flex items-start gap-4 border-2 rounded-2xl p-4 cursor-pointer transition-all duration-300 ${
                          storageType === option.value
                            ? "border-purple-500 bg-purple-500/5"
                            : "border-slate-800 bg-slate-950/60 hover:border-slate-700"
                        }`}
                      >
                        <input
                          type="radio"
                          name="storage"
                          value={option.value}
                          checked={storageType === option.value}
                          onChange={(e) => setStorageType(e.target.value)}
                          className="mt-1 accent-purple-500"
                        />
                        <div>
                          <span className="block font-semibold text-white text-sm">{option.label}</span>
                          <span className="block text-xs text-slate-400 mt-1 leading-normal">{option.desc}</span>
                        </div>
                      </label>
                    ))}
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button
                      variant="outline"
                      onClick={() => setCurrentStep(3)}
                      className="w-full sm:flex-1 rounded-3xl border-slate-700 bg-transparent text-slate-300 hover:bg-slate-800 hover:text-white h-11 text-sm"
                    >
                      <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
                      Back to Seats
                    </Button>
                    <Button
                      onClick={handleStorageSelect}
                      className="w-full sm:flex-1 rounded-3xl bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-lg shadow-purple-500/20 h-11 text-sm font-semibold hover:opacity-95"
                    >
                      Passenger Info
                      <FontAwesomeIcon icon={faArrowRight} className="ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Step 5: Secure Passenger Entry */}
          {currentStep === 5 && (
            <div className="max-w-xl mx-auto">
              <Card className="rounded-[2rem] border border-white/10 bg-slate-900/80 shadow-2xl shadow-black/40 backdrop-blur-xl text-slate-50">
                <CardHeader>
                  <CardTitle className="text-2xl font-semibold text-white">Passenger Details</CardTitle>
                  <CardDescription className="text-slate-400 text-sm">
                    Enter valid identification metrics for ticketing protocols
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form className="space-y-5">
                    <label className="block">
                      <span className="text-sm font-medium text-slate-300">Full Name *</span>
                      <input
                        type="text"
                        value={passengerName}
                        onChange={(e) => setPassengerName(e.target.value)}
                        required
                        placeholder="e.g. Kwame Mensah"
                        className="mt-2 w-full rounded-3xl border border-slate-700 bg-slate-950/90 px-4 py-3 text-white outline-none transition focus:border-purple-500 placeholder:text-slate-600 text-sm"
                      />
                    </label>

                    <label className="block">
                      <span className="text-sm font-medium text-slate-300">Email Address *</span>
                      <input
                        type="email"
                        value={passengerEmail}
                        onChange={(e) => setPassengerEmail(e.target.value)}
                        required
                        placeholder="kwame@university.edu.gh"
                        className="mt-2 w-full rounded-3xl border border-slate-700 bg-slate-950/90 px-4 py-3 text-white outline-none transition focus:border-purple-500 placeholder:text-slate-600 text-sm"
                      />
                    </label>

                    <label className="block">
                      <span className="text-sm font-medium text-slate-300">Phone Number *</span>
                      <input
                        type="tel"
                        value={passengerPhone}
                        onChange={(e) => setPassengerPhone(e.target.value)}
                        required
                        placeholder="+233 24 000 0000"
                        className="mt-2 w-full rounded-3xl border border-slate-700 bg-slate-950/90 px-4 py-3 text-white outline-none transition focus:border-purple-500 placeholder:text-slate-600 text-sm"
                      />
                    </label>

                    <div className="flex flex-col sm:flex-row gap-3 pt-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setCurrentStep(4)}
                        className="w-full sm:flex-1 rounded-3xl border-slate-700 bg-transparent text-slate-300 hover:bg-slate-800 hover:text-white h-11 text-sm"
                      >
                        <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
                        Back
                      </Button>
                      <Button
                        type="button"
                        onClick={handleProceedToPayment}
                        className="w-full sm:flex-1 rounded-3xl bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-lg shadow-purple-500/20 h-11 text-sm font-semibold hover:opacity-95"
                      >
                        Review Checkout
                        <FontAwesomeIcon icon={faArrowRight} className="ml-2" />
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Step 6: Paystack Integration Interface */}
          {currentStep === 6 && selectedSchedule && (
            <div className="max-w-xl mx-auto">
              <Card className="rounded-[2rem] border border-white/10 bg-slate-900/80 shadow-2xl shadow-black/40 backdrop-blur-xl text-slate-50">
                <CardHeader>
                  <CardTitle className="text-2xl font-semibold text-white">Payment Summary</CardTitle>
                  <CardDescription className="text-slate-400 text-sm">
                    Review trip manifesto configurations before routing to payment gateways
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 mb-6 pb-6 border-b border-slate-800 text-sm">
                    <div className="flex justify-between items-start py-1">
                      <span className="text-slate-400">Route Node</span>
                      <span className="font-semibold text-white text-right">
                        {selectedSchedule.route?.from_location} → {selectedSchedule.route?.to_location}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-1">
                      <span className="text-slate-400">Date & Time</span>
                      <span className="font-semibold text-white">
                        {selectedSchedule.departure_time && formatDate(selectedSchedule.departure_time.split("T")[0])} at {formatTime(selectedSchedule.departure_time)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-1">
                      <span className="text-slate-400">Assigned Fleet</span>
                      <span className="font-semibold text-white">{selectedSchedule.bus?.name}</span>
                    </div>
                    <div className="flex justify-between items-center py-1">
                      <span className="text-slate-400">Manifest Seats</span>
                      <span className="font-mono font-bold text-pink-400 tracking-wider">{selectedSeats.join(", ")}</span>
                    </div>
                    <div className="flex justify-between items-center py-1">
                      <span className="text-slate-400">Passenger Node</span>
                      <span className="font-semibold text-white">{passengerName}</span>
                    </div>
                  </div>

                  <div className="space-y-3 mb-8 bg-slate-950/60 border border-slate-800/60 p-4 rounded-2xl">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">
                        Base Ticket Fare ({selectedSeats.length} seat{selectedSeats.length !== 1 ? "s" : ""})
                      </span>
                      <span className="font-semibold text-slate-200">
                        {formatCurrency(totalPrice)}
                      </span>
                    </div>
                    <div className="border-t border-slate-800/80 pt-3 flex justify-between items-center">
                      <span className="text-sm font-medium text-white">Total Premium Invoice</span>
                      <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                        {formatCurrency(totalPrice)}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button
                      variant="outline"
                      onClick={() => setCurrentStep(5)}
                      className="w-full sm:flex-1 rounded-3xl border-slate-700 bg-transparent text-slate-300 hover:bg-slate-800 hover:text-white h-11 text-sm"
                    >
                      <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
                      Back
                    </Button>
                    <Button
                      onClick={handleCompleteBooking}
                      disabled={loading}
                      className="w-full sm:flex-1 rounded-3xl bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-lg shadow-purple-500/20 h-12 text-sm font-semibold hover:opacity-95"
                    >
                      <FontAwesomeIcon icon={faCreditCard} className="mr-2" />
                      {loading ? "Routing to Paystack..." : "Secure Pay Now"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Step 7: Final Manifest Confirmation Success Screen */}
          {currentStep === 7 && (
            <div className="max-w-xl mx-auto">
              <Card className="rounded-[2rem] border border-white/10 bg-slate-900/80 p-6 sm:p-10 text-center shadow-2xl shadow-black/50 backdrop-blur-xl text-slate-50">
                <CardContent className="space-y-6 pt-6">
                  <div className="mx-auto h-20 w-20 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shadow-xl shadow-emerald-500/5 animate-pulse">
                    <FontAwesomeIcon icon={faCheck} className="text-3xl" />
                  </div>
                  <div className="space-y-2">
                    <h2 className="text-3xl font-semibold text-white tracking-tight">Booking Confirmed!</h2>
                    <p className="text-slate-400 text-sm leading-relaxed max-w-sm mx-auto">
                      Your space coordinates have been signed onto the flight manifest. Forwarding parameters to checkout engine.
                    </p>
                  </div>
                  <Button
                    onClick={() => router.push("/")}
                    className="rounded-3xl bg-gradient-to-r from-purple-600 to-pink-500 text-white px-8 h-11 text-sm font-semibold shadow-lg shadow-purple-500/20 hover:opacity-95 transition"
                  >
                    Return to Home Terminal
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
      fallback = {
        <div className="min-h-screen bg-slate-950 text-slate-50 flex flex-col items-center justify-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-800 border-t-pink-500" />
          <p className="text-sm font-medium tracking-widest text-slate-400 uppercase animate-pulse">
            Configuring Reservation Hub...
          </p>
        </div>
      }
    >
      <BookingPageContent />
    </Suspense>
  );
}