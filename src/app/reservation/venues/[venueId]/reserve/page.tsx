"use client";

import React, { useEffect, useState } from "react";
import { collection, getDocs, addDoc, Timestamp, query, where, doc, setDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { db, auth } from "@/lib/firebaseConfig";

const ReservePage = () => {
  const [venues, setVenues] = useState<any[]>([]);
  const [selectedVenue, setSelectedVenue] = useState<string>("");
  const [partyName, setPartyName] = useState<string>("");
  const [attendees, setAttendees] = useState<number | "">("");
  const [reservationDate, setReservationDate] = useState<string>("");
  const [statusMessage, setStatusMessage] = useState<string>("");
  const [venueCapacity, setVenueCapacity] = useState<number | null>(null);
  const [userID, setUserID] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<string>("cash");
  const [cardNumber, setCardNumber] = useState<string>("");
  const [expirationDate, setExpirationDate] = useState<string>("");
  const [cvv, setCvv] = useState<string>("");

  const router = useRouter();

  useEffect(() => {
    const fetchVenues = async () => {
      try {
        const venuesCollectionRef = collection(db, "veneus"); // Misspelled Firestore collection name 'veneus'
        const querySnapshot = await getDocs(venuesCollectionRef);

        const venueData: any[] = [];
        querySnapshot.forEach((doc) => {
          const venue = doc.data();
          venueData.push({ ...venue, id: doc.id });
        });

        setVenues(venueData); // Set venues
        console.log("Fetched venues:", venueData); // Debugging log to check venue data
      } catch (error) {
        console.error("Error fetching venues:", error);
      }
    };

    const fetchUserID = () => {
      const user = auth.currentUser; // Get the current authenticated user
      if (user) {
        setUserID(user.uid);
      } else {
        router.push("/signin"); // Redirect to sign-in if not logged in
      }
    };

    fetchVenues();
    fetchUserID();
  }, [router]);

  const handleVenueChange = (venueId: string) => {
    setSelectedVenue(venueId);

    // Find the selected venue's capacity
    const selected = venues.find((venue) => venue.id === venueId);
    setVenueCapacity(selected ? selected.capacity : null);
  };

  const handleSubmit = async () => {
    if (!partyName || !attendees || !reservationDate || !selectedVenue || !userID) {
      alert("Please fill out all fields.");
      return;
    }
  
    // Validate attendees against venue capacity
    if (venueCapacity !== null && attendees > venueCapacity) {
      alert("The number of attendees exceeds the capacity of the selected venue.");
      return;
    }
  
    // If payment method is debit, ensure all debit fields are filled
    if (paymentMethod === "debit" && (!cardNumber || !expirationDate || !cvv)) {
      alert("Please provide all debit card details.");
      return;
    }
  
    // Validate card number (max 20 characters)
    if (paymentMethod === "debit" && cardNumber.replace(/[^0-9]/g, "").length > 20) {
      alert("Card number is too long. It should be a maximum of 20 digits.");
      return;
    }
  
    // Validate CVV (max 3 digits)
    if (paymentMethod === "debit" && cvv.length > 3) {
      alert("CVV should be a maximum of 3 digits.");
      return;
    }
  
    try {
      // Check for conflicts in 'confirmed_reservations' collection
      const confirmedQuery = query(
        collection(db, "confirmed_reservations"),
        where("venueId", "==", selectedVenue),
        where("date", "==", reservationDate)
      );
      const confirmedSnapshot = await getDocs(confirmedQuery);
  
      // Check for conflicts in 'pending_reservations' collection with status 'pending'
      const pendingQuery = query(
        collection(db, "pending_reservations"),
        where("venueId", "==", selectedVenue),
        where("date", "==", reservationDate),
        where("status", "==", "pending")
      );
      const pendingSnapshot = await getDocs(pendingQuery);
  
      // Alert user of any conflicts
      if (!confirmedSnapshot.empty || !pendingSnapshot.empty) {
        alert("The selected venue is already reserved on this date.");
        return;
      }
  
      const selectedVenueData = venues.find((venue) => venue.id === selectedVenue);
      const venuePrice = selectedVenueData ? selectedVenueData.price : 0;
  
      // Create a new document in 'pending_reservations' collection
      const reservationRef = collection(db, "pending_reservations");
  
      const newReservation = {
        name: partyName,
        attendees: String(attendees),
        date: reservationDate,
        venueId: selectedVenue,
        status: "pending",
        createdAt: Timestamp.fromDate(new Date()),
        userID: userID,
        paymentMethod: paymentMethod,
        price: venuePrice,
      };
  
      // Add document to Firestore
      await addDoc(reservationRef, newReservation);
  
      setStatusMessage("Reservation successfully submitted!");
      console.log("Reservation submitted:", newReservation);
  
      setPartyName("");
      setAttendees("");
      setReservationDate("");
      setSelectedVenue("");
      setVenueCapacity(null);
      setPaymentMethod("cash");
      setCardNumber("");
      setExpirationDate("");
      setCvv("");
    } catch (error) {
      console.error("Error submitting reservation:", error);
      setStatusMessage("There was an error submitting your reservation.");
    }
  };
  
  return (
    <div>
      <h1>Reserve Your Venue</h1>
      <form onSubmit={(e) => e.preventDefault()} style={{ maxWidth: "500px", margin: "0 auto" }}>
        {/* Name of the Party */}
        <div style={{ marginBottom: "20px" }}>
          <label htmlFor="partyName">
            <strong>Name of the Party:</strong>
          </label>
          <input
            id="partyName"
            type="text"
            value={partyName}
            onChange={(e) => setPartyName(e.target.value)}
            placeholder="Enter the name of the party"
            style={{
              display: "block",
              width: "100%",
              padding: "10px",
              marginTop: "5px",
              fontSize: "16px",
            }}
          />
        </div>

        {/* Number of Attendees */}
        <div style={{ marginBottom: "20px" }}>
          <label htmlFor="attendees">
            <strong>Number of Attendees:</strong>
          </label>
          <input
            id="attendees"
            type="number"
            value={attendees}
            onChange={(e) => setAttendees(Number(e.target.value))}
            placeholder="Enter the number of attendees"
            style={{
              display: "block",
              width: "100%",
              padding: "10px",
              marginTop: "5px",
              fontSize: "16px",
            }}
          />
        </div>

        {/* Reservation Date */}
        <div style={{ marginBottom: "20px" }}>
          <label htmlFor="reservationDate">
            <strong>Reservation Date:</strong>
          </label>
          <input
            id="reservationDate"
            type="date"
            value={reservationDate}
            onChange={(e) => setReservationDate(e.target.value)}
            style={{
              display: "block",
              width: "100%",
              padding: "10px",
              marginTop: "5px",
              fontSize: "16px",
            }}
          />
        </div>

        {/* Venue Selection */}
        <div style={{ marginBottom: "20px" }}>
          <label htmlFor="venueSelect">
            <strong>Select Venue:</strong>
          </label>
          <select
            id="venueSelect"
            value={selectedVenue}
            onChange={(e) => handleVenueChange(e.target.value)}
            style={{
              display: "block",
              width: "100%",
              padding: "10px",
              marginTop: "5px",
              fontSize: "16px",
            }}
          >
            <option value="" disabled>
              -- Select a Venue --
            </option>
            {venues.length > 0 ? (
              venues.map((venue) => (
                <option key={venue.id} value={venue.id}>
                  {venue.ven_name} - {venue.location} (Capacity: {venue.capacity})
                </option>
              ))
            ) : (
              <option value="">No venues available</option>
            )}
          </select>
        </div>

        {/* Payment Method Selection */}
        <div style={{ marginBottom: "20px" }}>
          <label htmlFor="paymentMethod">
            <strong>Payment Method:</strong>
          </label>
          <div>
            <input
              type="radio"
              id="cash"
              name="paymentMethod"
              value="cash"
              checked={paymentMethod === "cash"}
              onChange={() => setPaymentMethod("cash")}
            />
            <label htmlFor="cash" style={{ marginLeft: "5px" }}>
              Cash
            </label>
            <input
              type="radio"
              id="debit"
              name="paymentMethod"
              value="debit"
              checked={paymentMethod === "debit"}
              onChange={() => setPaymentMethod("debit")}
              style={{ marginLeft: "10px" }}
            />
            <label htmlFor="debit" style={{ marginLeft: "5px" }}>
              Debit
            </label>
          </div>
        </div>

        {/* Debit Card Details (only shown if debit is selected) */}
        {paymentMethod === "debit" && (
          <>
            <div style={{ marginBottom: "20px" }}>
              <label htmlFor="cardNumber">
                <strong>Card Number:</strong>
              </label>
              <input
                id="cardNumber"
                type="text"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                placeholder="Enter your debit card number"
                maxLength={20}
                style={{
                  display: "block",
                  width: "100%",
                  padding: "10px",
                  marginTop: "5px",
                  fontSize: "16px",
                }}
              />
            </div>
            <div style={{ marginBottom: "20px" }}>
              <label htmlFor="expirationDate">
                <strong>Expiration Date:</strong>
              </label>
              <input
                id="expirationDate"
                type="month"
                value={expirationDate}
                onChange={(e) => setExpirationDate(e.target.value)}
                style={{
                  display: "block",
                  width: "100%",
                  padding: "10px",
                  marginTop: "5px",
                  fontSize: "16px",
                }}
              />
            </div>
            <div style={{ marginBottom: "20px" }}>
              <label htmlFor="cvv">
                <strong>CVV:</strong>
              </label>
              <input
                id="cvv"
                type="text"
                value={cvv}
                onChange={(e) => setCvv(e.target.value)}
                maxLength={3}
                placeholder="Enter your card's CVV"
                style={{
                  display: "block",
                  width: "100%",
                  padding: "10px",
                  marginTop: "5px",
                  fontSize: "16px",
                }}
              />
            </div>
          </>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          onClick={handleSubmit}
          style={{
            display: "block",
            width: "100%",
            padding: "10px",
            fontSize: "16px",
            backgroundColor: "#007BFF",
            color: "#FFF",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Reserve Now
        </button>
      </form>

      {/* Back to Home Button */}
      <button
        onClick={() => router.push("/dashboard")}
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

      {statusMessage && (
        <p style={{ marginTop: "20px", fontSize: "18px", fontWeight: "bold", color: "green" }}>
          {statusMessage}
        </p>
      )}
    </div>
  );
};

export default ReservePage;
