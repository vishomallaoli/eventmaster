// Import the functions you need from the SDKs you need
import { getAuth } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics, isSupported } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCHCfOYdJGc7lpbNHeE7-pz0-wk2Y0ywM0",
  authDomain: "eventmaster-database.firebaseapp.com",
  projectId: "eventmaster-database",
  storageBucket: "eventmaster-database.firebaseapp.com",
  messagingSenderId: "594662023462",
  appId: "1:594662023462:web:ec42c0d6f019882bdf61e7",
  measurementId: "G-3PQRS2J4ZD",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

// Initialize Analytics (only if supported and in the browser)
let analytics;
if (typeof window !== "undefined") {
  isSupported().then((supported) => {
    if (supported) analytics = getAnalytics(app);
  });
}

// Initialize Firebase Auth
const auth = getAuth(app);

// Export db, auth, and analytics as named exports
export { db, auth, analytics };
