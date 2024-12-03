"use client";

import React, { useState, useEffect } from "react";
import { auth, db } from "@/lib/firebaseConfig";
import { useRouter } from "next/navigation";
import { collection, getDocs, query, where, doc, getDoc } from "firebase/firestore"; // Import necessary Firestore functions

const WorkersPage = () => {
  const [isWorker, setIsWorker] = useState<boolean>(false); // Tracks if the user is a worker
  const [loading, setLoading] = useState<boolean>(true); // Tracks loading state
  const [userReservations, setUserReservations] = useState<any[]>([]); // Holds the worker's reservations
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const user = auth.currentUser; // Get the currently authenticated user
      if (!user) {
        router.push("/signin"); // Redirect if not signed in
        return;
      }

      try {
        const userDocRef = doc(db, "users", user.uid);
        const userSnapshot = await getDoc(userDocRef);

        if (!userSnapshot.exists() || !userSnapshot.data().isWorker) {
          setIsWorker(false);
          router.push("/dashboard"); // Redirect non-workers
          return;
        }

        setIsWorker(true);
        await fetchReservations(user.uid); // Fetch reservations for workers
      } catch (error) {
        console.error("Error checking worker status:", error);
        setIsWorker(false);
        router.push("/dashboard"); // Redirect on error
      } finally {
        setLoading(false); // Ensure loading is set to false
      }
    };

    fetchUser();
  }, [router]);

  const fetchReservations = async (workerId: string) => {
    try {
      const confirmedReservationsRef = collection(db, "confirmed_reservations");
      const querySnapshot = await getDocs(
        query(confirmedReservationsRef, where("assignedWorkers", "array-contains", workerId))
      );

      const reservations = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setUserReservations(reservations);
    } catch (error) {
      console.error("Error fetching reservations:", error);
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!isWorker) {
    return <p>You are not authorized to view this page.</p>;
  }

  return (
    <div className="workers-page">
      <h1 style={{ textAlign: "center", fontSize: "2rem", fontWeight: "bold" }}>
      ⏰ View Your Work Schedule </h1>
      <h1>You are scheduled for the following reservations: </h1>
      {userReservations.length === 0 ? (
        <p>You are not scheduled for any reservations at this time.</p>
      ) : (
        <div className="reservation-list">
          {userReservations.map((reservation) => (
            <div key={reservation.id} className="reservation-item">
              <h2><strong>Reservation Name:</strong> {reservation.name}</h2> {/* Display the name field for venue */}
              <p><strong>Venue:</strong> {reservation.name || "Unknown Venue"}</p> {/* Use the 'name' field */}
              <p><strong>Date:</strong> {reservation.date}</p>
              <p><strong>Status:</strong> {reservation.status}</p>
              <br />
            </div>
          ))}
        </div>
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

export default WorkersPage;
