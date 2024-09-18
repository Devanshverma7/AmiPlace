import React, { useState } from "react";
import { RxCross2 } from "react-icons/rx";
import { auth, db } from "../../firebase.config";
import { doc, updateDoc } from "firebase/firestore";
import { useSelector } from "react-redux";

const LinkedIn = () => {
  const [linkedInEdit, setLinkedInEdit] = useState(false);
  const userData = useSelector((store) => store.userDetails.userData);
  const [linkedInInput, setLinkedInInput] = useState(userData.linkedIn);

  // useEffect(() => {
  //   const fetchLinkedInProfile = async () => {
  //     const user = auth.currentUser;
  //     if (user) {
  //       const userDocRef = doc(db, "users", user.uid);
  //       const userDoc = await getDoc(userDocRef);
  //       if (userDoc.exists()) {
  //         setLinkedInInput(userDoc.data().linkedinProfile || "");
  //       }
  //     }
  //   };

  //   fetchLinkedInProfile();
  // }, []);

  const handleAddLinkedIn = async () => {
    if (linkedInInput[0] == "w") {
      setLinkedInInput("https://" + linkedInInput);
    }
    const user = auth.currentUser;
    if (user) {
      const userDocRef = doc(db, "users", user.uid);
      await updateDoc(userDocRef, { linkedinProfile: linkedInInput });
      setLinkedInEdit(false);
    }
  };

  return (
    <div className="bg-slate-100 border-2 border-blue-400 w-full p-4 h-fit rounded-3xl">
      <div className="text-lg pb-1 flex">
        <div className="mt-2">
          <span className="cursor-text font-semibold ">LinkedIn</span>
          <button>
            <i
              className="ri-edit-2-fill ml-2"
              onClick={() => setLinkedInEdit(true)}
            ></i>
          </button>
        </div>
        <a
          href={linkedInInput}
          target="_blank"
          rel="noopener noreferrer"
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-2 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 ml-10"
        >
          To Profile
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

export default LinkedIn;
