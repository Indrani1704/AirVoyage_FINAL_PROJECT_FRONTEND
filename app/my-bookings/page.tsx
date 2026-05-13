// app/my-bookings/page.tsx

"use client";

import "../globals.css";

import { useEffect, useState } from "react";

import { useRouter } from "next/navigation";

import {
  FaPlane,
  FaHotel,
  FaCar,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaClock,
  FaChair,
  FaUser,
  FaStar,
  FaDownload,
  FaTicketAlt,
} from "react-icons/fa";

interface Booking {

  _id?: string;

  bookingType?:
    | "flight"
    | "hotel"
    | "cab";

  bookingStatus?: string;

  totalAmount?: number;

  passengerName?: string;

  createdAt?: string;

  hotelName?: string;

  userId?: {
    _id?: string;
    name?: string;
    email?: string;
  };

  user?: {
    _id?: string;
    name?: string;
    email?: string;
  };

  flightId?: {

    airline?: string;

    from?: string;

    to?: string;

    departureTime?: string;

    arrivalTime?: string;

  };

  seats?: {
    seatNumber?: string;
  }[];

  location?: string;

  checkIn?: string;

  checkOut?: string;

  rooms?: string;

  rating?: number;

  pickup?: string;

  drop?: string;

  cabType?: string;

  driver?: string;

  date?: string;

  time?: string;
}

export default function MyBookingsPage() {

  const router =
    useRouter();

  const [bookings, setBookings] =
    useState<Booking[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [activeTab, setActiveTab] =
    useState("all");

  useEffect(() => {

    fetchBookings();

  }, []);

  /* ================= FETCH BOOKINGS ================= */

  const fetchBookings =
    async () => {

      try {

        const userData =
          localStorage.getItem(
            "user"
          );

        if (!userData) {

          setLoading(false);

          return;

        }

        const user =
          JSON.parse(userData);

        /* ================= FLIGHTS ================= */

        const flightRes =
  await fetch(
    `https://airvoyage-final-project-backend-2.onrender.com/api/payments/my-bookings?userId=${user._id}`
  );

        const flightData =
          await flightRes.json();

        console.log(
          "FLIGHT BOOKINGS:",
          flightData
        );

        /* ================= HOTELS ================= */

        const hotelRes =
          await fetch(
            `https://airvoyage-final-project-backend-2.onrender.com/api/hotel-bookings/my-bookings?userId=${user._id}`
          );

        const hotelData =
          await hotelRes.json();

        console.log(
          "HOTEL BOOKINGS:",
          hotelData
        );

        /* ================= CABS ================= */

        const cabRes =
          await fetch(
            `https://airvoyage-final-project-backend-2.onrender.com/api/car-bookings/my-bookings?userId=${user._id}`
          );

        const cabData =
          await cabRes.json();

        console.log(
          "CAB BOOKINGS:",
          cabData
        );

        /* ================= ARRAY FIX ================= */

        const flightBookings =
          Array.isArray(flightData)
            ? flightData
            : flightData.bookings || [];

        const hotelBookings =
          Array.isArray(hotelData)
            ? hotelData
            : hotelData.bookings || [];

        const cabBookings =
          Array.isArray(cabData)
            ? cabData
            : cabData.bookings || [];

        /* ================= MERGE ================= */

        const allBookings = [

          ...flightBookings,

          ...hotelBookings,

          ...cabBookings,

        ];

        console.log(
          "ALL BOOKINGS:",
          allBookings
        );

        /* ================= SORT ================= */

        allBookings.sort(
          (a:any, b:any) =>

            new Date(
              b.createdAt || ""
            ).getTime()

            -

            new Date(
              a.createdAt || ""
            ).getTime()
        );

        setBookings(
          allBookings
        );

      } catch (error) {

        console.log(
          "FETCH BOOKINGS ERROR:",
          error
        );

      } finally {

        setLoading(false);

      }

    };

  /* ================= FILTER ================= */

  const filteredBookings =
    activeTab === "all"

      ? bookings

      : bookings.filter(
          (booking) =>
            booking?.bookingType ===
            activeTab
        );

  return (

    <div className="bookings-page">

      <div className="container">

        {/* HEADER */}

        <div className="header">

          <div>

            <h1>
              My Bookings
            </h1>

            <p>
              Flights, Hotels & Cab Bookings
            </p>

          </div>

          <div className="booking-count">

            <h3>
              Total Bookings
            </h3>

            <h2>
              {bookings.length}
            </h2>

          </div>

        </div>

        {/* FILTERS */}

        <div className="filters">

          {[
            "all",
            "flight",
            "hotel",
            "cab",
          ].map((tab) => (

            <button
              key={tab}
              className={
                activeTab === tab
                  ? "active"
                  : ""
              }
              onClick={() =>
                setActiveTab(tab)
              }
            >
              {tab}
            </button>

          ))}

        </div>

        {/* LOADING */}

        {loading && (

          <div className="loader-container">

            <div className="loader"></div>

          </div>

        )}

        {/* EMPTY */}

        {!loading &&
          filteredBookings.length === 0 && (

            <div className="empty-state">

              <h2>
                No Bookings Found
              </h2>

              <p>
                You do not have any bookings yet.
              </p>

            </div>

          )}

        {/* BOOKINGS */}

        <div className="booking-grid">

          {filteredBookings
            ?.filter(
              (booking) =>
                booking &&
                booking._id
            )
            .map((booking) => (

              <div
                className="booking-card"
                key={booking._id}
              >

                {/* TOP */}

                <div className="card-top">

                  <div className="left">

                    <div className="icon-box">

                      {booking.bookingType ===
                        "flight" && (
                        <FaPlane />
                      )}

                      {booking.bookingType ===
                        "hotel" && (
                        <FaHotel />
                      )}

                      {booking.bookingType ===
                        "cab" && (
                        <FaCar />
                      )}

                    </div>

                    <div>

                      <h2>
{booking?.bookingType
  ? booking.bookingType.charAt(0)
      .toUpperCase() +
    booking.bookingType.slice(1)
  : "Booking"}

                        {" "}
                        Ticket

                      </h2>

                      <p>

                        Booking ID:
                        {" "}
                        #
                        {booking._id?.slice(
                          0,
                          8
                        )}

                      </p>

                    </div>

                  </div>

                  <span className="status">

                    {booking.bookingStatus ||
                      "Confirmed"}

                  </span>

                </div>

                {/* ================= FLIGHT ================= */}

                {booking.bookingType ===
                  "flight" && (

                  <>

                    <div className="route">

                      <div>

                        <p>
                          From
                        </p>

                        <h2>
                          {booking.flightId
                            ?.from || "N/A"}
                        </h2>

                      </div>

                      <FaPlane className="plane-icon" />

                      <div>

                        <p>
                          To
                        </p>

                        <h2>
                          {booking.flightId
                            ?.to || "N/A"}
                        </h2>

                      </div>

                    </div>

                  </>

                )}

                {/* ================= HOTEL ================= */}

                {booking.bookingType ===
                  "hotel" && (

                  <>

                    <div className="hotel-box">

                      <h2>

                        {booking.hotelName ||
                          "Luxury Hotel"}

                      </h2>

                      <p className="location">

                        <FaMapMarkerAlt />

                        {booking.location ||
                          "Unknown"}

                      </p>

                    </div>

                  </>

                )}

                {/* ================= CAB ================= */}

                {booking.bookingType ===
                  "cab" && (

                  <>

                    <div className="route">

                      <div>

                        <p>
                          Pickup
                        </p>

                        <h3>
                          {booking.pickup ||
                            "N/A"}
                        </h3>

                      </div>

                      <FaCar className="plane-icon" />

                      <div>

                        <p>
                          Drop
                        </p>

                        <h3>
                          {booking.drop ||
                            "N/A"}
                        </h3>

                      </div>

                    </div>

                    <div className="info-grid">

                      <Card
                        title="Cab Type"
                        value={
                          booking.cabType ||
                          "N/A"
                        }
                      />

                      <Card
                        title="Driver"
                        value={
                          booking.driver ||
                          "N/A"
                        }
                      />

                      <Card
                        title="Date"
                        value={
                          booking.date ||
                          "N/A"
                        }
                      />

                      <Card
                        title="Time"
                        value={
                          booking.time ||
                          "N/A"
                        }
                      />

                    </div>

                  </>

                )}

                {/* FOOTER */}

                <div className="card-footer">

                  <div>

                    <p>
                      Passenger
                    </p>

                    <div className="passenger">

                      <FaUser />

                      <span>

                        {booking.passengerName ||

                          booking.userId?.name ||

                          booking.user?.name ||

                          "User"}

                      </span>

                    </div>

                  </div>

                  <div className="amount-box">

                    <p>
                      Amount Paid
                    </p>

                    <h2>
                      ₹
                      {booking.totalAmount ||
                        0}
                    </h2>

                  </div>

                </div>

                {/* DATE */}

                <div className="booking-date">

                  Booked On:
                  {" "}

                  {booking.createdAt

                    ? new Date(
                        booking.createdAt
                      ).toLocaleDateString()

                    : "N/A"}

                </div>

             {/* BUTTONS */}

<div className="buttons">

  {/* ================= FLIGHT ================= */}

  {booking.bookingType === "flight" && (

    <>

      {/* VIEW TICKET */}

      <button
        className="download-btn"

        onClick={() => {

          router.push(
            `/ticket/${booking._id}`
          );

        }}
      >

        <FaTicketAlt />

        View Ticket

      </button>

      {/* DOWNLOAD INVOICE */}

      <button
        className="download-btn"

        onClick={() => {

          window.open(
            `https://airvoyage-final-project-backend-2.onrender.com/api/payments/ticket/${booking._id}`,
            "_blank"
          );

        }}
      >

        <FaDownload />

        Download Invoice

      </button>

    </>

  )}

  {/* ================= HOTEL ================= */}

  {booking.bookingType === "hotel" && (

    <button
      className="download-btn full-btn"

      onClick={() => {

        window.open(
          `https://airvoyage-final-project-backend-2.onrender.com/api/hotel-bookings/invoice/${booking._id}`,
          "_blank"
        );

      }}
    >

      <FaDownload />

      Download Hotel Invoice

    </button>

  )}

  {/* ================= CAB ================= */}

  {booking.bookingType === "cab" && (

    <button
      className="download-btn full-btn"

      onClick={() => {

        window.open(
          `https://airvoyage-final-project-backend-2.onrender.com/api/car-bookings/receipt/${booking._id}`,
          "_blank"
        );

      }}
    >

      <FaDownload />

      Download Cab Invoice

    </button>

  )}

</div>

              </div>

            ))}

        </div>

      </div>

    </div>

  );

}

/* ================= CARD ================= */

function Card({

  title,

  value,

  icon,

}: {

  title: string;

  value: any;

  icon?: any;

}) {

  return (

    <div className="info-card">

      <p>
        {title}
      </p>

      <div className="card-value">

        {icon}

        <span>
          {value}
        </span>

      </div>

    </div>

  );

}