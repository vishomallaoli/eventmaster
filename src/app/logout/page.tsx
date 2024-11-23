// app/logout/page.tsx

"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Logout() {
  const router = useRouter();

  useEffect(() => {
    // Clear any authentication tokens or session data here
    console.log("User logged out"); // Replace this with actual logout logic

    // Redirect to the Sign In page after a short delay
    setTimeout(() => {
      router.push("/signin");
    }, 2000); // 2-second delay
  }, [router]);

  return (
    <div style={{ textAlign: "center", padding: "2rem" }}>
      <h1>Logging out...</h1>
      <p>You will be redirected to the Sign In page shortly.</p>
    </div>
  );
}