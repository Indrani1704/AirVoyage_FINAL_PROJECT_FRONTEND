"use client";

import {
  ThemeProvider,
  CssBaseline,
  Box,
} from "@mui/material";

import theme from "./theme";

import Sidebar from "./components/Sidebar";

import ProtectedRoute
from ".././components/routes/ProtectedRoute";

export default function Layout({
  children,
}: any) {

  return (

    <ProtectedRoute
      allowedRoles={["admin"]}
    >

      <ThemeProvider theme={theme}>

        <CssBaseline />

        {/* MAIN WRAPPER */}
        <Box
          sx={{
            display: "flex",
            width: "100vw",
            minHeight: "100vh",
          }}
        >

          {/* SIDEBAR */}
          <Sidebar />

          {/* CONTENT AREA */}
          <Box
            sx={{
              flexGrow: 1,
              width: "100%",
              maxWidth: "100%",
              p: 3,
              overflowX: "hidden",
            }}
          >

            {children}

          </Box>

        </Box>

      </ThemeProvider>

    </ProtectedRoute>
  );
}