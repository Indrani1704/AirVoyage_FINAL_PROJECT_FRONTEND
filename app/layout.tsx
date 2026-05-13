import "./globals.css";

import {
  Playfair_Display,
  Poppins,
} from "next/font/google";

import {
  Toaster,
} from "react-hot-toast";

const heading =
  Playfair_Display({
    subsets: ["latin"],
    weight: ["400", "700"],
    variable: "--font-heading",
  });

const body =
  Poppins({
    subsets: ["latin"],
    weight: [
      "300",
      "400",
      "500",
      "600",
    ],
    variable: "--font-body",
  });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (

    <html
      lang="en"
      className={`
        ${heading.variable}
        ${body.variable}
      `}
    >

      <body>

        {children}

        <Toaster
          position="top-right"
          toastOptions={{

            duration: 3000,

            style: {
              background: "#111827",
              color: "#fff",
              borderRadius: "14px",
              padding: "14px 18px",
              fontSize: "14px",
              border:
                "1px solid rgba(255,255,255,0.08)",
            },

            success: {
              iconTheme: {
                primary: "#22c55e",
                secondary: "#fff",
              },
            },

            error: {
              iconTheme: {
                primary: "#ef4444",
                secondary: "#fff",
              },
            },
          }}
        />

      </body>

    </html>
  );
}