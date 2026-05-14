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
} from "@mui/material";

import {
  useEffect,
  useState,
} from "react";

const BASE =
  "https://airvoyage-final-project-backend-2.onrender.com/api";

export default function CarBookingsPage() {

  const [bookings,setBookings] =
    useState<any[]>([]);

  const [loading,setLoading] =
    useState(true);

  const fetchBookings =
    async () => {

      try {

       const res =
  await fetch(
    `${BASE}/car-bookings/admin-bookings`
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
<Box sx={{ p: 3 }}>

      <Typography
  component="div"
  variant="h5"
  sx={{
    fontWeight: "bold",
    mb: 3,
  }}
>
  🚖 Cab Bookings
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
                User
              </TableCell>

              <TableCell sx={{color:"#fff"}}>
                Pickup
              </TableCell>

              <TableCell sx={{color:"#fff"}}>
                Drop
              </TableCell>

              <TableCell sx={{color:"#fff"}}>
                Cab
              </TableCell>

              <TableCell sx={{color:"#fff"}}>
                Amount
              </TableCell>

              <TableCell sx={{color:"#fff"}}>
                Status
              </TableCell>

            </TableRow>

          </TableHead>

         <TableBody>

 {loading && (

  <TableRow>

    <TableCell
      colSpan={6}
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

            width:"70px",

            height:"70px",

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
          Loading Cab Bookings...
        </Typography>

        {/* SUBTEXT */}

        <Typography
          sx={{
            color:"gray",
          }}
        >
          Fetching latest cab booking records 
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
        colSpan={6}
        align="center"
      >
        No cab bookings found
      </TableCell>

    </TableRow>

  )}

  {!loading &&
    bookings.map((b)=>(

      <TableRow
        key={b._id}
        hover
      >

        <TableCell>

          <Typography
  component="div"
  sx={{
    fontWeight: "bold",
  }}
>
  {b.passengerName}
</Typography>

         <Typography
  component="div"
  sx={{
    fontSize: 12,
    color: "gray",
  }}
>
  {b.phone}
</Typography>

        </TableCell>

        <TableCell>
          {b.pickup}
        </TableCell>

        <TableCell>
          {b.drop}
        </TableCell>

        <TableCell>
<Typography
  component="div"
  sx={{
    fontWeight: "bold",
  }}
>
  {b.cabType}
</Typography>

         <Typography
  component="div"
  sx={{
    fontSize: 12,
    color: "gray",
  }}
>
  {b.driver}
</Typography>

        </TableCell>

        <TableCell>

          <Typography
  component="div"
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

      </TableRow>

    ))}

</TableBody>

        </Table>

      </Paper>

    </Box>

  );

}