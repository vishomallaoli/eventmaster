// app/profile/page.tsx

"use client";

import Navbar from "@/components/ui/Navbar";

export default function Profile() {
  return (
    <div>
      <Navbar />
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <h1>Your Profile</h1>
        <p>Here you can update your personal information.</p>
        {/* Add profile form here */}
      </div>
    </div>
  );
}