"use client";

import { useEffect, useState } from "react";
import "../../globals.css";

import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const BASE = "https://airvoyage-final-project-backend-2.onrender.com/api/superadmin";

// 🔥 STATIC ONLY FOR CHARTS
const staticRegion = [
  { region: "DEL", count: 40 },
  { region: "MUM", count: 32 },
  { region: "BLR", count: 25 },
  { region: "DXB", count: 18 },
];

const staticForecast = [
  { region: "DEL", count: 40, predicted: 45 },
  { region: "MUM", count: 32, predicted: 36 },
  { region: "BLR", count: 25, predicted: 30 },
  { region: "DXB", count: 18, predicted: 22 },
];

export default function AdvancedAnalytics() {
  const [analytics, setAnalytics] = useState({
    totalRevenue: 0,
    totalBookings: 0,
    cancellationRate: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${BASE}/analytics`, {
        headers: {
          "Content-Type": "application/json",
          ...(token && {
            Authorization: `Bearer ${token}`,
          }),
        },
      });

      if (!res.ok) {
        throw new Error("Failed to fetch analytics");
      }

      const data = await res.json();

      setAnalytics({
        totalRevenue: data.totalRevenue || 0,
        totalBookings: data.totalBookings || 0,
        cancellationRate: data.cancellationRate || 0,
      });
    } catch (error) {
      console.log("Analytics Fetch Error:", error);

      setAnalytics({
        totalRevenue: 0,
        totalBookings: 0,
        cancellationRate: 0,
      });
    } finally {
      setLoading(false);
    }
  };

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
        Loading Advanced Analytics...
      </h2>

      {/* SUBTEXT */}

      <p
        style={{
          color:"#777",
        }}
      >
        Fetching revenue & forecasting insights ✈
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
    <div className="advanced">

      {/* HEADER */}
      <div className="advanced-header">
        <h2>Advanced Analytics</h2>
        <p>Revenue, demand & cancellation insights</p>
      </div>

      {/* ✅ DYNAMIC KPI FROM DATABASE */}
      <div className="advanced-kpi">

        {/* TOTAL REVENUE */}
        <div className="card premium">
          <h4>Total Revenue</h4>

          <h2>
            ₹
            {Number(analytics.totalRevenue).toLocaleString("en-IN")}
          </h2>
        </div>

        {/* TOTAL BOOKINGS */}
        <div className="card premium">
          <h4>Total Bookings</h4>

          <h2>
            {analytics.totalBookings}
          </h2>
        </div>

        {/* CANCELLATION RATE */}
        <div className="card premium">
          <h4>Cancellation Rate</h4>

          <h2>
            {analytics.cancellationRate}%
          </h2>
        </div>
      </div>

      {/* STATIC CHARTS */}
      <div className="advanced-charts">

        {/* DEMAND REGION */}
        <div className="card chart premium">
          <h3>Demand by Region</h3>

          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={staticRegion}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eee" />

              <XAxis dataKey="region" />
              <YAxis />

              <Tooltip
                contentStyle={{
                  background: "#111",
                  borderRadius: "10px",
                  color: "#fff",
                  border: "none",
                }}
              />

              <defs>
                <linearGradient
                  id="goldBar"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="0%" stopColor="#D4AF37" />
                  <stop offset="100%" stopColor="#8B0000" />
                </linearGradient>
              </defs>

              <Bar
                dataKey="count"
                fill="url(#goldBar)"
                radius={[12, 12, 0, 0]}
                barSize={30}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* FORECAST */}
        <div className="card chart premium">
          <h3>Revenue Forecast</h3>

          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={staticForecast}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eee" />

              <XAxis dataKey="region" />
              <YAxis />

              <Tooltip
                contentStyle={{
                  background: "#111",
                  borderRadius: "10px",
                  color: "#fff",
                  border: "none",
                }}
              />

              <Line
                dataKey="count"
                stroke="#8B0000"
                strokeWidth={3}
                dot={{ r: 5, fill: "#8B0000" }}
              />

              <Line
                dataKey="predicted"
                stroke="#D4AF37"
                strokeWidth={3}
                strokeDasharray="5 5"
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}