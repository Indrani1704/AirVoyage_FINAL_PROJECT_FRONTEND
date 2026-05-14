"use client";

import { useEffect, useState } from "react";
import { toast, Toaster } from "react-hot-toast";

const BASE = "https://airvoyage-final-project-backend-2.onrender.com/api/compliance";

export default function Compliance() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // DIALOG
  const [openDialog, setOpenDialog] = useState(false);
  const [userId, setUserId] = useState("");
  const [deleting, setDeleting] = useState(false);

  // ================= LOAD LOGS =================
  useEffect(() => {
    fetch(`${BASE}/audit-logs`)
      .then((res) => res.json())
      .then((data) => {
        setLogs(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => {
        setLogs([]);
        setLoading(false);

        // ❌ REMOVED FAILED TO LOAD TOAST
      });
  }, []);

  // ================= BACKUP =================
  const handleBackup = async () => {
    try {
      toast.loading("Preparing backup...", {
        id: "backup",
      });

      const res = await fetch(`${BASE}/backup`);
      const data = await res.json();

      const blob = new Blob(
        [JSON.stringify(data, null, 2)],
        {
          type: "application/json",
        }
      );

      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "backup.json";
      a.click();

      toast.success("Backup downloaded", {
        id: "backup",
      });

    } catch (error) {
      toast.error("Backup failed", {
        id: "backup",
      });
    }
  };

  // ================= RESTORE =================
  const handleRestore = async (e: any) => {
    try {
      const file = e.target.files[0];

      if (!file) return;

      toast.loading("Restoring backup...", {
        id: "restore",
      });

      const text = await file.text();
      const json = JSON.parse(text);

      await fetch(`${BASE}/restore`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(json),
      });

      toast.success("Backup restored successfully", {
        id: "restore",
      });

    } catch (error) {
      toast.error("Restore failed", {
        id: "restore",
      });
    }
  };

  // ================= DELETE USER =================
  const handleDelete = async () => {
    try {
      if (!userId.trim()) {
        toast.error("Please enter user ID");
        return;
      }

      setDeleting(true);

      toast.loading("Deleting user...", {
        id: "delete",
      });

      const res = await fetch(
        `${BASE}/gdpr/${userId}`,
        {
          method: "DELETE",
        }
      );

      if (!res.ok) {
        throw new Error("Delete failed");
      }

      toast.success("User deleted successfully", {
        id: "delete",
      });

      setOpenDialog(false);
      setUserId("");

    } catch (error) {
      toast.error("Delete failed", {
        id: "delete",
      });
    } finally {
      setDeleting(false);
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
        Loading Compliance Data...
      </h2>

      {/* SUBTEXT */}

      <p
        style={{
          color:"#777",
        }}
      >
        Fetching audit logs & security tools 
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
    <div className="compliance">

      {/* TOAST */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: "#121212",
            color: "#fff",
            borderRadius: "14px",
            padding: "14px 18px",
            fontSize: "14px",
            border: "1px solid rgba(255,255,255,0.08)",
          },
        }}
      />

      {/* HEADER */}
      <div className="compliance-header">
        <h2>Data & Compliance</h2>
        <p>
          Backup, privacy tools and audit monitoring
        </p>
      </div>

      <div className="compliance-grid">

        {/* BACKUP */}
        <div className="card premium">
          <h3>Backup & Restore</h3>

          <button
            className="btn primary"
            onClick={handleBackup}
          >
            Download Backup
          </button>

          <label className="file-upload">
            Restore Backup

            <input
              type="file"
              onChange={handleRestore}
            />
          </label>
        </div>

        {/* GDPR */}
        <div className="card premium">
          <h3>GDPR / Privacy</h3>

          <button
            className="btn danger"
            onClick={() => setOpenDialog(true)}
          >
            Delete User Data
          </button>

          <p className="hint">
            Permanently removes user and related
            bookings
          </p>
        </div>

        {/* AUDIT LOGS */}
        <div className="card premium full">
          <h3>Audit Logs</h3>

          {logs.length > 0 ? (
            logs.map((l, i) => (
              <div
                key={i}
                className="log-row"
              >
                <span className="action">
                  {l.action}
                </span>

                <span className="time">
                  {l.createdAt
                    ? new Date(
                        l.createdAt
                      ).toLocaleString()
                    : "No time"}
                </span>
              </div>
            ))
          ) : (
            <p className="empty">
              No logs available
            </p>
          )}
        </div>
      </div>

      {/* PROFESSIONAL DIALOG */}
      {openDialog && (
        <div className="dialog-overlay">

          <div className="dialog-card">

            <div className="dialog-top">
              <h3>Delete User Data</h3>

              <button
                className="dialog-close"
                onClick={() => {
                  setOpenDialog(false);
                  setUserId("");
                }}
              >
                ×
              </button>
            </div>

            <p className="dialog-desc">
              This action permanently removes the
              user account and all associated
              bookings.
            </p>

            <div className="dialog-field">
              <label>User ID</label>

              <input
                type="text"
                placeholder="Enter user ID"
                value={userId}
                onChange={(e) =>
                  setUserId(e.target.value)
                }
              />
            </div>

            <div className="dialog-buttons">

              <button
                className="dialog-cancel"
                onClick={() => {
                  setOpenDialog(false);
                  setUserId("");
                }}
              >
                Cancel
              </button>

              <button
                className="dialog-delete"
                onClick={handleDelete}
                disabled={deleting}
              >
                {deleting
                  ? "Deleting..."
                  : "Delete User"}
              </button>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}