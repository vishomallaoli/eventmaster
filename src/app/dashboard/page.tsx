"use client";

import React, { useState, useEffect } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth, db } from "@/lib/firebaseConfig";
import { useRouter } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/ui/Navbar2";

const DashboardPage = () => {
  const [user, setUser] = useState<any>(null);
  const [userName, setUserName] = useState<string>(""); // To store user's name
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isWorker, setIsWorker] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        router.push("/signin");
      } else {
        setUser(currentUser);

        try {
          // Fetch user's document from Firestore
          const userDocRef = doc(db, "users", currentUser.uid);
          const userDoc = await getDoc(userDocRef);

          if (userDoc.exists()) {
            const userData = userDoc.data();
            setUserName(userData.name || "User"); // Fetch and set the name
            setIsAdmin(userData.isAdmin || false);
            setIsWorker(userData.isWorker || false);
          } else {
            console.warn("User document does not exist in Firestore.");
            setUserName("User");
          }
        } catch (error) {
          console.error("Error fetching user document:", error);
          setUserName("User");
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        router.push("/signin");
      })
      .catch((error) => console.error("Error signing out:", error));
  };

  if (loading) {
    return <p className="text-center mt-20">Loading...</p>;
  }

  return (
    <div className="dashboard-container max-w-4xl mx-auto p-6 space-y-8">
      <Navbar />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "calc(100vh - 200px)",
          textAlign: "center",
        }}
      >
        {/* Display the user's name */}
        <h1 style={{ fontSize: "2rem", marginBottom: "1rem" }}>
          👋🏻 Hi, {userName}!
        </h1>

        <section>
          <h2 className="text-xl font-medium mb-4">Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Button asChild>
              <Link href="/reservation/venues">View Venues</Link>
            </Button>
            <Button asChild>
              <Link href="/reservation/userViewPendingReservation">
                View Your Pending Reservation Requests
              </Link>
            </Button>
          </div>
        </section>

        {isAdmin && (
          <section>
            <h2 className="text-xl font-medium mb-4">Admin Actions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <Button asChild>
                <Link href="/admin/reviewReservations">Review Reservations</Link>
              </Button>
              <Button asChild>
                <Link href="/admin/viewConfirmedReservations">
                  View Confirmed Reservations
                </Link>
              </Button>
              <Button asChild>
                <Link href="/admin/assignAdmins">Promote Admins</Link>
              </Button>
              <Button asChild>
                <Link href="/admin/promoteWorkers">Promote Workers</Link>
              </Button>
              <Button asChild>
                <Link href="/admin/createVenue">Add Venues</Link>
              </Button>
              <Button asChild>
                <Link href="/admin/editVenue">Edit Venues</Link>
              </Button>
            </div>
          </section>
        )}

        {isWorker && (
          <section>
            <h2 className="text-xl font-medium mb-4">Worker Actions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <Button asChild>
                <Link href="/workers">View Your Work Schedule</Link>
              </Button>
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
