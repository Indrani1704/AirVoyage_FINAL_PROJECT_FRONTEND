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
  Dialog,
  DialogTitle,
  DialogContent,
  Avatar,
  CircularProgress,
  Paper,
} from "@mui/material";

import {
  Block,
  CheckCircle,
  Flight,
} from "@mui/icons-material";

import { useEffect, useState } from "react";

/* ================= API ================= */

const BASE =
  "https://airvoyage-final-project-backend-2.onrender.com/api";

const getUsers = async () => {

  const res = await fetch(
    `${BASE}/users`
  );

  return res.json();

};

const toggleBlock = async (
  id:string
) => {

  const res = await fetch(
    `${BASE}/users/block/${id}`,
    {
      method:"PUT",
    }
  );

  return res.json();

};

const getUserBookings = async (
  id:string
) => {

  const res = await fetch(
    `${BASE}/users/${id}/bookings`
  );

  return res.json();

};

/* ================= PAGE ================= */

export default function UsersPage(){

  const [users,setUsers] =
    useState<any[]>([]);

  const [loading,setLoading] =
    useState(true);

  const [open,setOpen] =
    useState(false);

  const [bookings,setBookings] =
    useState<any[]>([]);

  /* ================= FETCH ================= */

  const fetchUsers = async () => {

    try {

      setLoading(true);

      const data =
        await getUsers();

      setUsers(
        Array.isArray(data)
          ? data
          : []
      );

    } catch (err) {

      console.log(err);

      setUsers([]);

    } finally {

      setLoading(false);

    }

  };

  useEffect(()=>{

    fetchUsers();

  },[]);

  /* ================= BLOCK ================= */

  const handleBlock = async (
    id:string
  ) => {

    await toggleBlock(id);

    fetchUsers();

  };

  /* ================= HISTORY ================= */

  const handleHistory = async (
    id:string
  ) => {

    const data =
      await getUserBookings(id);

    setBookings(
      Array.isArray(data)
        ? data
        : []
    );

    setOpen(true);

  };

  return(

    <Box
      sx={{
        minHeight:"100vh",
        background:
          "linear-gradient(to bottom,#faf7f2,#f4ede1)",
        p:4,
      }}
    >

      {/* HEADER */}

      <Box
  component="div"
  sx={{
    mb: 4,
  }}
>

       <Typography
  variant="h4"
  sx={{
    fontWeight: 800,
    color: "#8B0000",
  }}
>
          User Management
        </Typography>

        <Typography
  sx={{
    color: "gray",
    mt: 1,
  }}
>
          Manage users, bookings
          and account status
        </Typography>

      </Box>

      {/* TABLE */}

      <Paper
        elevation={0}
        sx={{
          borderRadius:"26px",
          overflow:"hidden",
          border:"1px solid #f0ddb0",
          boxShadow:
            "0 15px 45px rgba(0,0,0,.06)",
        }}
      >

        <Table>

          {/* HEAD */}

          <TableHead>

            <TableRow
              sx={{
                background:
                  "linear-gradient(135deg,#7f0000,#b30000)",
              }}
            >

              <TableCell
                sx={{
                  color:"#fff",
                  fontWeight:700,
                }}
              >
                User
              </TableCell>

              <TableCell
                sx={{
                  color:"#fff",
                  fontWeight:700,
                }}
              >
                Email
              </TableCell>

              <TableCell
                sx={{
                  color:"#fff",
                  fontWeight:700,
                }}
              >
                Total Bookings
              </TableCell>

              <TableCell
                sx={{
                  color:"#fff",
                  fontWeight:700,
                }}
              >
                Booking Status
              </TableCell>

              <TableCell
                sx={{
                  color:"#fff",
                  fontWeight:700,
                }}
              >
                Account
              </TableCell>

              <TableCell
                sx={{
                  color:"#fff",
                  fontWeight:700,
                }}
              >
                Actions
              </TableCell>

            </TableRow>

          </TableHead>

          {/* BODY */}

          <TableBody>

            {loading && (

              <TableRow>

                <TableCell
                  colSpan={6}
                  align="center"
                >

                  <CircularProgress />

                </TableCell>

              </TableRow>

            )}

            {!loading &&
              users.map((u)=>(

              <TableRow
                key={u._id}
                hover
                sx={{
                  transition:".2s",
                  "&:hover":{
                    background:"#fffaf1",
                  },
                }}
              >

                {/* USER */}

                <TableCell>

                 <Box
  component="div"
  sx={{
    display: "flex",
    alignItems: "center",
    gap: 2,
  }}
>

                   

                    <Box>

                    <Typography
  sx={{
    fontWeight: 700,
  }}
>
                        {u.name}
                      </Typography>

                     <Typography
  sx={{
    fontSize: 13,
    color: "gray",
  }}
>
                        {u.country ||
                          "India"}
                      </Typography>

                    </Box>

                  </Box>

                </TableCell>

                {/* EMAIL */}

                <TableCell>
                  {u.email}
                </TableCell>

                {/* BOOKINGS */}

                <TableCell>

                  <Chip
                    icon={<Flight />}
                    label={
                      u.totalBookings || 0
                    }
                    sx={{
                      background:"#fff4d2",
                      color:"#8B0000",
                      fontWeight:700,
                    }}
                  />

                </TableCell>

                {/* BOOKING STATUS */}

                <TableCell>

                  <Chip
                    label={
                      u.latestBookingStatus ||
                      "No Booking"
                    }
                    color={
                      u.latestBookingStatus ===
                      "confirmed"
                        ? "success"
                        : "default"
                    }
                    sx={{
                      fontWeight:700,
                    }}
                  />

                </TableCell>

                {/* USER STATUS */}

                <TableCell>

                  <Chip
                    icon={
                      u.isBlocked
                        ? <Block />
                        : <CheckCircle />
                    }
                    label={
                      u.isBlocked
                        ? "Blocked"
                        : "Active"
                    }
                    color={
                      u.isBlocked
                        ? "error"
                        : "success"
                    }
                    sx={{
                      fontWeight:700,
                    }}
                  />

                </TableCell>

                {/* ACTIONS */}

                <TableCell>

                 <Box
  component="div"
  sx={{
    display: "flex",
    gap: 1,
  }}
>

                    <Button
                      variant="outlined"
                      color={
                        u.isBlocked
                          ? "success"
                          : "error"
                      }
                      onClick={() =>
                        handleBlock(u._id)
                      }
                      sx={{
                        borderRadius:3,
                        textTransform:"none",
                        fontWeight:700,
                      }}
                    >
                      {u.isBlocked
                        ? "Unblock"
                        : "Block"}
                    </Button>

                    <Button
                      variant="contained"
                      onClick={() =>
                        handleHistory(u._id)
                      }
                      sx={{
                        borderRadius:3,
                        textTransform:"none",
                        fontWeight:700,
                        background:
                          "linear-gradient(135deg,#8B0000,#C62828)",
                      }}
                    >
                      History
                    </Button>

                  </Box>

                </TableCell>

              </TableRow>

            ))}

          </TableBody>

        </Table>

      </Paper>

      {/* ================= HISTORY DIALOG ================= */}

      <Dialog
        open={open}
        onClose={() =>
          setOpen(false)
        }
        fullWidth
        maxWidth="md"
      >

        <DialogTitle
          sx={{
            background:
              "linear-gradient(135deg,#8B0000,#b71c1c)",
            color:"#fff",
            fontWeight:700,
          }}
        >
          Booking History
        </DialogTitle>

        <DialogContent
          sx={{
            background:"#faf7f2",
            p:3,
          }}
        >

          {bookings.length === 0 && (

            <Typography
  sx={{
    textAlign: "center",
    color: "gray",
  }}
>
              No bookings found
            </Typography>

          )}

          {bookings.map((b)=>(

            <Box
              key={b._id}
              sx={{
                p:3,
                mb:2,
                borderRadius:"20px",
                background:"#fff",
                border:
                  "1px solid #f0ddb0",
                boxShadow:
                  "0 6px 20px rgba(0,0,0,.05)",
              }}
            >

              <Typography
  sx={{
    fontWeight: 800,
    color: "#8B0000",
    mb: 1,
  }}
>
                ✈ Flight:
                {" "}
                {b.flightId?.flightNumber ||
                  "N/A"}
              </Typography>

              <Typography
  sx={{
    mb: 1,
  }}
>
                Route:
                {" "}
                {b.flightId?.from}
                {" → "}
                {b.flightId?.to}
              </Typography>

              <Typography
  sx={{
    mb: 1,
  }}
>
                Seats:
                {" "}
                {
                  b.seats
                    ?.map(
                      (s:any)=>
                        s.seatNumber
                    )
                    .join(", ")
                }
              </Typography>

              <Typography
  sx={{
    mb: 1,
  }}
>
                Amount:
                {" "}
                ₹{b.totalAmount}
              </Typography>

              <Chip
                label={
                  b.bookingStatus
                }
                color={
                  b.bookingStatus ===
                  "confirmed"
                    ? "success"
                    : "warning"
                }
              />

            </Box>

          ))}

        </DialogContent>

      </Dialog>

    </Box>

  );

}