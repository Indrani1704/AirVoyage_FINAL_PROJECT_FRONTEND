"use client";

import {
  useState,
  useEffect,
} from "react";

import {
  createPortal,
} from "react-dom";

import API from "../lib/api";

export default function AuthMiniSidebar({
  open,
  setOpen,
}: any) {

  const [mounted,setMounted] =
    useState(false);

  const [mode,setMode] =
    useState<"login" | "register">(
      "login"
    );

  const [form,setForm] =
    useState({

      name:"",
      email:"",
      password:"",

    });

  const [error,setError] =
    useState("");

  const [message,setMessage] =
    useState("");

  const [loading,setLoading] =
    useState(false);

  useEffect(()=>{

    setMounted(true);

  },[]);

  if(!mounted)
    return null;

  /* ================= LOGIN ================= */

  const handleLogin =
    async ()=>{

      try{

        setLoading(true);

        setError("");

        setMessage("");

        const res =
          await API(
            "/auth/login",
            {
              method:"POST",

              body:JSON.stringify(
                form
              ),
            }
          );

        console.log(
          "LOGIN RESPONSE:",
          res
        );

        /* SAVE TOKEN */

       /* SAVE LOGIN */

/* SAVE LOGIN */

/* DON'T CLEAR EVERYTHING */

localStorage.removeItem(
  "token"
);

localStorage.removeItem(
  "user"
);

/* SAVE NEW LOGIN */

localStorage.setItem(
  "token",
  res.accessToken
);

localStorage.setItem(
  "user",
  JSON.stringify(
    res.user
  )
);

console.log(
  "LOGGED IN USER:",
  res.user
);

/* UPDATE UI */

window.dispatchEvent(
  new Event(
    "userChanged"
  )
);

        /* SUCCESS */

        setMessage(
          "Login successful"
        );

        /* CLOSE */

       setTimeout(()=>{

  setOpen(false);

  // ADMIN
  if (
    res.user.role === "admin"
  ) {

    window.location.href =
      "/admin";

  }

  // SUPERADMIN
  else if (
    res.user.role ===
    "superadmin"
  ) {

    window.location.href =
      "/superadmin";

  }

  // NORMAL USER
  else {

    window.location.href =
      "/";

  }

},800);

      }catch(err:any){

        console.log(err);

        setError(
          err.message ||
          "Login failed"
        );

      }finally{

        setLoading(false);

      }

    };

  /* ================= REGISTER ================= */

  const handleRegister =
    async ()=>{

      try{

        setLoading(true);

        setError("");

        setMessage("");

        const res =
          await API(
            "/auth/register",
            {
              method:"POST",

              body:JSON.stringify(
                form
              ),
            }
          );

        setMessage(
          res.msg ||
          "Account created successfully"
        );

        /* SWITCH LOGIN */

        setTimeout(()=>{

          setMode(
            "login"
          );

          setMessage(
            "Account created. Please login."
          );

        },1000);

      }catch(err:any){

        console.log(err);

        setError(
          err.message ||
          "Registration failed"
        );

      }finally{

        setLoading(false);

      }

    };

  return createPortal(

    <>

      {/* BACKDROP */}

      <div

        onClick={()=>
          setOpen(false)
        }

        style={{

          position:"fixed",

          inset:0,

          background:
            open
              ? "rgba(0,0,0,0.45)"
              : "transparent",

          opacity:
            open ? 1 : 0,

          pointerEvents:
            open
              ? "auto"
              : "none",

          transition:"0.3s",

          zIndex:9998,

          backdropFilter:
            "blur(4px)",

        }}
      />

      {/* SIDEBAR */}

      <div
        style={{

          position:"fixed",

          top:0,

          right:0,

          width:"380px",

          maxWidth:"100%",

          height:"100vh",

          background:"#fff",

          zIndex:9999,

          padding:"28px",

          display:"flex",

          flexDirection:"column",

          transform:
            open
              ? "translateX(0)"
              : "translateX(100%)",

          transition:
            "transform .35s ease",

          boxShadow:
            "-10px 0 40px rgba(0,0,0,.18)",

        }}
      >

        {/* HEADER */}

        <div
          style={{

            display:"flex",

            justifyContent:
              "space-between",

            alignItems:"center",

            marginBottom:18,

          }}
        >

          <h2
            style={{

              margin:0,

              fontSize:"22px",

              fontWeight:700,

              color:"#111",

            }}
          >

            {mode === "login"
              ? "Welcome Back"
              : "Create Account"}

          </h2>

          <button

            onClick={()=>
              setOpen(false)
            }

            style={{

              border:"none",

              background:"transparent",

              fontSize:"22px",

              cursor:"pointer",

              color:"#777",

            }}
          >

            ✕

          </button>

        </div>

        {/* GOLD BAR */}

        <div
          style={{

            height:"3px",

            width:"70px",

            borderRadius:"30px",

            background:
              "linear-gradient(90deg,#b8860b,#ffd700)",

            marginBottom:"22px",

          }}
        />

        {/* SUCCESS */}

        {message && (

          <div
            style={{

              background:"#e9fff1",

              color:"#0b8f4d",

              padding:"12px",

              borderRadius:"10px",

              marginBottom:"14px",

              textAlign:"center",

              fontSize:"14px",

              fontWeight:500,

            }}
          >

            {message}

          </div>

        )}

        {/* ERROR */}

        {error && (

          <div
            style={{

              background:"#ffe7e7",

              color:"#c62828",

              padding:"12px",

              borderRadius:"10px",

              marginBottom:"14px",

              textAlign:"center",

              fontSize:"14px",

              fontWeight:500,

            }}
          >

            {error}

          </div>

        )}

       {/* SOCIAL */}

<div
  style={{

    display:"flex",

    flexDirection:"column",

    gap:10,

    marginBottom:20,

  }}
>

  <button

    type="button"

    style={googleBtn}

    onClick={() => {

      setError("");
      setMessage(
        "Google login is currently under maintenance."
      );

    }}

  >
    Continue with Google
  </button>

  <button

    type="button"

    style={fbBtn}

    onClick={() => {

      setError("");
      setMessage(
        "Facebook login is currently under maintenance."
      );

    }}

  >
    Continue with Facebook
  </button>

  <div
    style={{

      textAlign:"center",

      color:"#999",

      fontSize:"13px",

    }}
  >
    ─── OR ───
  </div>

</div>

        {/* LOGIN FORM */}

        {mode === "login" && (

          <form

            onSubmit={(e)=>{

              e.preventDefault();

              handleLogin();

            }}

          >

            <input

              placeholder="Email"

              required

              style={inputStyle}

              value={form.email}

              onChange={(e)=>

                setForm({

                  ...form,

                  email:
                    e.target.value,

                })

              }

            />

            <input

              type="password"

              placeholder="Password"

              required

              style={inputStyle}

              value={form.password}

              onChange={(e)=>

                setForm({

                  ...form,

                  password:
                    e.target.value,

                })

              }

            />

            <button

              style={primaryBtn}

              disabled={loading}

            >

              {loading
                ? "Logging in..."
                : "Login"}

            </button>

          </form>

        )}

        {/* REGISTER FORM */}

        {mode === "register" && (

          <form

            onSubmit={(e)=>{

              e.preventDefault();

              handleRegister();

            }}

          >

            <input

              placeholder="Name"

              required

              style={inputStyle}

              value={form.name}

              onChange={(e)=>

                setForm({

                  ...form,

                  name:
                    e.target.value,

                })

              }

            />

            <input

              placeholder="Email"

              required

              style={inputStyle}

              value={form.email}

              onChange={(e)=>

                setForm({

                  ...form,

                  email:
                    e.target.value,

                })

              }

            />

            <input

              type="password"

              placeholder="Password"

              required

              style={inputStyle}

              value={form.password}

              onChange={(e)=>

                setForm({

                  ...form,

                  password:
                    e.target.value,

                })

              }

            />

            <button

              style={primaryBtn}

              disabled={loading}

            >

              {loading
                ? "Creating..."
                : "Register"}

            </button>

          </form>

        )}

        {/* TOGGLE */}

        <div
          style={{

            marginTop:22,

            textAlign:"center",

            fontSize:"14px",

            color:"#555",

          }}
        >

          {mode === "login" ? (

            <>

              Don’t have an account?{" "}

              <span

                style={linkStyle}

                onClick={()=>
                  setMode(
                    "register"
                  )
                }

              >
                Register
              </span>

            </>

          ) : (

            <>

              Already have an account?{" "}

              <span

                style={linkStyle}

                onClick={()=>
                  setMode(
                    "login"
                  )
                }

              >
                Login
              </span>

            </>

          )}

        </div>

      </div>

    </>,

    document.body

  );

}

/* ================= STYLES ================= */

const inputStyle = {

  width:"100%",

  padding:"13px 14px",

  border:
    "1px solid #ddd",

  borderRadius:"10px",

  marginBottom:"12px",

  fontSize:"14px",

  outline:"none",

};

const primaryBtn = {

  width:"100%",

  padding:"13px",

  borderRadius:"10px",

  background:
    "linear-gradient(135deg,#b8860b,#ffd700)",

  color:"#111",

  fontWeight:700,

  border:"none",

  cursor:"pointer",

  fontSize:"15px",

};

const googleBtn = {

  width:"100%",

  padding:"12px",

  borderRadius:"10px",

  border:
    "1px solid #ddd",

  background:"#fff",

  cursor:"pointer",

  fontWeight:600,

};

const fbBtn = {

  width:"100%",

  padding:"12px",

  borderRadius:"10px",

  border:"none",

  background:"#1877f2",

  color:"#fff",

  cursor:"pointer",

  fontWeight:600,

};

const linkStyle = {

  color:"#b8860b",

  cursor:"pointer",

  fontWeight:700,

};