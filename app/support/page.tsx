// app/support/page.tsx

"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import Cookies
  from "js-cookie";

import socket
  from "../lib/socket";

export default function SupportPage() {

  const [mounted,setMounted] =
    useState(false);

  const [user,setUser] =
    useState<any>(null);

  const [messages,setMessages] =
    useState<any[]>([]);

  const [message,setMessage] =
    useState("");

  const bottomRef =
    useRef<any>(null);

  /* ================= LOAD USER ================= */

  useEffect(()=>{

    setMounted(true);

    const storedUser =
      localStorage.getItem(
        "user"
      );

    if(storedUser){

      const parsed =
        JSON.parse(storedUser);

      setUser(parsed);

      socket.emit(
        "join",
        parsed._id
      );

      /* LOAD COOKIE CHAT */

      const saved =
        Cookies.get(
          `support_${parsed._id}`
        );

      if(saved){

        setMessages(
          JSON.parse(saved)
        );

      }

    }

  },[]);

 /* ================= RECEIVE ================= */

useEffect(()=>{

  socket.off(
    "receive_message"
  );

  socket.on(
    "receive_message",
    (data)=>{

      console.log(
        "USER RECEIVED:",
        data
      );

      setMessages((prev)=>{

        /* PREVENT DUPLICATES */

        const exists =
          prev.some(
            (m)=>

              m.message ===
              data.message &&

              m.sender ===
              data.sender &&

              m.userId ===
              data.userId
          );

        if(exists)
          return prev;

        const updated = [
          ...prev,
          data,
        ];

        if(user?._id){

          Cookies.set(
            `support_${user._id}`,
            JSON.stringify(updated),
            {
              expires:7,
            }
          );

        }

        return updated;

      });

    }
  );

  return ()=>{

    socket.off(
      "receive_message"
    );

  };

},[
  user
]);

  /* ================= AUTO SCROLL ================= */

  useEffect(()=>{

    bottomRef.current
      ?.scrollIntoView({
        behavior:"smooth",
      });

  },[
    messages
  ]);

  /* ================= SEND ================= */

  const sendMessage =
    ()=>{

      if(
        !message.trim() ||
        !user
      ) return;

      const data = {

        userId:
          user._id,

        userName:
          user.name,

        sender:"user",

        message,

      };

      socket.emit(
        "send_message",
        data
      );

      const updated = [
        ...messages,
        data,
      ];

      setMessages(updated);

      Cookies.set(
        `support_${user._id}`,
        JSON.stringify(updated),
        {
          expires:7,
        }
      );

      setMessage("");

    };

  /* ================= LOADING ================= */

  if(!mounted){

    return null;

  }

  /* ================= NO USER ================= */

  if(!user){

    return(

      <div
        style={{

          height:"100vh",

          display:"flex",

          alignItems:"center",

          justifyContent:"center",

          background:"#fff",

          color:"#8B0000",

          fontSize:"30px",

          fontWeight:900,

        }}
      >

        Login Required

      </div>

    );

  }

  return(

    <div
      style={{

        height:"100vh",

        display:"flex",

        flexDirection:"column",

        background:"#ffffff",

        overflow:"hidden",

      }}
    >

      {/* ================= HEADER ================= */}

      <div
        style={{

          padding:"22px 30px",

          background:
            "linear-gradient(135deg,#8B0000,#C89B3C)",

          color:"#fff",

          boxShadow:
            "0 10px 30px rgba(0,0,0,.1)",

        }}
      >

        <h1
          style={{

            margin:0,

            fontSize:"30px",

            fontWeight:900,

          }}
        >

          Premium Support

        </h1>

        <p
          style={{

            marginTop:"8px",

            fontSize:"14px",

            opacity:.95,

          }}
        >

          Welcome {user.name}

        </p>

      </div>

      {/* ================= CHAT AREA ================= */}

      <div
        style={{

          flex:1,

          overflowY:"auto",

          padding:"35px",

          display:"flex",

          flexDirection:"column",

          gap:"18px",

          background:"#fafafa",

        }}
      >

        {messages.length === 0 && (

          <div
            style={{

              margin:"auto",

              textAlign:"center",

            }}
          >

            <div
              style={{

                width:"130px",

                height:"130px",

                borderRadius:"50%",

                background:
                  "linear-gradient(135deg,#8B0000,#C89B3C)",

                display:"flex",

                alignItems:"center",

                justifyContent:"center",

                color:"#fff",

                fontSize:"50px",

                margin:"0 auto 24px",

              }}
            >

              💬

            </div>

            <h2
              style={{

                color:"#111",

                marginBottom:"10px",

              }}
            >

              Start Conversation

            </h2>

            <p
              style={{

                color:"#777",

              }}
            >

              Our premium support team is here for you

            </p>

          </div>

        )}

        {messages.map((m,i)=>(

          <div

            key={i}

            style={{

              display:"flex",

              justifyContent:
                m.sender ===
                "user"

                ? "flex-end"

                : "flex-start",

            }}
          >

            <div
              style={{

                maxWidth:"70%",

                padding:"16px 20px",

                borderRadius:
                  m.sender ===
                  "user"

                  ? "22px 22px 6px 22px"

                  : "22px 22px 22px 6px",

                background:
                  m.sender ===
                  "user"

                  ? "linear-gradient(135deg,#8B0000,#C89B3C)"

                  : "#fff",

                color:
                  m.sender ===
                  "user"

                  ? "#fff"

                  : "#111",

                border:
                  m.sender ===
                  "user"

                  ? "none"

                  : "1px solid #f0dddd",

                boxShadow:
                  "0 8px 25px rgba(0,0,0,.06)",

                lineHeight:"1.6",

                fontSize:"15px",

                wordBreak:"break-word",

              }}
            >

              {m.message}

            </div>

          </div>

        ))}

        <div ref={bottomRef}/>

      </div>

      {/* ================= INPUT ================= */}

      <div
        style={{

          padding:"22px",

          display:"flex",

          gap:"18px",

          background:"#fff",

          borderTop:
            "1px solid #f0dddd",

        }}
      >

        <input

          value={message}

          onChange={(e)=>
            setMessage(
              e.target.value
            )
          }

          onKeyDown={(e)=>{

            if(
              e.key === "Enter"
            ){

              sendMessage();

            }

          }}

          placeholder="Type your message..."

          style={{

            flex:1,

            padding:"18px 22px",

            borderRadius:"18px",

            border:
              "1px solid #e9caca",

            background:"#fafafa",

            color:"#111",

            outline:"none",

            fontSize:"15px",

          }}
        />

        <button

          onClick={sendMessage}

          style={{

            border:"none",

            borderRadius:"18px",

            padding:"0 34px",

            fontWeight:800,

            fontSize:"15px",

            cursor:"pointer",

            color:"#fff",

            background:
              "linear-gradient(135deg,#8B0000,#C89B3C)",

          }}
        >

          Send

        </button>

      </div>

    </div>

  );

}