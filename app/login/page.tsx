"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { loginUser } from "../lib/api";

export default function LoginPage() {

  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const handleLogin = async () => {

    try {

      setLoading(true);

      const data = await loginUser({
        email,
        password,
      });

      // ✅ DEBUG RESPONSE
      console.log(
        "FULL LOGIN RESPONSE:",
        data
      );

      console.log(
        "TOKEN VALUE:",
        data?.token
      );

      // ✅ CHECK TOKEN EXISTS
      if (!data?.token) {

        alert(
          "Token missing from backend response"
        );

        return;
      }

      // ✅ SAVE TOKEN
      localStorage.setItem(
        "token",
        data.token
      );

      // ✅ SAVE USER
      localStorage.setItem(
        "user",
        JSON.stringify(data.user)
      );

      // ✅ VERIFY SAVED TOKEN
      console.log(
        "STORED TOKEN:",
        localStorage.getItem("token")
      );

      alert("✅ Login successful");

      router.push("/");

    } catch (err: any) {

      console.error(
        "LOGIN ERROR:",
        err
      );

      alert(
        err?.message ||
        "Login failed"
      );

    } finally {

      setLoading(false);
    }
  };

  return (

    <div className="flex items-center justify-center h-screen bg-gray-100">

      <div className="bg-white p-6 rounded-xl shadow w-[350px] space-y-4">

        <h2 className="text-2xl font-bold text-center">
          Login
        </h2>

        <input
          placeholder="Email"
          className="w-full border p-2 rounded"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full border p-2 rounded"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
        />

        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          {loading
            ? "Logging in..."
            : "Login"}
        </button>

      </div>

    </div>
  );
}