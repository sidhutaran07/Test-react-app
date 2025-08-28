import { getAuth } from "firebase/auth";

export async function checkAdmin() {
  const auth = getAuth();
  const user = auth.currentUser;
  if (!user) return false;

  const token = await user.getIdToken();

  const res = await fetch("https://react-todolist-7cwa.onrender.com/is-admin", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();
  return data.isAdmin;
}
