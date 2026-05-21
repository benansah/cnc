"use server";

import { createServerSupabaseClient } from "@/lib/supabase/client";
import { initializePayment, verifyPayment } from "@/lib/server/paystack";
import { sendEmail, getBookingConfirmationEmail } from "@/lib/server/nodemailer";
import { generatePaymentReference } from "@/lib/server/paystack";
import type {
  Booking,
  BusSchedule,
  Seat,
  AdminBusFormData,
  AdminScheduleFormData,
  AdminRouteFormData,
} from "@/types";

function generateBusSeatNumbers(totalSeats: number): string[] {
  return Array.from({ length: totalSeats }, (_, index) => (index + 1).toString());
}

function generateTicketNumber(bookingId: string): string {
  return `TICKET-${bookingId.substring(0, 8).toUpperCase()}`;
}

export async function createTicket(bookingId: string, ticketNumber: string) {
  try {
    const supabase = createServerSupabaseClient();
    const { data, error } = await supabase
      .from("tickets")
      .insert({ booking_id: bookingId, ticket_number: ticketNumber, qr_code: ticketNumber })
      .select();

    if (error) throw error;
    return { success: true, data: data[0] };
  } catch (error) {
    console.error("Error creating ticket:", error);
    return { success: false, error: "Failed to create ticket" };
  }
}

export async function getBookingById(bookingId: string) {
  try {
    const supabase = createServerSupabaseClient();
    const { data, error } = await supabase
      .from("bookings")
      .select("*, schedule:bus_schedules(*, bus:buses(*), route:routes(*))")
      .eq("id", bookingId)
      .single();

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error("Error fetching booking:", error);
    let message = "Failed to fetch booking";
    if (error instanceof Error) {
      message = error.message;
    } else if (typeof error === "object" && error !== null && "message" in error) {
      message = String((error as Record<string, unknown>).message);
    }
    return { success: false, error: message };
  }
}

// ==================== Booking Actions ====================

export async function getAvailableSchedules(
  fromLocation?: string,
  toLocation?: string,
  departureDate?: string
) {
  try {
    const supabase = createServerSupabaseClient();

    let query = supabase
      .from("bus_schedules")
      .select(
        `
        *,
        bus:buses(*),
        route:routes(*)
      `
      )
      .gt("available_seats", 0);

    if (fromLocation && toLocation) {
      const { data: routes } = await supabase
        .from("routes")
        .select("id")
        .eq("from_location", fromLocation)
        .eq("to_location", toLocation);

      if (routes && routes.length > 0) {
        query = query.in(
          "route_id",
          routes.map((r) => r.id)
        );
      }
    }

    if (departureDate) {
      query = query.eq("departure_date", departureDate);
    }

    const { data, error } = await query.order("departure_time", {
      ascending: true,
    });

    if (error) throw error;
    return { success: true, data: data as BusSchedule[] };
  } catch (error) {
    console.error("Error fetching schedules:", error);
    return { success: false, error: "Failed to fetch schedules" };
  }
}

export async function getSeatsForSchedule(scheduleId: string) {
  try {
    const supabase = createServerSupabaseClient();

    const { data, error } = await supabase
      .from("seats")
      .select("*")
      .eq("schedule_id", scheduleId)
      .order("seat_number", { ascending: true });

    if (error) throw error;
    return { success: true, data: data as Seat[] };
  } catch (error) {
    console.error("Error fetching seats:", error);
    return { success: false, error: "Failed to fetch seats" };
  }
}

export async function createBooking(bookingData: {
  schedule_id: string;
  passenger_email: string;
  passenger_name: string;
  passenger_phone: string;
  seats: string[];
}) {
  try {
    const supabase = createServerSupabaseClient();

    // Get schedule details for payment calculation FIRST
    const { data: schedule, error: scheduleError } = await supabase
      .from("bus_schedules")
      .select("*")
      .eq("id", bookingData.schedule_id)
      .single();

    if (scheduleError) throw new Error("Schedule not found");

    const totalPrice = (schedule?.fare_price || 0) * bookingData.seats.length;

    // Create booking record with all required fields including total_price
    const { data: booking, error: bookingError } = await supabase
      .from("bookings")
      .insert({
        schedule_id: bookingData.schedule_id,
        passenger_email: bookingData.passenger_email,
        passenger_name: bookingData.passenger_name,
        passenger_phone: bookingData.passenger_phone,
        seats: bookingData.seats,
        total_price: totalPrice,
        payment_status: "pending",
      })
      .select();

    if (bookingError) throw bookingError;

    console.log("createBooking: created booking record:", booking[0]);

    // Initialize payment
    const paymentRef = generatePaymentReference();
    const paymentInit = await initializePayment(
      bookingData.passenger_email,
      totalPrice,
      paymentRef,
      "GHS",
      {
        booking_id: booking[0].id,
        passenger_name: bookingData.passenger_name,
        seats: bookingData.seats.join(","),
      }
    );

    console.log("createBooking: paymentRef=", paymentRef);
    console.log("createBooking: paymentInit=", paymentInit);

    if (!paymentInit || !paymentInit.data) {
      console.error("Payment initialization returned invalid response:", paymentInit);
      throw new Error("Payment initialization failed");
    }

    // Update booking with payment reference
    await supabase
      .from("bookings")
      .update({ payment_reference: paymentRef })
      .eq("id", booking[0].id);

    return {
      success: true,
      data: {
        booking: booking[0],
        paymentUrl: paymentInit.data.authorization_url,
        totalPrice,
      },
    };
  } catch (error) {
    console.error("Error creating booking:", error);
    let message = "Failed to create booking";
    if (error instanceof Error) {
      message = error.message;
    } else if (typeof error === "object" && error !== null && "message" in error) {
      message = String((error as Record<string, unknown>).message);
    }
    return { success: false, error: message };
  }
}

export async function verifyBookingPayment(paymentReference: string) {
  try {
    const supabase = createServerSupabaseClient();

    // Verify with Paystack
    const verification = await verifyPayment(paymentReference);

    if (!verification.status || verification.data?.status !== "success") {
      return { success: false, error: "Payment verification failed" };
    }

    // Update booking as paid
    const { data: booking, error: updateError } = await supabase
      .from("bookings")
      .update({
        payment_status: "completed",
      })
      .eq("payment_reference", paymentReference)
      .select();

    if (updateError) throw updateError;

    if (!booking || booking.length === 0) {
      return { success: false, error: "Booking not found" };
    }

    const currentBooking = booking[0];
    const seatsToBook = currentBooking.seats || [];

    // Mark seats as booked
    await supabase
      .from("seats")
      .update({ is_available: false, booked_by: currentBooking.id })
      .eq("schedule_id", currentBooking.schedule_id)
      .in("seat_number", seatsToBook);

    // Decrement available seats in schedule
    const { data: schedule } = await supabase
      .from("bus_schedules")
      .select("available_seats")
      .eq("id", currentBooking.schedule_id)
      .single();

    if (schedule) {
      const newAvailableSeats = Math.max(
        0,
        (schedule.available_seats || 0) - seatsToBook.length
      );
      await supabase
        .from("bus_schedules")
        .update({ available_seats: newAvailableSeats })
        .eq("id", currentBooking.schedule_id);
    }

    // Create ticket record
    const ticketNumber = generateTicketNumber(currentBooking.id);
    await createTicket(currentBooking.id, ticketNumber);

    // Send confirmation email
    const { data: scheduleData } = await supabase
      .from("bus_schedules")
      .select("*, route:routes(*), bus:buses(*)")
      .eq("id", currentBooking.schedule_id)
      .single();

    if (scheduleData) {
      const confirmationEmail = getBookingConfirmationEmail(
        currentBooking.passenger_name,
        scheduleData.route?.from_location || "",
        scheduleData.route?.to_location || "",
        scheduleData.departure_date,
        scheduleData.departure_time,
        seatsToBook,
        currentBooking.total_price || 0,
        ticketNumber
      );

      await sendEmail({
        to: currentBooking.passenger_email,
        subject: "Your Bus Booking Confirmation - C&C Transport",
        html: confirmationEmail,
      });
    }

    return { success: true, data: currentBooking };
  } catch (error) {
    console.error("Error verifying payment:", error);
    return { success: false, error: "Failed to verify payment" };
  }
}

// ==================== Admin Actions ====================

export async function createBus(busData: AdminBusFormData) {
  try {
    const supabase = createServerSupabaseClient();

    const { data, error } = await supabase
      .from("buses")
      .insert(busData)
      .select();

    if (error) throw error;
    return { success: true, data: data[0] };
  } catch (error) {
    console.error("Error creating bus:", error);
    return { success: false, error: "Failed to create bus" };
  }
}

export async function getBuses() {
  try {
    const supabase = createServerSupabaseClient();

    const { data, error } = await supabase
      .from("buses")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error("Error fetching buses:", error);
    return { success: false, error: "Failed to fetch buses" };
  }
}

export async function createRoute(routeData: AdminRouteFormData) {
  try {
    const supabase = createServerSupabaseClient();

    const { data, error } = await supabase
      .from("routes")
      .insert(routeData)
      .select();

    if (error) throw error;
    return { success: true, data: data[0] };
  } catch (error) {
    console.error("Error creating route:", error);
    return { success: false, error: "Failed to create route" };
  }
}

export async function getRoutes() {
  try {
    const supabase = createServerSupabaseClient();

    const { data, error } = await supabase
      .from("routes")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error("Error fetching routes:", error);
    return { success: false, error: "Failed to fetch routes" };
  }
}

export async function createSchedule(scheduleData: AdminScheduleFormData) {
  try {
    const supabase = createServerSupabaseClient();

    // Create schedule
    const { data: schedule, error: scheduleError } = await supabase
      .from("bus_schedules")
      .insert({
        ...scheduleData,
      })
      .select();

    if (scheduleError) throw scheduleError;

    // Generate numeric seats for the schedule
    const scheduleId = schedule[0].id;
    const seatNumbers = generateBusSeatNumbers(scheduleData.available_seats);
    const seats = seatNumbers.map((seatNumber) => ({
      schedule_id: scheduleId,
      seat_number: seatNumber,
      is_available: true,
    }));

    // Bulk insert seats
    if (seats.length > 0) {
      await supabase.from("seats").insert(seats);
    }

    return { success: true, data: schedule[0] };
  } catch (error) {
    console.error("Error creating schedule:", error);
    return { success: false, error: "Failed to create schedule" };
  }
}

export async function getSchedules() {
  try {
    const supabase = createServerSupabaseClient();

    const { data, error } = await supabase
      .from("bus_schedules")
      .select("*, bus:buses(*), route:routes(*)")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error("Error fetching schedules:", error);
    return { success: false, error: "Failed to fetch schedules" };
  }
}

export async function getScheduleDetails(scheduleId: string) {
  try {
    const supabase = createServerSupabaseClient();

    const { data, error } = await supabase
      .from("bus_schedules")
      .select("*, bus:buses(*), route:routes(*), seats:seats(*)")
      .eq("id", scheduleId)
      .single();

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error("Error fetching schedule details:", error);
    return { success: false, error: "Failed to fetch schedule details" };
  }
}

export async function updateBus(busId: string, busData: AdminBusFormData) {
  try {
    const supabase = createServerSupabaseClient();
    const { data, error } = await supabase
      .from("buses")
      .update(busData)
      .eq("id", busId)
      .select();

    if (error) throw error;
    return { success: true, data: data[0] };
  } catch (error) {
    console.error("Error updating bus:", error);
    return { success: false, error: "Failed to update bus" };
  }
}

export async function deleteBus(busId: string) {
  try {
    const supabase = createServerSupabaseClient();
    const { error } = await supabase.from("buses").delete().eq("id", busId);
    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error("Error deleting bus:", error);
    return { success: false, error: "Failed to delete bus" };
  }
}

export async function updateRoute(routeId: string, routeData: AdminRouteFormData) {
  try {
    const supabase = createServerSupabaseClient();
    const { data, error } = await supabase
      .from("routes")
      .update(routeData)
      .eq("id", routeId)
      .select();

    if (error) throw error;
    return { success: true, data: data[0] };
  } catch (error) {
    console.error("Error updating route:", error);
    return { success: false, error: "Failed to update route" };
  }
}

export async function deleteRoute(routeId: string) {
  try {
    const supabase = createServerSupabaseClient();
    const { error } = await supabase.from("routes").delete().eq("id", routeId);
    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error("Error deleting route:", error);
    return { success: false, error: "Failed to delete route" };
  }
}

export async function updateSchedule(scheduleId: string, scheduleData: AdminScheduleFormData) {
  try {
    const supabase = createServerSupabaseClient();
    const { data, error } = await supabase
      .from("bus_schedules")
      .update(scheduleData)
      .eq("id", scheduleId)
      .select();

    if (error) throw error;
    return { success: true, data: data[0] };
  } catch (error) {
    console.error("Error updating schedule:", error);
    return { success: false, error: "Failed to update schedule" };
  }
}

export async function deleteSchedule(scheduleId: string) {
  try {
    const supabase = createServerSupabaseClient();
    const { error } = await supabase.from("bus_schedules").delete().eq("id", scheduleId);
    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error("Error deleting schedule:", error);
    return { success: false, error: "Failed to delete schedule" };
  }
}

export async function deleteBooking(bookingId: string) {
  try {
    const supabase = createServerSupabaseClient();
    const { error } = await supabase.from("bookings").delete().eq("id", bookingId);
    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error("Error deleting booking:", error);
    return { success: false, error: "Failed to delete booking" };
  }
}

export async function getBookings() {
  try {
    const supabase = createServerSupabaseClient();

    const { data, error } = await supabase
      .from("bookings")
      .select("*, schedule:bus_schedules(*)")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return { success: false, error: "Failed to fetch bookings" };
  }
}
