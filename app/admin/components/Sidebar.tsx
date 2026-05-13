"use client";

import {
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Box,
  Typography,
} from "@mui/material";

import {
  Dashboard,
  Flight,
  Book,
  People,
  BarChart,
  LocalOffer,
  DirectionsCar,
  Hotel,
} from "@mui/icons-material";

import { useRouter, usePathname } from "next/navigation";

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();

  const menu = [
    { name: "Dashboard", path: "/admin", icon: <Dashboard /> },
    { name: "Flights", path: "/admin/flights", icon: <Flight /> },
    { name: "Bookings", path: "/admin/bookings", icon: <Book /> },
    { name: "Users", path: "/admin/users", icon: <People /> },
    { name: "Analytics", path: "/admin/analytics", icon: <BarChart /> },
    { name: "Offers", path: "/admin/offers", icon: <LocalOffer /> },
     { name: "Cars", path: "/admin/cars", icon: <DirectionsCar /> },
  { name: "Hotels", path: "/admin/hotels", icon: <Hotel /> },
    {
    name: "Hotel Bookings",
    path: "/admin/hotel-bookings",
    icon: <Hotel />,
  },
   {
    name: "Cab Bookings",
    path: "/admin/car-bookings",
    icon: <DirectionsCar />,
  },
  ];

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 240,
        "& .MuiDrawer-paper": {
          width: 240,
          background: "linear-gradient(180deg,#8B0000,#4B0000)",
          color: "#fff",
          borderRight: "none",
        },
      }}
    >
      {/* LOGO */}
      <Box sx={{ p: 3 }}>
       <Typography
  variant="h6"
  sx={{
    fontWeight: 700,
    color: "#D4AF37",
  }}
>
          ✈ Airlines
        </Typography>
      </Box>

      {/* MENU */}
      <List sx={{ px: 1 }}>
        {menu.map((item) => {
          const active = pathname === item.path;

          return (
            <ListItemButton
              key={item.name}
              onClick={() => router.push(item.path)}
              sx={{
                borderRadius: 2,
                mb: 1,
                px: 2,
                py: 1.2,
                transition: "0.3s",

                background: active
                  ? "linear-gradient(90deg,#D4AF37,#b8962e)"
                  : "transparent",

                color: active ? "#000" : "#fff",

                "&:hover": {
                  background:
                    "linear-gradient(90deg,#D4AF37,#b8962e)",
                  color: "#000",
                },
              }}
            >
              <ListItemIcon
                sx={{
                  color: active ? "#000" : "#fff",
                  minWidth: 35,
                }}
              >
                {item.icon}
              </ListItemIcon>

             <ListItemText
  primary={
    <Typography
      sx={{
        fontSize: 14,
        fontWeight: active ? 600 : 400,
      }}
    >
      {item.name}
    </Typography>
  }
/>
            </ListItemButton>
          );
        })}
      </List>
    </Drawer>
  );
}