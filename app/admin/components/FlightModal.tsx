"use client";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  Box,
  Typography,
  Tabs,
  Tab,
  Grid,
  Chip,
  Divider,
} from "@mui/material";

import { useState } from "react";

/* ================= SEAT ================= */
const SeatBox = ({ seat, selected, onClick }: any) => {
  return (
    <Box
      onClick={onClick}
      sx={{
        width: 46,
        height: 46,
        borderRadius: "12px",
        cursor: "pointer",
        fontSize: 10,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",

        background: selected
          ? "#8B0000"
          : seat.class === "business"
            ? "linear-gradient(135deg,#D4AF37,#FFD700)"
            : "#f5f5f5",

        color: selected ? "#fff" : "#000",

        border:
          seat.class === "business" ? "1px solid #D4AF37" : "1px solid #ddd",

        transition: "0.2s",

        "&:hover": {
          transform: "scale(1.12)",
          boxShadow: "0 6px 18px rgba(0,0,0,0.2)",
        },
      }}
    >
      <b>{seat.seatNumber}</b>
      <span style={{ fontSize: 9 }}>₹{seat.price}</span>
    </Box>
  );
};

export default function FlightModal({ open, onClose, onSave }: any) {
  const [tab, setTab] = useState(0);

  const [form, setForm] = useState({
    flightNumber: "",
    airline: "",
    from: "",
    to: "",
    departureTime: "",
    arrivalTime: "",
  });

  const [seats, setSeats] = useState<any[]>([]);
  const [selectedSeat, setSelectedSeat] = useState<any>(null);
  const [price, setPrice] = useState(5000);

  const [food, setFood] = useState<any[]>([]);
  const [foodInput, setFoodInput] = useState("");

  const [drinks, setDrinks] = useState<any[]>([]);
  const [drinkInput, setDrinkInput] = useState("");

  /* ================= GENERATE SEATS ================= */
  const generateSeats = () => {
    const s: any[] = [];

    for (let row = 1; row <= 5; row++) {
      ["A", "B", "C", "D"].forEach((col) => {
        s.push({
          seatNumber: `${row}${col}`,
          class: "business",
          price: 8000,
        });
      });
    }

    for (let row = 6; row <= 25; row++) {
      ["A", "B", "C", "D", "E", "F"].forEach((col) => {
        s.push({
          seatNumber: `${row}${col}`,
          class: "economy",
          price: 5000,
        });
      });
    }

    setSeats(s);
  };

  /* ================= GROUP ================= */
  const groupRows = (type: string) => {
    const filtered = seats.filter((s) => s.class === type);

    return filtered.reduce((acc: any, seat: any) => {
      const row = seat.seatNumber.slice(0, -1);
      if (!acc[row]) acc[row] = [];
      acc[row].push(seat);
      return acc;
    }, {});
  };

  const businessRows = groupRows("business");
  const economyRows = groupRows("economy");

  /* ================= SELECT ================= */
  const selectSeat = (seat: any) => {
    setSelectedSeat(seat);
    setPrice(seat.price);
  };

  const updateSeatPrice = () => {
    const updated = seats.map((s) =>
      s.seatNumber === selectedSeat.seatNumber ? { ...s, price } : s,
    );

    setSeats(updated);
    setSelectedSeat(null);
  };

  /* ================= SAVE ================= */
  const handleSave = () => {
    onSave({
      ...form,
      seats,
      foodOptions: [
        ...food.map((f) => ({ name: f, price: 300 })),
        ...drinks.map((d) => ({ name: d, price: 150 })),
      ],
    });

    onClose();
  };

  /* ================= RENDER ================= */
  const renderRows = (rows: any, type: any) => {
    return Object.keys(rows).map((row) => (
      <Box
        key={row}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 2,
          mb: 1.5,
        }}
      >
        <Typography sx={{ width: 30, fontWeight: "bold" }}>{row}</Typography>

        {/* LEFT */}
        <Box sx={{ display: "flex", gap: 1 }}>
          {(type === "business"
            ? rows[row].slice(0, 2)
            : rows[row].slice(0, 3)
          ).map((seat: any) => (
            <SeatBox
              key={seat.seatNumber}
              seat={seat}
              selected={selectedSeat?.seatNumber === seat.seatNumber}
              onClick={() => selectSeat(seat)}
            />
          ))}
        </Box>

        {/* AISLE */}
        <Box sx={{ width: 50 }} />

        {/* RIGHT */}
        <Box sx={{ display: "flex", gap: 1 }}>
          {(type === "business" ? rows[row].slice(2) : rows[row].slice(3)).map(
            (seat: any) => (
              <SeatBox
                key={seat.seatNumber}
                seat={seat}
                selected={selectedSeat?.seatNumber === seat.seatNumber}
                onClick={() => selectSeat(seat)}
              />
            ),
          )}
        </Box>
      </Box>
    ));
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg">
      <DialogTitle sx={{ fontWeight: "bold" }}>✈ Add / Edit Flight</DialogTitle>

      <Tabs value={tab} onChange={(e, v) => setTab(v)} centered>
        <Tab label="Flight Info" />
        <Tab label="Seats & Pricing" />
        <Tab label="Food & Beverages" />
      </Tabs>

      <DialogContent>
        {/* ================= FLIGHT INFO ================= */}
        {tab === 0 && (
          <Grid container spacing={3}>
            <Grid
              size={{
                xs: 12,
                md: 6,
              }}
            >
              <TextField
                fullWidth
                label="Flight Number"
                onChange={(e) =>
                  setForm({ ...form, flightNumber: e.target.value })
                }
              />
            </Grid>

            <Grid
              size={{
                xs: 12,
                md: 6,
              }}
            >
              <TextField
                fullWidth
                label="Airline"
                onChange={(e) => setForm({ ...form, airline: e.target.value })}
              />
            </Grid>

            <Grid
              size={{
                xs: 12,
                md: 6,
              }}
            >
              <TextField
                fullWidth
                label="From"
                onChange={(e) => setForm({ ...form, from: e.target.value })}
              />
            </Grid>

            <Grid
              size={{
                xs: 12,
                md: 6,
              }}
            >
              <TextField
                fullWidth
                label="To"
                onChange={(e) => setForm({ ...form, to: e.target.value })}
              />
            </Grid>

            {/* ✅ CLEAN DATE UI */}
            <Grid
              size={{
                xs: 12,
                md: 6,
              }}
            >
              <Typography
                sx={{
                  fontSize: 13,
                  mb: 0.5,
                }}
              >
                Departure Time
              </Typography>
              <TextField
                fullWidth
                type="datetime-local"
                onChange={(e) =>
                  setForm({ ...form, departureTime: e.target.value })
                }
              />
            </Grid>

            <Grid
              size={{
                xs: 12,
                md: 6,
              }}
            >
              <Typography
                sx={{
                  fontSize: 13,
                  mb: 0.5,
                }}
              >
                Arrival Time
              </Typography>
              <TextField
                fullWidth
                type="datetime-local"
                onChange={(e) =>
                  setForm({ ...form, arrivalTime: e.target.value })
                }
              />
            </Grid>
          </Grid>
        )}

        {/* ================= SEATS ================= */}
        {tab === 1 && (
          <Box>
            <Button variant="contained" onClick={generateSeats}>
              Generate Seats
            </Button>
            <Typography
              sx={{
                mt: 3,
                fontWeight: "bold",
              }}
            >
              ✈ Aircraft Layout
            </Typography>

            <Typography
              sx={{
                mt: 2,
              }}
            >
              Business Class
            </Typography>
            {renderRows(businessRows, "business")}

            <Divider sx={{ my: 3 }} />

            <Typography>Economy Class</Typography>
            {renderRows(economyRows, "economy")}

            {selectedSeat && (
              <Box
                sx={{
                  mt: 3,
                }}
              >
                <Typography>
                  Edit Price for {selectedSeat.seatNumber}
                </Typography>

                <TextField
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(+e.target.value)}
                />

                <Button sx={{ mt: 1 }} onClick={updateSeatPrice}>
                  Update Price
                </Button>
              </Box>
            )}
          </Box>
        )}

        {/* ================= FOOD ================= */}
        {tab === 2 && (
          <Box>
            <Typography>Food</Typography>

            <Box
              sx={{
                display: "flex",
                gap: 2,
              }}
            >
              <TextField
                label="Food item"
                value={foodInput}
                onChange={(e) => setFoodInput(e.target.value)}
              />
              <Button
                onClick={() => {
                  if (!foodInput) return;
                  setFood([...food, foodInput]);
                  setFoodInput("");
                }}
              >
                Add
              </Button>
            </Box>

            {food.map((f, i) => (
              <Chip key={i} label={f} sx={{ mt: 1 }} />
            ))}

            <Typography
              sx={{
                mt: 3,
              }}
            >
              Beverages
            </Typography>

            <Box
              sx={{
                display: "flex",
                gap: 2,
              }}
            >
              <TextField
                label="Drink"
                value={drinkInput}
                onChange={(e) => setDrinkInput(e.target.value)}
              />
              <Button
                onClick={() => {
                  if (!drinkInput) return;
                  setDrinks([...drinks, drinkInput]);
                  setDrinkInput("");
                }}
              >
                Add
              </Button>
            </Box>

            {drinks.map((d, i) => (
              <Chip key={i} label={d} sx={{ mt: 1 }} />
            ))}
          </Box>
        )}

        {/* SAVE */}
        <Button
          fullWidth
          sx={{ mt: 3, background: "#8B0000", color: "#fff" }}
          onClick={handleSave}
        >
          Save Flight
        </Button>
      </DialogContent>
    </Dialog>
  );
}
