"use client";

import React from "react";

type Props = {
  flightId: string;
  seat: string;
};

export default function PaymentPage({
  flightId,
  seat,
}: Props) {

  const pay = async () => {

    try {

      /* ================= CREATE ORDER ================= */

      const res = await fetch(
        "https://airvoyage-final-project-backend-2.onrender.com/api/payments/create",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            amount: 5000,
          }),
        }
      );

      const data = await res.json();

      /* ================= LOAD RAZORPAY ================= */

      if (!(window as any).Razorpay) {

        const script =
          document.createElement("script");

        script.src =
          "https://checkout.razorpay.com/v1/checkout.js";

        script.async = true;

        document.body.appendChild(script);

        await new Promise<void>((resolve) => {
          script.onload = () => resolve();
        });
      }

      /* ================= OPEN PAYMENT ================= */

      const rzp =
        new (window as any).Razorpay({

          key:
            process.env
              .NEXT_PUBLIC_RAZORPAY_KEY,

          order_id:
            data.id,

          amount:
            data.amount,

          currency:
            "INR",

          name:
            "AirVoyage",

          description:
            "Flight Booking Payment",

          theme: {
            color: "#8B0000",
          },

          handler:
            async (
              response: any
            ) => {

              try {

                /* ================= VERIFY PAYMENT ================= */

                await fetch(
                  "https://airvoyage-final-project-backend-2.onrender.com/api/payments/verify",
                  {
                    method: "POST",

                    headers: {
                      "Content-Type":
                        "application/json",
                    },

                    body: JSON.stringify(
                      response
                    ),
                  }
                );

                /* ================= SAVE BOOKING ================= */

                await fetch(
                  "https://airvoyage-final-project-backend-2.onrender.com/api/bookings",
                  {
                    method: "POST",

                    headers: {
                      "Content-Type":
                        "application/json",
                    },

                    body: JSON.stringify({
                      flightId,
                      seat,
                    }),
                  }
                );

                alert(
                  "Payment Successful"
                );

              } catch (err: any) {

                console.log(err);

                alert(
                  "Booking Failed"
                );

              }

            },

        });

      rzp.open();

    } catch (err: any) {

      console.log(err);

      alert(
        "Payment Failed"
      );

    }

  };

  return (
    <button
      onClick={pay}
      style={{
        padding: "12px 24px",

        background:
          "linear-gradient(135deg,#8B0000,#C62828)",

        color: "#fff",

        border: "none",

        borderRadius: "10px",

        cursor: "pointer",

        fontWeight: 700,
      }}
    >
      Pay Now
    </button>
  );

}