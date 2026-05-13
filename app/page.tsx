"use client";

import "./globals.css";
import Cookies from "js-cookie";
import { motion, Variants } from "framer-motion";
import Image from "next/image";
import {
  FaPlane,
  FaHotel,
  FaCar,
  FaMapMarkerAlt,
  FaUser,
  FaTag, 
  FaTicketAlt, 
  FaClock,
  FaGlobe,
  FaCrown,
    FaHeadset,
} from "react-icons/fa";
import WorldMap from "./components/WorldMap";


import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AuthMiniSidebar from "./components/AuthMiniSidebar";
import toast from "react-hot-toast";

const AIRPORTS = [
  { city: "Delhi", code: "DEL" },
  { city: "Mumbai", code: "BOM" },
  { city: "Bangalore", code: "BLR" },
  { city: "Kolkata", code: "CCU" },
  { city: "Chennai", code: "MAA" },
  { city: "Hyderabad", code: "HYD" },
  { city: "Goa", code: "GOI" },
  { city: "Dubai", code: "DXB" },
  { city: "Paris", code: "CDG" },
  { city: "Maldives", code: "MLE" },
];
/* 🔥 PREMIUM ANIMATION SYSTEM */



const fadeUp: Variants = {
  hidden: {
    opacity: 0,
    y: 40,
  },

  show: {
    opacity: 1,
    y: 0,

    transition: {
      duration: 0.7,
      ease: "easeOut",
    },
  },
};

const stagger = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

export default function Home() {
  const [tab, setTab] = useState("flights");
  const router = useRouter();

const [search, setSearch] = useState({
  from: "",
  to: "",
  departure: "",
  returnDate: "",
  guests: 1, // ✅ number not string
});
 const [deals, setDeals] = useState<any[]>([]);
const [coupons, setCoupons] = useState<any[]>([]);
const [hotels, setHotels] = useState<any[]>([]);
 const [user, setUser] = useState<any>(null);
  
  const [suggestions, setSuggestions] = useState<any[]>([]);
const [activeField, setActiveField] = useState<"from" | "to" | null>(null);
const [openAuth, setOpenAuth] = useState(false);
const [showMenu, setShowMenu] = useState(false);
const [profileImage, setProfileImage] =
  useState("");

  // 🔥 NEW: SLIDER STATE
  const [currentSlide, setCurrentSlide] = useState(0);
const handleAirportSearch = (value: string, field: "from" | "to") => {
  setSearch({ ...search, [field]: value });
  setActiveField(field);

  if (!value) return setSuggestions([]);

  const filtered = AIRPORTS.filter(
    (a) =>
      a.city.toLowerCase().includes(value.toLowerCase()) ||
      a.code.toLowerCase().includes(value.toLowerCase())
  );

  setSuggestions(filtered);
};
  /* 🔥 FETCH DATA */
  useEffect(() => {
    fetch("https://airvoyage-final-project-backend-2.onrender.com/api/flights/deals")
      .then((res) => res.json())
      .then(setDeals)
      .catch(() => {});

    // ✅ COUPONS FETCH SAFE
    fetch("https://airvoyage-final-project-backend-2.onrender.com/api/coupons")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setCoupons(data);
        else if (Array.isArray(data.coupons)) setCoupons(data.coupons);
        else if (Array.isArray(data.data)) setCoupons(data.data);
        else setCoupons([]);
      })
      .catch(() => setCoupons([]));

      // ✅ HOTELS FETCH (ADD THIS ONLY)
fetch("https://airvoyage-final-project-backend-2.onrender.com/api/hotels")
  .then((res) => res.json())
  .then((data) => {
    if (Array.isArray(data)) setHotels(data);
    else if (Array.isArray(data.data)) setHotels(data.data);
    else setHotels([]);
  })
  .catch(() => setHotels([]));

const token = localStorage.getItem("token");

console.log("HOME TOKEN:", token);

if (token && token !== "undefined") {

  fetch("https://airvoyage-final-project-backend-2.onrender.com/api/auth/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

    .then(async (res) => {

      console.log("ME STATUS:", res.status);

      const data = await res.json();

      console.log("ME RESPONSE:", data);

      if (!res.ok) {
        throw new Error(
          data.message || "Unauthorized"
        );
      }

      return data;
    })

    .then((data) => {

      console.log("FINAL USER:", data);

    const savedUser = localStorage.getItem("user");

if (savedUser) {
  setUser(JSON.parse(savedUser));
} else {
  setUser(data.user || data);
}

    })

    .catch((err) => {

      console.error("ME ERROR:", err);

      localStorage.removeItem("token");
      localStorage.removeItem("user");

      setUser(null);

    });

} else {

  console.log("NO VALID TOKEN FOUND");

}
  }, []);

  // 🔥 AUTO SLIDE
  useEffect(() => {
    if (!coupons.length) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) =>
        prev === coupons.length - 1 ? 0 : prev + 1
      );
    }, 3000);

    return () => clearInterval(interval);
  }, [coupons]);

useEffect(() => {

  /* USER */

  const savedUser =
    localStorage.getItem(
      "user"
    );

  if (savedUser) {

    setUser(
      JSON.parse(savedUser)
    );

  }

  /* PROFILE IMAGE */

  const savedImage =
    Cookies.get(
      "profileImage"
    );

  if (savedImage) {

    setProfileImage(
      savedImage
    );

  }

  /* LIVE UPDATE */

  const updateUser = () => {

    const updatedUser =
      localStorage.getItem(
        "user"
      );

    if (updatedUser) {

      setUser(
        JSON.parse(
          updatedUser
        )
      );

    }

    const updatedImage =
      Cookies.get(
        "profileImage"
      );

    if (updatedImage) {

      setProfileImage(
        updatedImage
      );

    }

  };

  window.addEventListener(
    "userChanged",
    updateUser
  );

  return () => {

    window.removeEventListener(
      "userChanged",
     
      updateUser
    );

  };

}, []);
const getCode = (val: string) => {
  const found = AIRPORTS.find(
    (a) =>
      val.toLowerCase().includes(a.city.toLowerCase()) ||
      val.toLowerCase().includes(a.code.toLowerCase())
  );

  return found ? found.code : val;
};

const handleSearch = () => {
  if (tab === "flights") {
    if (!search.from || !search.to || !search.departure) {
     toast.error(
  "Please fill all flight details"
);
    }

    const fromCode = getCode(search.from); // 🔥 FIX
    const toCode = getCode(search.to);     // 🔥 FIX

    console.log("SENDING:", fromCode, toCode);

    router.push(
      `/flights?from=${fromCode}&to=${toCode}&date=${search.departure}`
    );
  }

  else if (tab === "hotels") {
    if (!search.to || !search.departure || !search.returnDate) {
     toast.error(
  "Please fill all hotel details"
);
    }

    router.push(
      `/hotels?location=${search.to}&checkIn=${search.departure}&checkOut=${search.returnDate}&guests=${search.guests}`
    );
  }

  else if (tab === "cars") {
    if (!search.to || !search.departure || !search.returnDate) {
      toast.error(
  "Please fill all car details"
);
    }

    router.push(
      `/cars?location=${search.to}&startDate=${search.departure}&endDate=${search.returnDate}`
    );
  }
};
const increaseGuests = () => {
  setSearch((prev) => ({
    ...prev,
    guests: prev.guests + 1,
  }));
};

const decreaseGuests = () => {
  setSearch((prev) => ({
    ...prev,
    guests: prev.guests > 1 ? prev.guests - 1 : 1, // 🔒 min 1
  }));
};


  return (
    <main>


      {/* NAVBAR */}
      <motion.nav
        className="navbar"
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="container nav-flex">
          <div className="logo">AirVoyage</div>

          <div className="nav-links">
            <a href="#destinations">Destinations</a>
            <a href="#deals">Deals</a>
            <a href="#hotels">Hotels</a>
          </div>

        {/* USER MENU */}

<div className="user-menu">

  <motion.button
    className="profile-btn"
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    onClick={() => {

      if (!user) {

        setOpenAuth(true);

      } else {

        setShowMenu(!showMenu);

      }

    }}
  >
{/*  */}





 <div
  style={{
    display:"flex",
    alignItems:"center",
    gap:"10px",
  }}
>

  {/* <img
    src={
      profileImage ||
       "/images/photo.jpg"
    }
    alt="profile"
    style={{
      width:"42px",
      height:"42px",
      borderRadius:"50%",
      objectFit:"cover",
      border:"2px solid #d4af37",
    }}
  /> */}

  <span>
    {user
      ? `Hi, ${user.name}`
      : "Sign In"}
  </span>

</div>

  </motion.button>

  {user && showMenu && (

   <div className="profile-dropdown">

  <div className="profile-header">



    <h3>{user?.name}</h3>

    <p>{user?.email}</p>

  </div>

      <button
        onClick={() =>
          router.push("/profile")
        }
      >
        My Profile
      </button>

      <button
        onClick={() =>
          router.push("/passport")
        }
      >
        E-Passport
      </button>

      

      <button
        onClick={() =>
          router.push("/my-bookings")
        }
      >
        My Bookings
      </button>

      <button
        onClick={() =>
          router.push("/visa")
        }
      >
        Visa Services
      </button>

      <button
  onClick={() => {

    /* KEEP PROFILE IMAGE */

    const savedImage =
      Cookies.get(
        "profileImage"
      );

    /* REMOVE ONLY AUTH */

    localStorage.removeItem(
      "token"
    );

    localStorage.removeItem(
      "user"
    );

    sessionStorage.clear();

    /* RESTORE IMAGE */

    if (savedImage) {

      Cookies.set(
        "profileImage",
        savedImage,
        {
          expires: 365,
        }
      );

    }

    toast.success(
      "Logged out successfully"
    );

    setUser(null);

    setShowMenu(false);

    setTimeout(() => {

      router.push("/");

    }, 1000);

  }}
>
  Logout
</button>

    </div>

  )}

</div>
        </div>
      </motion.nav>

      {/* HERO */}
      <section className="hero premium-hero">
        <div className="container hero-grid">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
          >
            <h1 className="title">Fly Beyond Limits</h1>
            <h1 className="highlight">Luxury In Every Mile</h1>

            {/* TABS */}
            <div className="tabs">
              <motion.button whileTap={{ scale: 0.9 }} onClick={() => setTab("flights")} className={tab==="flights"?"active":""}>
                <FaPlane /> Flights
              </motion.button>
              <motion.button whileTap={{ scale: 0.9 }} onClick={() => setTab("hotels")} className={tab==="hotels"?"active":""}>
                <FaHotel /> Hotels
              </motion.button>
              <motion.button whileTap={{ scale: 0.9 }} onClick={() => setTab("cars")} className={tab==="cars"?"active":""}>
                <FaCar /> Cars
              </motion.button>
            </div>

            {/* SEARCH */}
            <motion.div
  className="search-box premium-glass advanced-search"
  initial={{ opacity: 0, y: 40 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 0.3 }}
>

  {/* ✈ FLIGHTS */}
  {tab === "flights" && (
    <>
     <div className="field">
  <label>From</label>
  <input
    placeholder="City or Airport (DEL)"
    value={search.from}
    onChange={(e) => handleAirportSearch(e.target.value, "from")}
  />

  {activeField === "from" && suggestions.length > 0 && (
    <div className="dropdown">
      {suggestions.map((s, i) => (
        <div
          key={i}
          className="dropdown-item"
          onClick={() => {
            setSearch({ ...search, from: `${s.city} (${s.code})` });
            setSuggestions([]);
          }}
        >
          ✈ {s.city} ({s.code})
        </div>
      ))}
    </div>
  )}
</div>
      <div className="field">
  <label>To</label>
  <input
    placeholder="City or Airport (BOM)"
    value={search.to}
    onChange={(e) => handleAirportSearch(e.target.value, "to")}
  />

  {activeField === "to" && suggestions.length > 0 && (
    <div className="dropdown">
      {suggestions.map((s, i) => (
        <div
          key={i}
          className="dropdown-item"
          onClick={() => {
            setSearch({ ...search, to: `${s.city} (${s.code})` });
            setSuggestions([]);
          }}
        >
          ✈ {s.city} ({s.code})
        </div>
      ))}
    </div>
  )}
</div>
      <div className="field">
        <label>Departure</label>
        <input
          type="date"
          onChange={(e) =>
            setSearch({ ...search, departure: e.target.value })
          }
        />
      </div>

      <div className="field">
        <label>Return</label>
        <input
          type="date"
          onChange={(e) =>
            setSearch({ ...search, returnDate: e.target.value })
          }
        />
      </div>

      <div className="field">
  <label><FaUser /> Passengers</label>

  <div className="stepper">
    <button onClick={decreaseGuests}>-</button>
    <span>{search.guests}</span>
    <button onClick={increaseGuests}>+</button>
  </div>
</div>
    </>
  )}

  {/* 🏨 HOTELS */}
  {tab === "hotels" && (
    <>
      <div className="field">
        <label>Location</label>
        <input
          placeholder="Goa / Dubai / Paris"
          onChange={(e) =>
            setSearch({ ...search, to: e.target.value })
          }
        />
      </div>

      <div className="field">
        <label>Check-in</label>
        <input
          type="date"
          onChange={(e) =>
            setSearch({ ...search, departure: e.target.value })
          }
        />
      </div>

      <div className="field">
        <label>Check-out</label>
        <input
          type="date"
          onChange={(e) =>
            setSearch({ ...search, returnDate: e.target.value })
          }
        />
      </div>

    <div className="field">
  <label>Guests</label>

  <div className="stepper">
    <button onClick={decreaseGuests}>-</button>
    <span>{search.guests}</span>
    <button onClick={increaseGuests}>+</button>
  </div>
</div>
    </>
  )}

  {/* 🚗 CARS */}
  {tab === "cars" && (
    <>
      <div className="field">
        <label>City</label>
        <input
          placeholder="Delhi"
          onChange={(e) =>
            setSearch({ ...search, to: e.target.value })
          }
        />
      </div>

      <div className="field">
        <label>Pickup Date</label>
        <input
          type="date"
          onChange={(e) =>
            setSearch({ ...search, departure: e.target.value })
          }
        />
      </div>

      <div className="field">
        <label>Drop Date</label>
        <input
          type="date"
          onChange={(e) =>
            setSearch({ ...search, returnDate: e.target.value })
          }
        />
      </div>

      <div className="field">
  <label>Passengers</label>

  <div className="stepper">
    <button onClick={decreaseGuests}>-</button>
    <span>{search.guests}</span>
    <button onClick={increaseGuests}>+</button>
  </div>
</div>
    </>
  )}

  {/* 🔥 COMMON BUTTON */}
  <motion.button
    className="search-btn big"
    whileHover={{ scale: 1.03 }}
    whileTap={{ scale: 0.97 }}
    onClick={handleSearch}
  >
    Search
  </motion.button>

</motion.div>
          </motion.div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="section services">
        <motion.h2 variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}>
          All Travel Services
        </motion.h2>

        <motion.div className="cards" variants={stagger} initial="hidden" whileInView="show">
          {[FaPlane, FaHotel, FaCar].map((Icon, i) => (
            <motion.div key={i} variants={fadeUp} whileHover={{ y: -10 }} className="service">
              <Icon size={28} />
              <h3>{["Flights","Hotels","Cars"][i]}</h3>
              <p>Premium experience</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* DESTINATIONS */}
      <section id="destinations" className="section">
        <motion.h2 variants={fadeUp} initial="hidden" whileInView="show">
          Popular Destinations
        </motion.h2>

        <motion.div className="cards" variants={stagger} initial="hidden" whileInView="show">
          {[
            { name: "Paris", price: "₹25,000", img: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34" },
            { name: "Dubai", price: "₹30,000", img: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c" },
            { name: "Maldives", price: "₹45,000", img: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e" },
          ].map((item, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              whileHover={{ scale: 1.05 }}
              className="premium-card"
              onClick={() =>
                router.push(
                  `/flights?from=Delhi&to=${item.name}&date=${new Date()
                    .toISOString()
                    .split("T")[0]}`
                )
              }
            >
              <Image src={item.img} width={400} height={250} alt={item.name} />
              <div className="card-overlay">
                <h3><FaMapMarkerAlt /> {item.name}</h3>
                <p>{item.price}</p>
                <button className="primary small">Book Now</button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

   {/* DEALS */}
<section id="deals" className="section dark">
  <motion.h2 variants={fadeUp} initial="hidden" whileInView="show">
    Flash Deals
  </motion.h2>

  <motion.div
    className="cards"
    variants={stagger}
    initial="hidden"
    animate="show"   // 🔥 FIXED (was whileInView)
  >
    {/* ❌ EMPTY */}
    {(!deals || deals.length === 0) && (
      <p style={{ textAlign: "center", width: "100%" }}>
        No recent flights available
      </p>
    )}

    {/* 🔥 SHOW LAST 3 */}
    {(deals || []).slice(0, 3).map((d, i) => {
      
      // ✅ GET MIN PRICE FROM SEATS
    const minPrice =
  d?.seats?.length > 0
    ? Math.min(
        ...d.seats.map(
          (s: any) => Number(s.price) || 0
        )
      )
    : "--";

      const safeDate = d?.departureTime
        ? new Date(d.departureTime).toDateString()
        : "Flexible";

      return (
        <motion.div
          key={d._id || i}
          variants={fadeUp}
          initial="hidden"     // 🔥 IMPORTANT
          animate="show"       // 🔥 IMPORTANT
          whileHover={{ scale: 1.08 }}
          className="deal-card"
        >
          <h3>
            {d?.from || "City"} → {d?.to || "City"}
          </h3>

          <p>₹{minPrice}</p>

          <small>
            {d?.airline || "AirVoyage"} • {safeDate}
          </small>

          <button
            className="primary small"
            onClick={() =>
              router.push(
                `/flights?from=${d.from}&to=${d.to}&date=${
                  d.departureTime
                    ? new Date(d.departureTime).toISOString().split("T")[0]
                    : ""
                }`
              )
            }
          >
            Book Now
          </button>
        </motion.div>
      );
    })}
  </motion.div>
</section>

{/* COUPONS */}
<section className="section">
  <motion.h2 variants={fadeUp} initial="hidden" whileInView="show">
    Coupons & Offers
  </motion.h2>

  <div className="slider-container">

    {/* EMPTY */}
    {(!coupons || coupons.length === 0) && (
      <p style={{ textAlign: "center" }}>
        No offers available
      </p>
    )}

    {/* SLIDER */}
    <div
      className="slider-track"
      style={{
        transform: `translateX(-${currentSlide * 100}%)`,
      }}
    >
      {(coupons || []).map((c, i) => {

        const images = [
          "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
          "https://images.unsplash.com/photo-1501785888041-af3ef285b470",
          "https://images.unsplash.com/photo-1512453979798-5ea266f8880c"
        ];

        const bg = images[i % images.length];

        return (
          <div key={c._id || i} className="slide">
            <motion.div
              className="coupon-banner"
              style={{ backgroundImage: `url(${bg})` }}
              whileHover={{ scale: 1.02 }}
            >

              {/* OVERLAY */}
              <div className="overlay"></div>

              {/* LEFT */}
              <div className="coupon-left">

                <h2 className="coupon-title">
                  <FaTag /> {c.discount || 50}% OFF
                </h2>

                <p className="desc">
                  <FaPlane /> {c.description || "Flight discount offer"}
                </p>

                <small className="expiry">
                  <FaClock />{" "}
                  {c.expiry
                    ? new Date(c.expiry).toDateString()
                    : "Limited time"}
                </small>
              </div>

              {/* RIGHT */}
              <div className="coupon-right">

                <div className="coupon-code-box">
                  <FaTicketAlt /> {c.code || "SAVE50"}
                </div>

                <button
                  className="apply-btn"
                  onClick={() => {
                    navigator.clipboard.writeText(c.code);
                    toast.success(
  "Coupon copied!"
);
                  }}
                >
                  Copy
                </button>
              </div>

            </motion.div>
          </div>
        );
      })}
    </div>

    {/* DOTS */}
    <div className="dots">
      {(coupons || []).map((_, i) => (
        <span
          key={i}
          className={i === currentSlide ? "active" : ""}
          onClick={() => setCurrentSlide(i)}
        />
      ))}
    </div>
  </div>
</section>

      {/* ================= HOTELS ================= */}
<section id="hotels" className="section">

  {/* HEADER */}
  <motion.div
    variants={fadeUp}
    initial="hidden"
    whileInView="show"
    className="section-header"
  >
    <h2>Luxury Hotels</h2>
    <p>Handpicked premium stays for your journey</p>
  </motion.div>

  {/* EMPTY STATE */}
  {(!hotels || hotels.length === 0) && (
    <p className="empty-text">
      No hotels available
    </p>
  )}

  {/* GRID */}
  <div className="hotel-grid">
    {(hotels || []).slice(0, 3).map((h, i) => {

      const img =
        h.image?.startsWith("http")
          ? h.image
          : h.image
          ? `https://airvoyage-final-project-backend-2.onrender.com/${h.image.replace(/\\/g, "/")}`
          : "https://images.unsplash.com/photo-1566073771259-6a8506099945";

      return (
        <motion.div
          key={h._id || i}
          variants={fadeUp}
          whileHover={{ y: -8, scale: 1.02 }}
          className="hotel-card"
          onClick={() =>
            router.push(`/hotels?location=${h.location}`)
          }
        >
          {/* IMAGE */}
          <div className="hotel-image-wrapper">
            <Image
              src={img}
              width={400}
              height={260}
              alt={h.name}
              className="hotel-image"
            />

            {/* GRADIENT OVERLAY */}
            <div className="hotel-overlay" />

            {/* TEXT OVERLAY */}
            <div className="hotel-info">
              <h3>{h.name}</h3>
              <p>₹{h.pricePerNight}/night</p>

              <button
                className="primary small"
                onClick={(e) => {
                  e.stopPropagation();
                  router.push(`/hotels?location=${h.location}`);
                }}
              >
                View Details
              </button>
            </div>
          </div>
        </motion.div>
      );
    })}
  </div>

</section>


{/* ================= PREMIUM EXPERIENCE ================= */}

<section className="premium-experience">

  <div className="premium-overlay"></div>

  <motion.div
    className="premium-content"
    initial={{ opacity: 0, y: 60 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.7 }}
  >

    <span className="premium-badge">
      Luxury Aviation Experience
    </span>

    <h2>
      Experience Premium Flying
    </h2>

    <p>
      First-class journeys, luxury lounges,
      premium dining, and seamless travel
      crafted for elite travelers around the world.
    </p>

    <div className="premium-features">

      <div className="feature-box">
        <FaCrown />
        <span>VIP Boarding</span>
      </div>

      <div className="feature-box">
        <FaHotel />
        <span>Luxury Lounge</span>
      </div>

      <div className="feature-box">
        <FaGlobe />
        <span>Global Destinations</span>
      </div>

    </div>

    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.96 }}
      className="premium-book-btn"
      onClick={() => {

        const searchSection =
          document.querySelector(
            ".advanced-search"
          );

        searchSection?.scrollIntoView({
          behavior: "smooth",
        });

      }}
    >

      <FaPlane />

      Book Your Flight

    </motion.button>

  </motion.div>

</section>

{/* ================= MINI WORLD MAP ================= */}

<section className="mini-map-section">

  <div className="mini-map-header">

    <div>

      <h2>
        Global Airports Network
      </h2>

      <p>
        Explore premium international airports
      </p>

    </div>

  </div>

  <div
    style={{
      marginTop: "24px",
    }}
  >

    <WorldMap />

  </div>

</section>


      {/* CTA */}
      {/* <motion.section className="cta" initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }}>
        <h2>Experience Premium Flying ✈️</h2>
        <motion.button className="primary" whileHover={{ scale: 1.05 }} onClick={() => router.push("/flights")}>
          Book Your Flight
        </motion.button>
      </motion.section> */}

    {/* ================= PREMIUM FOOTER ================= */}

<motion.footer
  className="ultra-footer"

  initial={{
    opacity: 0,
    y: 60,
  }}

  whileInView={{
    opacity: 1,
    y: 0,
  }}

  style={{

    position: "relative",

    overflow: "hidden",

    minHeight: "460px",

  }}
>

{/* ✈️ CINEMATIC AIRPLANE IMAGE */}

<img
  src="/images/plane.png"
  alt="plane"

  style={{

    position: "absolute",

    inset: 0,

    width: "100%",

    height: "100%",

    objectFit: "cover",

    zIndex: 0,

  }}
/>

  {/* 🔥 DARK PREMIUM OVERLAY */}

  <div
    style={{

      position: "absolute",

      inset: 0,

      background:
        `
        linear-gradient(
          to top,
          rgba(0,0,0,.92),
          rgba(0,0,0,.45)
        )
        `,

      zIndex: 1,

      backdropFilter:
        "blur(1px)",

    }}
  />

  {/* EXISTING GLOW */}

  <div className="footer-glow"></div>

  {/* CONTENT */}

  <div
    style={{
      position: "relative",
      zIndex: 2,
    }}
  >

    <div className="container footer-premium-grid">

      {/* BRAND */}

      <div>

        <h2 className="footer-logo">
          AirVoyage
        </h2>

        <p className="footer-desc">

          Luxury travel platform crafted for
          premium global journeys, elite
          experiences, and unforgettable flights.

        </p>

        <div className="socials">

          <span>
            <FaPlane />
          </span>

          <span>
            <FaGlobe />
          </span>

          <span>
            <FaHotel />
          </span>

          <span>
            <FaCar />
          </span>

        </div>

      </div>

      {/* COMPANY */}

      <div>

        <h4>
          Company
        </h4>

        <p>
          About Us
        </p>

        <p>
          Careers
        </p>

        <p>
          Investors
        </p>

        <p>
          Newsroom
        </p>

      </div>

      {/* SUPPORT */}

      <div>

        <h4>
          Support
        </h4>

        <p
          onClick={() =>
            router.push("/support")
          }

          style={{
            cursor:"pointer",
          }}
        >
          Help Center
        </p>

        <p>
          Refund Policy
        </p>

        <p>
          Privacy Policy
        </p>

        <p>
          Terms & Conditions
        </p>

      </div>

      {/* CONTACT */}

      <div>

        <h4>
          Contact
        </h4>

        <p>
          support@airvoyage.com
        </p>

        <p>
          +91 98765 43210
        </p>

        <p>
          Dubai • London • Paris
        </p>

      </div>

    </div>

    {/* BOTTOM */}

    <div className="footer-bottom">

      <FaPlane />

      <span>
        © 2026 AirVoyage. Premium Luxury Aviation Platform.
      </span>

    </div>

  </div>

</motion.footer>
<button
  className="floating-support-btn"
  onClick={() =>
    router.push("/support")
  }
>
  <FaHeadset />

  <span>
    Help
  </span>
</button>
 <AuthMiniSidebar open={openAuth} setOpen={setOpenAuth} />
    </main>
  );
}