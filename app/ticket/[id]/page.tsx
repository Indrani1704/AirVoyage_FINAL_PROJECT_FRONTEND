

"use client";

import {
  use,
  useEffect,
  useState,
} from "react";

import "../../globals.css";

import {
  FaPlane,
  FaChair,
  FaUser,
  FaClock,
  FaCalendarAlt,
  FaTicketAlt,
} from "react-icons/fa";

import QRCode from "react-qr-code";

export default function TicketPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {

  const { id } = use(params);

  const [ticket, setTicket] =
    useState<any>(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {

    if (id) {
      fetchTicket();
    }

  }, [id]);

  const fetchTicket = async () => {

    try {

      const res = await fetch(
        `https://airvoyage-final-project-backend-2.onrender.com/api/payments/single-booking/${id}`
      );

      const data = await res.json();

      console.log("TICKET:", data);

      if (data.success) {
        setTicket(data.booking);
      }

    } catch (error) {

      console.log(error);

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

  const departureDate =
    ticket.flightId?.departureTime
      ? new Date(
          ticket.flightId.departureTime
        ).toLocaleDateString()
      : "N/A";

  const departureTime =
    ticket.flightId?.departureTime
      ? new Date(
          ticket.flightId.departureTime
        ).toLocaleTimeString()
      : "N/A";

  const arrivalTime =
    ticket.flightId?.arrivalTime
      ? new Date(
          ticket.flightId.arrivalTime
        ).toLocaleTimeString()
      : "N/A";

  return (

    <div className="ticket-page">

      <div className="ticket-card">

        {/* LEFT */}

        <div className="ticket-left">

          {/* HEADER */}

          <div className="ticket-header">

            <div className="brand-logo">

              <h1>
                {ticket.flightId?.airline ||
                  "SKY WINGS"}
              </h1>

              <p>AIRLINES</p>

            </div>

            <div className="boarding-text">

              <h2>BOARDING PASS</h2>

              <p>
                {ticket.bookingStatus?.toUpperCase()}
              </p>

            </div>

          </div>

          {/* BODY */}

          <div className="ticket-body">

            {/* TOP */}

            <div className="ticket-top-row">

              <div className="pass-title">

                <h1>Boarding Pass</h1>

                <p>
                  Booking ID:
                  <span>
                    #{ticket._id?.slice(0, 8)}
                  </span>
                </p>

              </div>

            </div>

            {/* ROUTE */}

            <div className="route-section">

              <div className="route-box">

                <p>FROM</p>

                <h2>
                  {ticket.flightId?.from ||
                    "N/A"}
                </h2>

                <h3>
                  {ticket.flightId?.from ||
                    "Unknown"}
                </h3>

              </div>

              <div className="route-plane">
                ✈
              </div>

              <div className="route-box">

                <p>TO</p>

                <h2>
                  {ticket.flightId?.to ||
                    "N/A"}
                </h2>

                <h3>
                  {ticket.flightId?.to ||
                    "Unknown"}
                </h3>

              </div>

            </div>

            {/* INFO */}

            <div className="ticket-grid">

              <div className="ticket-info-box">

                <p>Passenger</p>

                <h3>

                  <FaUser />

                  {ticket.passengerName ||
                    ticket.userId?.name ||
                    "User"}

                </h3>

              </div>

              <div className="ticket-info-box">

                <p>Airline</p>

                <h3>
                  {ticket.flightId?.airline ||
                    "N/A"}
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
                    .join(", ") || "N/A"}

                </h3>

              </div>

              <div className="ticket-info-box">

                <p>Departure</p>

                <h3>

                  <FaClock />

                  {departureTime}

                </h3>

              </div>

            </div>

            {/* BOTTOM */}

            <div className="ticket-bottom">

              <div className="bottom-box">

                <FaPlane />

                <div>

                  <p>Gate</p>

                  <h4>
                    {ticket.flightId?.gate ||
                      "A12"}
                  </h4>

                </div>

              </div>

              <div className="bottom-box">

                <FaClock />

                <div>

                  <p>Arrival</p>

                  <h4>
                    {arrivalTime}
                  </h4>

                </div>

              </div>

              <div className="bottom-box">

                <FaCalendarAlt />

                <div>

                  <p>Date</p>

                  <h4>
                    {departureDate}
                  </h4>

                </div>

              </div>

              <div className="bottom-box">

                <FaTicketAlt />

                <div>

                  <p>Class</p>

                  <h4>
                    {ticket.flightId
                      ?.travelClass ||
                      "ECONOMY"}
                  </h4>

                </div>

              </div>

            </div>

          </div>

          {/* FOOTER */}

          <div className="ticket-footer">

            <div>
              Have a Safe Journey!
            </div>

            <span>✈</span>

          </div>

        </div>

        {/* RIGHT */}

        <div className="ticket-right">

          {/* SIDE LOGO */}

          <div className="side-logo">

            <h2>
              {ticket.flightId?.airline ||
                "SKY WINGS"}
            </h2>

            <p>AIRLINES</p>

          </div>

          {/* PRICE */}

          <div className="price-box">

            <p>Total Paid</p>

            <h1>
              ₹{ticket.totalAmount}
            </h1>

            <span>
              {ticket.bookingStatus}
            </span>

          </div>

          {/* QR */}

         <div className="qr-box">

  <QRCode
    size={140}
    value={JSON.stringify({
      bookingId: ticket._id,
      passenger: ticket.passengerName,
      from: ticket.flightId?.from,
      to: ticket.flightId?.to,
      airline: ticket.flightId?.airline,
      seats: ticket.seats
        ?.map((s: any) => s.seatNumber)
        .join(", "),
      departure:
        ticket.flightId?.departureTime,
    })}
  />

</div>

          {/* BARCODE */}

          <div className="barcode"></div>

          {/* FINAL ROUTE */}

          <div className="final-route">

            {ticket.flightId?.from}

            <span>✈</span>

            {ticket.flightId?.to}

          </div>

        </div>

      </div>

    </div>
  );
}