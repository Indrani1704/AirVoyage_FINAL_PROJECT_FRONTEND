"use client";

import { create } from "zustand";

interface AuthState {
  user: any;

  token: string | null;

  isAuthenticated: boolean;

  login: (data: any) => void;

  logout: () => void;

  loadUser: () => Promise<void>;
}

export const useAuthStore =
  create<AuthState>((set) => ({

    user: null,

    token: null,

    isAuthenticated: false,

    /* ================= LOGIN ================= */

    login: (data) => {

      if (
        typeof window !==
        "undefined"
      ) {

        localStorage.setItem(
          "token",
          data.accessToken
        );

      }

      set({

        user: data.user,

        token:
          data.accessToken,

        isAuthenticated:
          true,

      });

    },

    /* ================= LOGOUT ================= */

    logout: () => {

      if (
        typeof window !==
        "undefined"
      ) {

        localStorage.removeItem(
          "token"
        );

      }

      set({

        user: null,

        token: null,

        isAuthenticated:
          false,

      });

    },

    /* ================= LOAD USER ================= */

    loadUser: async () => {

      try {

        if (
          typeof window ===
          "undefined"
        ) return;

        const token =
          localStorage.getItem(
            "token"
          );

        /* NO TOKEN */

        if (!token) {

          set({

            user: null,

            token: null,

            isAuthenticated:
              false,

          });

          return;

        }

        /* VERIFY TOKEN */

        const res =
          await fetch(

            "https://airvoyage-final-project-backend-2.onrender.com/api/auth/me",

            {

              headers: {

                Authorization:
                  `Bearer ${token}`,

              },

            }

          );

        /* INVALID TOKEN */

        if (!res.ok) {

          localStorage.removeItem(
            "token"
          );

          set({

            user: null,

            token: null,

            isAuthenticated:
              false,

          });

          return;

        }

        const data =
          await res.json();

        set({

          user: data.user,

          token,

          isAuthenticated:
            true,

        });

      }

      catch (error) {

        console.log(error);

        set({

          user: null,

          token: null,

          isAuthenticated:
            false,

        });

      }

    },

  }));