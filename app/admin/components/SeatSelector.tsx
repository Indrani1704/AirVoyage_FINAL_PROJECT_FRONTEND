"use client";

import { Box, Typography } from "@mui/material";
import { useState } from "react";

export default function SeatSelector({ seats }: any) {
  const [selected, setSelected] = useState<string[]>([]);

  const toggleSeat = (seat: any) => {
    if (seat.isBooked) return;

    if (selected.includes(seat.seatNumber)) {
      setSelected(selected.filter((s) => s !== seat.seatNumber));
    } else {
      setSelected([...selected, seat.seatNumber]);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography
        variant="h5"
        sx={{
          mb: 2,
        }}
      >
        Select Your Seat
      </Typography>

      {/* LEGEND */}
      <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
        <Legend color="#ccc" label="Available" />
        <Legend color="#8B0000" label="Selected" />
        <Legend color="#333" label="Booked" />
      </Box>

      {/* SEATS GRID */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(6, 50px)",
          gap: 1,
          justifyContent: "center",
        }}
      >
        {seats.map((seat: any) => {
          const isSelected = selected.includes(seat.seatNumber);

          return (
            <Box
              key={seat.seatNumber}
              onClick={() => toggleSeat(seat)}
              sx={{
                width: 50,
                height: 50,
                borderRadius: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: seat.isBooked ? "not-allowed" : "pointer",
                background: seat.isBooked
                  ? "#333"
                  : isSelected
                    ? "#8B0000"
                    : "#e0e0e0",
                color: "#fff",
                transition: "0.3s",
                "&:hover": {
                  transform: "scale(1.1)",
                },
              }}
            >
              {seat.seatNumber}
            </Box>
          );
        })}
      </Box>

      {/* TOTAL */}
      <Typography
        sx={{
          mt: 3,
        }}
      >
        Selected Seats: {selected.join(", ")}
      </Typography>
    </Box>
  );
}

function Legend({ color, label }: any) {
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
      <Box sx={{ width: 20, height: 20, background: color }} />
      <Typography>{label}</Typography>
    </Box>
  );
}
