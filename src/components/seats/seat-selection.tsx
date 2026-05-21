"use client";

import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Seat } from "@/types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChair } from "@fortawesome/free-solid-svg-icons";

interface SeatSelectionProps {
  seats: Seat[];
  onSeatsSelected: (selectedSeats: string[]) => void;
  disabled?: boolean;
  maxSelection?: number;
}

// Bus seat configuration
const TOTAL_ROWS = 23;
const SEATS_PER_ROW = 4; // Regular rows have 4 seats (2 left, 2 right with aisle)
const LAST_ROW_SEATS = 5; // Last row has 5 seats (no aisle)

// Generate seat layout
function generateBusSeats(): { row: number; col: number; seatNumber: number }[] {
  const layout: { row: number; col: number; seatNumber: number }[] = [];
  let seatNumber = 1;

  for (let row = 1; row <= TOTAL_ROWS; row++) {
    const seatsInThisRow = row === TOTAL_ROWS ? LAST_ROW_SEATS : SEATS_PER_ROW;

    if (row === TOTAL_ROWS) {
      // Last row: 5 seats in a line [1] [2] [3] [4] [5]
      for (let col = 0; col < 5; col++) {
        layout.push({ row, col, seatNumber });
        seatNumber++;
      }
    } else {
      // Regular rows: 4 seats [1] [2]   [3] [4]
      // Left side
      layout.push({ row, col: 0, seatNumber });
      seatNumber++;
      layout.push({ row, col: 1, seatNumber });
      seatNumber++;
      // Right side (col 2 is aisle)
      layout.push({ row, col: 3, seatNumber });
      seatNumber++;
      layout.push({ row, col: 4, seatNumber });
      seatNumber++;
    }
  }

  return layout;
}

export function SeatSelection({
  seats,
  onSeatsSelected,
  disabled = false,
  maxSelection = 5,
}: SeatSelectionProps) {
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const busLayout = generateBusSeats();

  // Create a map of booked seats from database
  const bookedSeatsSet = new Set(
    seats.filter((s) => !s.is_available).map((s) => s.seat_number)
  );

  const handleSeatClick = (seatNumber: string) => {
    if (disabled) return;

    const alreadySelected = selectedSeats.includes(seatNumber);

    if (alreadySelected) {
      setSelectedSeats(selectedSeats.filter((s) => s !== seatNumber));
    } else if (selectedSeats.length < maxSelection) {
      setSelectedSeats([...selectedSeats, seatNumber]);
    }
  };

  useEffect(() => {
    onSeatsSelected(selectedSeats);
  }, [selectedSeats, onSeatsSelected]);

  const isSeatBooked = (seatNumber: string): boolean => {
    return bookedSeatsSet.has(seatNumber);
  };

  const isSeatSelected = (seatNumber: string): boolean => {
    return selectedSeats.includes(seatNumber);
  };

  // Group layout by rows
  const seatsByRow: { [key: number]: typeof busLayout } = {};
  busLayout.forEach((seat) => {
    if (!seatsByRow[seat.row]) {
      seatsByRow[seat.row] = [];
    }
    seatsByRow[seat.row].push(seat);
  });

  return (
    <div className="w-full space-y-6">
      <div className="bg-white/50 backdrop-blur-sm rounded-lg p-6">
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Select Your Seats
          </h3>

          {/* Legend */}
          <div className="grid grid-cols-3 gap-4 text-sm mb-6">
            <div className="flex items-center gap-2">
              <button
                className="w-8 h-8 bg-green-100 border-2 border-green-500 rounded cursor-default"
                disabled
              >
                <FontAwesomeIcon
                  icon={faChair}
                  className="text-green-600"
                  size="sm"
                />
              </button>
              <span className="text-gray-700">Available</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                className="w-8 h-8 bg-blue-100 border-2 border-blue-500 rounded cursor-default"
                disabled
              >
                <FontAwesomeIcon
                  icon={faChair}
                  className="text-blue-600"
                  size="sm"
                />
              </button>
              <span className="text-gray-700">Selected</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                className="w-8 h-8 bg-gray-300 border-2 border-gray-400 rounded cursor-default"
                disabled
              >
                <FontAwesomeIcon
                  icon={faChair}
                  className="text-gray-600"
                  size="sm"
                />
              </button>
              <span className="text-gray-700">Booked</span>
            </div>
          </div>

          {/* Front of Bus Label */}
          <div className="text-center mb-8">
            <div className="inline-block bg-gray-700 text-white px-6 py-2 rounded-lg font-semibold text-sm">
              FRONT OF BUS
            </div>
          </div>
        </div>

        {/* Seats Grid */}
        <div className="space-y-3 overflow-x-auto">
          {Object.keys(seatsByRow)
            .map(Number)
            .sort((a, b) => a - b)
            .map((row) => (
              <div key={row} className="flex gap-4 items-center justify-center">
                <div className="w-10 text-center font-semibold text-gray-600 text-sm">
                  {row}
                </div>

                <div className="flex gap-3 items-center">
                  {/* Left side seats */}
                  <div className="flex gap-2">
                    {seatsByRow[row]
                      .filter((s) => s.col <= 1)
                      .map((seat) => {
                        const seatNumberStr = seat.seatNumber.toString();
                        const isBooked = isSeatBooked(seatNumberStr);
                        const isSelected = isSeatSelected(seatNumberStr);

                        return (
                          <button
                            key={`${seat.row}-${seat.col}`}
                            onClick={() =>
                              handleSeatClick(seatNumberStr)
                            }
                            disabled={isBooked || disabled}
                            className={cn(
                              "w-10 h-10 rounded border-2 flex flex-col items-center justify-center transition-all duration-200 text-xs font-bold",
                              isBooked
                                ? "bg-gray-300 border-gray-400 cursor-not-allowed"
                                : isSelected
                                  ? "bg-blue-100 border-blue-500 cursor-pointer hover:bg-blue-200"
                                  : "bg-green-100 border-green-500 cursor-pointer hover:bg-green-200"
                            )}
                            title={`Seat ${seatNumberStr}`}
                          >
                            <FontAwesomeIcon
                              icon={faChair}
                              size="xs"
                              className={
                                isBooked
                                  ? "text-gray-600"
                                  : isSelected
                                    ? "text-blue-600"
                                    : "text-green-600"
                              }
                            />
                            <span
                              className={`text-xs font-bold ${
                                isBooked
                                  ? "text-gray-600"
                                  : isSelected
                                    ? "text-blue-600"
                                    : "text-green-600"
                              }`}
                            >
                              {seatNumberStr}
                            </span>
                          </button>
                        );
                      })}
                  </div>

                  {/* Aisle (only for regular rows, not last row) */}
                  {row !== TOTAL_ROWS && (
                    <div className="w-6 h-10 flex items-center justify-center">
                      <div className="w-1 h-full bg-gray-300 rounded"></div>
                    </div>
                  )}

                  {/* Right side seats */}
                  <div className="flex gap-2">
                    {row === TOTAL_ROWS
                      ? // Last row: remaining seats in center
                        seatsByRow[row]
                          .filter((s) => s.col >= 2)
                          .map((seat) => {
                            const seatNumberStr = seat.seatNumber.toString();
                            const isBooked = isSeatBooked(seatNumberStr);
                            const isSelected = isSeatSelected(seatNumberStr);

                            return (
                              <button
                                key={`${seat.row}-${seat.col}`}
                                onClick={() =>
                                  handleSeatClick(seatNumberStr)
                                }
                                disabled={isBooked || disabled}
                                className={cn(
                                  "w-10 h-10 rounded border-2 flex flex-col items-center justify-center transition-all duration-200 text-xs font-bold",
                                  isBooked
                                    ? "bg-gray-300 border-gray-400 cursor-not-allowed"
                                    : isSelected
                                      ? "bg-blue-100 border-blue-500 cursor-pointer hover:bg-blue-200"
                                      : "bg-green-100 border-green-500 cursor-pointer hover:bg-green-200"
                                )}
                                title={`Seat ${seatNumberStr}`}
                              >
                                <FontAwesomeIcon
                                  icon={faChair}
                                  size="xs"
                                  className={
                                    isBooked
                                      ? "text-gray-600"
                                      : isSelected
                                        ? "text-blue-600"
                                        : "text-green-600"
                                  }
                                />
                                <span
                                  className={`text-xs font-bold ${
                                    isBooked
                                      ? "text-gray-600"
                                      : isSelected
                                        ? "text-blue-600"
                                        : "text-green-600"
                                  }`}
                                >
                                  {seatNumberStr}
                                </span>
                              </button>
                            );
                          })
                      : // Regular rows right side
                        seatsByRow[row]
                          .filter((s) => s.col >= 3)
                          .map((seat) => {
                            const seatNumberStr = seat.seatNumber.toString();
                            const isBooked = isSeatBooked(seatNumberStr);
                            const isSelected = isSeatSelected(seatNumberStr);

                            return (
                              <button
                                key={`${seat.row}-${seat.col}`}
                                onClick={() =>
                                  handleSeatClick(seatNumberStr)
                                }
                                disabled={isBooked || disabled}
                                className={cn(
                                  "w-10 h-10 rounded border-2 flex flex-col items-center justify-center transition-all duration-200 text-xs font-bold",
                                  isBooked
                                    ? "bg-gray-300 border-gray-400 cursor-not-allowed"
                                    : isSelected
                                      ? "bg-blue-100 border-blue-500 cursor-pointer hover:bg-blue-200"
                                      : "bg-green-100 border-green-500 cursor-pointer hover:bg-green-200"
                                )}
                                title={`Seat ${seatNumberStr}`}
                              >
                                <FontAwesomeIcon
                                  icon={faChair}
                                  size="xs"
                                  className={
                                    isBooked
                                      ? "text-gray-600"
                                      : isSelected
                                        ? "text-blue-600"
                                        : "text-green-600"
                                  }
                                />
                                <span
                                  className={`text-xs font-bold ${
                                    isBooked
                                      ? "text-gray-600"
                                      : isSelected
                                        ? "text-blue-600"
                                        : "text-green-600"
                                  }`}
                                >
                                  {seatNumberStr}
                                </span>
                              </button>
                            );
                          })}
                  </div>
                </div>

                <div className="w-10"></div>
              </div>
            ))}
        </div>

        {/* Back of Bus Label */}
        <div className="text-center mt-8">
          <div className="inline-block bg-gray-700 text-white px-6 py-2 rounded-lg font-semibold text-sm">
            BACK OF BUS
          </div>
        </div>
      </div>

      {/* Selected Seats Summary */}
      <div className="bg-white/50 backdrop-blur-sm rounded-lg p-4">
        <p className="text-sm text-gray-600 mb-2">
          Selected Seats ({selectedSeats.length}/{maxSelection}):
        </p>
        {selectedSeats.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {selectedSeats.sort((a, b) => parseInt(a) - parseInt(b)).map((seat) => (
              <span
                key={seat}
                className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium"
              >
                Seat {seat}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 italic">No seats selected yet</p>
        )}
      </div>
    </div>
  );
}
