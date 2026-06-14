import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency = "GH₵"): string {
  return `${currency}${amount.toLocaleString("en-GH", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export function formatDate(date: string | Date | null | undefined): string {
  if (!date) return "—";
  // Treat plain date strings (YYYY-MM-DD) as local to avoid UTC-offset shifting
  const normalized =
    typeof date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(date)
      ? date + "T00:00:00"
      : date;
  const d = new Date(normalized);
  if (isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-GH", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function formatTime(time: string | null | undefined): string {
  if (!time) return "—";
  // Accept "HH:MM", "HH:MM:SS", or a full ISO string
  const timePart = time.includes("T") ? time.split("T")[1] : time;
  const [h, m] = timePart.split(":");
  const hour = parseInt(h, 10);
  if (isNaN(hour)) return "—";
  const ampm = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${m} ${ampm}`;
}

export function generateSeatLayout(rows: number, columns: number): string[] {
  const seats: string[] = [];
  const columnLetters = "ABCDEFGHIJKLMNOP".split("");

  for (let i = 1; i <= rows; i++) {
    for (let j = 0; j < columns; j++) {
      seats.push(`${i}${columnLetters[j]}`);
    }
  }

  return seats;
}

export function getSeatNumber(seat: string): { row: number; col: string } {
  const row = parseInt(seat.substring(0, seat.length - 1));
  const col = seat.substring(seat.length - 1);
  return { row, col };
}
