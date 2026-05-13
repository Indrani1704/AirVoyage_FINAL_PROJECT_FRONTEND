"use client";

import SeatMap
  from "../components/seat/SeatMap";

export default function SeatPage() {

  const handleSeatSelect = (
    seat: string
  ) => {

    console.log(
      "Selected seat:",
      seat
    );

  };

  return (

    <SeatMap
      flightId="demo-flight-id"
      onSelect={handleSeatSelect}
    />

  );

}