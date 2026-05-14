// ================= frontend/admin/bookings/page.tsx =================

"use client";

import {
  Box,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  Chip,
  Paper,
} from "@mui/material";

import {
  useEffect,
  useState,
} from "react";

/* ================= API ================= */

const BASE =
  "https://airvoyage-final-project-backend-2.onrender.com/api";

  

const getBookings =
  async () => {

    const res =
      await fetch(
        `${BASE}/bookings`
      );

    return res.json();

  };

const cancelBooking =
  async (
    id: string,
    type: string
  ) => {

    const res =
      await fetch(
        `${BASE}/bookings/cancel/${id}`,
        {
          method:"PUT",

          headers:{
            "Content-Type":
              "application/json",
          },

          body:JSON.stringify({
            cancelledBy:type,
          }),
        }
      );

    return res.json();

  };

/* ================= PAGE ================= */

export default function Bookings() {

  const [
    bookings,
    setBookings,
  ] = useState<any[]>([]);

  const [
  loading,
  setLoading,
] = useState(false);

  /* ================= FETCH ================= */

  const fetchData =
  async () => {

    try {

      setLoading(true);

      const data =
        await getBookings();

      console.log(
        "BOOKINGS:",
        data
      );

      /* SAFE RESPONSE */

      if (
        Array.isArray(data)
      ) {

        setBookings(data);

      } else {

        setBookings(
          data.bookings || []
        );

      }

    } catch (err) {

      console.log(err);

    } finally {

      setLoading(false);

    }

  };

  useEffect(() => {

    fetchData();

  }, []);

  /* ================= CANCEL ================= */

  const handleCancel =
    async (
      id: string,
      type: string
    ) => {

      try {

        const res =
          await cancelBooking(
            id,
            type
          );

        alert(
          `Refund: ₹${res.refundAmount || 0}`
        );

        fetchData();

      } catch (err) {

        console.log(err);

      }

    };

  return (

   <Box sx={{ p: 3 }}>

      {/* HEADER */}
<Typography
  variant="h5"
  sx={{
    fontWeight: "bold",
    mb: 3,
  }}
>
  ✈ Booking Management

  {/* LOADING */}

{loading && (

  <Box
    sx={{

      minHeight:"60vh",

      display:"flex",

      flexDirection:"column",

      alignItems:"center",

      justifyContent:"center",

    }}
  >

    <Box
      sx={{

        width:"75px",

        height:"75px",

        border:
          "6px solid #f3f3f3",

        borderTop:
          "6px solid #C62828",

        borderRadius:"50%",

        animation:
          "spin 1s linear infinite",

        mb:3,

      }}
    />

    <Typography
      variant="h5"
      sx={{

        fontWeight:"bold",

        color:"#8B0000",

        mb:1,

      }}
    >
      Loading Bookings...
    </Typography>

    <Typography
      sx={{
        color:"gray",
      }}
    >
      Fetching latest booking data ✈
    </Typography>

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

  </Box>

)}
</Typography>
      {/* TABLE */}
{!loading && (
      <Paper
        sx={{
          borderRadius:4,
          overflow:"hidden",
          boxShadow:
            "0 10px 40px rgba(0,0,0,0.08)",
        }}
      >

        <Table>

          {/* HEAD */}

          <TableHead
            sx={{
              background:
                "linear-gradient(135deg,#8B0000,#C62828)",
            }}
          >

            <TableRow>

              {[
                "User",
                "Flight",
                "Seats",
                "Amount",
                "Payment",
                "Booking Status",
                "Action",
              ].map((head) => (

                <TableCell
                  key={head}
                  sx={{
                    color:"#fff",
                    fontWeight:700,
                  }}
                >
                  {head}
                </TableCell>

              ))}

            </TableRow>

          </TableHead>

          {/* BODY */}

          <TableBody>

            {bookings.length === 0 && (

              <TableRow>

                <TableCell
                  colSpan={7}
                  align="center"
                >
                  No bookings found
                </TableCell>

              </TableRow>

            )}

            {bookings.map((b) => (

              <TableRow
                key={b._id}
                hover
              >

                {/* USER */}

                <TableCell>

                  <Box>

                    <Typography
  sx={{
    fontWeight: "bold",
  }}
>
  {b.userId?.name || "User"}
</Typography>

                    <Typography
  sx={{
    fontSize: 12,
    color: "gray",
  }}
>
  {b.userId?.email}
</Typography>

                  </Box>

                </TableCell>

                {/* FLIGHT */}

                <TableCell>

                  {b.flightId ? (

                    <Box>

                     <Typography
  sx={{
    fontWeight: "bold",
  }}
>
  {b.flightId?.flightNumber || "Flight"}
</Typography>
<Typography
  sx={{
    fontSize: 12,
    color: "gray",
  }}
>
  {b.flightId?.from}
  {" → "}
  {b.flightId?.to}
</Typography>

                    </Box>

                  ) : (

                    "N/A"

                  )}

                </TableCell>

                {/* SEATS */}

                <TableCell>

                  {b.seats
                    ?.map(
                      (s:any) =>
                        s.seatNumber
                    )
                    .join(", ") || "N/A"}

                </TableCell>

                {/* AMOUNT */}

                <TableCell>

                  <Typography
  sx={{
    fontWeight: "bold",
    color: "#8B0000",
  }}
>
  ₹{b.totalAmount || 0}
</Typography>

                </TableCell>

                {/* PAYMENT */}

                <TableCell>

                  <Chip
                    label={
                      b.paymentStatus ||
                      "pending"
                    }

                    color={
                      b.paymentStatus ===
                      "paid"

                        ? "success"

                        : b.paymentStatus ===
                          "refunded"

                        ? "warning"

                        : "default"
                    }
                  />

                </TableCell>

                {/* STATUS */}

                <TableCell>

                  <Chip
                    label={
                      b.bookingStatus ||
                      "pending"
                    }

                    color={
                      b.bookingStatus ===
                      "confirmed"

                        ? "success"

                        : b.bookingStatus ===
                          "cancelled"

                        ? "error"

                        : "warning"
                    }
                  />

                </TableCell>

                {/* ACTION */}

                <TableCell>

                  <Box
                    sx={{
                      display:"flex",
                      alignItems:"center",
                      gap:1,
                    }}
                  >

                    <Button
                      variant="outlined"
                      size="small"

                      onClick={() =>
                        handleCancel(
                          b._id,
                          "user"
                        )
                      }
                    >
                      Cancel
                    </Button>

                    <Button
                      variant="contained"
                      size="small"
                      color="secondary"

                      onClick={() =>
                        handleCancel(
                          b._id,
                          "admin"
                        )
                      }
                    >
                      Refund
                    </Button>

                  </Box>

                </TableCell>

              </TableRow>

            ))}

          </TableBody>

        </Table>

      </Paper>
)}
    </Box>

  );

}