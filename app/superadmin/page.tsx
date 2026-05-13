"use client";

import { useState } from "react";
import RBAC from "../superadmin/RBAC/page";
import SystemConfig from "../superadmin/systemconfig/page";
import AdvancedAnalytics from "../superadmin/advancedanalytics/page";
import Security from "../superadmin/security/page"; 
import Compliance from "../superadmin/compliance/page";

// ICONS
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import SettingsIcon from "@mui/icons-material/Settings";
import InsightsIcon from "@mui/icons-material/Insights";
import SecurityIcon from "@mui/icons-material/Security";
import GavelIcon from "@mui/icons-material/Gavel"; // best for compliance


export default function SuperAdmin() {
  const [tab, setTab] = useState("rbac");

  const tabs = [
    {
      key: "rbac",
      label: "RBAC",
      icon: <AdminPanelSettingsIcon />,
    },
    {
      key: "config",
      label: "System Config",
      icon: <SettingsIcon />,
    },
    {
      key: "analytics",
      label: "Advanced Analytics",
      icon: <InsightsIcon />,
    },
    {
      key: "security", 
      label: "Security",
      icon: <SecurityIcon />,
    },
     {
      key: "compliance", 
      label: "Compliance",
      icon: <GavelIcon />,
    },
  ];

  return (
    <div className="superadmin">

      {/* HEADER */}
      <div className="superadmin-header">
        <h2>Super Admin Panel</h2>
        <p>Control system, roles, analytics & security</p>
      </div>

      {/* NAV */}
      <div className="superadmin-tabs">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`tab-btn ${tab === t.key ? "active" : ""}`}
          >
            <span className="icon">{t.icon}</span>
            {t.label}
          </button>
        ))}
      </div>

      {/* CONTENT */}
      <div className="superadmin-content">
        {tab === "rbac" && <RBAC />}
        {tab === "config" && <SystemConfig />}
        {tab === "analytics" && <AdvancedAnalytics />}
        {tab === "security" && <Security />} 
        {tab === "compliance" && <Compliance />} 
      </div>
    </div>
  );
}