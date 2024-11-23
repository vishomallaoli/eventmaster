"use client";

import React, { useState, useEffect } from "react";
import { db, auth } from "@/lib/firebaseConfig";
import { collection, getDocs, doc, getDoc, deleteDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";

const ViewConfirmedReservationsPage = () => {
  const [confirmedReservations, setConfirmedReservations] = useState<any[]>([]);
  const [message, setMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    const checkAdminStatus = async () => {
      const user = auth.currentUser;

      if (!user) {
        // If no user is logged in, redirect to sign-in page
        router.push("/signin");
        return;
      }

      try {
        const userDocRef = doc(db, "users", user.uid);
        const userDocSnapshot = await getDoc(userDocRef);

        if (userDocSnapshot.exists()) {
          const userData = userDocSnapshot.data();
          if (userData && userData.isAdmin) {
            setIsAdmin(true); // User is an admin, proceed with fetching confirmed reservations
          } else {
            setIsAdmin(false);
            router.push("/dashboard"); // Redirect to dashboard if not an admin
          }
        } else {
          // If user document does not exist, redirect to dashboard
          setIsAdmin(false);
          router.push("/dashboard");
        }
      } catch (error) {
        console.error("Error checking admin status:", error);
        setIsAdmin(false);
        router.push("/dashboard");
      }
    };

    checkAdminStatus(); // Call the function to check admin status
  }, [isClient, router]);

  useEffect(() => {
    if (isAdmin === null) {
      return;
    }

    const fetchConfirmedReservations = async () => {
      try {
        const q = collection(db, "confirmed_reservations");
        const querySnapshot = await getDocs(q);

        const reservations: any[] = [];
        for (const docSnap of querySnapshot.docs) {
          const reservationData = docSnap.data();
          if (reservationData.status === "confirmed") {
            // I misspelled the collection as 'veneus' rather than venues
            const venueRef = doc(db, "veneus", reservationData.venueId);
            const venueSnapshot = await getDoc(venueRef);

            console.log(`Fetching venue for venueId: ${reservationData.venueId}`); // Debugging

            if (venueSnapshot.exists()) {
              const venueName = venueSnapshot.data()?.ven_name;
              reservations.push({
                ...reservationData,
                id: docSnap.id,
                venueName: venueName || "Unknown Venue",
              });
            } else {
              console.warn(`Venue with ID ${reservationData.venueId} not found.`);
              reservations.push({
                ...reservationData,
                id: docSnap.id,
                venueName: "Unknown Venue",
              });
            }
          }
        }

        setConfirmedReservations(reservations);
      } catch (error) {
        console.error("Error fetching confirmed reservations:", error);
        setMessage("Failed to fetch confirmed reservations. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchConfirmedReservations();
  }, [isAdmin]);

  const handleDeleteReservation = async (reservationId: string) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this reservation?");
    
    if (confirmDelete) {
      try {
        const reservationRef = doc(db, "confirmed_reservations", reservationId);
        await deleteDoc(reservationRef);
        setMessage("Reservation deleted successfully.");
        // Remove the deleted reservation from the state
        setConfirmedReservations((prevReservations) =>
          prevReservations.filter((reservation) => reservation.id !== reservationId)
        );
      } catch (error) {
        console.error("Error deleting reservation:", error);
        setMessage("Error deleting reservation. Please try again.");
      }
    }
  };

  if (isAdmin === null) {
    return <p>Loading...</p>;
  }

  return (
    <div className="admin-container">
      <h1 style={{ textAlign: "center", fontSize: "2rem", fontWeight: "bold" }}>
        ✅ View Confirmed Reservations</h1>

      {message && <p>{message}</p>}

      {loading ? (
        <p>Loading confirmed reservations...</p>
      ) : (
        <div className="reservation-list">
          {confirmedReservations.length === 0 ? (
            <p>No confirmed reservations available.</p>
          ) : (
            confirmedReservations.map((reservation) => (
              <div key={reservation.id} className="reservation-item">
                <p><strong>Name:</strong> {reservation.name}</p>
                <p><strong>Venue:</strong> {reservation.venueId} - {reservation.venueName}</p>
                <p><strong>Attendees:</strong> {reservation.attendees}</p>
                <p><strong>Reservation Date:</strong> {reservation.date}</p>
                <p><strong>Price:</strong> {reservation.price}</p>
                <p><strong>Payment Method:</strong> {reservation.paymentMethod}</p>
                <p><strong>Status:</strong> {reservation.status}</p>

                <button
                  onClick={() => handleDeleteReservation(reservation.id)}
                  className="delete-btn"
                  style={{backgroundColor: "red"}}
                >
                  Delete Reservation
                </button>

                <hr className="reservation-divider" />
              </div>
            ))
          )}
        </div>
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

export default ViewConfirmedReservationsPage;
