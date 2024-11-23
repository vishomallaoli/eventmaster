'use client';

import React, { useState, useEffect } from "react";
import { db, auth } from "@/lib/firebaseConfig";
import { collection, doc, getDocs, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";

const EditVenuePage = () => {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [venues, setVenues] = useState<any[]>([]);
  const [selectedVenue, setSelectedVenue] = useState<any | null>(null);
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

  useEffect(() => {
    const fetchVenues = async () => {
      const venuesRef = collection(db, "veneus");
      const venueSnapshot = await getDocs(venuesRef);
      const venueList = venueSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setVenues(venueList);
    };

    fetchVenues();
  }, []);

  const handleEditVenue = (venue: any) => {
    setSelectedVenue(venue);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (selectedVenue) {
      setSelectedVenue({
        ...selectedVenue,
        [e.target.name]: e.target.value,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedVenue) return;

    const isConfirmed = window.confirm("Are you sure you want to publish these changes?");
    if (!isConfirmed) return;

    try {
      const venueRef = doc(db, "veneus", selectedVenue.id);
      await updateDoc(venueRef, {
        capacity: selectedVenue.capacity,
        features: selectedVenue.features,
        location: selectedVenue.location,
        price: selectedVenue.price,
        ven_name: selectedVenue.ven_name,
        venue_id: selectedVenue.venue_id,
      });

      setMessage("Venue updated successfully!");
      setSelectedVenue(null);
    } catch (error) {
      console.error("Error updating venue:", error);
      setMessage("Error updating venue. Please try again.");
    }
  };

  const handleCancel = () => {
    setSelectedVenue(null); // Reset the selected venue (close the edit form)
  };

  const handleBackToDashboard = () => {
    router.push("/dashboard");
  };

  if (isAdmin === null) {
    return <p>Loading...</p>;
  }

  if (!isAdmin) {
    return <p>You do not have permission to view this page.</p>;
  }

  const handleDeleteVenue = async (venueId: string) => {
    const isConfirmed = window.confirm("Are you sure you want to delete this venue?");
    if (!isConfirmed) return;
  
    try {
      const venueRef = doc(db, "veneus", venueId);
      await deleteDoc(venueRef);
      setVenues((prevVenues) => prevVenues.filter((venue) => venue.id !== venueId));
      setMessage("Venue deleted successfully!");
    } catch (error) {
      console.error("Error deleting venue:", error);
      setMessage("Error deleting venue. Please try again.");
    }
  };
  

  return (
    <div>
      {message && <p>{message}</p>}

      <div>
        <p>Please select a venue to edit:</p>
        {venues.length === 0 ? (
          <p>No venues available to edit.</p>
        ) : (
          venues.map((venue) => (
            <div key={venue.id} style={{ marginBottom: "10px" }}>
              <p>{venue.ven_name}</p>
              <button
                onClick={() => handleEditVenue(venue)}
                style={{
                  marginRight: "10px",
                  padding: "10px 20px",
                  backgroundColor: "#4CAF50",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
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
                Edit Venue
              </button>
              <button
              onClick={() => handleDeleteVenue(venue.id)}
              style={{
                padding: "10px 20px",
                backgroundColor: "#f44336",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                transition: "background-color 0.3s",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = "#e53935";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = "#f44336";
              }}
            >
              Delete Venue
            </button>
            </div>
          ))
        )}
      </div>

      {selectedVenue && (
        <div>
          <h2>Edit {selectedVenue.ven_name}</h2>
          <form onSubmit={handleSubmit}>
            <div>
              <label htmlFor="capacity">Capacity:</label>
              <input
                type="number"
                id="capacity"
                name="capacity"
                value={selectedVenue.capacity}
                onChange={handleInputChange}
                required
              />
            </div>

            <div>
              <label htmlFor="features">Features:</label>
              <input
                type="text"
                id="features"
                name="features"
                value={selectedVenue.features}
                onChange={handleInputChange}
                required
              />
            </div>

            <div>
              <label htmlFor="location">Location:</label>
              <input
                type="text"
                id="location"
                name="location"
                value={selectedVenue.location}
                onChange={handleInputChange}
                required
              />
            </div>

            <div>
              <label htmlFor="price">Price:</label>
              <input
                type="number"
                id="price"
                name="price"
                value={selectedVenue.price}
                onChange={handleInputChange}
                required
              />
            </div>

            <div>
              <label htmlFor="ven_name">Venue Name:</label>
              <input
                type="text"
                id="ven_name"
                name="ven_name"
                value={selectedVenue.ven_name}
                onChange={handleInputChange}
                required
              />
            </div>

            <div>
              <label htmlFor="venue_id">Venue ID:</label>
              <input
                type="text"
                id="venue_id"
                name="venue_id"
                value={selectedVenue.venue_id}
                onChange={handleInputChange}
                required
              />
            </div>

            <div style={{ marginTop: "10px" }}>
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
                Confirm Changes
              </button>

              <button
                type="button"
                onClick={handleCancel}
                style={{
                  backgroundColor: "#f44336",
                  color: "white",
                  padding: "12px 24px",
                  fontSize: "16px",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  marginLeft: "10px",
                  transition: "background-color 0.3s",
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = "#e53935";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = "#f44336";
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <button
        onClick={handleBackToDashboard}
        style={{
          marginTop: "20px",
          backgroundColor: "#007BFF",
          color: "white",
          padding: "12px 24px",
          fontSize: "16px",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
          transition: "background-color 0.3s",
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.backgroundColor = "#0056b3";
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.backgroundColor = "#007BFF";
        }}
      >
        Back to Home
      </button>
    </div>
  );
};

export default EditVenuePage;
