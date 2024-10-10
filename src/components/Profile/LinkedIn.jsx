import React, { useEffect, useState } from "react";
import { RxCross2 } from "react-icons/rx";
import { auth, db } from "../../firebase.config";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { FaLinkedin } from "react-icons/fa";

const LinkedIn = () => {
  const [linkedInEdit, setLinkedInEdit] = useState(false);
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

  const handleAddLinkedIn = async () => {
    if (linkedInInput[0] == "w") {
      setLinkedInInput("https://" + linkedInInput);
    }
    const user = auth.currentUser;
    if (user) {
      const userDocRef = doc(db, "users", user.uid);
      const Lin =
        linkedInInput[0] === "w" ? "https://" + linkedInInput : linkedInInput;
      await updateDoc(userDocRef, { linkedinProfile: Lin });
      setLinkedInEdit(false);
    }
  };

  return (
    <div className="bg-slate-100 border-2 border-blue-400 w-full mb-3 p-4 h-fit rounded-3xl">
      <div className="text-lg pb-1 flex justify-between">
        <div className="mt-2">
          <span className="cursor-text font-semibold ">LinkedIn</span>
          <button onClick={() => setLinkedInEdit(true)}>
            <i className="ri-edit-2-fill ml-2"></i>
            <span className="text-sm ml-1">Edit</span>
          </button>
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
      <div className={`${!linkedInEdit && "hidden"} linkedin_input space-x-2`}>
        <input
          type="text"
          value={linkedInInput}
          onChange={(e) => setLinkedInInput(e.target.value)}
          className="w-[30%] rounded-lg px-2 py-1 border-[1px] border-solid border-blue-500 text-sm"
          placeholder="Your LinkedIn profile link"
        />
        <button
          onClick={handleAddLinkedIn}
          className="text-white text-sm border-[2px] py-0.5 px-1.5 bg-blue-500 rounded-lg hover:bg-blue-600"
        >
          add
        </button>
        <button
          onClick={() => setLinkedInEdit(false)}
          className="bg-red-400 p-1 rounded-full"
        >
          <RxCross2 />
        </button>
      </div>
    </div>
  );
};
// .
export default LinkedIn;
