import { useState, useEffect } from "react";
import { auth, db } from "../../firebase.config";
import { doc, getDoc } from "firebase/firestore";
import { IoMdMale } from "react-icons/io";
import { IoMdFemale } from "react-icons/io";

const UserBasicInfo = ({ userUID }) => {
  const [userData, setUserData] = useState({});

  useEffect(() => {
    const fetchUserData = async () => {
      const userDocRef = doc(db, "users", userUID);
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        setUserData(userDoc.data());
      }
    };

    fetchUserData();
  }, []);
  const InfoItem = ({ label, value, icon }) => (
    <div className="mb-2">
      <span className="text-blue-600 font-semibold">{label}: </span>
      <span className="text-gray-800">
        {value}
        {icon}
      </span>
    </div>
  );
  return (
    <div className="flex-grow border-2 border-blue-400 rounded-xl p-5">
      <div className="flex justify-center items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800">Basic Information</h2>
      </div>
      <div className="grid grid-cols-2 gap-x-4 gap-y-2 ">
        <InfoItem label="Name" value={userData.FullName} />
        <InfoItem label="Course Name" value={userData.Course} />
        <InfoItem label="Branch" value={userData.Branch} />
        <InfoItem label="Semester" value={userData.Semister} />
        <InfoItem label="Specialization" value={userData.Specialization} />
        <InfoItem
          label="Gender"
          value={userData.Gender}
          icon={
            userData.Gender === "Male" ? (
              <IoMdMale className="inline ml-1 text-blue-500" />
            ) : (
              <IoMdFemale className="inline ml-1 text-pink-500" />
            )
          }
        />
        <InfoItem label="DOB" value={userData.DOB} />
      </div>
    </div>
  );
};
export default UserBasicInfo;
