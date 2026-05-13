

"use client";

import { useEffect, useState } from "react";

import {
  FaPlane,
  FaChair,
  FaUser,
  FaClock,
} from "react-icons/fa";

import "../globals.css";

export default function TicketPage({
  params,
}: {
  params: { id: string };
}) {

  const [ticket, setTicket] =
    useState<any>(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {

    if (params?.id) {
      fetchTicket();
    }

  }, [params?.id]);

  const fetchTicket = async () => {

    try {

      console.log(
        "BOOKING ID:",
        params.id
      );

      const res = await fetch(
        `https://airvoyage-final-project-backend-2.onrender.com/api/payments/single-booking/${params.id}`
      );

      console.log("RESPONSE:", res);

      const data = await res.json();

      console.log("DATA:", data);

      if (data.success) {
        setTicket(data.booking);
      }

    } catch (error) {

      console.log(
        "FETCH TICKET ERROR:",
        error
      );

    } finally {

      setLoading(false);

    }
  };

  if (loading) {
    return (
      <div className="ticket-loading">
        Loading Ticket...
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="ticket-loading">
        Ticket Not Found
      </div>
    );
  }

  return (
    <div className="ticket-page">

      <div className="ticket-card">

        {/* TOP */}

        <div className="ticket-top">

          <div>

            <h1>Boarding Pass</h1>

            <p>
              Booking ID:
              #{ticket._id.slice(0, 8)}
            </p>

          </div>

          <FaPlane className="top-plane" />

        </div>

        {/* ROUTE */}

        <div className="ticket-route">

          <div>
            <p>FROM</p>

            <h2>
              {ticket.flightId?.from}
            </h2>
          </div>

          <FaPlane className="route-plane" />

          <div>
            <p>TO</p>

            <h2>
              {ticket.flightId?.to}
            </h2>
          </div>

        </div>

        {/* GRID */}

        <div className="ticket-grid">

          <div className="ticket-info-box">

            <p>Passenger</p>

            <h3>
              <FaUser />

              {ticket.passengerName ||
                ticket.userId?.name}
            </h3>

          </div>

          <div className="ticket-info-box">

            <p>Airline</p>

            <h3>
              {ticket.flightId?.airline}
            </h3>

          </div>

          <div className="ticket-info-box">

            <p>Seats</p>

            <h3>
              <FaChair />

              {ticket.seats
                ?.map(
                  (seat: any) =>
                    seat.seatNumber
                )
                .join(", ")}
            </h3>

          </div>

          <div className="ticket-info-box">

            <p>Departure</p>

            <h3>
              <FaClock />

              {ticket.flightId
                ?.departureTime ||
                "N/A"}
            </h3>

          </div>

        </div>

        {/* FOOTER */}

        <div className="ticket-footer">

          <div>

            <p>Total Paid</p>

            <h1>
              ₹{ticket.totalAmount}
            </h1>

          </div>

          <div className="ticket-status">
            {ticket.bookingStatus}
          </div>

        </div>

        {/* QR */}

        <div className="qr-box">

          <img
            src={`https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${ticket._id}`}
            alt="QR"
          />

        </div>

      </div>

    </div>
  );
}