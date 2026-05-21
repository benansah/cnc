import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency, formatDate, formatTime } from "@/lib/utils";
import { Booking, BusSchedule } from "@/types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendar,
  faClock,
  faTicket,
  faBus,
  faMapMarkerAlt,
  faCheck,
} from "@fortawesome/free-solid-svg-icons";

interface TicketComponentProps {
  booking: Booking & { schedule?: BusSchedule };
  ticketNumber: string;
  isDownloadable?: boolean;
}

export function TicketComponent({
  booking,
  ticketNumber,
  isDownloadable = true,
}: TicketComponentProps) {
  const schedule = booking.schedule;

  return (
    <Card className="bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 border-0 text-white overflow-hidden">
      <CardHeader className="pb-0">
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl font-bold">
            <FontAwesomeIcon icon={faTicket} className="mr-2" />
            Booking Confirmed
          </CardTitle>
          <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg">
            <FontAwesomeIcon icon={faCheck} className="mr-2 text-green-300" />
            Paid
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-6 space-y-6">
        {/* Ticket Number */}
        <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg">
          <p className="text-xs opacity-80 uppercase tracking-wide mb-1">
            Ticket Number
          </p>
          <p className="text-2xl font-bold font-mono">{ticketNumber}</p>
        </div>

        {/* Route Information */}
        {schedule && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs opacity-80 uppercase tracking-wide mb-1">
                  <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-2" />
                  From
                </p>
                <p className="text-lg font-semibold">
                  {schedule.route?.from_location}
                </p>
              </div>
              <div>
                <p className="text-xs opacity-80 uppercase tracking-wide mb-1">
                  <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-2" />
                  To
                </p>
                <p className="text-lg font-semibold">
                  {schedule.route?.to_location}
                </p>
              </div>
            </div>

            {/* Date and Time */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/10 backdrop-blur-sm p-3 rounded-lg">
                <p className="text-xs opacity-80 uppercase tracking-wide mb-1">
                  <FontAwesomeIcon icon={faCalendar} className="mr-2" />
                  Date
                </p>
                <p className="font-semibold">
                  {formatDate(schedule.departure_date)}
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm p-3 rounded-lg">
                <p className="text-xs opacity-80 uppercase tracking-wide mb-1">
                  <FontAwesomeIcon icon={faClock} className="mr-2" />
                  Time
                </p>
                <p className="font-semibold">
                  {formatTime(schedule.departure_time)}
                </p>
              </div>
            </div>

            {/* Bus Information */}
            <div className="bg-white/10 backdrop-blur-sm p-3 rounded-lg">
              <p className="text-xs opacity-80 uppercase tracking-wide mb-1">
                <FontAwesomeIcon icon={faBus} className="mr-2" />
                Bus
              </p>
              <p className="font-semibold">
                {schedule.bus?.name} ({schedule.bus?.registration_number})
              </p>
            </div>
          </div>
        )}

        {/* Passenger and Seat Information */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs opacity-80 uppercase tracking-wide mb-1">
              Passenger
            </p>
            <p className="font-semibold">{booking.passenger_name}</p>
          </div>
          <div>
            <p className="text-xs opacity-80 uppercase tracking-wide mb-1">
              Seats
            </p>
            <p className="font-semibold">{booking.seats.join(", ")}</p>
          </div>
        </div>

        {/* Contact */}
        <div className="grid grid-cols-1 gap-4">
          <div>
            <p className="text-xs opacity-80 uppercase tracking-wide mb-1">
              Email
            </p>
            <p className="font-semibold break-all">{booking.passenger_email}</p>
          </div>
          <div>
            <p className="text-xs opacity-80 uppercase tracking-wide mb-1">
              Phone
            </p>
            <p className="font-semibold">{booking.passenger_phone}</p>
          </div>
        </div>

        {/* Price Information */}
        <div className="bg-white/20 backdrop-blur-sm p-4 rounded-lg border border-white/30">
          <p className="text-xs opacity-80 uppercase tracking-wide mb-2">
            Total Amount Paid
          </p>
          <p className="text-3xl font-bold">
            {formatCurrency(booking.total_price)}
          </p>
        </div>

        {/* Payment Reference */}
        {booking.payment_reference && (
          <div className="bg-white/10 backdrop-blur-sm p-3 rounded-lg">
            <p className="text-xs opacity-80 uppercase tracking-wide mb-1">
              Payment Reference
            </p>
            <p className="font-mono text-sm break-all">
              {booking.payment_reference}
            </p>
          </div>
        )}

        {/* Footer Message */}
        <div className="border-t border-white/20 pt-4 text-center text-xs opacity-75">
          <p>Please arrive 30 minutes before departure time</p>
          <p className="mt-1">Thank you for booking with C&C Transport</p>
        </div>
      </CardContent>
    </Card>
  );
}
