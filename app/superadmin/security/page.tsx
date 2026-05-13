"use client";

import { useEffect, useState } from "react";

const BASE =
  "https://airvoyage-final-project-backend-2.onrender.com/api/superadmin";

/* ================= TYPES ================= */

type SecurityBooking = {
  _id?: string;
  totalAmount?: number;
  seats?: any[];
};

type SecurityType = {
  suspicious: SecurityBooking[];
  suspiciousCount: number;
};

type LogType = {
  _id?: string;
  action?: string;
  createdAt?: string;
  admin?: string;

  metadata?: {
    flightId?: string;
    bookingId?: string;
    userId?: string;
  };
};

/* ================= PAGE ================= */

export default function SecurityMonitoring() {

  const [security, setSecurity] =
    useState<SecurityType>({
      suspicious: [],
      suspiciousCount: 0,
    });

  const [logs, setLogs] =
    useState<LogType[]>([]);

  const [loading, setLoading] =
    useState(true);

  /* ================= FETCH ================= */

  useEffect(() => {

    const fetchData = async () => {

      try {

        const [secRes, logRes] =
          await Promise.all([

            fetch(`${BASE}/security`),

            fetch(`${BASE}/logs`),

          ]);

        const secData =
          await secRes.json();

        const logData =
          await logRes.json();

        setSecurity({

          suspicious:
            secData?.suspicious || [],

          suspiciousCount:
            secData?.suspiciousCount || 0,

        });

        setLogs(
          Array.isArray(logData)
            ? logData
            : []
        );

      } catch (err: any) {

        console.error(err);

        setLogs([]);

      } finally {

        setLoading(false);

      }

    };

    fetchData();

  }, []);

  /* ================= LOADING ================= */

  if (loading) {

    return (
      <p>
        Loading security...
      </p>
    );

  }

  /* ================= UI ================= */

  return (

    <div className="security">

      <h2>
        Security & Monitoring
      </h2>

      {/* ================= FRAUD ================= */}

      <div className="card premium">

        <h3>
          Suspicious Bookings (
          {security.suspiciousCount}
          )
        </h3>

        {security.suspicious.length > 0 ? (

          security.suspicious.map(

            (
              b: SecurityBooking,
              i: number
            ) => (

              <div
                key={i}
                className="fraud"
              >

                <span>
                  {b._id}
                </span>

                <span>
                  ₹{b.totalAmount || 0}
                </span>

                <span>
                  {b.seats?.length || 0}
                  {" "}
                  seats
                </span>

              </div>

            )

          )

        ) : (

          <p>
            No suspicious bookings
          </p>

        )}

      </div>

      {/* ================= LOGS ================= */}

      <div className="card premium">

        <h3>
          Admin Activity
        </h3>

        {logs.length > 0 ? (

          logs.map(

            (
              l: LogType,
              i: number
            ) => {

              const getLabel = () => {

                switch (l.action) {

                  case "CREATE_FLIGHT":
                    return "Flight Created";

                  case "DELETE_FLIGHT":
                    return "Flight Deleted";

                  case "CANCEL_BOOKING":
                    return "Booking Cancelled";

                  case "BLOCK_USER":
                    return "User Blocked";

                  default:
                    return l.action;

                }

              };

              return (

                <div
                  key={i}
                  className="log-item"
                >

                  {/* ICON */}

                  <div className="log-icon">

                    {l.action?.includes("FLIGHT")
                      ? "✈"
                      : l.action?.includes("BOOKING")
                      ? "📄"
                      : l.action?.includes("USER")
                      ? "👤"
                      : "⚙"}

                  </div>

                  {/* CONTENT */}

                  <div className="log-content">

                    <h4>
                      {getLabel()}
                    </h4>

                    <p className="meta">

                      {l.metadata?.flightId && (

                        <span>
                          Flight:
                          {" "}
                          {l.metadata.flightId}
                        </span>

                      )}

                      {l.metadata?.bookingId && (

                        <span>
                          Booking:
                          {" "}
                          {l.metadata.bookingId}
                        </span>

                      )}

                      {l.metadata?.userId && (

                        <span>
                          User:
                          {" "}
                          {l.metadata.userId}
                        </span>

                      )}

                    </p>

                    <span className="admin">

                      By:
                      {" "}
                      {l.admin || "Unknown"}

                    </span>

                  </div>

                  {/* TIME */}

                  <div className="log-time">

                    {l.createdAt
                      ? new Date(
                          l.createdAt
                        ).toLocaleString()
                      : "No time"}

                  </div>

                </div>

              );

            }

          )

        ) : (

          <p>
            No logs found
          </p>

        )}

      </div>

    </div>

  );

}