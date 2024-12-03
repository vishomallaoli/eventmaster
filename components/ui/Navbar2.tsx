// components/Navbar.tsx

"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Navbar() {
  const router = useRouter();

  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    setIsAuthenticated(!!token);
  }, []);

  return (
    <nav style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1rem 2rem", backgroundColor: "#333", color: "#fff" }}>
      <h1 style={{ fontSize: "1.5rem", fontWeight: "bold", cursor: "pointer" }} onClick={() => router.push("/")}>
        Dashboard
      </h1>
      <div style={{ display: "flex", gap: "15px" }}>
        <Button onClick={() => router.push("/faq")} style={{ color: "#fff" }}>FAQ</Button>
        {!isAuthenticated ? (
          <>
            <Button onClick={() => router.push("/logout")} style={{ color: "red" }}>Logout</Button>
          </>
        ) : (
          <>
            <Button onClick={() => router.push("/profile")} style={{ color: "#fff" }}>Profile</Button>
            <Button onClick={() => router.push("/logout")} style={{ color: "#fff" }}>Logout</Button>
          </>
        )}
      </div>
    </nav>
  );
}