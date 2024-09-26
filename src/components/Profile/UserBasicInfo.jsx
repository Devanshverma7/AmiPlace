import { useState, useEffect, useCallback } from "react";
import About_You from "./overlays/About_You";
import { auth, db } from "../../firebase.config";
import { doc, getDoc } from "firebase/firestore";
import { IoMdMale, IoMdFemale } from "react-icons/io";

const UserBasicInfo = () => {
  const [showModal, setShowModal] = useState(false);
  const [userData, setUserData] = useState({});

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (user) {
        const userDocRef = doc(db, "users", user.uid);
        try {
          const userDoc = await getDoc(userDocRef);
          if (userDoc.exists()) {
            setUserData(userDoc.data());
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };

    fetchUserData();
  }, []);

  const handleEditClick = useCallback(() => {
    setShowModal(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setShowModal(false);
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
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800">Basic Information</h2>
        <button
          onClick={handleEditClick}
          className="text-blue-500 hover:text-blue-700"
        >
          <i className="ri-edit-2-fill text-xl"></i>
        </button>
      </div>
      <div className="grid grid-cols-2 gap-x-4 gap-y-2 ">
        <InfoItem label="Name" value={userData.FullName} />
        <InfoItem label="Course Name" value={userData.Course} />
        <InfoItem label="Branch" value={userData.Branch} />
        <InfoItem label="Semester" value={userData.Semester} />
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
        <InfoItem label="Enrollment Number" value={userData.EnrollmentNumber} />
        <InfoItem label="Personal Email" value={userData.PersonalEmail} />
      </div>
      <About_You isVisible={showModal} onClose={handleCloseModal} />
    </div>
  );
};

export default UserBasicInfo;
