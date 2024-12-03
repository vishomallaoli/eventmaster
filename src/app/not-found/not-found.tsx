// app/not-found.tsx

"use client";

import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();

  return (
    <div style={{ textAlign: "center", padding: "2rem" }}>
      <h1>404 - Page Not Found</h1>
      <p>Sorry, the page you are looking for does not exist.</p>
      <button onClick={() => router.push("/")} style={{ padding: "0.5rem 1rem", marginTop: "1rem" }}>
        Go Back Home
      </button>
    </div>
  );
}