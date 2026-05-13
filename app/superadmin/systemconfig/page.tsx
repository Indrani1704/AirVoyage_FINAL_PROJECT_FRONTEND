"use client";

import "../../globals.css";

// ICONS
import SettingsIcon from "@mui/icons-material/Settings";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import FlightIcon from "@mui/icons-material/Flight";
import SaveIcon from "@mui/icons-material/Save";

export default function SystemConfig() {
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