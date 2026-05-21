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

export function formatDate(date: string | Date): string {
  const d = new Date(date);
  return d.toLocaleDateString("en-NG", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function formatTime(time: string): string {
  const [hours, minutes] = time.split(":");
  const hour = parseInt(hours);
  const ampm = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${minutes} ${ampm}`;
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
