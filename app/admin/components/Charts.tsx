"use client";

import {
  LineChart, Line, XAxis, YAxis, Tooltip, BarChart, Bar
} from "recharts";

const revenue = [
  { month: "Jan", value: 5000 },
  { month: "Feb", value: 8000 },
  { month: "Mar", value: 12000 },
];

export default function Charts() {
  return (
    <>
      <LineChart width={500} height={250} data={revenue}>
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Line dataKey="value" stroke="#8B0000" />
      </LineChart>

      <BarChart width={500} height={250} data={revenue}>
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="value" fill="#D4AF37" />
      </BarChart>
    </>
  );
}