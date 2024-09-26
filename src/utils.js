import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "./firebase.config";

export const updateAndStoreUserData = async (data) => {
  const user = auth.currentUser;
  if (!user) throw new Error("No authenticated user found");

  const userDocRef = doc(db, "users", user.uid);

  try {
    await setDoc(userDocRef, data, { merge: true });
    console.log("User data updated successfully", data);
  } catch (error) {
    console.error("Error updating user data:", error);
    throw error; // Re-throw the error to be handled in the component
  }
};
