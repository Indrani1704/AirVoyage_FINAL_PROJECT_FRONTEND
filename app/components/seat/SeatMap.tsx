"use client";

import React, {
  useEffect,
  useState,
} from "react";

import  socket 
from "../../lib/socket";

type Seat = {
  seatNumber: string;
  isBooked: boolean;
};

type Props = {
  flightId: string;
  onSelect: (
    seatNumber: string
  ) => void;
};

export default function SeatMap({
  flightId,
  onSelect,
}: Props) {

  const [seats, setSeats] =
    useState<Seat[]>([]);

  /* ================= FETCH ================= */

  useEffect(() => {

    const fetchSeats =
      async () => {

        try {

          const res =
            await fetch(
              `https://airvoyage-final-project-backend-2.onrender.com/api/seatmap/${flightId}`
            );

          const data =
            await res.json();

          setSeats(
            Array.isArray(
              data?.seats
            )
              ? data.seats
              : []
          );

        } catch (err: any) {

          console.log(
            "Seat fetch error:",
            err.message
          );

        }

      };

    fetchSeats();

    /* ================= SOCKET ================= */

    socket.emit(
      "joinFlight",
      flightId
    );

    socket.on(
      "seatUpdate",
      (data: Seat) => {

        setSeats((prev) =>

          prev.map((s) =>

            s.seatNumber ===
            data.seatNumber

              ? {
                  ...s,
                  ...data,
                }

              : s
          )
        );

      }
    );

    return () => {

      socket.off(
        "seatUpdate"
      );

    };

  }, [flightId]);

  return (

    <div
      className="
        grid
        grid-cols-6
        gap-3
      "
    >

      {seats.map(
        (seat: Seat) => (

          <div
            key={
              seat.seatNumber
            }

            onClick={() => {

              if (
                seat.isBooked
              ) return;

              onSelect(
                seat.seatNumber
              );

            }}

            className={`
              p-3
              text-center
              rounded
              cursor-pointer
              text-white
              font-bold
              transition

              ${
                seat.isBooked

                  ? "bg-red-500 cursor-not-allowed"

                  : "bg-green-500 hover:bg-green-600"
              }
            `}
          >

            {
              seat.seatNumber
            }

          </div>

        )
      )}

    </div>

  );

}