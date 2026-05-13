"use client";

import {
  ThemeProvider,
  CssBaseline,
  Box,
} from "@mui/material";

// import theme from "./theme";

import Sidebar from "../components/AuthMiniSidebar";

import ProtectedRoute
from ".././components/routes/ProtectedRoute";

export default function SuperAdminLayout({
  children,
}: any) {

  return (

    <ProtectedRoute
      allowedRoles={["superadmin"]}
    >

      {/* <ThemeProvider theme={theme}> */}

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

          {/* CONTENT */}
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
{/* 
      </ThemeProvider> */}

    </ProtectedRoute>
  );
}