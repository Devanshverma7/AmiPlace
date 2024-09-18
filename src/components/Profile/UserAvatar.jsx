import React, { useState, useEffect } from "react";
import Lottie from "lottie-react";
import User_Icon from "../../assest/user_Icon.json";
import { updateAndStoreUserData } from "../../utils";
import { storage, auth, db } from "../../firebase.config";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import {
  doc,
  getDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { MdVerified } from "react-icons/md";

const UserAvatar = () => {
  const [avatarURL, setAvatarURL] = useState(null);
  const [uploadError, setUploadError] = useState(null);
  const [username, setUsername] = useState("");
  const [oldUsername, setOldUsername] = useState("");
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [usernameError, setUsernameError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (user) {
        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const userData = userDoc.data();
          if (userData.avatarURL) {
            setAvatarURL(userData.avatarURL);
          }
          if (userData.username) {
            setOldUsername(userData.username);
            setUsername(userData.username);
          }
        }
      }
    };

    fetchUserData();
  }, []);

  const handleAvatarUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const storageRef = ref(
      storage,
      `avatars/${auth.currentUser.uid}/${file.name}`
    );
    try {
      setUploadError(null);
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      await updateAndStoreUserData({ avatarURL: downloadURL });
      setAvatarURL(downloadURL);
    } catch (error) {
      console.error("Error uploading avatar:", error);
      setUploadError("Failed to upload avatar. Please try again.");
    }
  };

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
    setUsernameError(null); // Clear any previous errors when the user starts typing
  };

  const isUsernameUnique = async (username) => {
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("username", "==", username));
    const querySnapshot = await getDocs(q);
    return querySnapshot.empty;
  };

  const handleUsernameSubmit = async () => {
    try {
      setUsernameError(null);
      if (!username.trim()) {
        setUsernameError("Username cannot be empty.");
        return;
      }

      const isUnique = await isUsernameUnique(username);
      if (!isUnique) {
        setUsernameError(
          "This username is already taken. Please choose another."
        );
        return;
      }

      const user = auth.currentUser;
      if (user) {
        const userDocRef = doc(db, "users", user.uid);
        await updateDoc(userDocRef, { username: username });
        await updateAndStoreUserData({ username: username });
        setIsEditingUsername(false);
      }
    } catch (error) {
      console.error("Error updating username:", error);
      setUsernameError("Failed to update username. Please try again.");
    }
  };
  const handleCancelEdit = () => {
    setIsEditingUsername(false);
    setUsername(oldUsername);
    setUsernameError(null);
  };

  return (
    <div className="items-center justify-center w-full h-3/5 sm:w-1/3 md:w-1/3 lg:w-1/3 m-3 rounded-2xl p-4">
      <div className="user_profile_img mb-5">
        {avatarURL ? (
          <img
            src={avatarURL}
            alt="User Avatar"
            className="w-60 h-56 rounded-full object-cover border-4 border-blue-400"
          />
        ) : (
          <Lottie className="h-60 w-60" animationData={User_Icon} loop={true} />
        )}
      </div>
      <div className="w-full flex flex-col items-center mt-2">
        <label
          htmlFor="userProfileImage"
          className="mx-auto text-white bg-blue-500 hover:bg-blue-600 focus:ring-2 focus:outline-none focus:ring-blue-400 rounded-lg text-xs sm:w-auto px-2 py-1.5 text-center dark:bg-blue-500 dark:hover:bg-blue-600 dark:focus:ring-blue-600 mb-2"
        >
          Update Avatar
        </label>
        <input
          type="file"
          name="user_profile_image"
          id="userProfileImage"
          className="text-xs hidden"
          accept="image/*"
          onChange={handleAvatarUpload}
        />
        {uploadError && <p className="text-red-500 mt-2">{uploadError}</p>}

        {isEditingUsername ? (
          <div className="flex flex-col items-center mt-2">
            <input
              type="text"
              value={username}
              onChange={handleUsernameChange}
              className="border rounded px-2 py-1 text-sm"
            />
            <div className="flex space-x-2">
              <button
                onClick={handleUsernameSubmit}
                className="mt-2 bg-green-500 text-white px-2 py-1 rounded text-xs"
              >
                Save
              </button>
              <button
                onClick={handleCancelEdit}
                className="text-sm text-red-600 mt-2"
              >
                cancel
              </button>
            </div>

            {usernameError && (
              <p className="text-red-500 mt-2 text-xs">{usernameError}</p>
            )}
          </div>
        ) : (
          <div className="flex items-center mt-2">
            <span className="text-xl font-semibold flex">
              ~ {username || "No username set"}
              {(username === "devanshVerma" ||
                username === "praharshsingh07") && (
                <MdVerified className="mt-[7px] ml-1 text-lg text-blue-500" />
              )}
            </span>
            <button
              onClick={() => setIsEditingUsername(true)}
              className="ml-2 bg-blue-500 text-white px-2 py-1 rounded text-xs"
            >
              Edit
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserAvatar;
