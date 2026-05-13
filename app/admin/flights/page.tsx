"use client";

import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  Chip,
  IconButton,
} from "@mui/material";

import { Delete, Edit, AirlineSeatReclineNormal } from "@mui/icons-material";

import FlightModal from "../components/FlightModal";
import {
  getFlights,
  createFlight,
  updateFlight,
  deleteFlight,
} from "../../lib/api";

/* ================= PAGE ================= */
export default function FlightsPage() {
  const [flights, setFlights] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [editData, setEditData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  /* ================= FETCH ================= */
  const fetchFlights = async () => {
    try {
      setLoading(true);

      const data = await getFlights();

      console.log("FLIGHTS API RESPONSE:", data);

      if (Array.isArray(data)) {
        setFlights(data);
      } else if (Array.isArray(data.flights)) {
        setFlights(data.flights);
      } else if (Array.isArray(data.data)) {
        setFlights(data.data);
      } else {
        setFlights([]);
      }
    } catch (err: any) {
      console.error("FETCH ERROR:", err.message);

      if (err.message?.includes("401")) {
        alert("Session expired. Please login again.");
        window.location.href = "/login";
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFlights();
  }, []);

  /* ================= SAVE ================= */
  const handleSave = async (data: any) => {
    try {
      if (editData) {
        await updateFlight(editData._id, data);
      } else {
        await createFlight(data);
      }

      await fetchFlights(); // 🔥 refresh
      setEditData(null);
      setOpen(false);
    } catch (err: any) {
      console.error("SAVE ERROR:", err.message);

      if (err.message?.includes("401")) {
        alert("Unauthorized. Please login again.");
      }
    }
  };

  /* ================= DELETE ================= */
  const handleDelete = async (id: string) => {
    try {
      await deleteFlight(id);
      fetchFlights();
    } catch (err: any) {
      console.error("DELETE ERROR:", err.message);
    }
  };

  return (
    <Box
      component="div"
      sx={{
        p: 3,
      }}
    >
      {/* HEADER */}
      <Box
        component="div"
        sx={{
          display: "flex",
          justifyContent: "space-between",
          mb: 3,
        }}
      >
        <Typography
          variant="h5"
          sx={{
            fontWeight: "bold",
          }}
        >
          ✈ Flight Management
        </Typography>

        <Button
          variant="contained"
          onClick={() => {
            setEditData(null);
            setOpen(true);
          }}
          sx={{
            background: "linear-gradient(135deg,#8B0000,#C62828)",
            fontWeight: "bold",
            borderRadius: 2,
            px: 3,
          }}
        >
          + Add Flight
        </Button>
      </Box>

      {/* LOADING */}
      {loading && (
        <Typography
          sx={{
            textAlign: "center",
          }}
        >
          Loading flights...
        </Typography>
      )}

      {/* EMPTY */}
      {!loading && flights.length === 0 && (
        <Typography
          sx={{
            textAlign: "center",
            color: "gray",
          }}
        >
          No flights found. Add your first flight ✈
        </Typography>
      )}

      {/* FLIGHTS GRID */}
      <Grid container spacing={3}>
        {flights.map((f) => (
          <Grid
            size={{
              xs: 12,
              md: 6,
              lg: 4,
            }}
            key={f._id}
          >
            <Card
              sx={{
                borderRadius: 3,
                boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
                transition: "0.3s",
                "&:hover": {
                  transform: "translateY(-5px)",
                  boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
                },
              }}
            >
              <CardContent>
                {/* HEADER */}
                <Box
                  component="div"
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <Typography
                    sx={{
                      fontWeight: "bold",
                    }}
                  >
                    {f.flightNumber || "N/A"}
                  </Typography>

                  <Box>
                    <IconButton
                      onClick={() => {
                        setEditData(f);
                        setOpen(true);
                      }}
                    >
                      <Edit />
                    </IconButton>

                    <IconButton onClick={() => handleDelete(f._id)}>
                      <Delete />
                    </IconButton>
                  </Box>
                </Box>

                {/* ROUTE */}
                <Typography
                  sx={{
                    mt: 1,
                  }}
                >
                  {f.from || "-"} → {f.to || "-"}
                </Typography>

                <Typography variant="body2" color="gray">
                  {f.departureTime
                    ? new Date(f.departureTime).toLocaleString()
                    : "No schedule"}
                </Typography>

                {/* SEATS */}
                <Box
                  component="div"
                  sx={{
                    mt: 2,
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: 13,
                    }}
                  >
                    Seats
                  </Typography>

                  <Box
                    component="div"
                    sx={{
                      display: "flex",
                      gap: 1,
                      mt: 1,
                    }}
                  >
                    <Chip
                      icon={<AirlineSeatReclineNormal />}
                      label={`Business: ${
                        f.seats?.filter((s: any) => s.class === "business")
                          .length || 0
                      }`}
                      sx={{
                        background: "#D4AF37",
                        color: "#000",
                        fontWeight: 600,
                      }}
                    />

                    <Chip
                      label={`Economy: ${
                        f.seats?.filter((s: any) => s.class === "economy")
                          .length || 0
                      }`}
                    />
                  </Box>
                </Box>

                {/* FOOD (FIXED KEY) */}
                <Box
                  component="div"
                  sx={{
                    mt: 2,
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: 13,
                    }}
                  >
                    Food
                  </Typography>

                  <Box
                    component="div"
                    sx={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 1,
                      mt: 1,
                    }}
                  >
                    {f.foodOptions?.slice(0, 3).map((item: any, i: number) => (
                      <Chip key={i} label={item.name} />
                    ))}
                  </Box>
                </Box>

                {/* PRICE */}
                <Box
                  component="div"
                  sx={{
                    mt: 2,
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: 13,
                    }}
                  >
                    Starting Price
                  </Typography>

                  <Typography
                    sx={{
                      fontWeight: "bold",
                      color: "#8B0000",
                    }}
                  >
                    ₹{f.seats?.[0]?.price || f.basePrice || 0}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* MODAL */}
      <FlightModal
        open={open}
        onClose={() => {
          setOpen(false);
          setEditData(null);
        }}
        onSave={handleSave}
        editData={editData}
      />
    </Box>
  );
}
