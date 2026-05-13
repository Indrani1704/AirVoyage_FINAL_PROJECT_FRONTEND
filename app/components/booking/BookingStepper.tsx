"use client";

import { useState } from "react";
import SeatMap from "../seat/SeatMap";
import PassengerForm from "./PassengerForm";
import PaymentPage from "./PaymentPage";

export default function BookingStepper({ flight }: any) {
  const [step, setStep] = useState(1);
  const [seat, setSeat] = useState("");

  return (
    <div>
      {step === 1 && (
        <SeatMap
          flightId={flight._id}
          onSelect={(s: string) => {
            setSeat(s);
            setStep(2);
          }}
        />
      )}

      {step === 2 && <PassengerForm onNext={() => setStep(3)} />}
      {step === 3 && <PaymentPage seat={seat} flightId={flight._id} />}
    </div>
  );
}