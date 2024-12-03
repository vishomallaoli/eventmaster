"use client";

import React, { useState, useEffect } from "react";
import { db, auth } from "@/lib/firebaseConfig";
import { collection, setDoc, doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";

const CreateVenuePage = () => {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [capacity, setCapacity] = useState<number>(0);
  const [features, setFeatures] = useState<string>("");
  const [location, setLocation] = useState<string>("");
  const [price, setPrice] = useState<number>(0);
  const [venName, setVenName] = useState<string>("");
  const [venueId, setVenueId] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
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
          if (userData.isAdmin) {
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
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!capacity || !features || !location || !price || !venName || !venueId) {
      setMessage("All fields are required.");
      return;
    }

    // Ask for confirmation before submitting
    const isConfirmed = window.confirm("Are you sure you want to create this venue?");
    if (!isConfirmed) return;

    try {
      const venueRef = doc(db, "veneus", venueId);
      await setDoc(venueRef, {
        capacity,
        features,
        location,
        price,
        ven_name: venName,
        venue_id: venueId,
      });

      setMessage("Venue added successfully!");
      setCapacity(0);
      setFeatures("");
      setLocation("");
      setPrice(0);
      setVenName("");
      setVenueId("");
    } catch (error) {
      console.error("Error adding venue:", error);
      setMessage("Error adding venue. Please try again.");
    }
  };

  const handleBackToDashboard = () => {
    router.push("/dashboard"); // Redirect to dashboard
  };

  if (isAdmin === null) {
    return <p>Loading...</p>;
  }

  if (!isAdmin) {
    return <p>You do not have permission to view this page.</p>;
  }

  return (
    <div>
      <h1 style={{ textAlign: "center", fontSize: "2rem", fontWeight: "bold" }}>
        🌋 Add a venue </h1>

      <h1>Please fill out the following information to add a new venue:</h1>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        {/* Capacity */}
        <div className="flex flex-col">
          <label htmlFor="capacity" className="text-sm font-medium text-gray-700">
            Capacity
          </label>
          <input
            type="number"
            id="capacity"
            value={capacity || ""}
            onChange={(e) => setCapacity(Number(e.target.value))}
            required
            placeholder="Enter capacity"
            className="mt-1 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Features */}
        <div className="flex flex-col">
          <label htmlFor="features" className="text-sm font-medium text-gray-700">
            Features
          </label>
          <textarea
            id="features"
            value={features}
            onChange={(e) => setFeatures(e.target.value)}
            required
            placeholder="Enter features (e.g., WiFi, projector)"
            rows={3}
            className="mt-1 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Location */}
        <div className="flex flex-col">
          <label htmlFor="location" className="text-sm font-medium text-gray-700">
            Location
          </label>
          <input
            type="text"
            id="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
            placeholder="Enter location"
            className="mt-1 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Price */}
        <div className="flex flex-col">
          <label htmlFor="price" className="text-sm font-medium text-gray-700">
            Price
          </label>
          <input
            type="number"
            id="price"
            value={price || ""}
            onChange={(e) => setPrice(Number(e.target.value))}
            required
            placeholder="Enter price"
            className="mt-1 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Venue Name */}
        <div className="flex flex-col">
          <label htmlFor="ven_name" className="text-sm font-medium text-gray-700">
            Venue Name
          </label>
          <input
            type="text"
            id="ven_name"
            value={venName}
            onChange={(e) => setVenName(e.target.value)}
            required
            placeholder="Enter venue name"
            className="mt-1 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Venue ID */}
        <div className="flex flex-col">
          <label htmlFor="venue_id" className="text-sm font-medium text-gray-700">
            Venue ID
          </label>
          <input
            type="text"
            id="venue_id"
            value={venueId}
            onChange={(e) => setVenueId(e.target.value)}
            required
            placeholder="Enter a unique venue ID"
            className="mt-1 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <button
          type="submit"
          style={{
            backgroundColor: "#4CAF50",
            color: "white",
            padding: "12px 24px",
            fontSize: "16px",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            transition: "background-color 0.3s",
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = "#45a049";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = "#4CAF50";
          }}
        >
          Add Venue
        </button>
      </form>

      <button
        onClick={handleBackToDashboard}
        style={{
          textAlign: "center",
          backgroundColor: "grey",
          color: "white",
          padding: "12px 24px",
          fontSize: "16px",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
          marginTop: "10px",
          transition: "background-color 0.3s",
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.backgroundColor = "#e53935";
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.backgroundColor = "#f44336";
        }}
      >
        Back to Home
      </button>
    </div>
  );
};

export default CreateVenuePage;
