// src/app/faq/page.tsx

"use client";

import { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebaseConfig";
import Navbar from "@/components/ui/Navbar";
import Navbar2 from "@/components/ui/Navbar2";

export default function FAQ() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    // Check user authentication status
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsLoggedIn(!!user); // Set true if user is logged in, false otherwise
    });

    return () => unsubscribe();
  }, []);

  return (
    <div>
      {/* Conditionally render Navbar based on login status */}
      {isLoggedIn === null ? (
        <p>Loading...</p> // Display a loading state while checking auth
      ) : isLoggedIn ? (
        <Navbar2 />
      ) : (
        <Navbar />
      )}
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <h1 style={{ fontSize: "2.5rem", fontWeight: "bold", marginBottom: "1rem" }}>
          Frequently Asked Questions
        </h1>
        <p style={{ marginBottom: "2rem", fontSize: "1.2rem", color: "#555" }}>
          You've got questions, we've got answers (or at least we’ll try to make you laugh).
        </p>

        <div style={{ maxWidth: "600px", margin: "0 auto", textAlign: "left" }}>
          <h3>Q: What is EventMaster?</h3>
          <p>
            A: EventMaster is your ultimate event management platform! 
            Imagine a world where planning events doesn't feel like herding cats. 
            We make that world possible.
          </p>
          <br />

          <h3>Q: Who made this incredible platform?</h3>
          <p>
            A: It was a two-person adventure! <strong>Visho Malla Oli </strong> 
            designed this beautiful frontend (you’re welcome), 
            while <strong>Brayden Williams</strong> worked backend magic 
            and tied it all together with integrations.
          </p>
          <br />

          <h3>Q: How do I sign up?</h3>
          <p>
            A: Simple! Click the big "Sign Up" button in the navigation bar. 
            If you don’t see it, maybe Brayden forgot to integrate it (just kidding, he’s awesome).
          </p>
          <br />

          <h3>Q: How can I contact support?</h3>
          <p>
            A: Shoot us a message through the contact form on the support page, 
            or send an email. Brayden promises to reply to emails faster than Visho fixes a CSS bug.
          </p>
          <br />

          <h3>Q: What if I have feature requests?</h3>
          <p>
            A: Great! We love suggestions. Send them our way, 
            and we’ll let Visho argue with Brayden about whose responsibility it is.
          </p>
          <br />

          <h3>Q: What's the coolest feature in EventMaster?</h3>
          <p>
            A: That's a tough one. It’s probably the slick frontend built by Visho, 
            unless Brayden is reading this—then it's definitely the rock-solid backend integrations.
          </p>
          <br />

          <h3>Q: Any Easter eggs I should know about?</h3>
          <p>
            A: Oh, absolutely! Try clicking on random buttons. 
            If something breaks, it's Brayden's fault. If it looks cool, that's all Visho.
          </p>
          <br />

          <h3>Q: What’s next for EventMaster?</h3>
          <p>
            A: World domination, of course. But for now, we're focused on adding features, 
            improving performance, and making sure Brayden doesn't sneak off to write Python scripts.
          </p>
        </div>
      </div>
    </div>
  );
}
