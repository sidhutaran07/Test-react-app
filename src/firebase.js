// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// IMPORTANT: Paste your firebaseConfig object here
const firebaseConfig = {
  apiKey: "AIzaSyAecX5kX7oum6S-tyD92nSBZmROuTsCYXY",
  authDomain: "reactproject-8d763.firebaseapp.com",
  projectId: "reactproject-8d763",
  storageBucket: "reactproject-8d763.firebasestorage.app",
  messagingSenderId: "369149202",
  appId: "1:369149202:web:7444edf163d10841bedfcb"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export the auth service
export const auth = getAuth(app);
