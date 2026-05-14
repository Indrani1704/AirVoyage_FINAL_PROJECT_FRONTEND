"use client";

import { useEffect, useState } from "react";
import "../globals.css";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

// ICONS
import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import WbSunnyIcon from "@mui/icons-material/WbSunny";
import CloudIcon from "@mui/icons-material/Cloud";
import ThunderstormIcon from "@mui/icons-material/Thunderstorm";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import SupportAgentIcon
  from "@mui/icons-material/SupportAgent";
  import { useRouter }
  from "next/navigation";

const BASE = "https://airvoyage-final-project-backend-2.onrender.com/api";
const WEATHER_KEY = "f49cb4d10f8b6b79062ee2a6432552f1";

export default function Dashboard() {
  const [data, setData] = useState<any>(null);
  const [flights, setFlights] = useState<any[]>([]);
  const [weather, setWeather] = useState<any>(null);
  const [city, setCity] = useState("Kolkata");
  const [loading, setLoading] =
  useState(true);

const router =
  useRouter();

  const safeFetch = async (
  url: string,
  setter: React.Dispatch<
    React.SetStateAction<any>
  >
) => {

  try {

    setLoading(true);

    const res =
      await fetch(url);

    if (!res.ok)
      throw new Error(
        "API Error"
      );

    const json =
      await res.json();

    setter(json);

  } catch (err:any) {

    console.log(
      "Fetch error:",
      err.message
    );

  } finally {

    setLoading(false);

  }

};

  useEffect(() => {
    safeFetch(`${BASE}/analytics`, setData);
    safeFetch(`${BASE}/flights`, setFlights);
  }, []);

  useEffect(() => {
    safeFetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${WEATHER_KEY}`,
      setWeather
    );
  }, [city]);

 {/* LOADING */}
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

      <div
        style={{

          width:"70px",

          height:"70px",

          border:
            "6px solid #f3f3f3",

          borderTop:
            "6px solid #c62828",

          borderRadius:"50%",

          animation:
            "spin 1s linear infinite",

          marginBottom:"20px",

        }}
      />

      <h2
        style={{

          color:"#c62828",

          fontWeight:700,

          marginBottom:"8px",

        }}
      >
        Loading Dashboard...
      </h2>

      <p
        style={{
          color:"#777",
        }}
      >
        Fetching analytics & flights
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

  const current = Array.isArray(weather?.list)
  ? weather.list[0]
  : null;
  const condition = current?.weather?.[0]?.main;

  const getIcon = () => {
    if (condition === "Clear") return <WbSunnyIcon />;
    if (condition === "Rain") return <ThunderstormIcon />;
    return <CloudIcon />;
  };

  // 🔥 SAME LOGIC
  const totalFlights = flights.length;
  const onTimeCount = flights.filter(f => f.status === "on-time").length;
  const cancelledCount = flights.filter(f => f.status === "cancelled").length;

  const kpis = [
    { label: "Flights", value: totalFlights, icon: <FlightTakeoffIcon /> },
    { label: "On Time", value: onTimeCount, icon: <AccessTimeIcon /> },
    { label: "Cancelled", value: cancelledCount, icon: <CancelIcon /> },
    { label: "Revenue", value: `₹${data.totalRevenue || 0}`, icon: <CurrencyRupeeIcon /> },
  ];

  return (
    <div className="dashboard">

      {/* HEADER */}
      <div className="header">

  <div>

    <h1>
      Dashboard
    </h1>

    <p>
      Overview of flights,
      bookings and performance
    </p>

  </div>

  <button

    onClick={()=>
      router.push("/admin/support")
    }

    style={{

      display:"flex",

      alignItems:"center",

      gap:"10px",

      background:
        "linear-gradient(135deg,#8B0000,#C62828)",

      color:"#fff",

      border:"none",

      padding:"12px 20px",

      borderRadius:"12px",

      cursor:"pointer",

      fontWeight:"bold",

      boxShadow:
        "0 8px 20px rgba(198,40,40,.25)",

    }}
  >

    <SupportAgentIcon />

    Live Support

  </button>

</div>

      {/* KPI */}
      <div className="kpi-grid">
        {kpis.map((item, i) => (
          <div className="kpi-card" key={i}>
            <div className="kpi-icon">{item.icon}</div>
            <div>
              <p>{item.label}</p>
              <h2>{item.value}</h2>
            </div>
          </div>
        ))}
      </div>

      {/* CHART + WEATHER */}
      <div className="row">

        {/* CHART */}
        <div className="card chart-card">
          <div className="chart-header">
            <h3>Booking Trend</h3>
          </div>

          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={data.trendData || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />

              <Line
                type="monotone"
                dataKey="count"
                stroke="#c62828"
                strokeWidth={3}
                dot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* WEATHER */}
        <div className="weather-card">
          <h4>📍 {city}</h4>
          <h2>{city}</h2>

          <div className="weather-icon">{getIcon()}</div>

          <h1>{current?.main?.temp}°C</h1>
          <p>{condition}</p>

          <input
            placeholder="Search city..."
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
        </div>
      </div>

      {/* FLIGHTS */}
      <div className="flights">
        <h3>Created Flights</h3>

        {flights.map((f, i) => {
          const d = new Date(f.departureTime);

          return (
            <div className="flight-card" key={i}>

              <div className="flight-left">
                <FlightTakeoffIcon />
              </div>

              <div className="flight-body">

                {/* ROUTE */}
                <div>
                  <h4>{f.from} → {f.to}</h4>
                  <p>{f.duration}</p>
                  <span className="badge">Economy</span>
                </div>

                {/* TIME */}
                <div>
                  <p>Departure</p>
                  <h5>{d.toLocaleTimeString()}</h5>
                  <span>{d.toDateString()}</span>
                </div>

                {/* STATUS */}
                <div>
                  <p>Status</p>
                  <span className={`status ${f.status}`}>
                    ● {f.status}
                  </span>
                </div>

               

              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}