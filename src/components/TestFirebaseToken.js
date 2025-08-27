import React, { useEffect } from "react";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "./firebase"; // ✅ import auth directly

function TestFirebaseToken() {
  async function getToken() {
    const user = auth.currentUser;
    if (!user) {
      console.log("No user signed in");
      return;
    }
    const token = await user.getIdToken(true);
    console.log("Firebase ID Token:", token);
    return token;
  }

  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    console.log("User signed in:", result.user.email);

    const token = await result.user.getIdToken();
    console.log("Token:", token);
  };

  useEffect(() => {
    getToken();
  }, []);

  return (
    <div>
      <h2>🔥 Firebase Test</h2>
      <button onClick={handleLogin}>Login with Google</button>
      <button onClick={getToken}>Get Token (Console)</button>
    </div>
  );
}

export default TestFirebaseToken;
