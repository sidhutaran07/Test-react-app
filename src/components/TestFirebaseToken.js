import React, { useEffect } from "react";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";

function TestFirebaseToken() {
  const auth = getAuth();

  // Call after login
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

  // Example: Sign in with Google + get token
  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    console.log("User signed in:", result.user.email);

    const token = await result.user.getIdToken();
    console.log("Token:", token); // paste this into jwt.io to inspect
  };

  useEffect(() => {
    // If already logged in, try fetching token automatically
    getToken();
  }, []);

  return (
    <div>
      <button onClick={handleLogin}>Login with Google</button>
      <button onClick={getToken}>Get Token (Console)</button>
    </div>
  );
}

export default TestFirebaseToken;
