// app/admin/support/page.tsx

"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import Cookies
  from "js-cookie";

import socket
  from "../../lib/socket";

export default function AdminSupportPage() {

  const [users,setUsers] =
    useState<any[]>([]);

  const [selectedUser,
    setSelectedUser] =
    useState<any>(null);

  const [messages,
    setMessages] =
    useState<any[]>([]);

  const [message,
    setMessage] =
    useState("");

  const bottomRef =
    useRef<any>(null);

  /* ================= JOIN ================= */

  useEffect(()=>{

    socket.emit(
      "join",
      "admin"
    );

    socket.emit(
      "join_admin_room"
    );

    const saved =
      Cookies.get(
        "admin_support_messages"
      );

    if(saved){

      const parsed =
        JSON.parse(saved);

      setMessages(parsed);

      /* USERS RESTORE */

      const uniqueUsers =
        parsed.reduce(
          (acc:any[],msg:any)=>{

            const exists =
              acc.find(
                (u)=>
                  u.userId ===
                  msg.userId
              );

            if(!exists){

              acc.push({

                userId:
                  msg.userId,

                userName:
                  msg.userName,

              });

            }

            return acc;

          },
          []
        );

      setUsers(uniqueUsers);

    }

  },[]);

  /* ================= RECEIVE ================= */

 /* ================= RECEIVE ================= */

useEffect(()=>{

  socket.off(
    "receive_message"
  );

  socket.on(
    "receive_message",
    (data)=>{

      console.log(
        "ADMIN RECEIVED:",
        data
      );

      /* USERS */

      setUsers((prev)=>{

        const exists =
          prev.find(
            (u)=>
              u.userId ===
              data.userId
          );

        if(exists)
          return prev;

        return [

          ...prev,

          {
            userId:
              data.userId,

            userName:
              data.userName ||
              "Customer",
          },

        ];

      });

      /* MESSAGES */

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

        Cookies.set(
          "admin_support_messages",
          JSON.stringify(updated),
          {
            expires:7,
          }
        );

        return updated;

      });

    }
  );

  return ()=>{

    socket.off(
      "receive_message"
    );

  };

},[]);

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

  const sendReply =
    ()=>{

      if(
        !message.trim() ||
        !selectedUser
      ) return;

      const data = {

        userId:
          selectedUser.userId,

        userName:
          selectedUser.userName,

        sender:"admin",

        receiverId:
          selectedUser.userId,

        message,

      };

      socket.emit(
        "send_message",
        data
      );

     

      setMessage("");

    };

  /* ================= FILTERED ================= */

  const filteredMessages =
    messages.filter(
      (m)=>
        m.userId ===
        selectedUser?.userId
    );

  return(

    <div
      style={{

        display:"flex",

        height:"100vh",

        overflow:"hidden",

        background:"#fff",

      }}
    >

      {/* ================= SIDEBAR ================= */}

      <div
        style={{

          width:"340px",

          background:"#fff",

          borderRight:
            "1px solid #f0dddd",

          display:"flex",

          flexDirection:"column",

        }}
      >

        {/* HEADER */}

        <div
          style={{

            padding:"28px",

            background:
              "linear-gradient(135deg,#8B0000,#C89B3C)",

            color:"#fff",

          }}
        >

          <h1
            style={{

              margin:0,

              fontSize:"30px",

              fontWeight:900,

            }}
          >

            Support Lobby

          </h1>

          <p
            style={{

              marginTop:"8px",

              fontSize:"14px",

            }}
          >

            Premium Support Panel

          </p>

        </div>

        {/* USERS */}

        <div
          style={{

            flex:1,

            overflowY:"auto",

            padding:"12px",

          }}
        >

          {users.length === 0 && (

            <div
              style={{

                textAlign:"center",

                marginTop:"50px",

                color:"#999",

              }}
            >

              No Active Users

            </div>

          )}

          {users.map((u)=>(

            <div

              key={u.userId}

              onClick={()=>{

                setSelectedUser(u);

              }}

              style={{

                padding:"18px",

                borderRadius:"18px",

                marginBottom:"12px",

                cursor:"pointer",

                background:
                  selectedUser?.userId ===
                  u.userId

                  ? "linear-gradient(135deg,#8B0000,#C89B3C)"

                  : "#fff",

                color:
                  selectedUser?.userId ===
                  u.userId

                  ? "#fff"

                  : "#111",

                border:
                  selectedUser?.userId ===
                  u.userId

                  ? "none"

                  : "1px solid #f3dddd",

                boxShadow:
                  "0 8px 25px rgba(0,0,0,.05)",

              }}
            >

              <div
                style={{

                  display:"flex",

                  alignItems:"center",

                  gap:"14px",

                }}
              >

                <div
                  style={{

                    width:"50px",

                    height:"50px",

                    borderRadius:"50%",

                    background:
                      "linear-gradient(135deg,#FFD700,#fff5cc)",

                    display:"flex",

                    alignItems:"center",

                    justifyContent:"center",

                    color:"#8B0000",

                    fontWeight:900,

                    fontSize:"20px",

                  }}
                >

                  {u.userName
                    ?.charAt(0)
                    ?.toUpperCase()}

                </div>

                <div>

                  <h3
                    style={{

                      margin:0,

                      fontSize:"16px",

                    }}
                  >

                    {u.userName}

                  </h3>

                  <p
                    style={{

                      marginTop:"5px",

                      fontSize:"12px",

                      opacity:.8,

                    }}
                  >

                    Live Support Chat

                  </p>

                </div>

              </div>

            </div>

          ))}

        </div>

      </div>

      {/* ================= CHAT AREA ================= */}

      <div
        style={{

          flex:1,

          display:"flex",

          flexDirection:"column",

          background:"#fafafa",

        }}
      >

        {selectedUser ? (

          <>

            {/* TOP */}

            <div
              style={{

                padding:"24px 30px",

                background:"#fff",

                borderBottom:
                  "1px solid #f0dddd",

                display:"flex",

                alignItems:"center",

                gap:"16px",

              }}
            >

              <div
                style={{

                  width:"58px",

                  height:"58px",

                  borderRadius:"50%",

                  background:
                    "linear-gradient(135deg,#FFD700,#fff5cc)",

                  display:"flex",

                  alignItems:"center",

                  justifyContent:"center",

                  color:"#8B0000",

                  fontWeight:900,

                  fontSize:"24px",

                }}
              >

                {selectedUser.userName
                  ?.charAt(0)
                  ?.toUpperCase()}

              </div>

              <div>

                <h2
                  style={{

                    margin:0,

                    color:"#111",

                  }}
                >

                  {selectedUser.userName}

                </h2>

                <p
                  style={{

                    marginTop:"5px",

                    color:"#C89B3C",

                    fontSize:"13px",

                  }}
                >

                  Connected

                </p>

              </div>

            </div>

            {/* MESSAGES */}

            <div
              style={{

                flex:1,

                overflowY:"auto",

                padding:"35px",

                display:"flex",

                flexDirection:"column",

                gap:"18px",

              }}
            >

              {filteredMessages.map((m,i)=>(

                <div

                  key={i}

                  style={{

                    display:"flex",

                    justifyContent:
                      m.sender ===
                      "admin"

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
                        "admin"

                        ? "22px 22px 6px 22px"

                        : "22px 22px 22px 6px",

                      background:
                        m.sender ===
                        "admin"

                        ? "linear-gradient(135deg,#8B0000,#C89B3C)"

                        : "#fff",

                      color:
                        m.sender ===
                        "admin"

                        ? "#fff"

                        : "#111",

                      border:
                        m.sender ===
                        "admin"

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

            {/* INPUT */}

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

                    sendReply();

                  }

                }}

                placeholder="Type reply..."

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

                onClick={sendReply}

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

          </>

        ) : (

          <div
            style={{

              flex:1,

              display:"flex",

              alignItems:"center",

              justifyContent:"center",

              flexDirection:"column",

            }}
          >

            <div
              style={{

                width:"140px",

                height:"140px",

                borderRadius:"50%",

                background:
                  "linear-gradient(135deg,#8B0000,#C89B3C)",

                display:"flex",

                alignItems:"center",

                justifyContent:"center",

                color:"#fff",

                fontSize:"52px",

                marginBottom:"24px",

              }}
            >

              🎧

            </div>

            <h1
              style={{

                margin:0,

                fontSize:"38px",

                fontWeight:900,

                color:"#111",

              }}
            >

              Premium Support

            </h1>

            <p
              style={{

                marginTop:"14px",

                color:"#777",

              }}
            >

              Select a customer from lobby

            </p>

          </div>

        )}

      </div>

    </div>

  );

}