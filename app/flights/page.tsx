"use client";

import { useSearchParams, useRouter } from "next/navigation";
import {
  Suspense,
  useEffect,
 
  useState,
} from "react";
import "../globals.css";
import toast from "react-hot-toast";

function FlightsContent() {
  const params = useSearchParams();
  const router = useRouter();

  const [flights, setFlights] = useState<any[]>([]);
  const [selectedFlight, setSelectedFlight] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);

  const [coupons, setCoupons] = useState<any[]>([]);
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [loading, setLoading] =
  useState(true);

  const from = params.get("from") || "";
  const to = params.get("to") || "";
  const date = params.get("date") || "";

  /* ================= FETCH ================= */
 useEffect(() => {

  if (!from || !to) return;

  setLoading(true);

  Promise.all([

    fetch(
      `https://airvoyage-final-project-backend-2.onrender.com/api/flights?from=${from}&to=${to}&date=${date}`
    ),

    fetch(
      "https://airvoyage-final-project-backend-2.onrender.com/api/coupons"
    ),

  ])

    .then(async ([flightRes, couponRes]) => {

      const flightData =
        await flightRes.json();

      const couponData =
        await couponRes.json();

      /* FLIGHTS */

      if (Array.isArray(flightData))
        setFlights(flightData);

      else if (
        Array.isArray(
          flightData.flights
        )
      )
        setFlights(
          flightData.flights
        );

      else if (
        Array.isArray(
          flightData.data
        )
      )
        setFlights(
          flightData.data
        );

      else
        setFlights([]);

      /* COUPONS */

      if (
        Array.isArray(couponData)
      )
        setCoupons(couponData);

      else if (
        Array.isArray(
          couponData.data
        )
      )
        setCoupons(
          couponData.data
        );

      else
        setCoupons([]);

    })

    .catch(() => {

      setFlights([]);
      setCoupons([]);

    })

    .finally(() => {

      setLoading(false);

    });

}, [from, to, date]);


  /* ================= OPEN MODAL ================= */
const openSeatModal = (flight: any) => {

  try {

    const userStr =
      localStorage.getItem(
        "user"
      );

    const token =
      localStorage.getItem(
        "token"
      );

    if(
      !userStr ||
      !token
    ){

      toast.error(
        "Please login first to make bookings"
      );

      setTimeout(()=>{

        router.push("/");

      },1500);

      return;

    }

    const user =
      JSON.parse(userStr);

    if(
      !user ||
      !user._id
    ){

      toast.error(
        "Please login first to continue"
      );

      setTimeout(()=>{

        router.push("/");

      },1500);

      return;

    }

    setSelectedFlight(flight);

    setSelectedSeats([]);

    setAppliedCoupon(null);

    setShowModal(true);

  } catch {

    toast.error(
      "Please login first"
    );

    setTimeout(()=>{

      router.push("/");

    },1500);

  }

};

  const getUser = () => {
  try {
    const data = localStorage.getItem("user");
    if (!data) return null;

    const parsed = JSON.parse(data);
    if (!parsed || !parsed._id) return null;

    return parsed;
  } catch {
    return null;
  }
};

 /* ================= PAYMENT ================= */
const handlePayment = async () => {
  try {
    const user = getUser();

    if (!user) {
     toast.error(
  "Session expired. Please login again."
);
      router.push("/login");
      return;
    }
console.log({

  baseTotal,

  discount,

  finalTotal,

  selectedSeats,

  allSeats:
    selectedFlight?.seats,

});
    // 🔥 CREATE ORDER
    const res = await fetch("https://airvoyage-final-project-backend-2.onrender.com/api/payments/create-order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ amount: finalTotal }),
    });

    const data = await res.json();

    if (!data.success) {
   toast.error(
  "Order creation failed"
);
      return;
    }

    // 🔥 LOAD RAZORPAY
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      const options = {
        key: "rzp_test_Sb4mvfRgT35BRM",
        amount: data.order.amount,
        currency: "INR",
        name: selectedFlight?.airline,
        description: "Flight Booking",
        order_id: data.order.id,

        handler: async function (response: any) {
          const verifyRes = await fetch(
            "https://airvoyage-final-project-backend-2.onrender.com/api/payments/verify",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,

                bookingData: {
                  bookingType: "flight",
                  userId: user._id,
                  flightId: selectedFlight._id,
                  seats: selectedFlight.seats
                    .filter((s: any) =>
                      selectedSeats.includes(s.seatNumber)
                    )
                    .map((s: any) => ({
                      seatNumber: s.seatNumber,
                      price: s.price,
                    })),
                  totalAmount: finalTotal,
                },
              }),
            }
          );
console.log(
  "LOCAL USER:",
  user
);

console.log(
  "LOCAL USER ID:",
  user._id
);
          const verifyData = await verifyRes.json();

          if (verifyData.success) {
         toast.success(
  "✈️ Flight booked successfully"
);

setTimeout(()=>{

  router.push(
    "/my-bookings"
  );

},1500);
            router.push("/my-bookings");
          } else {
            toast.error(
  "Payment verification failed"
);
          }
        },

        theme: { color: "#dc2626" },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    };
  } catch (err) {
    console.error(err);
    toast.error(
  "Payment failed"
);
  }
};

/* ================= PRICE CALCULATION ================= */

const getSeatPrice = (seatNumber: string) => {
  const seat = selectedFlight?.seats?.find(
    (x: any) => x.seatNumber === seatNumber
  );
  return Number(seat?.price || 0);
};

const baseTotal =
  selectedSeats.reduce(

    (sum, seatNo) => {

      const seat =
        selectedFlight?.seats?.find(
          (s:any) =>
            s.seatNumber === seatNo
        );

      return (
        sum +
        Number(
          seat?.price || 0
        )
      );

    },

    0

  );

let discount = 0;
let isCouponValid = false;

if (appliedCoupon && baseTotal > 0) {
  const minAmount = Number(appliedCoupon.minAmount || 0);

  if (baseTotal >= minAmount) {
    isCouponValid = true;

    const value =
      Number(appliedCoupon.discount) ||
      Number(appliedCoupon.value) ||
      0;

    const type = appliedCoupon.type || "flat";

    if (type === "percentage") {
      discount = (baseTotal * value) / 100;
    } else {
      discount = value;
    }
  }
}

discount = Number(discount) || 0;

const finalTotal =
  Math.max(
    Number(baseTotal) -
    Number(discount),
    0
  );

if (loading) {

  return (

    <div
      style={{

        height:"100vh",

        display:"flex",

        flexDirection:"column",

        alignItems:"center",

        justifyContent:"center",

        background:
          "linear-gradient(135deg,#fff5f5,#ffffff)",

      }}
    >

      {/* SPINNER */}

      <div
        style={{

          width:"80px",

          height:"80px",

          border:
            "6px solid #f3f3f3",

          borderTop:
            "6px solid #dc2626",

          borderRadius:"50%",

          animation:
            "spin 1s linear infinite",

          marginBottom:"24px",

        }}
      />

      {/* TITLE */}

      <h2
        style={{

          color:"#dc2626",

          fontWeight:700,

          marginBottom:"8px",

        }}
      >
        Searching Flights...
      </h2>

      {/* SUBTEXT */}

      <p
        style={{
          color:"#777",
        }}
      >
        Finding best fares & available seats ✈
      </p>

      {/* ANIMATION */}

      <style jsx>{`

        @keyframes spin {

          0% {
            transform: rotate(0deg);
          }

          100% {
            transform: rotate(360deg);
          }

        }

      `}</style>

    </div>

  );

}



  return (
    <div className="page-container">

      {/* HERO */}
      <div className="page-hero">
        <img
          src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1600&q=80"
          alt="flight banner"
        />
        <div className="hero-overlay" />
        <div className="hero-text">
          <h1>Flights from {from} → {to}</h1>
          <p>{date}</p>
        </div>
      </div>

      {/* EMPTY */}
      {flights.length === 0 && (
        <p className="empty-text">No flights found</p>
      )}

      {/* LIST */}
      <div className="card-list">
        {flights.map((f) => {
          const minPrice =
            f.seats?.length > 0
              ? Math.min(...f.seats.map((s: any) => s.price))
              : "--";

          return (
            <div key={f._id} className="flight-card-modern">
              <div className="flight-left">
                <h3>{f.airline}</h3>
                <p className="flight-no">{f.flightNumber}</p>

                <div className="time-row">
                  <div>
                    <h2>{new Date(f.departureTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</h2>
                    <p>{f.from}</p>
                  </div>

                  <div className="flight-line">────✈────</div>

                  <div>
                    <h2>{new Date(f.arrivalTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</h2>
                    <p>{f.to}</p>
                  </div>
                </div>
              </div>

              <div className="flight-right">
                <h2>₹{minPrice}</h2>
                <p>per seat</p>

                <button className="primary-btn" onClick={() => openSeatModal(f)}>
                  Select Seats
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* MODAL */}
      {showModal && selectedFlight && (
       <div className="modal-overlay" onClick={() => setShowModal(false)}>
  <div
    className="seat-modal premium"
    onClick={(e) => e.stopPropagation()}
  >

          <div className="seat-header premium-header">
  <div className="header-left">

    <h2 className="airline-name">{selectedFlight.airline}</h2>

    <div className="route-row">
      <div className="city">
        <h3>
          {new Date(selectedFlight.departureTime).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </h3>
        <p>{selectedFlight.from}</p>
      </div>

      <div className="flight-path">✈</div>

      <div className="city">
        <h3>
          {new Date(selectedFlight.arrivalTime).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </h3>
        <p>{selectedFlight.to}</p>
      </div>
    </div>

    <p className="flight-date">
      {new Date(selectedFlight.departureTime).toDateString()}
    </p>

  </div>


</div>
            <div className="seat-body">

              {/* LEFT - SEATS */}
              <div className="aircraft-wrapper">
                {Array.from({
                  length: Math.ceil(selectedFlight.seats.length / 4),
                }).map((_, rowIndex) => {
                  const rowSeats = selectedFlight.seats.slice(
                    rowIndex * 4,
                    rowIndex * 4 + 4
                  );

                  return (
                    <div key={rowIndex} className="seat-row">
                      <div className="row-number">{rowIndex + 1}</div>

                      <div className="seat-group">
  {rowSeats.slice(0, 2).map((seat: any, idx: number) => {
    const isSelected = selectedSeats.includes(seat.seatNumber);

    return (
      <div
        key={seat.seatNumber}
        className={`seat 
          ${seat.isBooked ? "booked" : ""} 
          ${isSelected ? "selected" : ""}`}
        onClick={() => {
          if (seat.isBooked) return;

          isSelected
            ? setSelectedSeats(prev => prev.filter(s => s !== seat.seatNumber))
            : setSelectedSeats(prev => [...prev, seat.seatNumber]);
        }}
      >
        <div className="seat-top">
          {idx === 0 ? "🪟" : "🪑"}
        </div>

        <div className="seat-number">{seat.seatNumber}</div>

        <div className="seat-price">₹{seat.price}</div>
      </div>
    );
  })}
</div>
                        

                      <div className="aisle-line" />

                     <div className="seat-group">
  {rowSeats.slice(2, 4).map((seat: any, idx: number) => {
    const isSelected = selectedSeats.includes(seat.seatNumber);

    return (
      <div
        key={seat.seatNumber}
        className={`seat 
          ${seat.isBooked ? "booked" : ""} 
          ${isSelected ? "selected" : ""}`}
        onClick={() => {
          if (seat.isBooked) return;

          isSelected
            ? setSelectedSeats(prev =>
                prev.filter(s => s !== seat.seatNumber)
              )
            : setSelectedSeats(prev => [...prev, seat.seatNumber]);
        }}
      >
        <div className="seat-top">
          {idx === 1 ? "🪟" : "🪑"} {/* window on right */}
        </div>

        <div className="seat-number">{seat.seatNumber}</div>
        <div className="seat-price">₹{seat.price}</div>
      </div>
    );
  })}
</div>
                    </div>
                  );
                })}
              </div>

              <div className="booking-panel premium">

  {/* SCROLLABLE CONTENT */}
  <div className="booking-scroll">

    <h3>Booking Summary</h3>

    <div className="summary-box">
      <p>
        {selectedSeats.length > 0
          ? `${selectedSeats.length} seat(s): ${selectedSeats.join(", ")}`
          : "No seats selected"}
      </p>

      <div className="price-box">
        <div>Subtotal: ₹{baseTotal}</div>

        {appliedCoupon && isCouponValid && (
          <div className="discount">
            Discount ({appliedCoupon.code}) - ₹{discount}
          </div>
        )}

        <h2>Total: ₹{finalTotal}</h2>
      </div>
    </div>

    {/* COUPONS */}
    <div className="coupon-section">
      <h4>Apply Coupon</h4>

      {coupons.map((c: any) => {
        const valid = baseTotal >= (c.minAmount || 0);

        return (
          <div
            key={c._id}
            className={`coupon-card 
              ${appliedCoupon?.code === c.code ? "active" : ""}
              ${!valid ? "disabled" : ""}
            `}
            onClick={() => valid && setAppliedCoupon(c)}
          >
            <b>{c.code}</b>
            <p>{c.description}</p>
            {!valid && <small>Min ₹{c.minAmount}</small>}
          </div>
        );
      })}
    </div>

  </div>

  {/* 🔥 BUTTON ALWAYS VISIBLE */}
 <div className="booking-footer">
  <button
    className="primary-btn premium"
    disabled={selectedSeats.length === 0}
    onClick={handlePayment}
  >
    Proceed to Book →
  </button>
</div>

</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
export default function FlightsPage() {

  return (

    <Suspense
    fallback={

  <div
    style={{

      height:"100vh",

      display:"flex",

      alignItems:"center",

      justifyContent:"center",

      fontSize:"20px",

      fontWeight:"bold",

      color:"#dc2626",

    }}
  >
    Loading Flights...
  </div>

}
    >

      <FlightsContent />

    </Suspense>

  );

}