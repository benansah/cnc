"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TicketComponent } from "@/components/tickets/ticket";
import { Booking, BusSchedule } from "@/types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckCircle,
  faHome,
  faExclamationTriangle,
} from "@fortawesome/free-solid-svg-icons";
import { faBus } from "@fortawesome/free-solid-svg-icons";
import { Toaster } from "sonner";
import Image from "next/image";
import Link from "next/link";

function PaymentSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const success = searchParams.get("success");
  const error = searchParams.get("error");
  const bookingId = searchParams.get("booking");

  const [booking, setBooking] = useState<(Booking & { schedule?: BusSchedule }) | null>(null);
  const [loading, setLoading] = useState(success === "true");
  const [fetchError, setFetchError] = useState<string | null>(() => {
    if (success === "true" && (!bookingId || bookingId === "undefined")) {
      return "Missing booking reference.";
    }
    return null;
  });

  useEffect(() => {
    if (bookingId === "undefined") {
      const params = new URLSearchParams(window.location.search);
      params.delete("booking");
      const newQuery = params.toString();
      try { router.replace(window.location.pathname + (newQuery ? `?${newQuery}` : "")); } catch { }
      setTimeout(() => { setFetchError("Missing booking reference."); setLoading(false); }, 0);
      return;
    }

    const uuidV4 = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (success !== "true" || !bookingId || !uuidV4.test(bookingId)) {
      if (bookingId && !uuidV4.test(bookingId)) {
        setTimeout(() => { setFetchError("Invalid booking reference."); setLoading(false); }, 0);
      }
      return;
    }

    let isCancelled = false;
    const loadBooking = async () => {
      try {
        const response = await fetch(`/api/bookings/${bookingId}`);
        const json = await response.json();
        if (!response.ok || !json.success) throw new Error(json.error || "Unable to load booking details.");
        if (!isCancelled) setBooking(json.data);
      } catch (err) {
        console.error(err);
        if (!isCancelled) setFetchError(err instanceof Error ? err.message : "Failed to load booking details.");
      } finally {
        if (!isCancelled) setLoading(false);
      }
    };
    loadBooking();
    return () => { isCancelled = true; };
  }, [success, bookingId, router]);

  const nav = (
    <header className="sticky top-0 z-50 border-b border-[#E5E7EB] bg-white/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <Image src="/cnc_logo.png" alt="C&C Transport" width={40} height={40} className="object-contain" />
          <div className="leading-tight">
            <span className="block text-[10px] font-bold uppercase tracking-[0.25em] text-[#425066]">C&C Transport</span>
            <span className="block text-sm font-bold text-[#425066]">Campus Bus Booking</span>
          </div>
        </Link>
      </div>
    </header>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F9FA]">
        {nav}
        <Toaster />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="flex flex-col items-center gap-4">
            <div className="h-9 w-9 animate-spin rounded-full border-2 border-[#E5E7EB] border-t-[#425066]" />
            <p className="text-sm text-[#80868B]">Loading payment status…</p>
          </div>
        </div>
      </div>
    );
  }

  if (fetchError || error) {
    const title = fetchError ? "Unable to Load Booking" : "Payment Failed";
    const message = fetchError
      ? fetchError
      : `Error: ${error}. Please try again or contact support if the issue persists.`;

    return (
      <div className="min-h-screen bg-[#F8F9FA]">
        {nav}
        <Toaster />
        <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
          <Card className="animate-fade-in">
            <CardContent className="p-8 text-center space-y-5">
              <div className="mx-auto h-16 w-16 rounded-full bg-[#FCE8E6] flex items-center justify-center text-[#EA4335]">
                <FontAwesomeIcon icon={faExclamationTriangle} className="h-7 w-7" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-[#425066]">{title}</h2>
                <p className="mt-2 text-sm text-[#425066]">{message}</p>
                {fetchError && (
                  <p className="mt-2 text-sm text-[#425066]">
                    If your payment completed, check your email or contact{" "}
                    <a href="mailto:support@ccbooking.com" className="text-[#425066] hover:underline">support@ccbooking.com</a>.
                  </p>
                )}
              </div>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button variant="outline" onClick={() => router.push("/booking")} className="sm:w-44">
                  Try Again
                </Button>
                <Button onClick={() => router.push("/")} className="sm:w-44">
                  <FontAwesomeIcon icon={faHome} className="mr-2 h-3.5 w-3.5" />
                  Home
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      {nav}
      <Toaster />

      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Success header */}
        <div className="text-center mb-10 animate-fade-in">
          <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-[#E6F4EA]">
            <FontAwesomeIcon icon={faCheckCircle} className="h-10 w-10 text-[#34A853]" />
          </div>
          <h1 className="text-3xl font-bold text-[#425066]">Payment Successful!</h1>
          <p className="mt-2 text-[#425066]">Your bus ticket booking has been confirmed.</p>
        </div>

        {/* Ticket */}
        {booking ? (
          <div className="mb-6 animate-fade-in">
            <TicketComponent
              booking={booking}
              ticketNumber={`TICKET-${booking.id.substring(0, 8).toUpperCase()}`}
            />
          </div>
        ) : (
          <Card className="mb-6">
            <CardContent className="p-8 text-center text-[#425066]">
              <p>Booking details will be loaded shortly…</p>
            </CardContent>
          </Card>
        )}

        {/* What's next */}
        <Card className="mb-6 animate-fade-in">
          <CardHeader>
            <CardTitle>What&apos;s Next?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ol className="list-decimal list-inside space-y-2.5 text-sm text-[#425066]">
              <li>Check your email for the booking confirmation and ticket.</li>
              <li>Arrive at the bus station at least 15 minutes before departure.</li>
              <li>Present your ticket number for check-in.</li>
              <li>Enjoy your journey with C&C Transport!</li>
            </ol>
            <div className="rounded-xl border border-[#c5cdd9] bg-[#f5f7fa] p-4 mt-5">
              <p className="text-sm font-semibold text-[#425066] mb-1">Tip</p>
              <p className="text-sm text-[#425066]">
                Save your booking confirmation email. You'll need your ticket number for check-in.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Button onClick={() => router.push("/")} className="flex-1 h-12 text-base">
            <FontAwesomeIcon icon={faHome} className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
          <Button variant="outline" onClick={() => router.push("/booking")} className="flex-1 h-12 text-base">
            Book Another Trip
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#E5E7EB] border-t-[#425066]" />
        </div>
      }
    >
      <PaymentSuccessContent />
    </Suspense>
  );
}
