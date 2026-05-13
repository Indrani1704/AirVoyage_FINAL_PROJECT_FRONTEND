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
  LocationOn,
  Star,
  Image as ImageIcon,
} from "@mui/icons-material";

export default function HotelsPage() {
  const [hotels, setHotels] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const [form, setForm] = useState<any>({
    name: "",
    location: "",
    pricePerNight: "",
    rating: "",
    maxGuests: "",
    bedType: "",
    amenities: "",
    image: null,
  });

  const fallback =
    "https://images.unsplash.com/photo-1566073771259-6a8506099945";

  /* ================= FETCH ================= */
  const fetchHotels = async () => {
    setLoading(true);
    try {
      const res = await fetch("https://airvoyage-final-project-backend-2.onrender.com/api/hotels");
      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      setHotels(Array.isArray(data) ? data : []);
    } catch (err) {
      console.log("FETCH ERROR:", err);
      setHotels([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHotels();
  }, []);

  /* ================= SAVE ================= */
  const handleSave = async () => {
    if (!form.name || !form.pricePerNight) {
      alert("Please fill required fields");
      return;
    }

    setSaving(true);

    try {
      const fd = new FormData();

      fd.append("name", form.name);
      fd.append("location", form.location);
      fd.append("pricePerNight", form.pricePerNight);
      fd.append("rating", form.rating);
      fd.append("maxGuests", form.maxGuests);
      fd.append("bedType", form.bedType);
      fd.append("amenities", form.amenities);

      if (form.image) fd.append("image", form.image);

      const url = editing
        ? `https://airvoyage-final-project-backend-2.onrender.com/api/hotels/${editing}`
        : "https://airvoyage-final-project-backend-2.onrender.com/api/hotels";

      const method = editing ? "PUT" : "POST";

      const res = await fetch(url, { method, body: fd });
      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      // ✅ instant UI update
      if (editing) {
        setHotels((prev) =>
          prev.map((h) => (h._id === editing ? data : h))
        );
      } else {
        setHotels((prev) => [data, ...prev]);
      }

      setForm({
        name: "",
        location: "",
        pricePerNight: "",
        rating: "",
        maxGuests: "",
        bedType: "",
        amenities: "",
        image: null,
      });

      setPreview(null);
      setEditing(null);
      setOpen(false);
    } catch (err) {
      console.log("SAVE ERROR:", err);
      alert("Save failed");
    } finally {
      setSaving(false);
    }
  };

  /* ================= DELETE ================= */
  const handleDelete = async (id: string) => {
    const confirmDelete = window.confirm("Delete this hotel?");
    if (!confirmDelete) return;

    try {
      const res = await fetch(
        `https://airvoyage-final-project-backend-2.onrender.com/api/hotels/${id}`,
        { method: "DELETE" }
      );

      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      setHotels((prev) => prev.filter((h) => h._id !== id));
    } catch (err) {
      console.log("DELETE ERROR:", err);
      alert("Delete failed");
    }
  };

  /* ================= EDIT ================= */
  const handleEdit = (h: any) => {
    setEditing(h._id);

    setForm({
      name: h.name,
      location: h.location,
      pricePerNight: h.pricePerNight,
      rating: h.rating,
      maxGuests: h.maxGuests,
      bedType: h.bedType,
      amenities: h.amenities?.join(",") || "",
      image: null,
    });

    setPreview(h.image || fallback);
    setOpen(true);
  };

  return (
    <Box
  component="div"
  sx={{
    p: 3,
  }}
>
      {/* HEADER */}
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 4 }}>
      <Typography
  variant="h5"
  sx={{
    fontWeight: "bold",
  }}
>
          🏨 Hotel Management
        </Typography>

        <Button
          variant="contained"
          onClick={() => {
            setEditing(null);
            setPreview(null);
            setOpen(true);
          }}
          sx={{
            background: "linear-gradient(135deg,#8B0000,#C62828)",
            borderRadius: 3,
            px: 3,
          }}
        >
          + Add Hotel
        </Button>
      </Box>

      {/* LOADING */}
      {loading && (
       <Box
  component="div"
  sx={{
    textAlign: "center",
  }}
>
          <CircularProgress />
        </Box>
      )}

      {/* GRID */}
      <Grid container spacing={3}>
        {hotels.map((h) => {
          const img = h.image || fallback;

          return (
          <Grid
  size={{
    xs: 12,
    md: 6,
    lg: 4,
  }}
  key={h._id}
>
              <Card sx={{ borderRadius: 4 }}>
                <img
                  src={img}
                  alt={h.name}
                  onError={(e) => (e.currentTarget.src = fallback)}
                  style={{
                    width: "100%",
                    height: 220,
                    objectFit: "cover",
                  }}
                />

                <CardContent>
                <Box
  component="div"
  sx={{
    display: "flex",
    justifyContent: "space-between",
  }}
>
                   <Typography
  sx={{
    fontWeight: 700,
  }}
>{h.name}</Typography>

                    <Box>
                      <IconButton onClick={() => handleEdit(h)}>
                        <Edit />
                      </IconButton>
                      <IconButton onClick={() => handleDelete(h._id)}>
                        <Delete />
                      </IconButton>
                    </Box>
                  </Box>

                  <Typography color="gray">
                    <LocationOn fontSize="small" /> {h.location}
                  </Typography>

                  <Chip
                    icon={<Star />}
                    label={`${h.rating || 4} Rating`}
                    sx={{ mt: 1 }}
                  />

                  <Typography
  sx={{
    mt: 1,
  }}
>
                    👥 {h.maxGuests || "N/A"} Guests
                  </Typography>

                  <Chip label={h.bedType || "Bed"} sx={{ mt: 1 }} />

                  <Box
  component="div"
  sx={{
    mt: 1,
  }}
>
                    {h.amenities?.map((a: string, i: number) => (
                      <Chip key={i} label={a} size="small" sx={{ mr: 1 }} />
                    ))}
                  </Box>

                  <Typography
  sx={{
    mt: 2,
    fontWeight: "bold",
    color: "#8B0000",
  }}
>
                    ₹{h.pricePerNight}/night
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {/* MODAL */}
    <Modal
  open={open}
  onClose={() => setOpen(false)}
  sx={{
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backdropFilter: "blur(8px)",
    backgroundColor: "rgba(0,0,0,0.5)",
    p: 2,
  }}
>
<Box
  sx={{
    width: "100%",
    maxWidth: 460,
    bgcolor: "#fff",
    borderRadius: "26px",
    p: 3,
    boxShadow: "0 20px 60px rgba(0,0,0,.25)",
    border: "1px solid #f0d9a7",

    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 1.5,

    overflow: "hidden",
  }}
>
  {/* TITLE */}

 <Typography
  variant="h6"
  sx={{
    fontWeight: 700,
    textAlign: "center",
    gridColumn: "1/3",
    color: "#8B0000",
    mb: 1,
  }}
  >
    {editing ? "Edit Hotel" : "Add Hotel"}
  </Typography>

  {/* INPUTS */}

  <TextField
    size="small"
    label="Hotel Name"
    value={form.name}
    onChange={(e) =>
      setForm({ ...form, name: e.target.value })
    }
  />

  <TextField
    size="small"
    label="Location"
    value={form.location}
    onChange={(e) =>
      setForm({ ...form, location: e.target.value })
    }
  />

  <TextField
    size="small"
    label="Price"
    type="number"
    value={form.pricePerNight}
    onChange={(e) =>
      setForm({
        ...form,
        pricePerNight: e.target.value,
      })
    }
  />

  <TextField
    size="small"
    label="Rating"
    type="number"
    value={form.rating}
    onChange={(e) =>
      setForm({
        ...form,
        rating: e.target.value,
      })
    }
  />

  <TextField
    size="small"
    label="Guests"
    type="number"
    value={form.maxGuests}
    onChange={(e) =>
      setForm({
        ...form,
        maxGuests: e.target.value,
      })
    }
  />

  <TextField
    size="small"
    label="Bed Type"
    value={form.bedType}
    onChange={(e) =>
      setForm({
        ...form,
        bedType: e.target.value,
      })
    }
  />

  {/* AMENITIES */}

  <TextField
    size="small"
    label="Amenities"
    value={form.amenities}
    onChange={(e) =>
      setForm({
        ...form,
        amenities: e.target.value,
      })
    }
    sx={{
      gridColumn: "1/3",
    }}
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
    Upload Hotel Image

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
    onClick={handleSave}
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
    ) : editing ? (
      "Update Hotel"
    ) : (
      "Save Hotel"
    )}
  </Button>
</Box>
</Modal>
    </Box>
  );
}