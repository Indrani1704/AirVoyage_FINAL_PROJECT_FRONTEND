"use client";

import {
  Suspense,
  useEffect,
  useMemo,
  useState,
} from "react";

import { useSearchParams } from "next/navigation";

import {
  Dialog,
  DialogContent,
  TextField,
  Button,
  Typography,
  Box,
  MenuItem,
  Divider,
  Chip,
} from "@mui/material";
import toast from "react-hot-toast";
function CarsContent() {
  const params = useSearchParams();

  const location = params.get("location") || "";

  const urlStartDate = params.get("startDate") || "";

  const urlEndDate = params.get("endDate") || "";

  const [cars, setCars] = useState<any[]>([]);

  const [open, setOpen] = useState(false);

  const [selectedCar, setSelectedCar] = useState<any>(null);
  const [loading, setLoading] =
  useState(true);

  const [bookingForm, setBookingForm] = useState({
    fullName: "",
    email: "",
    phone: "",

    pickupLocation: location,

    dropLocation: location,

    startDate: urlStartDate,

    endDate: urlEndDate,

    pickupTime: "",

    passengers: 1,
  });

  const fallback =
    "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=1200&q=80";

  /* ================= IMAGE FIX ================= */

  const getImage = (img: string) => {
    if (!img) return fallback;

    if (img.startsWith("http")) return img;

    return `https://airvoyage-final-project-backend-2.onrender.com/${img.replace(/\\/g, "/")}`;
  };

  /* ================= INPUT STYLE ================= */

  const compactField = {
    "& .MuiOutlinedInput-root": {
      borderRadius: "12px",

      background: "#fff",

      fontSize: "13px",

      height: "52px",

      "& fieldset": {
        borderColor: "#E5E7EB",
      },

      "&:hover fieldset": {
        borderColor: "#8B0000",
      },

      "&.Mui-focused fieldset": {
        borderColor: "#8B0000",
      },
    },

    "& .MuiInputBase-input": {
      fontSize: "13px",
    },
  };

  /* ================= FETCH ================= */

  useEffect(() => {

  if (!location) return;

  setLoading(true);

  fetch(
    `https://airvoyage-final-project-backend-2.onrender.com/api/cars/search?location=${location}&startDate=${bookingForm.startDate}&endDate=${bookingForm.endDate}`,
  )

    .then((res) => res.json())

    .then((data: any) => {

      setCars(
        Array.isArray(data)
          ? data
          : []
      );

    })

    .catch((err: any) => {

      console.log(err);

      setCars([]);

    })

    .finally(() => {

      setLoading(false);

    });

}, [
  location,
  bookingForm.startDate,
  bookingForm.endDate,
]);

  /* ================= OPEN ================= */

  /* ================= OPEN ================= */

  const openBooking = (car: any) => {
    const savedUser = localStorage.getItem("user");

    if (!savedUser) {
      toast.error("Please login first to book cars");

      setTimeout(() => {
        window.location.href = "/";
      }, 1500);

      return;
    }

    try {
      const parsed = JSON.parse(savedUser);

      if (!parsed?._id) {
        toast.error("Please login first");

        setTimeout(() => {
          window.location.href = "/";
        }, 1500);

        return;
      }

      setSelectedCar(car);

      setOpen(true);
    } catch {
      toast.error("Please login first");

      setTimeout(() => {
        window.location.href = "/";
      }, 1500);
    }
  };

  /* ================= DAYS ================= */

  const totalDays = useMemo(() => {
    if (!bookingForm.startDate || !bookingForm.endDate) return 1;

    const start = new Date(bookingForm.startDate).getTime();

    const end = new Date(bookingForm.endDate).getTime();

    const diff = end - start;

    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));

    return days > 0 ? days : 1;
  }, [bookingForm.startDate, bookingForm.endDate]);

  /* ================= PRICE ================= */

  /* ================= PRICE ================= */

  const rawPrice = selectedCar?.pricePerDay || 0;

  /* FIX STRING / DECIMAL ISSUES */

  const pricePerDay = Math.round(Number(rawPrice));

  const subtotal = Math.round(pricePerDay * Number(totalDays));

  const gst = Math.round(subtotal * 0.12);

  const total = Math.round(subtotal + gst);

  console.log({
    RAW_PRICE: rawPrice,

    pricePerDay,

    totalDays,

    subtotal,

    gst,

    total,
  });
  /* ================= LOAD RAZORPAY ================= */

  const loadRazorpay = (): Promise<boolean> => {
    return new Promise<boolean>((resolve) => {
      if ((window as any).Razorpay) {
        resolve(true);

        return;
      }

      const script = document.createElement("script");

      script.src = "https://checkout.razorpay.com/v1/checkout.js";

      script.onload = () => resolve(true);

      script.onerror = () => resolve(false);

      document.body.appendChild(script);
    });
  };

  /* ================= PAYMENT ================= */

  const handlePayment = async () => {
    if (
      !bookingForm.fullName ||
      !bookingForm.email ||
      !bookingForm.phone ||
      !bookingForm.pickupTime
    ) {
      toast.error("Please fill all fields");

      return;
    }

    const loaded = await loadRazorpay();

    if (!loaded) {
      toast.error("Razorpay failed");

      return;
    }

    try {
      /* ================= FINAL PRICE ================= */

      const finalAmount = Math.round(Number(total));

      console.log("FINAL RUPEES:", finalAmount);

      /* ================= CREATE ORDER ================= */

      const res = await fetch(
        "https://airvoyage-final-project-backend-2.onrender.com/api/payments/create-order",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            amount: finalAmount,
          }),
        },
      );

      const data = await res.json();

      console.log("ORDER RESPONSE:", data);

      const order = data.order || data;

      /* ================= IMPORTANT FIX ================= */

      const razorpayAmount = Number(order.amount);

      console.log("RAZORPAY AMOUNT:", razorpayAmount);

      const options = {
        key: "rzp_test_Sb4mvfRgT35BRM",

        /* DO NOT MULTIPLY AGAIN */
        amount: razorpayAmount,

        currency: "INR",

        name: "AirVoyage",

        description: selectedCar?.name,

        order_id: order.id,

        prefill: {
          name: bookingForm.fullName,

          email: bookingForm.email,

          contact: bookingForm.phone,
        },

        theme: {
          color: "#8B0000",
        },

        handler: async function (response: any) {
          try {
            const user = JSON.parse(localStorage.getItem("user") || "{}");

            await fetch("https://airvoyage-final-project-backend-2.onrender.com/api/car-bookings/book", {
              method: "POST",

              headers: {
                "Content-Type": "application/json",
              },

              body: JSON.stringify({
                bookingType: "cab",

                userId: user?._id,

                passengerName: bookingForm.fullName,

                email: bookingForm.email,

                phone: bookingForm.phone,

                pickup: bookingForm.pickupLocation,

                drop: bookingForm.dropLocation,

                startDate: bookingForm.startDate,

                endDate: bookingForm.endDate,

                pickupTime: bookingForm.pickupTime,

                passengers: bookingForm.passengers,

                cabType: selectedCar?.name,

                driver: "Assigned Soon",

                totalAmount: finalAmount,

                paymentId: response.razorpay_payment_id,

                orderId: response.razorpay_order_id,

                paymentStatus: "paid",

                bookingStatus: "confirmed",
              }),
            });

            toast.success("Cab Booked Successfully");

            setOpen(false);

            setTimeout(() => {
              window.location.href = "/my-bookings";
            }, 1500);

            setOpen(false);
          } catch (err) {
            console.log(err);

            toast.error("Booking save failed");
          }
        },
      };

      const rzp = new (window as any).Razorpay(options);

      rzp.open();
    } catch (err) {
      console.log(err);

      toast.error("Payment Failed");
    }
  };

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
            "6px solid #8B0000",

          borderRadius:"50%",

          animation:
            "spin 1s linear infinite",

          marginBottom:"24px",

        }}
      />

      {/* TITLE */}

      <h2
        style={{

          color:"#8B0000",

          fontWeight:700,

          marginBottom:"8px",

        }}
      >
        Searching Cars...
      </h2>

      {/* SUBTEXT */}

      <p
        style={{
          color:"#777",
        }}
      >
        Finding premium rides & best prices 🚖
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
          src="https://images.unsplash.com/photo-1493238792000-8113da705763?w=1600&q=80"
          alt="cars"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />

        <div className="hero-overlay" />

        <div className="hero-text">
          <h1>Premium Cars in {location}</h1>

          <p>
            {bookingForm.startDate}
            {" → "}
            {bookingForm.endDate}
          </p>
        </div>
      </div>

      {/* EMPTY */}

      {cars.length === 0 && (
        <p
          style={{
            textAlign: "center",
            marginTop: 30,
          }}
        >
          No cars available
        </p>
      )}

      {/* LIST */}

      <div className="card-list">
        {cars.map((c) => (
          <div key={c._id} className="travel-card">
            <div
              style={{
                width: "100%",
                height: "220px",
                borderRadius: "16px",
                overflow: "hidden",
                background: "#f3f4f6",
              }}
            >
              <img
                src={getImage(c.image)}
                alt={c.name}
                onError={(e: any) => {
                  e.currentTarget.src = fallback;
                }}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            </div>

            <div className="card-content">
              <h3>{c.name}</h3>

              <p className="sub">{c.brand}</p>

              <div className="tags">
                <Chip label={`${c.seats || 4} Seats`} size="small" />

                <Chip label={c.fuelType || "Petrol"} size="small" />
              </div>
            </div>

            <div className="card-side">
              <h2>₹{c.pricePerDay}</h2>

              <p>/day</p>

              <button className="primary-btn" onClick={() => openBooking(c)}>
                Book Now
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ================= DIALOG ================= */}

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="md"
        fullWidth
      slotProps={{
  paper: {
    sx: {
      borderRadius: "22px",
      overflow: "hidden",
      maxWidth: "760px",
    },
  },
}}
      >
        <DialogContent
          sx={{
            p: 0,
          }}
        >
          {/* HEADER */}

          <Box
            sx={{
              background: "linear-gradient(135deg,#6d0000,#8B0000,#C89B3C)",

              color: "#fff",

              px: 3,

              py: 2,
            }}
          >
            <Typography
              sx={{
                fontSize: 24,
                fontWeight: 800,
              }}
            >
              Complete Cab Booking
            </Typography>

            <Typography
              sx={{
                fontSize: 13,
                opacity: 0.9,
              }}
            >
              {selectedCar?.name}
            </Typography>
          </Box>

          {/* BODY */}

          <Box
            component="div"
            sx={{
              p: 2,
            }}
          >
            <Box
              sx={{
                display: "grid",

                gridTemplateColumns: "1fr 1fr",

                gap: 1.5,
              }}
            >
              <TextField
                label="Full Name"
                size="small"
                value={bookingForm.fullName}
                onChange={(e) =>
                  setBookingForm({
                    ...bookingForm,
                    fullName: e.target.value,
                  })
                }
                sx={compactField}
              />

              <TextField
                label="Email"
                size="small"
                value={bookingForm.email}
                onChange={(e) =>
                  setBookingForm({
                    ...bookingForm,
                    email: e.target.value,
                  })
                }
                sx={compactField}
              />

              <TextField
                label="Phone"
                size="small"
                value={bookingForm.phone}
                onChange={(e) =>
                  setBookingForm({
                    ...bookingForm,
                    phone: e.target.value,
                  })
                }
                sx={compactField}
              />

              <TextField
                select
                label="Passengers"
                size="small"
                value={bookingForm.passengers}
                onChange={(e) =>
                  setBookingForm({
                    ...bookingForm,
                    passengers: Number(e.target.value),
                  })
                }
                sx={compactField}
              >
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <MenuItem key={n} value={n}>
                    {n} Passenger
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                label="Pickup"
                size="small"
                value={bookingForm.pickupLocation}
                onChange={(e) =>
                  setBookingForm({
                    ...bookingForm,
                    pickupLocation: e.target.value,
                  })
                }
                sx={compactField}
              />

              <TextField
                label="Drop"
                size="small"
                value={bookingForm.dropLocation}
                onChange={(e) =>
                  setBookingForm({
                    ...bookingForm,
                    dropLocation: e.target.value,
                  })
                }
                sx={compactField}
              />

              <TextField
                type="date"
                label="Pickup Date"
                size="small"
                value={bookingForm.startDate}
                onChange={(e) =>
                  setBookingForm({
                    ...bookingForm,
                    startDate: e.target.value,
                  })
                }
                slotProps={{
  inputLabel: {
    shrink: true,
  },
}}
sx={compactField}
              />

              <TextField
                type="date"
                label="Drop Date"
                size="small"
                value={bookingForm.endDate}
                onChange={(e) =>
                  setBookingForm({
                    ...bookingForm,
                    endDate: e.target.value,
                  })
                }
              slotProps={{
  inputLabel: {
    shrink: true,
  },
}}
sx={compactField}
              />

              <TextField
                label="Pickup Time"
                size="small"
                placeholder="Eg: 10:30 AM"
                value={bookingForm.pickupTime}
                onChange={(e) =>
                  setBookingForm({
                    ...bookingForm,
                    pickupTime: e.target.value,
                  })
                }
                sx={compactField}
              />
            </Box>

            {/* SUMMARY */}

            <Box
              component="div"
              sx={{
                mt: 2,

                background: "#fffdf8",

                border: "1px solid #f0d8a3",

                borderRadius: "14px",

                p: 1.5,
              }}
            >
              <Typography
                sx={{
                  fontWeight: 800,
                  color: "#8B0000",
                  mb: 1,
                }}
              >
                Booking Summary
              </Typography>

              <Box
                component="div"
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  mb: 1,
                }}
              >
                <Typography>
                  ₹{pricePerDay}
                  {" × "}
                  {totalDays} Day
                </Typography>

                <Typography>₹{subtotal}</Typography>
              </Box>

              <Box
                component="div"
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography>GST & Taxes</Typography>

                <Typography>₹{gst}</Typography>
              </Box>

              <Divider sx={{ my: 1 }} />

              <Box
                component="div"
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography
                  sx={{
                    fontWeight: 800,
                  }}
                >
                  Total
                </Typography>

                <Typography
                  sx={{
                    fontSize: 26,
                    fontWeight: 900,
                    color: "#8B0000",
                  }}
                >
                  ₹{total}
                </Typography>
              </Box>
            </Box>

            {/* BUTTONS */}

            <Box
              component="div"
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                gap: 1,
                mt: 2,
              }}
            >
              <Button onClick={() => setOpen(false)}>Cancel</Button>

              <Button
                variant="contained"
                onClick={handlePayment}
                sx={{
                  background: "linear-gradient(135deg,#7B0000,#C62828)",

                  borderRadius: "10px",

                  px: 3,

                  py: 1,

                  fontWeight: 800,

                  textTransform: "none",
                }}
              >
                Pay ₹{total}
              </Button>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
    </div>
  );
}
export default function CarsPage() {

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

      color:"#8B0000",

    }}
  >
    Loading Cars...
  </div>

}
    >

      <CarsContent />

    </Suspense>

  );

}