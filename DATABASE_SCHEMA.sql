-- C&C Transport Bus Booking App Database Schema
-- Run these queries in your Supabase SQL editor to set up the database

-- 1. Create Buses Table
CREATE TABLE buses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  registration_number VARCHAR(50) UNIQUE NOT NULL,
  total_seats INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Create Routes Table
CREATE TABLE routes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  from_location VARCHAR(255) NOT NULL,
  to_location VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Create Bus Schedules Table
CREATE TABLE bus_schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bus_id UUID NOT NULL REFERENCES buses(id) ON DELETE CASCADE,
  route_id UUID NOT NULL REFERENCES routes(id) ON DELETE CASCADE,
  departure_time TIME NOT NULL,
  arrival_time TIME NOT NULL,
  fare_price DECIMAL(10, 2) NOT NULL,
  available_seats INTEGER NOT NULL,
  departure_date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT departure_before_arrival CHECK (departure_time < arrival_time)
);

-- 4. Create Seats Table
CREATE TABLE seats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  schedule_id UUID NOT NULL REFERENCES bus_schedules(id) ON DELETE CASCADE,
  seat_number VARCHAR(10) NOT NULL,
  is_available BOOLEAN DEFAULT true,
  booked_by UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(schedule_id, seat_number)
);

-- 5. Create Bookings Table
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  schedule_id UUID NOT NULL REFERENCES bus_schedules(id) ON DELETE CASCADE,
  passenger_email VARCHAR(255) NOT NULL,
  passenger_name VARCHAR(255) NOT NULL,
  passenger_phone VARCHAR(20) NOT NULL,
  seats TEXT[] NOT NULL,
  total_price DECIMAL(10, 2) NOT NULL,
  payment_reference VARCHAR(100),
  payment_status VARCHAR(50) DEFAULT 'pending',
  booking_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. Create Tickets Table
CREATE TABLE tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  ticket_number VARCHAR(50) UNIQUE NOT NULL,
  qr_code TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(booking_id)
);

-- Create Indexes for Performance
CREATE INDEX idx_bus_schedules_bus_id ON bus_schedules(bus_id);
CREATE INDEX idx_bus_schedules_route_id ON bus_schedules(route_id);
CREATE INDEX idx_bus_schedules_departure_date ON bus_schedules(departure_date);
CREATE INDEX idx_seats_schedule_id ON seats(schedule_id);
CREATE INDEX idx_seats_available ON seats(schedule_id, is_available);
CREATE INDEX idx_bookings_schedule_id ON bookings(schedule_id);
CREATE INDEX idx_bookings_payment_reference ON bookings(payment_reference);
CREATE INDEX idx_bookings_payment_status ON bookings(payment_status);
CREATE INDEX idx_bookings_created_at ON bookings(created_at);
CREATE INDEX idx_tickets_booking_id ON tickets(booking_id);

-- Add Triggers for updated_at fields
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_buses_timestamp
BEFORE UPDATE ON buses
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_routes_timestamp
BEFORE UPDATE ON routes
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_bus_schedules_timestamp
BEFORE UPDATE ON bus_schedules
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_seats_timestamp
BEFORE UPDATE ON seats
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_bookings_timestamp
BEFORE UPDATE ON bookings
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();
