"use client";

import "../globals.css";

import {
  useEffect,
  useState,
} from "react";

import Cookies from "js-cookie";

import toast from "react-hot-toast";

export default function ProfilePage() {

  const [user, setUser] =
    useState<any>(null);

  const [preview, setPreview] =
    useState("");

  const [edit, setEdit] =
    useState(false);

  const [form, setForm] =
    useState({

      name: "",
      email: "",
      phone: "",
      country: "",
      passport: "",
      dob: "",

    });

  /* ================= LOAD USER ================= */

  useEffect(() => {

    const saved =
      localStorage.getItem(
        "user"
      );

    if (saved) {

      const parsed =
        JSON.parse(saved);

      setUser(parsed);

      /* IMAGE */

      const savedImage =
        Cookies.get(
          "profileImage"
        );

      const finalImage =
        savedImage ||

        parsed.image ||

        "https://i.ibb.co/7QpKsCX/user.png";

      setPreview(
        finalImage
      );

      setForm({

        name:
          parsed.name || "",

        email:
          parsed.email || "",

        phone:
          parsed.phone || "",

        country:
          parsed.country ||
          "India",

        passport:
          parsed.passport ||
          "N/A",

        dob:
          parsed.dob ||
          "N/A",

      });

    }

  }, []);

  /* ================= IMAGE CHANGE ================= */

  const handleImage = (
    e: any
  ) => {

    const file =
      e.target.files?.[0];

    if (!file) return;

    const reader =
      new FileReader();

    reader.onloadend = () => {

      const image =
        reader.result as string;

      /* PREVIEW */

      setPreview(image);

      /* SAVE COOKIE */

      Cookies.set(
        "profileImage",
        image,
        {
          expires: 365,
        }
      );

      /* UPDATE LOCAL USER */

      const savedUser =
        localStorage.getItem(
          "user"
        );

      if (savedUser) {

        const parsed =
          JSON.parse(savedUser);

        parsed.image =
          image;

        localStorage.setItem(
          "user",
          JSON.stringify(parsed)
        );

      }

      toast.success(
        "Profile photo updated"
      );

    };

    reader.readAsDataURL(file);

  };

  /* ================= SAVE PROFILE ================= */

  const saveProfile = () => {

    const updated = {

      ...user,

      ...form,

      image:
        preview,

    };

    localStorage.setItem(

      "user",

      JSON.stringify(
        updated
      )

    );

    /* SAVE COOKIE IMAGE */

    Cookies.set(
      "profileImage",
      preview,
      {
        expires: 365,
      }
    );

    setUser(updated);

    setEdit(false);

    toast.success(
      "Profile updated successfully"
    );

  };

  return (

    <div className="premium-page">

      <div className="premium-container">

        <div className="profile-premium-card">

          {/* ================= BANNER ================= */}

          <div className="profile-banner">

            <div className="banner-overlay" />

          </div>

          {/* ================= PROFILE CONTENT ================= */}

          <div className="profile-content">

            {/* ================= IMAGE ================= */}

            <div className="profile-image-box">

              <div className="profile-image-wrapper">

                <img
  src={
    preview ||
    "/images/photo.jpg"
  }
  alt="profile"
  className="profile-main-image"
/>

                <div className="online-dot" />

              </div>

              {edit && (

                <label className="upload-btn">

                  Change Photo

                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={handleImage}
                  />

                </label>

              )}

            </div>

            {/* ================= INFO ================= */}

            <div className="profile-info">

              {!edit ? (

                <>

                  <h1>
                    {user?.name ||
                      "Traveler"}
                  </h1>

                  <p>
                    {user?.email}
                  </p>

                  <div className="profile-badges">

                    <span>
                      Gold Elite
                    </span>

                    <span>
                      Verified
                    </span>

                    <span>
                      Premium Traveler
                    </span>

                  </div>

                </>

              ) : (

                <div className="edit-grid">

                  <input
                    value={form.name}
                    placeholder="Full Name"
                    onChange={(e) =>

                      setForm({

                        ...form,

                        name:
                          e.target.value,

                      })

                    }
                  />

                  <input
                    value={form.email}
                    placeholder="Email"
                    onChange={(e) =>

                      setForm({

                        ...form,

                        email:
                          e.target.value,

                      })

                    }
                  />

                  <input
                    value={form.phone}
                    placeholder="Phone"
                    onChange={(e) =>

                      setForm({

                        ...form,

                        phone:
                          e.target.value,

                      })

                    }
                  />

                  <input
                    value={form.country}
                    placeholder="Country"
                    onChange={(e) =>

                      setForm({

                        ...form,

                        country:
                          e.target.value,

                      })

                    }
                  />

                  <input
                    value={form.passport}
                    placeholder="Passport No"
                    onChange={(e) =>

                      setForm({

                        ...form,

                        passport:
                          e.target.value,

                      })

                    }
                  />

                  <input
                    value={form.dob}
                    placeholder="Date Of Birth"
                    onChange={(e) =>

                      setForm({

                        ...form,

                        dob:
                          e.target.value,

                      })

                    }
                  />

                </div>

              )}

            </div>

          </div>

          {/* ================= STATS ================= */}

          <div className="profile-grid">

            <div className="profile-box">
              <p>Phone</p>

              <h3>
                {form.phone ||
                  "Not Added"}
              </h3>
            </div>

            <div className="profile-box">
              <p>Country</p>

              <h3>
                {form.country}
              </h3>
            </div>

            <div className="profile-box">
              <p>Passport</p>

              <h3>
                {form.passport}
              </h3>
            </div>

            <div className="profile-box">
              <p>Date Of Birth</p>

              <h3>
                {form.dob}
              </h3>
            </div>

            <div className="profile-box">
              <p>Membership</p>

              <h3>
                Gold Elite
              </h3>
            </div>

            <div className="profile-box">
              <p>Travel Status</p>

              <h3>
                International
              </h3>
            </div>

          </div>

          {/* ================= ACTIONS ================= */}

          <div className="profile-actions">

            {!edit ? (

              <button
                className="save-btn"
                onClick={() =>
                  setEdit(true)
                }
              >

                Edit Profile

              </button>

            ) : (

              <button
                className="save-btn"
                onClick={saveProfile}
              >

                Save Changes

              </button>

            )}

          </div>

        </div>

      </div>

    </div>

  );

}