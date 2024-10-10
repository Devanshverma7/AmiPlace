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
import { PiCodeDuotone } from "react-icons/pi";

const UserAvatar = () => {
  const [avatarURL, setAvatarURL] = useState(null);
  const [uploadError, setUploadError] = useState(null);
  const [username, setUsername] = useState("");
  const [oldUsername, setOldUsername] = useState("");
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [usernameError, setUsernameError] = useState(null);
  const [verified, setVerified] = useState(false);
  const [dev, setDev] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (user) {
        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setVerified(userData.Verified);
          setDev(userData.dev);
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
    const newUsername = e.target.value.toLowerCase().trim();
    setUsername(newUsername);
    setUsernameError(null); // Clear any previous errors when the user starts typing
  };

  const isUsernameUnique = async (username) => {
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("username", "==", username));
    const querySnapshot = await getDocs(q);
    return (
      querySnapshot.empty || querySnapshot.docs[0].id == auth.currentUser.uid
    );
  };

  const handleUsernameSubmit = async () => {
    try {
      setUsernameError(null);
      const regex1 = /^[a-zA-Z0-9._]+$/;
      const regex2 = /^(?![_\.]+$)[a-zA-Z0-9._]+$/;
      const regex3 = /^(?!\.)([a-zA-Z0-9._]*)(?<!\.)$/;
      const regex4 = /^(?!.*\.\.)([a-zA-Z0-9._]+)$/;

      if (!username.trim()) {
        setUsernameError("Username cannot be empty.");
        return;
      }

      if (!regex1.test(username)) {
        setUsernameError("Special characters not allowed!");
        return;
      }
      if (!regex2.test(username)) {
        setUsernameError("Please combine aphanumeric characters");
        return;
      }
      if (!regex3.test(username)) {
        setUsernameError("leading and trailing periods are not allowed!");
        return;
      }
      if (!regex4.test(username)) {
        setUsernameError("Consicutive special characters not allowed!");
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
        await updateDoc(userDocRef, { username: username, Verified: false });
        await updateAndStoreUserData({ username: username });
        setIsEditingUsername(false);
        setOldUsername(username);
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
    <div className="flex flex-col items-center justify-center w-full md:w-[40%] max-w-sm mx-auto p-4">
      <div className="w-full max-w-[240px] aspect-square mb-5 overflow-hidden">
        {avatarURL ? (
          <img
            src={avatarURL}
            alt="User Avatar"
            className="w-full h-full object-cover border-4 border-blue-400 rounded-full"
          />
        ) : (
          <Lottie
            className="w-full h-full"
            animationData={User_Icon}
            loop={true}
          />
        )}
      </div>

      <div className="w-full flex flex-col items-center">
        <label
          htmlFor="userProfileImage"
          className="text-white bg-blue-500 hover:bg-blue-600 focus:ring-2 focus:outline-none focus:ring-blue-400 rounded-lg text-xs px-4 py-1.5 text-center dark:bg-blue-500 dark:hover:bg-blue-600 dark:focus:ring-blue-600 mb-4 cursor-pointer"
        >
          Update Avatar
        </label>
        <input
          type="file"
          name="user_profile_image"
          id="userProfileImage"
          className="hidden"
          accept="image/*"
          onChange={handleAvatarUpload}
        />

        {uploadError && (
          <p className="text-red-500 text-sm mb-2">{uploadError}</p>
        )}

        <div className="w-full flex flex-col items-center">
          {isEditingUsername ? (
            <div className="w-full flex flex-col items-center">
              <input
                type="text"
                value={username}
                onChange={handleUsernameChange}
                className="w-full max-w-[200px] border rounded px-3 py-1.5 text-sm text-center mb-2"
                placeholder="Enter a username"
              />
              <div className="flex space-x-2">
                <button
                  onClick={handleUsernameSubmit}
                  className="bg-green-500 text-white px-4 py-1 rounded text-xs"
                >
                  Save
                </button>
                <button
                  onClick={handleCancelEdit}
                  className="text-red-600 px-4 py-1 rounded text-xs"
                >
                  Cancel
                </button>
              </div>
              {usernameError && (
                <p className="text-red-500 mt-2 text-xs text-center">
                  {usernameError}
                </p>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <div className="flex items-center justify-center flex-wrap">
                <span className="text-xl font-semibold">
                  ~{username || "No username set"}
                </span>
                {verified && (
                  <div className="flex items-center ml-1">
                    <MdVerified className="text-[17px] text-blue-500" />
                    {dev && <PiCodeDuotone className="text-2xl ml-1" />}
                  </div>
                )}
              </div>
              <button
                onClick={() => setIsEditingUsername(true)}
                className="mt-2 bg-gray-400 text-white px-4 py-1 rounded text-xs"
              >
                Edit
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserAvatar;
