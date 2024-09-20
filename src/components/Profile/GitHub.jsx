import React, { useState, useEffect } from "react";
import { RxCross2 } from "react-icons/rx";
import { auth, db } from "../../firebase.config";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { FaGithub } from "react-icons/fa";

const GitHub = () => {
  const [gitHubEdit, setGitHubEdit] = useState(false);
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

  const handleAddGitHub = async () => {
    if (gitHubInput) {
      const user = auth.currentUser;
      if (user) {
        const userDocRef = doc(db, "users", user.uid);
        await updateDoc(userDocRef, { githubProfile: gitHubInput });
        setGitHubEdit(false);
      }
    }
  };

  return (
    <div className="bg-slate-100 border-2 border-blue-400 w-full p-4 h-fit rounded-3xl">
      <div className="text-lg pb-1 flex justify-between">
        <div className="mt-2">
          <span className="cursor-text font-semibold ">GitHub</span>
          <button onClick={() => setGitHubEdit(true)}>
            <i className="ri-edit-2-fill ml-2"></i>
            <span className="text-sm ml-1">Edit</span>
          </button>
        </div>
        <a
          href={gitHubInput}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 flex space-x-2"
        >
          <FaGithub className="text-2xl"/>
          <span className="text-xs mt-1">visit</span>
        </a>
      </div>
      <div className={`${!gitHubEdit && "hidden"} github_input space-x-2`}>
        <input
          type="text"
          value={gitHubInput}
          onChange={(e) => setGitHubInput(e.target.value)}
          className="w-[30%] rounded-lg px-2 py-1 border-[1px] border-solid border-blue-500 text-sm"
          placeholder="Your GitHub profile link"
        />
        <button
          onClick={handleAddGitHub}
          className="text-white text-sm border-[2px] py-0.5 px-1.5 bg-blue-500 rounded-lg hover:bg-blue-600"
        >
          add
        </button>
        <button
          onClick={() => setGitHubEdit(false)}
          className="bg-red-400 p-1 rounded-full"
        >
          <RxCross2 />
        </button>
      </div>
    </div>
  );
};

export default GitHub;
