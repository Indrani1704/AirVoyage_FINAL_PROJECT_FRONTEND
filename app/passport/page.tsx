"use client";

import { useEffect, useState } from "react";

export default function PassportPage() {

  const [user, setUser] = useState<any>(null);

  useEffect(() => {

    const saved = localStorage.getItem("user");

    if (saved) {
      setUser(JSON.parse(saved));
    }

  }, []);

  return (

    <div className="passport-page">

      <div className="passport-book-ui">

        {/* FRONT COVER */}

        <div className="passport-cover">

          <div className="passport-cover-inner">

           <div className="passport-emblem">
  ☸
</div>

            <h1>
              REPUBLIC OF INDIA
            </h1>

            <h2>
              PASSPORT
            </h2>

            <div className="passport-chip"></div>

            <p>
              ELECTRONIC PASSPORT
            </p>

          </div>

        </div>

        {/* INSIDE PAGE */}

        <div className="passport-inside-page">

          <div className="passport-header">

            <div>

              <h1>
                भारतीय गणराज्य
              </h1>

              <h2>
                Republic of India
              </h2>

            </div>

            <div className="passport-no">
              P45876219
            </div>

          </div>

          <div className="passport-main-content">

            {/* PHOTO */}

            <div className="passport-photo-section">

              <img
                src={
                  user?.image ||
                  "/images/photo.jpg"
                }
                alt=""
              />

              <div className="passport-sign">
                HOLDER SIGNATURE
              </div>

            </div>

            {/* DETAILS */}

            <div className="passport-details-section">

              <div className="passport-detail-box">
                <p>Full Name</p>
                <h3>{user?.name || "Traveler"}</h3>
              </div>

              <div className="passport-detail-box">
                <p>Nationality</p>
                <h3>INDIAN</h3>
              </div>

              <div className="passport-detail-box">
                <p>Date Of Birth</p>
                <h3>12 JAN 2002</h3>
              </div>

              <div className="passport-detail-box">
                <p>Gender</p>
                <h3>FEMALE</h3>
              </div>

              <div className="passport-detail-box">
                <p>Passport No</p>
                <h3>P45876219</h3>
              </div>

              <div className="passport-detail-box">
                <p>Date Of Issue</p>
                <h3>01 JAN 2026</h3>
              </div>

              <div className="passport-detail-box">
                <p>Date Of Expiry</p>
                <h3>01 JAN 2036</h3>
              </div>

              <div className="passport-detail-box">
                <p>Email</p>
                <h3>{user?.email}</h3>
              </div>

            </div>

          </div>

          {/* MACHINE CODE */}

          <div className="passport-machine-code">
            P&lt;IND&lt;&lt;{user?.name || "TRAVELER"}&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;
          </div>

        </div>

      </div>

    </div>

  );

}