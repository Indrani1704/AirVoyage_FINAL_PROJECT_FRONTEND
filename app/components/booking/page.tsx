"use client";
import { useEffect, useState } from "react";

export default function MyBookings() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const getUser = () => {
    try {
      const data = localStorage.getItem("user");
      if (!data) return null;

      const parsed = JSON.parse(data);
      if (!parsed?._id) return null;

      return parsed;
    } catch {
      return null;
    }
  };

  useEffect(() => {
    const user = getUser();

    // ❌ DON'T redirect immediately
    if (!user) {
      console.log("No user found");
      setLoading(false);
      return;
    }

    const fetchBookings = async () => {
      try {
        const res = await fetch(
          `https://airvoyage-final-project-backend-2.onrender.com/api/payments/my-bookings?userId=${user._id}`
        );

        if (!res.ok) {
          console.error("Failed to fetch bookings");
          setBookings([]);
          return;
        }

        const data = await res.json();

        setBookings(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("ERROR:", err);
        setBookings([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  return (
    <div className="my-bookings-page">
      <h2>My Bookings</h2>

      {/* LOADING */}
      {loading && <p>Loading...</p>}

      {/* NOT LOGGED IN */}
      {!loading && bookings.length === 0 && (
        <p>No bookings found</p>
      )}

      {/* BOOKINGS */}
      {bookings.map((b) => (
        <div key={b._id} className="booking-card">
          <h3>{b.flightId?.airline || "Airline"}</h3>

          <p>
            {b.flightId?.from} → {b.flightId?.to}
          </p>

          <p>
            Seats:{" "}
            {b.seats?.map((s: any) => s.seatNumber).join(", ") || "-"}
          </p>

          <p>₹{b.totalAmount}</p>

          {/* ✅ DOWNLOAD */}
          <button
            onClick={() =>
              window.open(
                `https://airvoyage-final-project-backend-2.onrender.com/api/payments/ticket/${b._id}`,
                "_blank"
              )
            }
          >
            Download Ticket
          </button>
        </div>
      ))}
    </div>
  );
}