"use client";
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: { main: "#8B0000" },
    secondary: { main: "#D4AF37" },
  },

  typography: {
    fontFamily: "var(--font-body)", 

    allVariants: {
      fontFamily: "var(--font-body)", 
    },

    h1: {
      fontFamily: "var(--font-heading)", 
      fontWeight: 700,
    },

    h2: {
      fontFamily: "var(--font-heading)",
      fontWeight: 700,
    },

    h3: {
      fontFamily: "var(--font-heading)",
    },
  },
});

export default theme;