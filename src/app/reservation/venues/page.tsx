"use client";

import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";
import { useRouter } from "next/navigation";
import Link from "next/link";

const VenuesPage = () => {
  const [venues, setVenues] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchVenues = async () => {
      try {
        // Reference to the misspelled 'veneus' collection
        const venuesCollectionRef = collection(db, "veneus");
        
        // Fetch documents from the collection
        const querySnapshot = await getDocs(venuesCollectionRef);

        const venueData: any[] = [];
        querySnapshot.forEach((doc) => {
          const venue = doc.data();
          venueData.push({ ...venue, id: doc.id });
        });

        setVenues(venueData);
      } catch (error) {
        console.error("Error fetching venues:", error);
      }
    };

    // Fetch venues
    fetchVenues();
  }, []);

  return (
    <div>
      <h1 style={{ textAlign: "center", fontSize: "2rem", fontWeight: "bold" }}>
        🌴 Available Venues </h1>
      {/* Check if there are venues */}
      {venues.length === 0 ? (
        <p>No venues found.</p>
      ) : (
        <ul>
          {venues.map((venue, index) => (
            <li key={venue.id}>
              <h2>Name: {venue.ven_name}</h2>
              <p>Location: {venue.location}</p>
              <p>Capacity: {venue.capacity}</p>
              <p>Price: ${venue.price}</p>
              <p>Features: {venue.features}</p>
              <Link href={`/reservation/venues/${venue.id}`}>
                <button>View Venue</button>
              </Link>

              {index < venues.length - 1 && <hr style={{ borderTop: "3px solid #000", margin: "10px 0" }} />}
            </li>
          ))}
        </ul>
      )}

      <button
        onClick={() => router.push("/dashboard")} // Redirect to dashboard
        style={{
          display: "block",
          margin: "20px auto",
          padding: "10px",
          fontSize: "16px",
          backgroundColor: "#6c757d",
          color: "#FFF",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
          maxWidth: "200px",
        }}
      >
        Back to Home
      </button>
    </div>
  );
};

export default VenuesPage;
