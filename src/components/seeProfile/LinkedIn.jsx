import React, { useEffect, useState } from "react";
import { auth, db } from "../../firebase.config";
import { doc, getDoc } from "firebase/firestore";
import { FaLinkedin } from "react-icons/fa";

const LinkedIn = () => {
  const [linkedInInput, setLinkedInInput] = useState("");

  useEffect(() => {
    const fetchLinkedInProfile = async () => {
      const user = auth.currentUser;
      if (user) {
        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          setLinkedInInput(userDoc.data().linkedinProfile || "");
        }
      }
    };

    fetchLinkedInProfile();
  }, []);

  return (
    <div className="bg-slate-100 border-2 border-blue-400 w-full mb-3 p-4 h-fit rounded-3xl">
      <div className="text-lg pb-1 flex justify-between">
        <div className="mt-2">
          <span className="cursor-text font-semibold ">LinkedIn</span>
        </div>
        <a
          href={linkedInInput}
          target="_blank"
          rel="noopener noreferrer"
          className=" mt-3 flex space-x-2"
        >
          <FaLinkedin className="text-2xl text-blue-600" />
          <span className="text-xs mt-1">visit</span>
        </a>
      </div>
    </div>
  );
};

export default LinkedIn;
