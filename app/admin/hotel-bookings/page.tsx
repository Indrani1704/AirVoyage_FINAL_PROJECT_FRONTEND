"use client";

import {
  Box,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Chip,
  Button,
} from "@mui/material";

import {
  useEffect,
  useState,
} from "react";

const BASE =
  "https://airvoyage-final-project-backend-2.onrender.com/api";

export default function HotelBookingsPage() {

  const [bookings,setBookings] =
    useState<any[]>([]);

  const [loading,setLoading] =
    useState(true);

  const fetchBookings =
    async () => {

      try {

        const res =
          await fetch(
            `${BASE}/hotel-bookings`
          );

        const data =
          await res.json();

        console.log(data);

        if(data.success){

          setBookings(
            data.bookings || []
          );

        }

      } catch(err){

        console.log(err);

      } finally {

        setLoading(false);

      }

    };

  useEffect(()=>{

    fetchBookings();

  },[]);

  return(

    <Box
  component="div"
  sx={{
    p: 3,
  }}
>

     <Typography
  variant="h5"
  sx={{
    fontWeight: "bold",
    mb: 3,
  }}
>
        🏨 Hotel Bookings
      </Typography>

      <Paper
        sx={{
          borderRadius:4,
          overflow:"hidden",
          boxShadow:
            "0 10px 40px rgba(0,0,0,.08)",
        }}
      >

        <Table>

          <TableHead
            sx={{
              background:
                "linear-gradient(135deg,#8B0000,#C62828)",
            }}
          >

            <TableRow>

              <TableCell sx={{color:"#fff"}}>
                Guest
              </TableCell>

              <TableCell sx={{color:"#fff"}}>
                Hotel
              </TableCell>

              <TableCell sx={{color:"#fff"}}>
                Dates
              </TableCell>

              <TableCell sx={{color:"#fff"}}>
                Rooms
              </TableCell>

              <TableCell sx={{color:"#fff"}}>
                Amount
              </TableCell>

              <TableCell sx={{color:"#fff"}}>
                Status
              </TableCell>

              <TableCell sx={{color:"#fff"}}>
                Invoice
              </TableCell>

            </TableRow>

          </TableHead>

          <TableBody>

         {loading && (

  <TableRow>

    <TableCell
      colSpan={7}
      align="center"
      sx={{
        py:8,
      }}
    >

      <Box
        sx={{

          display:"flex",

          flexDirection:"column",

          alignItems:"center",

          justifyContent:"center",

        }}
      >

        {/* SPINNER */}

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

        {/* TITLE */}

        <Typography
          sx={{

            fontWeight:"bold",

            color:"#8B0000",

            fontSize:"22px",

            mb:1,

          }}
        >
          Loading Hotel Bookings...
        </Typography>

        {/* SUBTEXT */}

        <Typography
          sx={{
            color:"gray",
          }}
        >
          Fetching latest hotel reservations 
        </Typography>

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

      </Box>

    </TableCell>

  </TableRow>

)}

            {!loading &&
              bookings.length === 0 && (

              <TableRow>

                <TableCell
                  colSpan={7}
                  align="center"
                >
                  No hotel bookings found
                </TableCell>

              </TableRow>

            )}

            {bookings.map((b)=>(

              <TableRow
                key={b._id}
                hover
              >

                <TableCell>

                 <Typography
  sx={{
    fontWeight: "bold",
  }}
>
                    {b.fullName}
                  </Typography>

                 <Typography
  sx={{
    fontSize: 12,
    color: "gray",
  }}
>
                    {b.email}
                  </Typography>

                </TableCell>

                <TableCell>

                 <Typography
  sx={{
    fontWeight: "bold",
  }}
>
                    {b.hotelName}
                  </Typography>

                  <Typography
  sx={{
    fontSize: 12,
    color: "gray",
  }}
>
                    {b.location}
                  </Typography>

                </TableCell>

                <TableCell>

                  <Typography
  sx={{
    fontSize: 13,
  }}
>
                    {b.checkIn}
                  </Typography>

                 <Typography
  sx={{
    fontSize: 12,
    color: "gray",
  }}
>
                    to {b.checkOut}
                  </Typography>

                </TableCell>

                <TableCell>

                  {b.rooms} Room

                </TableCell>

                <TableCell>

                 <Typography
  sx={{
    fontWeight: "bold",
    color: "#8B0000",
  }}
>
                    ₹{b.totalAmount}
                  </Typography>

                </TableCell>

                <TableCell>

                  <Chip
                    label={
                      b.bookingStatus ||
                      "confirmed"
                    }
                    color="success"
                  />

                </TableCell>

                <TableCell>

                  <Button
                    variant="contained"
                    size="small"

                    onClick={()=>
                      window.open(
                        `https://airvoyage-final-project-backend-2.onrender.com/api/hotel-bookings/invoice/${b._id}`,
                        "_blank"
                      )
                    }
                  >
                    Download
                  </Button>

                </TableCell>

              </TableRow>

            ))}

          </TableBody>

        </Table>

      </Paper>

    </Box>

  );

}