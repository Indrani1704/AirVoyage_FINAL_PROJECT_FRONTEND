"use client";

export default function PassengerForm({ onNext }: any) {
  return (
    <div>
      <input className="border p-2" placeholder="Name" />
      <button onClick={onNext}>Next</button>
    </div>
  );
}