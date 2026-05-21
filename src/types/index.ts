// Bus and Route Types
export interface Bus {
  id: string;
  name: string;
  registration_number: string;
  total_seats: number;
  created_at: string;
}

export interface Route {
  id: string;
  from_location: string;
  to_location: string;
  created_at: string;
}

export interface BusSchedule {
  id: string;
  bus_id: string;
  route_id: string;
  departure_time: string;
  arrival_time: string;
  fare_price: number;
  available_seats: number;
  departure_date: string;
  created_at: string;
  bus?: Bus;
  route?: Route;
}

// Seat Types
export interface Seat {
  id: string;
  schedule_id: string;
  seat_number: string;
  is_available: boolean;
  booked_by?: string;
  created_at: string;
}

export interface SeatLayout {
  rows: number;
  columns: number;
  reserved_seats: string[]; // e.g., ["1A", "1B"]
}

// Booking Types
export interface Booking {
  id: string;
  user_id: string;
  schedule_id: string;
  passenger_email: string;
  passenger_name: string;
  passenger_phone: string;
  seats: string[]; // e.g., ["1A", "2B"]
  total_price: number;
  payment_reference?: string;
  payment_status: "pending" | "completed" | "failed";
  booking_date: string;
  created_at: string;
  schedule?: BusSchedule;
}

// Payment Types
export interface PaymentPayload {
  email: string;
  amount: number;
  reference: string;
}

export interface PaymentVerification {
  status: boolean;
  message: string;
  data?: {
    reference: string;
    amount: number;
    status: string;
  };
}

// Ticket Type
export interface Ticket {
  id: string;
  booking_id: string;
  ticket_number: string;
  qr_code?: string;
  created_at: string;
}

// Admin Types
export interface AdminBusFormData {
  name: string;
  registration_number: string;
  total_seats: number;
}

export interface AdminScheduleFormData {
  bus_id: string;
  route_id: string;
  departure_time: string;
  arrival_time: string;
  fare_price: number;
  available_seats: number;
  departure_date: string;
}

export interface AdminRouteFormData {
  from_location: string;
  to_location: string;
}
