const BASE = "https://airvoyage-final-project-backend-2.onrender.com/api";
import Cookies from "js-cookie";
import toast from "react-hot-toast";

/* ================= TOKEN ================= */
const getToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("token");
  }
  return null;
};

/* ================= LOGOUT ================= */
const handleLogout = () => {

  if (typeof window !== "undefined") {

    /* SAVE IMAGE */

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

    setTimeout(() => {

      window.location.href =
        "/login";

    }, 1200);

  }

};
/* ================= CORE FETCH ================= */
const fetchAPI = async (
  url: string,
  options: any = {}
) => {
  const token = getToken();

  const res = await fetch(`${BASE}${url}`, {
    ...options,

    headers: {
      ...(options.body
        ? { "Content-Type": "application/json" }
        : {}),

      ...(token
        ? { Authorization: `Bearer ${token}` }
        : {}),

      ...(options.headers || {}),
    },
  });

  //  Read raw response safely
  const text = await res.text();

  let data: any = null;

  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }

  /* ================= AUTH HANDLING ================= */

  if (res.status === 401) {
    console.warn(" Session expired");

    handleLogout();

    throw new Error("Session expired");
  }

  if (res.status === 403) {
    console.warn("🚫 Access denied");

    throw new Error(
      data?.message ||
        data?.msg ||
        "Access denied"
    );
  }

  /* ================= ERROR HANDLING ================= */

  if (!res.ok) {
    console.error(
      "❌ API ERROR STATUS:",
      res.status
    );

    console.error(
      "❌ API ERROR BODY:",
      data
    );

    throw new Error(
      data?.message ||
        data?.msg ||
        data?.error ||
        (typeof data === "string"
          ? data
          : "Something went wrong")
    );
  }

  /* ================= SUCCESS ================= */

  return data;
};

export default fetchAPI;

/* ================= AUTH APIs ================= */

export const loginUser = async (data: any) => {
  return fetchAPI("/auth/login", {
    method: "POST",
    body: JSON.stringify(data),
  });
};

export const registerUser = async (data: any) => {
  return fetchAPI("/auth/register", {
    method: "POST",
    body: JSON.stringify(data),
  });
};



/* ================= FLIGHTS ================= */

export const getFlights = async () => {
  return fetchAPI("/flights");
};

export const createFlight = async (
  data: any
) => {
  return fetchAPI("/flights", {
    method: "POST",
    body: JSON.stringify(data),
  });
};

export const updateFlight = async (
  id: string,
  data: any
) => {
  return fetchAPI(`/flights/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
};

export const deleteFlight = async (
  id: string
) => {
  return fetchAPI(`/flights/${id}`, {
    method: "DELETE",
  });
};