"use client";

import React, { useState, useEffect } from "react";
import { db, auth } from "@/lib/firebaseConfig";
import { collection, getDocs, doc, getDoc, updateDoc, setDoc, deleteDoc, query, where } from "firebase/firestore";
import { useRouter } from "next/navigation";

const ReviewReservationsPage = () => {
  const [pendingReservations, setPendingReservations] = useState<any[]>([]);
  const [message, setMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [workers, setWorkers] = useState<any[]>([]);
  const [selectedWorkers, setSelectedWorkers] = useState<string[]>([]);
  const [showWorkerModal, setShowWorkerModal] = useState<boolean>(false);
  const [selectedReservationId, setSelectedReservationId] = useState<string | null>(null);
  const [selectedReservationName, setSelectedReservationName] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    const checkAdminStatus = async () => {
      const user = auth.currentUser;

      if (!user) {
        router.push("/signin");
        return;
      }

      try {
        const userDocRef = doc(db, "users", user.uid);
        const userDocSnapshot = await getDoc(userDocRef);

        if (userDocSnapshot.exists()) {
          const userData = userDocSnapshot.data();
          if (userData && userData.isAdmin) {
            setIsAdmin(true);
          } else {
            setIsAdmin(false);
            router.push("/dashboard");
          }
        } else {
          setIsAdmin(false);
          router.push("/dashboard");
        }
      } catch (error) {
        console.error("Error checking admin status:", error);
        setIsAdmin(false);
        router.push("/dashboard");
      }
    };

    checkAdminStatus();
  }, [isClient, router]);

  useEffect(() => {
    const fetchPendingReservations = async () => {
      try {
        const q = collection(db, "pending_reservations");
        const querySnapshot = await getDocs(q);
        const reservations: any[] = [];

        for (const docSnap of querySnapshot.docs) {
          const reservationData = docSnap.data();
          if (reservationData.status === "pending") {
            const venueRef = doc(db, "veneus", reservationData.venueId);
            const venueSnapshot = await getDoc(venueRef);

            if (venueSnapshot.exists()) {
              const venueName = venueSnapshot.data()?.ven_name;
              reservations.push({
                ...reservationData,
                id: docSnap.id,
                venueName: venueName || "Unknown Venue",
              });
            } else {
              reservations.push({
                ...reservationData,
                id: docSnap.id,
                venueName: "Unknown Venue",
              });
            }
          }
        }

        setPendingReservations(reservations);
      } catch (error) {
        console.error("Error fetching pending reservations:", error);
        setMessage("Failed to fetch pending reservations. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchPendingReservations();
  }, [isAdmin]);

  useEffect(() => {
    const fetchWorkers = async () => {
      try {
        const workersCollection = collection(db, "users");
        const workersQuery = query(workersCollection, where("isWorker", "==", true));
        const workersSnapshot = await getDocs(workersQuery);

        const availableWorkers = workersSnapshot.docs.map(docSnap => {
          return { id: docSnap.id, name: docSnap.data().name };
        });

        setWorkers(availableWorkers);
      } catch (error) {
        console.error("Error fetching workers:", error);
      }
    };

    fetchWorkers();
  }, []);

  const handleAssignWorkers = async (reservationId: string) => {
    if (selectedWorkers.length !== 2) {
      setMessage("Please select exactly two workers.");
      return;
    }
  
    try {
      const reservationRef = doc(db, "pending_reservations", reservationId);
      const reservationSnapshot = await getDoc(reservationRef);
  
      if (!reservationSnapshot.exists()) {
        throw new Error("Reservation not found.");
      }
  
      const reservationData = reservationSnapshot.data();
      const reservationDate = reservationData.date;
      const workersWithConflictsSet: Set<string> = new Set();
  
      // Loop through selected workers and check for conflicting reservations
      for (const workerId of selectedWorkers) {
        const pendingReservationsQuery = query(
          collection(db, "pending_reservations"),
          where("assignedWorkers", "array-contains", workerId),
          where("date", "==", reservationDate) // Check if the worker is already assigned on the same date for pending reservations
        );
        const confirmedReservationsQuery = query(
          collection(db, "confirmed_reservations"),
          where("assignedWorkers", "array-contains", workerId),
          where("date", "==", reservationDate) // Check if the worker is already assigned on the same date for confirmed reservations
        );
  
        const [pendingSnapshot, confirmedSnapshot] = await Promise.all([
          getDocs(pendingReservationsQuery),
          getDocs(confirmedReservationsQuery),
        ]);
  
        // Check pending reservations
        pendingSnapshot.forEach((docSnap) => {
          const reservationData = docSnap.data();
          const workerReservationDate = reservationData.date;
  
          if (workerReservationDate === reservationDate && docSnap.id !== reservationId) {
            workersWithConflictsSet.add(workerId);
          }
        });
  
        // Check confirmed reservations
        confirmedSnapshot.forEach((docSnap) => {
          const reservationData = docSnap.data();
          const workerReservationDate = reservationData.date;
  
          if (workerReservationDate === reservationDate) {
            workersWithConflictsSet.add(workerId);
          }
        });
      }
  
      // If there are conflicts, fetch the worker names and display the error
      if (workersWithConflictsSet.size > 0) {
        const workerNames: string[] = [];
  
        // Fetch names of workers with conflicts
        for (const workerId of workersWithConflictsSet) {
          const workerDocRef = doc(db, "users", workerId);
          const workerDocSnapshot = await getDoc(workerDocRef);
  
          if (workerDocSnapshot.exists()) {
            const workerData = workerDocSnapshot.data();
            const workerName = workerData?.name || "Unknown Worker";
            workerNames.push(workerName);
          }
        }
  
        setMessage(
          `Worker(s) ${workerNames.join(", ")} are already assigned to other reservations on this date.`
        );
        return;
      }
  
      // Proceed to assign workers to the reservation if no conflicts
      await updateDoc(reservationRef, {
        ...reservationData,
        assignedWorkers: selectedWorkers,
      });
  
      setMessage("Workers assigned to pending reservation successfully.");
      setPendingReservations((prev) =>
        prev.map((res) =>
          res.id === reservationId
            ? { ...res, assignedWorkers: selectedWorkers }
            : res
        )
      );
      setShowWorkerModal(false);
    } catch (error) {
      console.error("Error assigning workers:", error);
      setMessage("Error assigning workers. Please try again.");
    }
  };
  
  
  
  const handleReservationAction = async (reservationId: string, action: "confirm" | "deny") => {
    const selectedReservation = pendingReservations.find(
      (reservation) => reservation.id === reservationId
    );
  
    if (
      action === "confirm" &&
      selectedReservation &&
      (!selectedReservation.assignedWorkers || selectedReservation.assignedWorkers.length !== 2)
    ) {
      setMessage("Please assign exactly two workers to confirm the reservation.");
      return;
    }
  
    try {
      const reservationRef = doc(db, "pending_reservations", reservationId);
      const reservationSnapshot = await getDoc(reservationRef);
  
      if (!reservationSnapshot.exists()) {
        throw new Error("Reservation does not exist.");
      }
  
      if (action === "confirm") {
        const confirmedReservationRef = doc(db, "confirmed_reservations", reservationId);
        const reservationData = reservationSnapshot.data();
  
        await setDoc(confirmedReservationRef, {
          ...reservationData,
          assignedWorkers: selectedReservation.assignedWorkers,
          status: "confirmed",
          price: reservationData.price,
        });
  
        // Delete the reservation from the pending collection after confirming
        await deleteDoc(reservationRef);
      } else if (action === "deny") {
        await updateDoc(reservationRef, { status: "denied" });
      }
  
      setMessage(`Reservation ${action}ed successfully.`);
      setPendingReservations((prevReservations) =>
        prevReservations.filter((reservation) => reservation.id !== reservationId)
      );
    } catch (error) {
      console.error("Error processing reservation:", error);
      setMessage("Error processing reservation. Please try again.");
    }
  };
  
  const handleClearWorkers = async (reservationId: string) => {
    try {
      const reservationRef = doc(db, "pending_reservations", reservationId);
      const reservationSnapshot = await getDoc(reservationRef);
  
      if (!reservationSnapshot.exists()) {
        throw new Error("Reservation not found.");
      }
  
      const reservationData = reservationSnapshot.data();
  
      // Update the reservation to clear assigned workers
      await updateDoc(reservationRef, {
        assignedWorkers: []
      });
  
      setMessage("Assigned workers cleared successfully.");
      setPendingReservations((prev) =>
        prev.map((res) =>
          res.id === reservationId
            ? { ...res, assignedWorkers: [] }
            : res
        )
      );
    } catch (error) {
      console.error("Error clearing workers:", error);
      setMessage("Error clearing workers. Please try again.");
    }
  };
  
  const toggleWorkerSelection = (workerId: string) => {
    if (selectedWorkers.includes(workerId)) {
      setSelectedWorkers(selectedWorkers.filter(id => id !== workerId));
    } else {
      setSelectedWorkers([...selectedWorkers, workerId]);
    }
  };

  const openWorkerModal = (reservationId: string, reservationName: string) => {
    setSelectedReservationId(reservationId);
    setSelectedReservationName(reservationName);
    setShowWorkerModal(true);
  };

  if (isAdmin === null) {
    return <p>Loading...</p>;
  }
  const handleWorkerSelection = (workerId: string) => {
    setSelectedWorkers((prevSelected) =>
      prevSelected.includes(workerId)
        ? prevSelected.filter((id) => id !== workerId)
        : [...prevSelected, workerId]
    );
  };
  
  return (
    <div>
      <h1 style={{ textAlign: "center", fontSize: "2rem", fontWeight: "bold" }}>
        🔎 Review Pending Reservations</h1>


  
      {message && <p>{message}</p>}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div>
          {pendingReservations.length === 0 ? (
            <p>No pending reservations to review.</p>
          ) : (
            <div>
              {pendingReservations.map((reservation) => (
                <div key={reservation.id} className="reservation-item">
                  <h2><strong>Name:</strong> {reservation.name}</h2>
                  <p><strong>Venue:</strong> {reservation.venueName}</p>
                  <p><strong>Reservation Date:</strong> {reservation.date}</p>
                  <p><strong>Attendees:</strong> {reservation.attendees}</p>
                  <p><strong>Price:</strong> {reservation.price}</p>
                  <p><strong>Payment Method:</strong> {reservation.paymentMethod}</p>
                  <p><strong>Status:</strong> {reservation.status}</p>
                  
  
                  <div className="action-buttons">
                    <button
                      onClick={() => openWorkerModal(reservation.id, reservation.name)}
                      className="assign-workers-btn"
                      style={{
                        backgroundColor: "blue",
                        color: "white",
                        padding: "10px 20px",
                        borderRadius: "5px",
                      }}
                    >
                      Assign Workers
                    </button>
                    <button
                      onClick={() => handleReservationAction(reservation.id, "confirm")}
                      className="confirm-btn"
                      style={{
                        backgroundColor: "green",
                        color: "white",
                        padding: "10px 20px",
                        borderRadius: "5px",
                      }}
                    >
                      Confirm
                    </button>
                    <button
                      onClick={() => handleReservationAction(reservation.id, "deny")}
                      className="deny-btn"
                      style={{
                        backgroundColor: "red",
                        color: "white",
                        padding: "10px 20px",
                        borderRadius: "5px",
                      }}
                    >
                      Deny
                    </button>
                    {/* Clear Workers Button */}
                    <button
                      onClick={() => handleClearWorkers(reservation.id)}
                      className="clear-workers-btn"
                      style={{
                        backgroundColor: "orange",
                        color: "white",
                        padding: "10px 20px",
                        borderRadius: "5px",
                      }}
                    >
                      Clear Workers
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
  
      {showWorkerModal && selectedReservationId && (
        <div className="worker-modal">
          <h2>Select Workers for the Reservation: '{selectedReservationName}'</h2>
          <div className="worker-list">
            {workers.map(worker => (
              <div key={worker.id}>
                <input
                  type="checkbox"
                  id={worker.id}
                  checked={selectedWorkers.includes(worker.id)}
                  onChange={() => handleWorkerSelection(worker.id)}
                />
                <label htmlFor={worker.id}>{worker.name}</label>
              </div>
            ))}
          </div>
  
          <div className="worker-modal-actions" style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
            <button
              onClick={() => handleAssignWorkers(selectedReservationId)}
              style={{
                backgroundColor: "blue",
                color: "white",
                padding: "10px 20px",
                borderRadius: "5px",
              }}
            >
              Assign Workers
            </button>
            <button
              onClick={() => setShowWorkerModal(false)}
              style={{
                backgroundColor: "gray",
                color: "white",
                padding: "10px 20px",
                borderRadius: "5px",
              }}
            >
              Close
            </button>
          </div>
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

export default ReviewReservationsPage;