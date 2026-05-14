"use client";

import { useEffect, useState } from "react";
import "../../analytics.css";

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

const BASE = "https://airvoyage-final-project-backend-2.onrender.com/api";

/* ✅ TYPES */
type TrendItem = {
  date: string;
  count: number;
};

type SeatItem = {
  seat: string;
  count: number;
};

type AnalyticsData = {
  totalBookings?: number;
  totalRevenue?: number;
  trendData?: TrendItem[];
  topSeats?: SeatItem[];
};

export default function Analytics() {
 
  const [data, setData] = useState<AnalyticsData | null>(null);

   

  const [loading, setLoading] =
    useState(true);

 useEffect(() => {

  setLoading(true);

  fetch(`${BASE}/analytics`)

    .then((res) => res.json())

    .then((res: AnalyticsData) => {

      setData(res);

    })

    .catch(() =>

      setData({

        totalBookings: 0,

        totalRevenue: 0,

        trendData: [],

        topSeats: [],

      })

    )

    .finally(() => {

      setLoading(false);

    });

}, []);

  if (loading || !data)

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

          marginBottom:"8px",

          fontWeight:700,

        }}
      >
        Loading Analytics...
      </h2>

      {/* SUBTEXT */}

      <p
        style={{
          color:"#777",
        }}
      >
        Fetching airline performance data ✈
      </p>

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

  return (
    <div className="analytics">

      {/* HEADER */}
      <div className="header">
        <div>
          <h2>Airline Analytics</h2>
          <p>Performance & booking insights</p>
        </div>
      </div>

      {/* KPI */}
      <div className="kpi-grid">
        {[
          {
            label: "Total Bookings",
            value: data.totalBookings || 0,
            growth: "+12%",
          },
          {
            label: "Revenue",
            value: `₹${data.totalRevenue || 0}`,
            growth: "+18%",
          },
        ].map((item, i) => (
          <div className="kpi-card premium" key={i}>
            <div>
              <p>{item.label}</p>
              <h2>{item.value}</h2>
              <span className="growth">{item.growth}</span>
            </div>
          </div>
        ))}
      </div>

      {/* CHARTS */}
      <div className="charts">

        {/* PREMIUM LINE */}
        <div className="card premium">
          <h3>Booking Trend</h3>

          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={data.trendData || []}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#eee"
              />

              <XAxis dataKey="date" />
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
                type="monotone"
                dataKey="count"
                stroke="#8B0000"
                strokeWidth={4}
                dot={{
                  r: 5,
                  fill: "#fff",
                  stroke: "#8B0000",
                }}
                activeDot={{
                  r: 8,
                  fill: "#D4AF37",
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* PREMIUM BAR */}
        <div className="card premium">
          <h3>Revenue Overview</h3>

          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={data.trendData || []}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#eee"
              />

              <XAxis dataKey="date" />
              <YAxis />

              <Tooltip />

              <defs>
                <linearGradient
                  id="goldBar"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="0%"
                    stopColor="#D4AF37"
                  />

                  <stop
                    offset="100%"
                    stopColor="#8B0000"
                  />
                </linearGradient>
              </defs>

              <Bar
                dataKey="count"
                fill="url(#goldBar)"
                radius={[10, 10, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* BOTTOM */}
      <div className="bottom">

        {/* SEATS */}
        <div className="card premium">
          <h3>Seat Occupancy</h3>

          {(data.topSeats || []).map((s, i) => (
            <div key={i} className="seat">

              <div className="seat-head">
                <span>{s.seat}</span>
                <span>{s.count}</span>
              </div>

              <div className="progress">
                <div
                  className="bar premium-bar"
                  style={{
                    width: `${
                      data.totalBookings
                        ? (s.count / data.totalBookings) * 100
                        : 0
                    }%`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* ROUTES */}
        <div className="card premium">
          <h3>Popular Routes</h3>

          <div className="routes">
            {[
              "DEL → MUM",
              "DEL → DXB",
              "DEL → BLR",
            ].map((r, i) => (
              <div
                className="route premium-route"
                key={i}
              >
                <h4>{r}</h4>
                <p>High demand</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}