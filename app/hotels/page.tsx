"use client";

import {
  Suspense,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useSearchParams } from "next/navigation";
import toast from "react-hot-toast";

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

function HotelsContent() {
  const params = useSearchParams();

  const location =
    params.get("location") || "";

  const urlCheckIn =
    params.get("checkIn") || "";

  const urlCheckOut =
    params.get("checkOut") || "";

  const guests =
    params.get("guests") || "1";

  /* ================= STATES ================= */

  const [hotels, setHotels] =
    useState<any[]>([]);

  const [open, setOpen] =
    useState(false);

  const [selectedHotel,
    setSelectedHotel] =
    useState<any>(null);

    const [loading, setLoading] =
  useState(true);

  const [bookingForm,
    setBookingForm] =
    useState({

      fullName:"",
      email:"",
      phone:"",

      rooms:1,

      guests:Number(guests),

      requests:"",

      checkIn:
        urlCheckIn || "",

      checkOut:
        urlCheckOut || "",

      checkInTime:
        "12:00 PM",

      checkOutTime:
        "11:00 AM",

    });

  /* ================= FALLBACK IMAGE ================= */

  const fallback =
    "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&q=80";

  /* ================= IMAGE FIX ================= */

  const getImage =
    (img:string) => {

      if(!img)
        return fallback;

      if(img.startsWith("http"))
        return img;

      return `https://airvoyage-final-project-backend-2.onrender.com/${img.replace(/\\/g,"/")}`;

    };

  /* ================= INPUT STYLE ================= */

  const compactField = {

    "& .MuiOutlinedInput-root": {

      borderRadius:"12px",

      background:"#fff",

      fontSize:"13px",

      height:"44px",

      "& fieldset":{
        borderColor:"#E5E7EB",
      },

      "&:hover fieldset":{
        borderColor:"#8B0000",
      },

      "&.Mui-focused fieldset":{
        borderColor:"#8B0000",
        borderWidth:"1.2px",
      },

    },

    "& .MuiInputBase-input":{

      padding:"11px 12px",

      fontSize:"13px",

    },

    "& .MuiInputLabel-root":{

      fontSize:"12px",

      top:"-3px",

    },

    "& .MuiInputLabel-shrink":{

      top:0,

    },

  };

  /* ================= FETCH HOTELS ================= */

useEffect(()=>{

  if(!location) return;

  setLoading(true);

  fetch(
    `https://airvoyage-final-project-backend-2.onrender.com/api/hotels/search?location=${location}&checkIn=${bookingForm.checkIn}&checkOut=${bookingForm.checkOut}&guests=${bookingForm.guests}`
  )

    .then(res=>res.json())

    .then(data=>{

      setHotels(
        Array.isArray(data)
          ? data
          : []
      );

    })

    .catch(err=>{

      console.log(err);

      setHotels([]);

    })

    .finally(()=>{

      setLoading(false);

    });

},[
  location,
  bookingForm.checkIn,
  bookingForm.checkOut,
  bookingForm.guests
]);

  /* ================= LOAD RAZORPAY ================= */

  const loadRazorpay =
    () => {

      return new Promise((resolve)=>{

        if((window as any).Razorpay){

          resolve(true);

          return;

        }

        const script =
          document.createElement(
            "script"
          );

        script.src =
          "https://checkout.razorpay.com/v1/checkout.js";

        script.onload =
          ()=>resolve(true);

        script.onerror =
          ()=>resolve(false);

        document.body.appendChild(
          script
        );

      });

    };

  /* ================= OPEN ================= */

 /* ================= OPEN ================= */

const openBooking =
  (hotel:any) => {

    const savedUser =
      localStorage.getItem(
        "user"
      );

    if(!savedUser){

      toast.error(
        "Please login first to book hotels"
      );

      setTimeout(()=>{

        window.location.href =
          "/";

      },1500);

      return;

    }

    try{

      const parsed =
        JSON.parse(savedUser);

      if(!parsed?._id){

        toast.error(
          "Please login first"
        );

        setTimeout(()=>{

          window.location.href =
            "/";

        },1500);

        return;

      }

      setSelectedHotel(hotel);

      setOpen(true);

    }catch{

      toast.error(
        "Please login first"
      );

      setTimeout(()=>{

        window.location.href =
          "/";

      },1500);

    }

  };

  /* ================= NIGHTS ================= */

  const nights =
    useMemo(()=>{

      if(
        !bookingForm.checkIn ||
        !bookingForm.checkOut
      ) return 1;

      const start =
        new Date(
          bookingForm.checkIn
        ).getTime();

      const end =
        new Date(
          bookingForm.checkOut
        ).getTime();

      const diff =
        end - start;

      const total =
        Math.ceil(
          diff /
          (1000*60*60*24)
        );

      return total > 0
        ? total
        : 1;

    },[
      bookingForm.checkIn,
      bookingForm.checkOut
    ]);

  /* ================= PRICE ================= */

  const roomPrice =
    Number(
      selectedHotel?.pricePerNight || 0
    );

  const subtotal =
    roomPrice *
    bookingForm.rooms *
    nights;

  const gst =
    Math.round(
      subtotal * 0.12
    );

  const total =
    subtotal + gst;

  /* ================= PAYMENT ================= */

  const handlePayment = async () => {

  if (
    !bookingForm.fullName ||
    !bookingForm.email ||
    !bookingForm.phone
  ) {

    toast.error(
  "Please fill all fields"
);

    return;
  }

  const loaded =
    await loadRazorpay();

  if (!loaded) {

    toast.error(
  "Razorpay failed to load"
);

    return;
  }

  try {

    /* =================
       CONVERT TO PAISE
    ================= */

    const amount =
      Math.round(total * 100);

    console.log(
      "FRONTEND AMOUNT:",
      amount
    );

    const res =
      await fetch(
        "https://airvoyage-final-project-backend-2.onrender.com/api/payments/create-order",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            amount,
          }),

        }
      );

    const data =
      await res.json();

    const order =
      data.order;

    const options = {

      key:
        "rzp_test_Sb4mvfRgT35BRM",

      amount:
        order.amount,

      currency:
        "INR",

      name:
        "AirVoyage",

      description:
        selectedHotel?.name,

      order_id:
        order.id,

      prefill: {

        name:
          bookingForm.fullName,

        email:
          bookingForm.email,

        contact:
          bookingForm.phone,

      },

      theme: {
        color:"#8B0000",
      },

    handler:
  async function (response:any) {

    try {

      const user =
        JSON.parse(
          localStorage.getItem("user") || "{}"
        );

      await fetch(
        "https://airvoyage-final-project-backend-2.onrender.com/api/hotel-bookings/create",
        {
          method:"POST",

          headers:{
            "Content-Type":
              "application/json",
          },

          body:JSON.stringify({

            bookingType:"hotel",

            userId:user._id,

            hotelId:
              selectedHotel._id,

            hotelName:
              selectedHotel.name,

            location:
              selectedHotel.location,

            fullName:
              bookingForm.fullName,

            email:
              bookingForm.email,

            phone:
              bookingForm.phone,

            rooms:
              bookingForm.rooms,

            guests:
              bookingForm.guests,

            checkIn:
              bookingForm.checkIn,

            checkOut:
              bookingForm.checkOut,

            checkInTime:
              bookingForm.checkInTime,

            checkOutTime:
              bookingForm.checkOutTime,

            requests:
              bookingForm.requests,

            totalAmount:
              total,

            paymentId:
              response.razorpay_payment_id,

            orderId:
              response.razorpay_order_id,

          }),

        }
      );

     toast.success(
  "Hotel Booking Successful"
);

setOpen(false);

setTimeout(()=>{

  window.location.href =
    "/my-bookings";

},1500);

      setOpen(false);

    } catch (err) {

      console.log(err);

     toast.error(
  "Booking save failed"
);

    }

  },

    };

    const rzp =
      new (window as any)
      .Razorpay(options);

    rzp.open();

  } catch (err) {

    console.log(err);
toast.error(
  "Payment Failed"
);

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
          "linear-gradient(135deg,#fff8f0,#ffffff)",

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
        Searching Hotels...
      </h2>

      {/* SUBTEXT */}

      <p
        style={{
          color:"#777",
        }}
      >
        Finding luxury stays & best prices 🏨
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
  return(

    <div className="page-container">

      {/* HERO */}

      <div className="page-hero">

        <img
          src="/images/hotel.png"
          alt="hotel"
          style={{
            width:"100%",
            height:"100%",
            objectFit:"cover",
          }}
        />

        <div className="hero-overlay"/>

        <div className="hero-text">

          <h1>
            Luxury Hotels in {location}
          </h1>

          <p>
            {bookingForm.checkIn || "Select Date"}
            {" → "}
            {bookingForm.checkOut || "Select Date"}
            {" • "}
            {guests} Guests
          </p>

        </div>

      </div>

      {/* HOTELS */}

      <div className="card-list">

        {hotels.map((h)=>(

          <div
            key={h._id}
            className="travel-card"
          >

            {/* IMAGE */}

            <div
              style={{
                width:"100%",
                height:"220px",
                borderRadius:"16px",
                overflow:"hidden",
                background:"#f3f4f6",
              }}
            >

              <img
                src={
                  h.image
                    ? h.image.startsWith("http")
                      ? h.image
                      : `https://airvoyage-final-project-backend-2.onrender.com/${h.image.replace(
                          /\\/g,
                          "/"
                        )}`
                    : fallback
                }

                alt={h.name}

                onError={(e:any)=>{

                  e.currentTarget.src =
                    fallback;

                }}

                style={{
                  width:"100%",
                  height:"100%",
                  objectFit:"cover",
                  display:"block",
                }}
              />

            </div>

            {/* CONTENT */}

            <div className="card-content">

              <h3>{h.name}</h3>

              <p className="sub">
                {h.location}
              </p>

              <div className="tags">

                <Chip
                  label={`${h.maxGuests} Guests`}
                  size="small"
                />

                <Chip
                  label={h.bedType}
                  size="small"
                />

              </div>

            </div>

            {/* SIDE */}

            <div className="card-side">

              <h2>
                ₹{h.pricePerNight}
              </h2>

              <p>/night</p>

              <button
                className="primary-btn"
                onClick={()=>
                  openBooking(h)
                }
              >
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
      borderRadius: "24px",

      overflow: "hidden",

      width: "100%",

      maxWidth: "760px",

      background:
        "#ffffff",

      boxShadow:
        "0 20px 60px rgba(0,0,0,0.18)",

      m: 1.5,
    },
  },
}}
>
  <DialogContent
    sx={{
      p: 0,

      overflowX: "hidden",

      overflowY: "auto",

      "&::-webkit-scrollbar": {
        width: "6px",
      },

      "&::-webkit-scrollbar-thumb": {
        background: "#d1d5db",
        borderRadius: "20px",
      },
    }}
  >

    {/* HEADER */}

    <Box
      sx={{
        background:
          "linear-gradient(135deg,#5c0000,#8B0000,#C89B3C)",

        color: "#fff",

        px: 3,

        py: 2.2,

        position: "sticky",

        top: 0,

        zIndex: 10,
      }}
    >
      <Typography
        sx={{
          fontSize: 24,
          fontWeight: 800,
          letterSpacing: ".3px",
        }}
      >
        Complete Your Booking
      </Typography>

      <Typography
        sx={{
          fontSize: 13,
          opacity: 0.92,
          mt: 0.5,
        }}
      >
        {selectedHotel?.name}
      </Typography>
    </Box>

    {/* BODY */}

    <Box
      sx={{
        p: 2.2,
      }}
    >

      {/* FORM GRID */}

      <Box
        sx={{
          display: "grid",

          gridTemplateColumns: {
            xs: "1fr",
            sm: "1fr 1fr",
          },

          gap: 1.4,
        }}
      >

        {/* NAME */}

        <TextField
          label="Full Name"
          size="small"
          fullWidth
          value={bookingForm.fullName}
          onChange={(e) =>
            setBookingForm({
              ...bookingForm,
              fullName:
                e.target.value,
            })
          }
          sx={compactField}
        />

        {/* EMAIL */}

        <TextField
          label="Email Address"
          size="small"
          fullWidth
          value={bookingForm.email}
          onChange={(e) =>
            setBookingForm({
              ...bookingForm,
              email:
                e.target.value,
            })
          }
          sx={compactField}
        />

        {/* PHONE */}

        <TextField
          label="Phone Number"
          size="small"
          fullWidth
          value={bookingForm.phone}
          onChange={(e) =>
            setBookingForm({
              ...bookingForm,
              phone:
                e.target.value,
            })
          }
          sx={compactField}
        />

        {/* GUESTS */}

        <TextField
          select
          label="Guests"
          size="small"
          fullWidth
          value={bookingForm.guests}
          onChange={(e) =>
            setBookingForm({
              ...bookingForm,
              guests: Number(
                e.target.value
              ),
            })
          }
          sx={compactField}
        >
          {[1,2,3,4,5,6].map((n)=>(
            <MenuItem
              key={n}
              value={n}
            >
              {n} Guests
            </MenuItem>
          ))}
        </TextField>

        {/* CHECK IN */}

        <TextField
          label="Check In"
          type="date"
          size="small"
          fullWidth
          value={bookingForm.checkIn}
          onChange={(e)=>
            setBookingForm({
              ...bookingForm,
              checkIn:
                e.target.value,
            })
          }
         slotProps={{
  inputLabel: {
    shrink: true,
  },
}}
sx={{
  ...compactField,

  "& .MuiOutlinedInput-root": {
    height: "50px",
  },

  "& input": {
    padding:
      "16px 12px 10px !important",
  },
}}
        />

        {/* CHECK OUT */}

        <TextField
          label="Check Out"
          type="date"
          size="small"
          fullWidth
          value={bookingForm.checkOut}
          onChange={(e)=>
            setBookingForm({
              ...bookingForm,
              checkOut:
                e.target.value,
            })
          }
         slotProps={{
  inputLabel: {
    shrink: true,
  },
}}
sx={{
  ...compactField,

  "& .MuiOutlinedInput-root": {
    height: "50px",
  },

  "& input": {
    padding:
      "16px 12px 10px !important",
  },
}}
        />

        {/* CHECK IN TIME */}

        <TextField
          select
          label="Check In Time"
          size="small"
          fullWidth
          value={
            bookingForm.checkInTime
          }
          onChange={(e)=>
            setBookingForm({
              ...bookingForm,
              checkInTime:
                e.target.value,
            })
          }
          sx={compactField}
        >
          {[
            "10:00 AM",
            "11:00 AM",
            "12:00 PM",
          ].map((t)=>(
            <MenuItem
              key={t}
              value={t}
            >
              {t}
            </MenuItem>
          ))}
        </TextField>

        {/* CHECK OUT TIME */}

        <TextField
          select
          label="Check Out Time"
          size="small"
          fullWidth
          value={
            bookingForm.checkOutTime
          }
          onChange={(e)=>
            setBookingForm({
              ...bookingForm,
              checkOutTime:
                e.target.value,
            })
          }
          sx={compactField}
        >
          {[
            "09:00 AM",
            "10:00 AM",
            "11:00 AM",
          ].map((t)=>(
            <MenuItem
              key={t}
              value={t}
            >
              {t}
            </MenuItem>
          ))}
        </TextField>

        {/* ROOMS */}

        <TextField
          select
          label="Rooms"
          size="small"
          fullWidth
          value={
            bookingForm.rooms
          }
          onChange={(e)=>
            setBookingForm({
              ...bookingForm,
              rooms:Number(
                e.target.value
              ),
            })
          }
          sx={compactField}
        >
          {[1,2,3,4].map((n)=>(
            <MenuItem
              key={n}
              value={n}
            >
              {n} Room
            </MenuItem>
          ))}
        </TextField>

        {/* REQUEST */}

        <TextField
          label="Special Requests"
          size="small"
          fullWidth
          value={
            bookingForm.requests
          }
          onChange={(e)=>
            setBookingForm({
              ...bookingForm,
              requests:
                e.target.value,
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
          background:
            "linear-gradient(180deg,#fffdf8,#fff9ef)",

          border:
            "1px solid #f1d8a1",

          borderRadius:
            "18px",

          p: 2,
        }}
      >

        <Typography
          sx={{
            fontWeight: 800,
            color: "#8B0000",
            fontSize: 16,
            mb: 1.4,
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
         <Typography
  sx={{
    fontSize: 14,
  }}
>
            Room Charges
          </Typography>

          <Typography
  sx={{
    fontWeight: 600,
    fontSize: 14,
  }}
>
            ₹{subtotal}
          </Typography>
        </Box>

       <Box
  component="div"
  sx={{
    display: "flex",
    justifyContent: "space-between",
    mb: 1,
  }}
>
         <Typography
  sx={{
    fontSize: 14,
  }}
>
            GST & Taxes
          </Typography>

          <Typography
  sx={{
    fontWeight: 600,
    fontSize: 14,
  }}
>
            ₹{gst}
          </Typography>
        </Box>

        <Divider
          sx={{
            my: 1.2,
          }}
        />

       <Box
  component="div"
  sx={{
    display: "flex",
    justifyContent: "space-between",
    mb: 1,
  }}
>
          <Typography
            sx={{
              fontWeight: 800,
              fontSize: 18,
            }}
          >
            Total Amount
          </Typography>

          <Typography
            sx={{
              fontWeight: 900,
              fontSize: 30,
              color: "#8B0000",
            }}
          >
            ₹{total}
          </Typography>
        </Box>

      </Box>

      {/* FOOTER BUTTONS */}

     <Box
  component="div"
  sx={{
    mt: 2.2,
    display: "flex",
    justifyContent: "flex-end",
    gap: 1.2,
  }}
>

        <Button
          onClick={() =>
            setOpen(false)
          }
          sx={{
            textTransform:
              "none",

            color:"#555",

            fontWeight:700,

            borderRadius:"10px",

            px:2.4,

            height:"42px",
          }}
        >
          Cancel
        </Button>

        <Button
          variant="contained"
          onClick={handlePayment}
          sx={{
            background:
              "linear-gradient(135deg,#7B0000,#C62828)",

            borderRadius:"12px",

            px:3.5,

            height:"44px",

            textTransform:"none",

            fontWeight:800,

            fontSize:"14px",

            boxShadow:
              "0 8px 20px rgba(139,0,0,.25)",

            "&:hover":{

              background:
                "linear-gradient(135deg,#650000,#b71c1c)",

              boxShadow:
                "0 10px 24px rgba(139,0,0,.3)",
            },
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
export default function HotelsPage() {

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
    Loading Hotels...
  </div>

}
    >

      <HotelsContent />

    </Suspense>

  );

}