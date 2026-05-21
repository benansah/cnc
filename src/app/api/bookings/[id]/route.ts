import { NextRequest, NextResponse } from "next/server";
import { getBookingById } from "@/actions";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Await params first
    const { id: bookingId } = await params;

    console.log("API /api/bookings/[id] called with id:", bookingId);

    // Validate UUID format
    const uuidV4 =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

    if (!uuidV4.test(bookingId)) {
      console.error("Invalid booking id format:", bookingId);

      return NextResponse.json(
        {
          success: false,
          error: "Invalid booking id",
        },
        { status: 400 }
      );
    }

    const result = await getBookingById(bookingId);

    if (!result.success) {
      console.error(
        "getBookingById failed for id:",
        bookingId,
        "error:",
        result.error
      );

      return NextResponse.json(
        {
          success: false,
          error: result.error,
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: result.data,
    });
  } catch (error) {
    console.error("Error in booking API route:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch booking",
      },
      { status: 500 }
    );
  }
}