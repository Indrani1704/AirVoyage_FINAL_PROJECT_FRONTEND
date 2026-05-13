"use client";

import { useState } from "react";

const visas = [

  {
    country:"Dubai",
    image:"https://images.unsplash.com/photo-1512453979798-5ea266f8880c",
    requirements:[
      "Passport",
      "Passport Photo",
      "Bank Statement",
      "Flight Ticket",
    ],
  },

  {
    country:"USA",
    image:"https://images.unsplash.com/photo-1485738422979-f5c462d49f74",
    requirements:[
      "Passport",
      "DS-160 Form",
      "Financial Proof",
      "Interview",
    ],
  },

  {
    country:"France",
    image:"https://images.unsplash.com/photo-1502602898657-3e91760cbb34",
    requirements:[
      "Passport",
      "Travel Insurance",
      "Hotel Booking",
      "Bank Statement",
    ],
  },

];

export default function VisaPage(){

  const [selected,setSelected] =
    useState<any>(null);

  return(

    <div className="premium-page">

      <div className="premium-container">

        <div className="page-card">

          <h1 className="page-title">
            Visa Services
          </h1>

          <p className="page-subtitle">
            Apply international visas easily
          </p>

          <div className="visa-grid">

            {visas.map((visa,i)=>(

              <div
                className="visa-card"
                key={i}
              >

                <img
                  src={visa.image}
                  className="visa-image"
                  alt=""
                />

                <div className="visa-body">

                  <h2>
                    {visa.country} Visa
                  </h2>

                  <button
                    className="apply-btn"
                    onClick={() =>
                      setSelected(visa)
                    }
                  >
                    Apply Now
                  </button>

                </div>

              </div>

            ))}

          </div>

        </div>

      </div>

      {/* DIALOG */}

      {selected && (

        <div
          className="visa-modal-bg"
          onClick={() =>
            setSelected(null)
          }
        >

          <div
            className="visa-modal"
            onClick={(e)=>
              e.stopPropagation()
            }
          >

            <h1>
              {selected.country} Visa
            </h1>

            <p>
              Required Documents
            </p>

            <ul>

              {selected.requirements.map(
                (item:string,i:number)=>(
                  <li key={i}>
                    ✓ {item}
                  </li>
                )
              )}

            </ul>

            <button
              className="apply-btn"
              onClick={()=>{
                alert(
                  "Visa Applied Successfully"
                );

                setSelected(null);
              }}
            >
              Submit Application
            </button>

          </div>

        </div>

      )}

    </div>

  );

}