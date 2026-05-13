"use client";

import { ScatterChart, Scatter, XAxis, YAxis, Tooltip } from "recharts";

const data = [
  { day: 30, price: 5000 },
  { day: 15, price: 5500 },
  { day: 5, price: 6000 },
];

export default function PriceGraph() {
  return (
    <ScatterChart width={400} height={200}>
      <XAxis dataKey="day" name="Days Before" />
      <YAxis dataKey="price" name="Price" />
      <Tooltip />
      <Scatter data={data} fill="#8B0000" />
    </ScatterChart>
  );
}