"use client";

import React, { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";
import { useRouter } from "next/navigation";

interface VenueDetailsProps {
  params: {
    venueId: string; // Access venueId
  };
}

const VenueDetails: React.FC<VenueDetailsProps> = ({ params }) => {
  const { venueId } = params; // Extract venueId from params
  const [venue, setVenue] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    const fetchVenue = async () => {
      try {
        const venueDocRef = doc(db, "veneus", venueId); // Reference the misspelled 'veneus' collection
        const venueSnapshot = await getDoc(venueDocRef);

        if (venueSnapshot.exists()) {
          setVenue(venueSnapshot.data());
        } else {
          console.error("No such document!");
        }
      } catch (error) {
        console.error("Error fetching venue details:", error);
      } finally {
        setLoading(false); // Stop loading once fetch is complete
      }
    };

    fetchVenue();
  }, [venueId]); // Re-run effect if venueId changes

  if (loading) {
    return <p>Loading...</p>; // Show loading message
  }

  if (!venue) {
    return <p>No venue found.</p>; // Show this if no venue data is available
  }

  return (
    <div>
      <h1>Venue Details</h1>
      <h2>
        <strong>Name:</strong> {venue.ven_name}
      </h2>
      <p>
        <strong>Location:</strong> {venue.location}
      </p>
      <p>
        <strong>Capacity:</strong> {venue.capacity} people
      </p>
      <p>
        <strong>Price:</strong> ${venue.price}
      </p>
      <p>
        <strong>Features:</strong> {venue.features}
      </p>

 
      {/* Reserve now button */}
      <button
        onClick={() => router.push(`/reservation/venues/${venueId}/reserve`)}
        style={{
          padding: "10px 20px",
          backgroundColor: "#0070f3",
          color: "#fff",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          marginTop: "20px",
        }}
      >
        Reserve Now
      </button>
    
    {/* Back to Venues Button */}
    <button
    onClick={() => router.push("/reservation/venues")} // Go back to the venues page
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
  Back to Venues
</button>
</div>

  );
};

export default VenueDetails;
