import React, { useState, useEffect } from "react";
import { auth, db } from "../../firebase.config";
import { doc, getDoc, updateDoc } from "firebase/firestore";

const GitHub = ({ userUID }) => {
  const [gitHubInput, setGitHubInput] = useState("");

  useEffect(() => {
    const fetchGitHubProfile = async () => {
      const userDocRef = doc(db, "users", userUID);
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        setGitHubInput(userDoc.data().githubProfile || "");
      }
    };

    fetchGitHubProfile();
  }, []);
  return (
    <div className="bg-slate-100 border-2 border-blue-400 h-1/3 w-full p-4 rounded-3xl">
      <h2 className="font-semibold text-lg pb-1">GitHub</h2>
      <div className="rounded-lg flex flex-col items-center gap-4 p-4">
        <a
          href={gitHubInput}
          target="_blank"
          rel="noopener noreferrer"
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-2 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          To Profile
        </a>
        <div className="help-text title-medium text-md text-gray-600">
          You will be directed to my GitHub profile
        </div>
      </div>
    </div>
  );
};

export default GitHub;
