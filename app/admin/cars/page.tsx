"use client";

import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  IconButton,
  Chip,
  Modal,
  TextField,
  CircularProgress,
} from "@mui/material";

import {
  Delete,
  Edit,
  DirectionsCar,
  Image as ImageIcon,
} from "@mui/icons-material";

export default function CarsPage() {
  const [cars, setCars] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const [form, setForm] = useState<any>({
    name: "",
    brand: "",
    fuelType: "",
    seats: "",
    pricePerDay: "",
    image: null,
  });

  const fallback =
    "https://images.unsplash.com/photo-1552519507-da3b142c6e3d";

  /* ================= FETCH ================= */
  const fetchCars = async () => {
    setLoading(true);
    try {
      const res = await fetch("https://airvoyage-final-project-backend-2.onrender.com/api/cars");
      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      setCars(Array.isArray(data) ? data : []);
    } catch (err) {
      console.log("FETCH ERROR:", err);
      setCars([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCars();
  }, []);

  /* ================= CREATE ================= */
  const handleCreate = async () => {
    if (!form.name || !form.pricePerDay) {
      alert("Please fill required fields");
      return;
    }

    setSaving(true);

    try {
   const fd = new FormData();

fd.append("name", form.name || "");
fd.append("brand", form.brand || "");
fd.append("location", form.location || ""); // ✅ FIX
fd.append("fuelType", form.fuelType || "");
fd.append("seats", String(form.seats || ""));
fd.append("pricePerDay", String(form.pricePerDay || ""));

if (form.image) fd.append("image", form.image);

     

      const res = await fetch("https://airvoyage-final-project-backend-2.onrender.com/api/cars", {
        method: "POST",
        body: fd,
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      // ✅ instant UI update
      setCars((prev) => [data, ...prev]);

      setForm({
        name: "",
        brand: "",
        fuelType: "",
        seats: "",
        pricePerDay: "",
        image: null,
      });

      setPreview(null);
      setOpen(false);
    } catch (err) {
      console.log("CREATE ERROR:", err);
      alert("Create failed");
    } finally {
      setSaving(false);
    }
  };

  /* ================= DELETE ================= */
  const handleDelete = async (id: string) => {
    const confirmDelete = window.confirm("Delete this car?");
    if (!confirmDelete) return;

    try {
      const res = await fetch(
        `https://airvoyage-final-project-backend-2.onrender.com/api/cars/${id}`,
        { method: "DELETE" }
      );

      const data = await res.json();
      console.log("DELETE:", data);

      if (!res.ok) throw new Error(data.message);

      // ✅ instant UI update (IMPORTANT FIX)
      setCars((prev) => prev.filter((c) => c._id !== id));
    } catch (err) {
      console.log("DELETE ERROR:", err);
      alert("Delete failed");
    }
  };

  return (
    <Box
  sx={{
    p: 3,
  }}
>
      {/* HEADER */}
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 4 }}>
        <Typography
  component="div"
  variant="h5"
  sx={{
    fontWeight: "bold",
  }}
>
  Car Management
</Typography>

        <Button
          variant="contained"
          onClick={() => setOpen(true)}
          sx={{
            background: "linear-gradient(135deg,#8B0000,#C62828)",
            borderRadius: 3,
            px: 3,
            fontWeight: 600,
          }}
        >
          + Add Car
        </Button>
      </Box>

      {/* LOADING */}
      {loading && (
       <Box
  sx={{
    textAlign: "center",
  }}
>
  <CircularProgress />
</Box>
      )}

      {/* EMPTY */}
      {!loading && cars.length === 0 && (
    <Typography
  component="div"
  sx={{
    textAlign: "center",
    color: "gray",
  }}
>
  No cars found. Add your first car
</Typography>
      )}

      {/* GRID */}
      <Grid container spacing={3}>
        {cars.map((c) => {
          const img =
            c.image && c.image.startsWith("http")
              ? `${c.image}?v=${Date.now()}`
              : fallback;

          return (
            <Grid
  size={{
    xs: 12,
    md: 6,
    lg: 4,
  }}
  key={c._id}
>
              <Card
                sx={{
                  borderRadius: 4,
                  overflow: "hidden",
                  transition: "0.3s",
                  "&:hover": {
                    transform: "translateY(-6px)",
                    boxShadow: "0 20px 50px rgba(0,0,0,0.2)",
                  },
                }}
              >
                <img
                  src={img}
                  alt={c.name}
                  onError={(e) => (e.currentTarget.src = fallback)}
                  style={{
                    width: "100%",
                    height: 200,
                    objectFit: "cover",
                  }}
                />

                <CardContent>
                  <Box
  sx={{
    display: "flex",
    justifyContent: "space-between",
  }}
>
                 <Typography
  component="div"
  sx={{
    fontWeight: 700,
  }}
>
  {c.name}
</Typography>
                    <Box>
                      <IconButton>
                        <Edit />
                      </IconButton>

                      <IconButton onClick={() => handleDelete(c._id)}>
                        <Delete />
                      </IconButton>
                    </Box>
                  </Box>

                  <Typography color="gray">
                    {c.brand || "Unknown Brand"}
                  </Typography>
<Box
  sx={{
    mt: 2,
    display: "flex",
    gap: 1,
  }}
>
                    <Chip
                      label={c.seats ? `${c.seats} seats` : "N/A"}
                    />
                  </Box>

                 <Box
  sx={{
    mt: 2,
  }}
>
                    <Typography
  component="div"
  sx={{
    fontSize: 13,
  }}
>
  Price
</Typography>
                    <Typography
  component="div"
  sx={{
    fontWeight: "bold",
    color: "#8B0000",
  }}
>
  ₹{c.pricePerDay || 0}/day
</Typography>
                    <Typography color="gray">
  📍 {c.location || "Unknown Location"}
</Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {/* MODAL (UNCHANGED UI) */}
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backdropFilter: "blur(6px)",
          backgroundColor: "rgba(0,0,0,0.4)",
        }}
      >
       <Box
  sx={{
    width: "100%",
    maxWidth: 460,

    bgcolor: "#fff",

    borderRadius: "28px",

    p: 3,

    border: "1px solid #f0d8a5",

    boxShadow:
      "0 25px 70px rgba(0,0,0,.25)",

    display: "grid",

    gridTemplateColumns: "1fr 1fr",

    gap: 1.5,

    overflow: "hidden",
  }}
>
  {/* TITLE */}

  <Typography
  component="div"
  variant="h6"
  sx={{
    fontWeight: 700,
    textAlign: "center",
    gridColumn: "1/3",
    color: "#8B0000",
    mb: 1,
  }}
>
  
    Add New Car
  </Typography>

  {/* INPUTS */}

  <TextField
    size="small"
    label="Car Name"
    value={form.name}
    onChange={(e) =>
      setForm({
        ...form,
        name: e.target.value,
      })
    }
  />

  <TextField
    size="small"
    label="Brand"
    value={form.brand}
    onChange={(e) =>
      setForm({
        ...form,
        brand: e.target.value,
      })
    }
  />

  <TextField
    size="small"
    label="Location"
    value={form.location}
    onChange={(e) =>
      setForm({
        ...form,
        location: e.target.value,
      })
    }
  />

  <TextField
    size="small"
    label="Fuel Type"
    value={form.fuelType}
    onChange={(e) =>
      setForm({
        ...form,
        fuelType: e.target.value,
      })
    }
  />

  <TextField
    size="small"
    label="Seats"
    type="number"
    value={form.seats}
    onChange={(e) =>
      setForm({
        ...form,
        seats: e.target.value,
      })
    }
  />

  <TextField
    size="small"
    label="Price / Day"
    type="number"
    value={form.pricePerDay}
    onChange={(e) =>
      setForm({
        ...form,
        pricePerDay: e.target.value,
      })
    }
  />

  {/* UPLOAD */}

  <Button
    component="label"
    startIcon={<ImageIcon />}
    sx={{
      gridColumn: "1/3",

      border: "1px solid #8B0000",

      color: "#8B0000",

      borderRadius: "14px",

      py: 1,

      fontWeight: 700,

      textTransform: "none",
    }}
  >
    Upload Car Image

    <input
      hidden
      type="file"
      onChange={(e: any) => {
        const file = e.target.files[0];

        setForm({
          ...form,
          image: file,
        });

        setPreview(
          URL.createObjectURL(file)
        );
      }}
    />
  </Button>

  {/* IMAGE */}

  {preview && (
    <img
      src={preview}
      alt=""
      style={{
        width: "100%",
        height: "140px",
        objectFit: "cover",
        borderRadius: "16px",
        gridColumn: "1/3",
      }}
    />
  )}

  {/* BUTTON */}

  <Button
    fullWidth
    onClick={handleCreate}
    disabled={saving}
    sx={{
      gridColumn: "1/3",

      background:
        "linear-gradient(135deg,#8B0000,#C62828)",

      color: "#fff",

      py: 1.2,

      borderRadius: "16px",

      fontWeight: 700,

      textTransform: "none",

      mt: 1,

      "&:hover": {
        background:
          "linear-gradient(135deg,#6d0000,#a30000)",
      },
    }}
  >
    {saving ? (
      <CircularProgress
        size={20}
        sx={{ color: "#fff" }}
      />
    ) : (
      "Save Car"
    )}
  </Button>
</Box>
      </Modal>
    </Box>
  );
}