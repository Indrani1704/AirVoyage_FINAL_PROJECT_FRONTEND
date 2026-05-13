"use client";

const airports = [
  {
    name: "Indira Gandhi International Airport",
    city: "Delhi",
    country: "India",
    lat: 28.5562,
    lng: 77.1,
  },
  {
  name: "Netaji Subhas Chandra Bose International Airport",
  city: "Kolkata",
  country: "India",
  lat: 22.6547,
  lng: 88.4467,
},
  {
    name: "Chhatrapati Shivaji Maharaj Airport",
    city: "Mumbai",
    country: "India",
    lat: 19.0896,
    lng: 72.8656,
  },
  {
    name: "Kempegowda International Airport",
    city: "Bangalore",
    country: "India",
    lat: 13.1986,
    lng: 77.7066,
  },
  {
    name: "Dubai International Airport",
    city: "Dubai",
    country: "UAE",
    lat: 25.2532,
    lng: 55.3657,
  },
  {
    name: "London Heathrow Airport",
    city: "London",
    country: "United Kingdom",
    lat: 51.47,
    lng: -0.4543,
  },
  {
    name: "John F. Kennedy International Airport",
    city: "New York",
    country: "USA",
    lat: 40.6413,
    lng: -73.7781,
  },
  {
    name: "Singapore Changi Airport",
    city: "Singapore",
    country: "Singapore",
    lat: 1.3644,
    lng: 103.9915,
  },
  {
    name: "Tokyo Haneda Airport",
    city: "Tokyo",
    country: "Japan",
    lat: 35.5494,
    lng: 139.7798,
  },
  {
    name: "Sydney Kingsford Smith Airport",
    city: "Sydney",
    country: "Australia",
    lat: -33.9399,
    lng: 151.1753,
  },
];

export default function WorldMap() {

  return (

    <div
      style={{
        width: "100%",
        height: "720px",

        borderRadius: "30px",

        overflow: "hidden",

        position: "relative",

        background: "#f5f5f5",

        boxShadow:
          "0 25px 60px rgba(0,0,0,0.18)",
      }}
    >

      {/* GOOGLE MAP */}

      <iframe
        width="100%"
        height="100%"
        loading="lazy"
        allowFullScreen
        style={{
          border: 0,
        }}
        src="https://maps.google.com/maps?q=20,0&z=2&output=embed"
      />

      {/* DARK OVERLAY */}

      <div
        style={{
          position: "absolute",

          inset: 0,

          background:
            "linear-gradient(to bottom, rgba(0,0,0,0.12), rgba(0,0,0,0.03))",

          pointerEvents: "none",
        }}
      />

      {/* HEADER */}

      <div
        style={{
          position: "absolute",

          top: "28px",

          left: "28px",

          background:
            "rgba(10,10,10,0.72)",

          color: "#fff",

          padding: "22px 28px",

          borderRadius: "24px",

          backdropFilter:
            "blur(14px)",

          WebkitBackdropFilter:
            "blur(14px)",

          border:
            "1px solid rgba(255,255,255,0.12)",

          boxShadow:
            "0 10px 30px rgba(0,0,0,0.25)",
        }}
      >

        <h1
          style={{
            margin: 0,

            fontSize: "42px",

            fontWeight: 900,

            letterSpacing: "-1px",
          }}
        >
          ✈ Global Airports
        </h1>

        <div
          style={{
            width: "90px",

            height: "4px",

            borderRadius: "20px",

            background:
              "linear-gradient(90deg,#FFD700,#D4AF37)",

            marginTop: "12px",
          }}
        />

        <p
          style={{
            marginTop: "14px",

            marginBottom: 0,

            fontSize: "14px",

            lineHeight: 1.7,

            opacity: 0.92,

            maxWidth: "340px",
          }}
        >
          Explore major international airports
          and aviation hubs around the world.
        </p>

      </div>

      {/* AIRPORT PANEL */}

      <div
        style={{
          position: "absolute",

          top: "28px",

          right: "28px",

          width: "320px",

          maxHeight: "85%",

          overflowY: "auto",

          background:
            "rgba(255,255,255,0.96)",

          borderRadius: "26px",

          padding: "20px",

          boxShadow:
            "0 18px 45px rgba(0,0,0,0.2)",

          border:
            "1px solid rgba(0,0,0,0.06)",
        }}
      >

        <h2
          style={{
            marginTop: 0,

            marginBottom: "18px",

            fontSize: "24px",

            color: "#8B0000",

            fontWeight: 800,
          }}
        >
          Airport Locations
        </h2>

        {airports.map((airport, i) => (

          <a
            key={i}
            href={`https://www.google.com/maps?q=${airport.lat},${airport.lng}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              textDecoration: "none",
            }}
          >

            <div
              style={{
                padding: "16px",

                marginBottom: "14px",

                borderRadius: "18px",

                background:
                  "linear-gradient(135deg,#fff8ec,#ffffff)",

                border:
                  "1px solid #f2ddb0",

                transition: "0.25s",

                cursor: "pointer",

                boxShadow:
                  "0 4px 12px rgba(0,0,0,0.04)",
              }}
            >

              {/* TITLE */}

              <div
                style={{
                  fontWeight: 800,

                  color: "#8B0000",

                  fontSize: "15px",

                  lineHeight: 1.4,
                }}
              >
                ✈ {airport.name}
              </div>

              {/* LOCATION */}

              <div
                style={{
                  marginTop: "6px",

                  color: "#666",

                  fontSize: "13px",
                }}
              >
                {airport.city}, {airport.country}
              </div>

              {/* COORDS */}

              <div
                style={{
                  marginTop: "10px",

                  fontSize: "11px",

                  color: "#999",

                  lineHeight: 1.6,
                }}
              >
                Latitude: {airport.lat}
                <br />
                Longitude: {airport.lng}
              </div>

              {/* BUTTON */}

              <div
                style={{
                  marginTop: "12px",

                  display: "inline-block",

                  background:
                    "linear-gradient(135deg,#8B0000,#C62828)",

                  color: "#fff",

                  padding: "8px 14px",

                  borderRadius: "12px",

                  fontSize: "12px",

                  fontWeight: 700,
                }}
              >
                Open Exact Location
              </div>

            </div>

          </a>

        ))}

      </div>

      {/* FOOTER CARD */}

      <div
        style={{
          position: "absolute",

          bottom: "24px",

          left: "28px",

          display: "flex",

          gap: "14px",
        }}
      >

        {/* AIRPORTS */}

        <div
          style={{
            background:
              "rgba(255,255,255,0.94)",

            padding: "16px 20px",

            borderRadius: "18px",

            minWidth: "150px",

            boxShadow:
              "0 10px 25px rgba(0,0,0,0.12)",
          }}
        >

          <div
            style={{
              fontSize: "13px",

              color: "#777",
            }}
          >
            Airports
          </div>

          <div
            style={{
              marginTop: "6px",

              fontSize: "32px",

              fontWeight: 900,

              color: "#8B0000",
            }}
          >
            500+
          </div>

        </div>

        {/* COUNTRIES */}

        <div
          style={{
            background:
              "rgba(255,255,255,0.94)",

            padding: "16px 20px",

            borderRadius: "18px",

            minWidth: "150px",

            boxShadow:
              "0 10px 25px rgba(0,0,0,0.12)",
          }}
        >

          <div
            style={{
              fontSize: "13px",

              color: "#777",
            }}
          >
            Countries
          </div>

          <div
            style={{
              marginTop: "6px",

              fontSize: "32px",

              fontWeight: 900,

              color: "#8B0000",
            }}
          >
            190+
          </div>

        </div>

      </div>

    </div>

  );

}