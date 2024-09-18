import { useState, useEffect } from "react";
import About_You from "./overlays/About_You";
import { auth, db } from "../../firebase.config";
import { doc, getDoc } from "firebase/firestore";
import { IoMdMale } from "react-icons/io";
import { IoMdFemale } from "react-icons/io";

const UserBasicInfo = () => {
  const [showModal, setShowModal] = useState(false);
  const [userData, setUserData] = useState({});

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (user) {
        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          setUserData(userDoc.data());
        }
      }
    };

    fetchUserData();
  }, []);
  return (
    <div className="flex justify-between gap-10 w-full h-full xsm:w-full sm:w-full m-3  rounded-xl p-4 border-blue-400 border-2">
      <div className=" flex flex-col justify-evenly  gap-3 w-full h-full rounded-xl  p-2 ">
        <div className="mr-2 text-lg">
          <span className="font-semibold text-blue-600">Name:</span>
          <span className="font-normal p-3 text-lg  ">{userData.FullName}</span>
        </div>
        <div className="mr-2 text-lg">
          <span className="font-semibold text-blue-600">Course Name: </span>
          <span className="font-normal p-3 text-lg  ">{userData.Course}</span>
        </div>
        <div className="mr-2 text-lg">
          <span className="font-semibold text-blue-600"> Branch: </span>
          <span className="font-normal p-3 text-lg  ">{userData.Branch}</span>
        </div>
        <div className="mr-2 text-lg">
          <span className="font-semibold text-blue-600">Semister: </span>
          <span className="font-normal p-3 text-lg  ">{userData.Semister}</span>
        </div>
        <div className="mr-2 text-lg">
          <span className="font-semibold text-blue-600">Specialization: </span>
          <span className="font-normal p-3 text-lg  ">
            {userData.Specialization}
          </span>
        </div>
        <div className="mr-2 text-lg flex space-x-2">
          <span className="font-semibold text-blue-600">Gender: </span>
          <span className="font-normal pl-3 text-lg  ">{userData.Gender}</span>
          <span className="mt-[5px] ">
            {userData.Gender == "Male" ? <IoMdMale /> : <IoMdFemale />}
          </span>
        </div>
        <div className="mr-2 text-lg">
          <span className="font-semibold text-blue-600">DOB: </span>
          <span className="font-normal p-3 text-lg  ">{userData.DOB}</span>
        </div>
      </div>
      <div className="">
        <button onClick={() => setShowModal(true)}>
          <i className="ri-edit-2-fill"></i>
        </button>
      </div>
      <About_You isVisible={showModal} onClose={() => setShowModal(false)} />
    </div>
  );
};
export default UserBasicInfo;
