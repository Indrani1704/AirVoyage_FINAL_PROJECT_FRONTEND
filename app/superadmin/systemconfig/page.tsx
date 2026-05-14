"use client";

import "../../globals.css";

// ICONS
import SettingsIcon from "@mui/icons-material/Settings";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import FlightIcon from "@mui/icons-material/Flight";
import SaveIcon from "@mui/icons-material/Save";
import {
  useEffect,
  useState,
} from "react";
export default function SystemConfig() {

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {

    const timer =
      setTimeout(() => {

        setLoading(false);

      }, 1500);

    return () =>
      clearTimeout(timer);

  }, []);

  if (loading) {

  return (

    <div
      style={{

        height:"100vh",

        display:"flex",

        flexDirection:"column",

        alignItems:"center",

        justifyContent:"center",

        background:
          "linear-gradient(135deg,#fff5f5,#ffffff)",

      }}
    >

      {/* SPINNER */}

      <div
        style={{

          width:"80px",

          height:"80px",

          border:
            "6px solid #f3f3f3",

          borderTop:
            "6px solid #8B0000",

          borderRadius:"50%",

          animation:
            "spin 1s linear infinite",

          marginBottom:"24px",

        }}
      />

      {/* TITLE */}

      <h2
        style={{

          color:"#8B0000",

          fontWeight:700,

          marginBottom:"8px",

        }}
      >
        Loading System Config...
      </h2>

      {/* SUBTEXT */}

      <p
        style={{
          color:"#777",
        }}
      >
        Fetching pricing & airline settings ⚙
      </p>

      {/* ANIMATION */}

      <style jsx>{`

        @keyframes spin {

          0% {
            transform: rotate(0deg);
          }

          100% {
            transform: rotate(360deg);
          }

        }

      `}</style>

    </div>

  );

}
  return (
    <div className="config">

      {/* HEADER */}
      <div className="config-header">
        <div className="header-left">
          <SettingsIcon />
          <h2>System Configuration</h2>
        </div>
        <p>Manage pricing, taxes and airline policies</p>
      </div>

      {/* GRID */}
      <div className="config-grid">

        {/* ================= PRICING ================= */}
        <div className="config-card premium">
          <div className="card-header">
            <div className="card-title">
              <AttachMoneyIcon />
              <h3>Global Pricing</h3>
            </div>
            <span>Rules & multipliers</span>
          </div>

          <div className="form-group">
            <label>Base Fare Multiplier</label>
            <input type="number" placeholder="1.0" />
          </div>

          <div className="form-group">
            <label>Peak Hour Pricing (%)</label>
            <input type="number" placeholder="20" />
          </div>

          <div className="toggle-row">
            <span>Dynamic Pricing</span>
            <label className="switch">
              <input type="checkbox" />
              <span className="slider"></span>
            </label>
          </div>
        </div>

        {/* ================= TAX ================= */}
        <div className="config-card premium">
          <div className="card-header">
            <div className="card-title">
              <ReceiptLongIcon />
              <h3>Taxes & Charges</h3>
            </div>
            <span>Government & airport fees</span>
          </div>

          <div className="form-group">
            <label>GST (%)</label>
            <input type="number" placeholder="18" />
          </div>

          <div className="form-group">
            <label>Fuel Surcharge (₹)</label>
            <input type="number" placeholder="500" />
          </div>

          <div className="form-group">
            <label>Airport Fee (₹)</label>
            <input type="number" placeholder="250" />
          </div>
        </div>

        {/* ================= BRANDING ================= */}
        <div className="config-card premium full">
          <div className="card-header">
            <div className="card-title">
              <FlightIcon />
              <h3>Branding & Policies</h3>
            </div>
            <span>Airline identity & rules</span>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Airline Name</label>
              <input type="text" placeholder="SkyBook Airlines" />
            </div>

            <div className="form-group">
              <label>Primary Color</label>
              <input type="color" />
            </div>
          </div>

          <div className="form-group">
            <label>Refund Policy</label>
            <textarea placeholder="Enter refund rules..." />
          </div>

          <div className="form-group">
            <label>Baggage Policy</label>
            <textarea placeholder="Enter baggage rules..." />
          </div>

          {/* SAVE BUTTON */}
          <button className="save-btn">
            <SaveIcon /> Save Configuration
          </button>
        </div>

      </div>
    </div>
  );
}