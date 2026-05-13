"use client";

import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="fixed w-full z-50 bg-white/80 backdrop-blur-md shadow-sm">
      <div className="max-w-7xl mx-auto flex justify-between items-center p-4">
        
        <h1 className="text-2xl font-heading text-primary font-bold">
          SkyBook+
        </h1>

        <div className="flex gap-6 font-body">
          <Link href="#">Flights</Link>
          <Link href="#">Hotels</Link>
          <Link href="#">Deals</Link>
        </div>

        <button className="bg-primary text-white px-4 py-2 rounded-full hover:bg-red-800">
          Login
        </button>
      </div>
    </nav>
  );
}