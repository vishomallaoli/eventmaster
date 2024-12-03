"use client";

import React, { useEffect, useState } from "react";
import { db } from "@/lib/firebaseConfig";
import { collection, getDocs, query, where, deleteDoc, doc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { getAuth } from "firebase/auth";

const UserViewPendingReservation = () => {
  const [reservations, setReservations] = useState<any[]>([]); // To store reservations
  const router = useRouter();

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        // Get the userID from Firebase
        const auth = getAuth();
        const user = auth.currentUser;
        const userID = user ? user.uid : null;
        
        if (!userID) {
          console.log("No user is authenticated.");
          return;
        }
        
        console.log("Fetching reservations for userID:", userID); // Log the userID
        
        const reservationsRef = collection(db, "pending_reservations");
        const q = query(reservationsRef, where("userID", "==", userID));
        
        console.log("Query for pending reservations:", q);
        
        const querySnapshot = await getDocs(q);
        console.log("Query snapshot:", querySnapshot);

        const reservationsData: any[] = [];
        
        querySnapshot.forEach((doc) => {
          const reservation = doc.data();
          reservationsData.push({ ...reservation, id: doc.id });
        });
        
        console.log("Reservations found:", reservationsData);

        setReservations(reservationsData);
      } catch (error) {
        console.error("Error fetching reservations: ", error);
      }
    };

    fetchReservations(); // Fetch reservations
  }, []);

  const handleCancelReservation = async (reservationId: string) => {
    const confirmation = window.confirm(
      "Are you sure you want to cancel your reservation request?"
    );
    if (confirmation) {
      try {
        // Deleting the reservation from Firestore
        await deleteDoc(doc(db, "pending_reservations", reservationId));
        setReservations((prevReservations) =>
          prevReservations.filter((res) => res.id !== reservationId)
        );
        alert("Your reservation request has been cancelled.");
      } catch (error) {
        console.error("Error cancelling reservation: ", error);
        alert("There was an error cancelling your reservation.");
      }
    }
  };

  return (
    <div>
      <h1 style={{ textAlign: "center", fontSize: "2rem", fontWeight: "bold" }}>
      👀 Pending Reservations Requests </h1>
      {reservations.length === 0 ? (
        <p>No pending reservations found.</p>
      ) : (
        <ul>
          {reservations.map((reservation) => (
            <li key={reservation.id}>
              <div>
                <strong>Party Name:</strong> {reservation.name}
              </div>
              <div>
                <strong>Attendees:</strong> {reservation.attendees}
              </div>
              <div>
                <strong>Date:</strong> {reservation.date}
              </div>
              <div>
                <strong>Price:</strong> {"$" + reservation.price}
              </div>
              <div>
                <strong>Payment Method:</strong> {reservation.paymentMethod}
              </div>
              <div>
                <strong>Status:</strong> {reservation.status}
              </div>
              <div>
                <strong>Venue:</strong> {reservation.venueId}
              </div>
              <button
                onClick={() => handleCancelReservation(reservation.id)}
                style={{
                  backgroundColor: "#ff5c5c",
                  color: "#fff",
                  padding: "10px",
                  border: "none",
                  cursor: "pointer",
                  marginTop: "10px",
                }}
              >
                Cancel Reservation
              </button>
            </li>
          ))}
        </ul>
      )}
    {/* Back to Home Button */}
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

export default UserViewPendingReservation;
