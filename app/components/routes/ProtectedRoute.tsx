"use client";

import { useEffect, useState } from "react";

import { useRouter } from "next/navigation";

import { useAuthStore } from "../../store/authStore";

interface Props {
  children: React.ReactNode;
  allowedRoles?: string[];
}

export default function ProtectedRoute({
  children,
  allowedRoles,
}: Props) {

  const router = useRouter();

  const {
    user,
    loadUser,
  } = useAuthStore();

  const [loading, setLoading] =
    useState(true);

  const [authorized, setAuthorized] =
    useState(false);

  useEffect(() => {

    const verifyAccess = async () => {

      await loadUser();

      const currentUser =
        useAuthStore.getState().user;

      // NO USER
      if (!currentUser) {

        router.replace("/");

        return;
      }

      // ROLE CHECK
      if (
        allowedRoles &&
        !allowedRoles.includes(
          currentUser.role
        )
      ) {

        router.replace("/");

        return;
      }

      setAuthorized(true);

      setLoading(false);
    };

    verifyAccess();

  }, []);

  // LOADER
  if (loading) {
    return (
      <div className="protected-screen">

        <div className="protected-box">

          <div className="protected-spinner" />

          <h3>Verifying Access</h3>

          <p>
            Checking authentication &
            permissions
          </p>

        </div>
      </div>
    );
  }

  // BLOCK RENDER
  if (!authorized) {
    return null;
  }

  return <>{children}</>;
}