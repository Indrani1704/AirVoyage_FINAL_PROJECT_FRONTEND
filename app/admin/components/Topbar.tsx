"use client";

import { Grid, Paper, Typography } from "@mui/material";

export default function TopCards() {
  const data = [
    { label: "Flights", value: 45 },
    { label: "Bookings", value: 33 },
    { label: "Cancelled", value: 12 },
    { label: "Revenue", value: "₹13,105" },
  ];

  return (
    <Grid container spacing={2}>
      {data.map((d, i) => (
    <Grid
  size={3}
  key={i}
>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h5">{d.value}</Typography>
            <Typography color="gray">{d.label}</Typography>
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
}