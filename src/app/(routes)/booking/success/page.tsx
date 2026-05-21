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
import { faCheckCircle, faHome } from "@fortawesome/free-solid-svg-icons";
import { Toaster } from "sonner";

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
    // If booking is literally the string "undefined", clean the URL and show friendly message
    if (bookingId === "undefined") {
      const params = new URLSearchParams(window.location.search);
      params.delete("booking");
      const newQuery = params.toString();
      const newUrl = window.location.pathname + (newQuery ? `?${newQuery}` : "");
      try {
        router.replace(newUrl);
      } catch {
        // ignore replace errors
      }
      // Defer state updates to avoid synchronous setState inside effect
      setTimeout(() => {
        setFetchError("Missing booking reference.");
        setLoading(false);
      }, 0);
      return;
    }

    // Validate bookingId is a proper UUID before attempting fetch
    const uuidV4 = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (success !== "true" || !bookingId || !uuidV4.test(bookingId)) {
      if (bookingId && !uuidV4.test(bookingId)) {
        setTimeout(() => {
          setFetchError("Invalid booking reference.");
          setLoading(false);
        }, 0);
      }
      return;
    }

    let isCancelled = false;

    const loadBooking = async () => {
      try {
        const response = await fetch(`/api/bookings/${bookingId}`);
        const json = await response.json();

        if (!response.ok || !json.success) {
          throw new Error(json.error || "Unable to load booking details.");
        }

        if (!isCancelled) {
          setBooking(json.data);
        }
      } catch (fetchError) {
        console.error(fetchError);
        if (!isCancelled) {
          setFetchError(
            fetchError instanceof Error
              ? fetchError.message
              : "Failed to load booking details."
          );
        }
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    };

    loadBooking();

    return () => {
      isCancelled = true;
    };
  }, [success, bookingId, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <Card className="glass">
          <CardContent className="p-8">
            <p className="text-lg text-gray-600">Loading payment status...</p>
          </CardContent>
        </Card>
        <Toaster />
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4 sm:p-6 lg:p-8">
        <Toaster />
        <div className="max-w-2xl mx-auto">
          <Card className="glass">
            <CardHeader>
              <CardTitle className="text-red-600">Unable to Load Booking</CardTitle>
              <CardDescription>
                We could not retrieve your booking details.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <p className="text-gray-600 mb-4">{fetchError}</p>
                <p className="text-gray-600 mb-6">
                  If your payment was completed, please check your email or contact support.
                </p>
              </div>
              <div className="flex gap-4">
                <Button
                  onClick={() => router.push("/booking")}
                  className="flex-1"
                  variant="outline"
                >
                  Back to Booking
                </Button>
                <Button
                  onClick={() => router.push("/")}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                >
                  <FontAwesomeIcon icon={faHome} className="mr-2" />
                  Home
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4 sm:p-6 lg:p-8">
        <Toaster />
        <div className="max-w-2xl mx-auto">
          <Card className="glass">
            <CardHeader>
              <CardTitle className="text-red-600">Payment Failed</CardTitle>
              <CardDescription>
                There was an issue processing your payment
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <p className="text-gray-600 mb-4">Error: {error}</p>
                <p className="text-gray-600 mb-6">
                  Please try booking again or contact support if the issue persists.
                </p>
              </div>
              <div className="flex gap-4">
                <Button
                  onClick={() => router.push("/booking")}
                  className="flex-1"
                  variant="outline"
                >
                  Back to Booking
                </Button>
                <Button
                  onClick={() => router.push("/")}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                >
                  <FontAwesomeIcon icon={faHome} className="mr-2" />
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4 sm:p-6 lg:p-8">
      <Toaster />
      <div className="max-w-4xl mx-auto">
        {/* Success Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="flex items-center justify-center w-20 h-20 bg-green-100 rounded-full">
              <FontAwesomeIcon
                icon={faCheckCircle}
                className="text-green-600 text-4xl"
              />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Payment Successful!
          </h1>
          <p className="text-xl text-gray-600">
            Your bus ticket booking has been confirmed
          </p>
        </div>

        {/* Ticket */}
        {booking ? (
          <div className="mb-8">
            <TicketComponent
              booking={booking}
              ticketNumber={`TICKET-${booking.id.substring(0, 8).toUpperCase()}`}
            />
          </div>
        ) : (
          <Card className="glass mb-8">
            <CardContent className="p-8 text-center text-gray-600">
              <p>Booking details will be loaded shortly...</p>
            </CardContent>
          </Card>
        )}

        {/* Next Steps */}
        <Card className="glass">
          <CardHeader>
            <CardTitle>What&apos;s Next?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ol className="list-decimal list-inside space-y-3 text-gray-700">
              <li>Check your email for the booking confirmation and ticket</li>
              <li>Arrive at the bus station 30 minutes before departure</li>
              <li>Present your ticket number for check-in</li>
              <li>Enjoy your journey with C&C Transport!</li>
            </ol>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
              <p className="text-blue-900 font-medium mb-2">💡 Tip</p>
              <p className="text-blue-800 text-sm">
                Save your booking confirmation email for your records. You&apos;ll need your ticket number for check-in.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mt-8">
          <Button
            onClick={() => router.push("/")}
            className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-lg h-12"
          >
            <FontAwesomeIcon icon={faHome} className="mr-2" />
            Back to Home
          </Button>
          <Button
            onClick={() => router.push("/booking")}
            variant="outline"
            className="flex-1 text-lg h-12"
          >
            Book Another Trip
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PaymentSuccessContent />
    </Suspense>
  );
}
