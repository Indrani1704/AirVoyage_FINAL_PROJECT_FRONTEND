"use client";

import { useEffect, useState } from "react";

const BASE = "https://airvoyage-final-project-backend-2.onrender.com/api/superadmin";

export default function RBAC() {
  const [users, setUsers] = useState<any[]>([]);
const [loading, setLoading] =
  useState(true);
  const fetchData = async () => {

  try {

    setLoading(true);

    const res =
      await fetch(
        `${BASE}/rbac`
      );

    const data =
      await res.json();

    setUsers(
      data.users || []
    );

  } catch (err) {

    console.log(err);

    setUsers([]);

  } finally {

    setLoading(false);

  }

};

  useEffect(() => {
    fetchData();
  }, []);

  // 🔥 ADMIN TOGGLE
  const toggleAdmin = async (userId: string) => {
    await fetch(`${BASE}/toggle-admin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId }),
    });

    fetchData();
  };

  // 🔥 MODULE TOGGLE
  const togglePermission = async (userId: string, module: string) => {
    await fetch(`${BASE}/permission`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId, module }),
    });

    fetchData();
  };

  const hasAccess = (user: any, module: string) => {
    return user.permissions?.some(
      (p: any) => p.module === module && p.enabled
    );
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
        Loading RBAC Panel...
      </h2>

      {/* SUBTEXT */}

      <p
        style={{
          color:"#777",
        }}
      >
        Fetching users & permissions 
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
    <div className="rbac">
      <h2>RBAC Control Panel</h2>

      <div className="rbac-table">

        <div className="rbac-header">
          <span>User</span>
          <span>Admin</span>
          <span>Flights</span>
          <span>Bookings</span>
        </div>

        {users.map(user => (
          <div key={user._id} className="rbac-row">

            {/* EMAIL */}
            <span>{user.email}</span>

            {/* ADMIN */}
            <label className="switch">
              <input
                type="checkbox"
                checked={user.role === "admin"}
                onChange={() => toggleAdmin(user._id)}
              />
              <span className="slider"></span>
            </label>

            {/* FLIGHTS */}
            <label className="switch">
              <input
                type="checkbox"
                checked={hasAccess(user, "flights")}
                onChange={() =>
                  togglePermission(user._id, "flights")
                }
              />
              <span className="slider"></span>
            </label>

            {/* BOOKINGS */}
            <label className="switch">
              <input
                type="checkbox"
                checked={hasAccess(user, "bookings")}
                onChange={() =>
                  togglePermission(user._id, "bookings")
                }
              />
              <span className="slider"></span>
            </label>

          </div>
        ))}
      </div>
    </div>
  );
}