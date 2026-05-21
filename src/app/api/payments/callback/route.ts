import { NextRequest, NextResponse } from "next/server";
import { verifyBookingPayment } from "@/actions";

export async function GET(request: NextRequest) {
  try {
    const reference = request.nextUrl.searchParams.get("reference");

    if (!reference) {
      return NextResponse.redirect(
        new URL("/booking?error=no_reference", request.url)
      );
    }

    // Verify the payment
    const result = await verifyBookingPayment(reference);

    // Log full result to help debug missing booking IDs
    console.log("verifyBookingPayment result:", result);

    if (result.success && result.data && result.data.id) {
      return NextResponse.redirect(
        new URL(`/booking/success?success=true&booking=${result.data.id}`, request.url)
      );
    } else {
      if (result.success && (!result.data || !result.data.id)) {
        console.error("Payment verification succeeded but returned no booking id:", result);
      }
      return NextResponse.redirect(
        new URL("/booking?error=verification_failed", request.url)
      );
    }
  } catch (error) {
    console.error("Payment callback error:", error);
    return NextResponse.redirect(
      new URL("/booking?error=callback_error", request.url)
    );
  }
}
