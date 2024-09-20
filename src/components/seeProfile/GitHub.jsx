import React, { useState, useEffect } from "react";
import { auth, db } from "../../firebase.config";
import { doc, getDoc } from "firebase/firestore";
import { FaGithub } from "react-icons/fa";

const GitHub = () => {
  const [gitHubInput, setGitHubInput] = useState("");

  useEffect(() => {
    const fetchGitHubProfile = async () => {
      const user = auth.currentUser;
      if (user) {
        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          setGitHubInput(userDoc.data().githubProfile || "");
        }
      }
    };

    fetchGitHubProfile();
  }, []);

  return (
    <div className="bg-slate-100 border-2 border-blue-400 w-full p-4 h-fit rounded-3xl">
      <div className="text-lg pb-1 flex justify-between">
        <div className="mt-2">
          <span className="cursor-text font-semibold ">GitHub</span>
        </div>
        <a
          href={gitHubInput}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 flex space-x-2"
        >
          <FaGithub className="text-2xl" />
          <span className="text-xs mt-1">visit</span>
        </a>
      </div>
    </div>
  );
};

export default GitHub;
