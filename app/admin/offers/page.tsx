"use client";

import {
  Box,
  Typography,
  Grid,
  Card,
  TextField,
  Button,
  MenuItem,
  CircularProgress,
} from "@mui/material";

import { useState } from "react";

const BASE = "https://airvoyage-final-project-backend-2.onrender.com/api/coupon";

export default function Offers() {
  const [form, setForm] = useState({
    code: "",
    type: "percent",
    value: "",
    expiry: "",
    minAmount: "",
  });

  const [apply, setApply] = useState({
    code: "",
    total: "",
    result: null as any,
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // ================= FORM CHANGE =================
  const handleChange = (e: any) => {
    const { name, value } = e.target;

    setForm({
      ...form,
      [name]: name === "code" ? value.toUpperCase() : value,
    });
  };

  const handleApplyChange = (e: any) => {
    setApply({ ...apply, [e.target.name]: e.target.value });
  };

  // ================= CREATE COUPON =================
  const handleCreate = async () => {
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch(`${BASE}/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...form,
          value: Number(form.value),
          minAmount: Number(form.minAmount),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.msg || "Error creating coupon");
        setLoading(false);
        return;
      }

      setMessage("✅ Coupon created successfully");

      // reset form
      setForm({
        code: "",
        type: "percent",
        value: "",
        expiry: "",
        minAmount: "",
      });
    } catch (err) {
      setMessage("Server error");
    }

    setLoading(false);
  };

  // ================= APPLY COUPON =================
  const applyCoupon = async () => {
    const res = await fetch(`${BASE}/apply`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        code: apply.code,
        total: Number(apply.total),
      }),
    });

    const data = await res.json();
    setApply({ ...apply, result: data });
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg,#f8fafc,#eef2f7)",
        p: 3,
      }}
    >
      {/* HEADER */}
      <Box
  component="div"
  sx={{
    mb: 3,
  }}
>
       <Typography
  variant="h5"
  sx={{
    fontWeight: 700,
  }}
>
          Offers & Promotions
        </Typography>
       <Typography
  sx={{
    fontSize: 13,
    color: "gray",
  }}
>
          Create and test discount coupons
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* ================= CREATE ================= */}
        <Grid
  size={{
    xs: 12,
    md: 6,
  }}
>
          <Card
            sx={{
              borderRadius: 5,
              p: 3,
              backdropFilter: "blur(10px)",
              background: "rgba(255,255,255,0.75)",
              boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
            }}
          >
            <Typography
  sx={{
    fontWeight: 600,
    mb: 2,
  }}
>
              Create Coupon
            </Typography>

            <Grid container spacing={2}>
              <Grid size={12}>
                <TextField
                  fullWidth
                  label="Coupon Code"
                  name="code"
                  value={form.code}
                  onChange={handleChange}
                />
              </Grid>

              <Grid size={6}>
                <TextField
                  select
                  fullWidth
                  label="Type"
                  name="type"
                  value={form.type}
                  onChange={handleChange}
                >
                  <MenuItem value="percent">Percent (%)</MenuItem>
                  <MenuItem value="flat">Flat (₹)</MenuItem>
                </TextField>
              </Grid>

              <Grid size={6}>
                <TextField
                  fullWidth
                  label="Value"
                  name="value"
                  value={form.value}
                  onChange={handleChange}
                />
              </Grid>

             <TextField
  fullWidth
  type="date"
  name="expiry"
  value={form.expiry}
  onChange={handleChange}
  helperText="Coupon Expiry Date"
  sx={{
    "& .MuiOutlinedInput-root": {
      borderRadius: "14px",
      background: "#fff",
    },

    "& input": {
      padding: "14px",
    },

    "& fieldset": {
      borderColor: "#e2d4b0",
    },

    "&:hover fieldset": {
      borderColor: "#b8860b",
    },

    "&.Mui-focused fieldset": {
      borderColor: "#8B0000",
    },

    "& .MuiFormHelperText-root": {
      marginLeft: "4px",
      color: "#777",
      fontSize: "12px",
    },
  }}
/>

              <Grid size ={6}>
                <TextField
                  fullWidth
                  label="Min Amount"
                  name="minAmount"
                  value={form.minAmount}
                  onChange={handleChange}
                />
              </Grid>

              <Grid size ={12}>
                <Button
                  fullWidth
                  variant="contained"
                  onClick={handleCreate}
                  disabled={loading}
                  sx={{
                    borderRadius: 3,
                    py: 1.2,
                    background:
                      "linear-gradient(90deg,#8B0000,#D4AF37)",
                  }}
                >
                  {loading ? (
                    <CircularProgress size={22} color="inherit" />
                  ) : (
                    "Create Coupon"
                  )}
                </Button>
              </Grid>

              {message && (
                <Grid size ={12}>
                  <Typography
  sx={{
    fontSize: 13,
    color: message.includes("✅")
      ? "green"
      : "red",
  }}
>
                    {message}
                  </Typography>
                </Grid>
              )}
            </Grid>
          </Card>
        </Grid>

        {/* ================= APPLY ================= */}
        <Grid
  size={{
    xs: 12,
    md: 6,
  }}
>
          <Card
            sx={{
              borderRadius: 5,
              p: 3,
              backdropFilter: "blur(10px)",
              background: "rgba(255,255,255,0.75)",
              boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
            }}
          >
           <Typography
  sx={{
    fontWeight: 600,
    mb: 2,
  }}
>
              Apply Coupon (Test)
            </Typography>

            <Grid container spacing={2}>
              <Grid size ={6}>
                <TextField
                  fullWidth
                  label="Coupon Code"
                  name="code"
                  value={apply.code}
                  onChange={handleApplyChange}
                />
              </Grid>

              <Grid size ={6}>
                <TextField
                  fullWidth
                  label="Total Amount"
                  name="total"
                  value={apply.total}
                  onChange={handleApplyChange}
                />
              </Grid>

              <Grid size ={12}>
                <Button
                  fullWidth
                  variant="contained"
                  onClick={applyCoupon}
                  sx={{
                    borderRadius: 3,
                    py: 1.2,
                    background:
                      "linear-gradient(90deg,#8B0000,#D4AF37)",
                  }}
                >
                  Apply Coupon
                </Button>
              </Grid>

              {apply.result && (
                <Grid size ={12}>
                  <Box
                    sx={{
                      mt: 2,
                      p: 2,
                      borderRadius: 3,
                      background: "#f9fafb",
                      border: "1px solid #eee",
                    }}
                  >
                    <Typography
  sx={{
    fontWeight: 600,
  }}
>
                      Final Price: ₹{apply.result.final}
                    </Typography>
                  </Box>
                </Grid>
              )}
            </Grid>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}