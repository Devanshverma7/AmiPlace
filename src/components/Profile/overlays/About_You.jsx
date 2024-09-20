import { doc, getDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useRef } from "react";
import { RxCross2 } from "react-icons/rx";
import { auth, db } from "../../../firebase.config";
import { updateAndStoreUserData } from "../../../utils";

const About_You = ({ isVisible, onClose }) => {
  if (!isVisible) return null;

  const FullNameInput = useRef();
  const CourseInput = useRef();
  const BranchInput = useRef();
  const SemesterInput = useRef();
  const SpecializationInput = useRef();
  const [gender, setGender] = useState("");
  const [userData, setUserData] = useState({});
  const DOBInput = useRef();

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

  const handleSubmit = (e) => {
    e.preventDefault();
    const userData = {
      FullName: FullNameInput.current.value,
      Course: CourseInput.current.value,
      Branch: BranchInput.current.value,
      Semester: SemesterInput.current.value,
      Specialization: SpecializationInput.current.value,
      Gender: gender,
      DOB: DOBInput.current.value,
    };
    updateAndStoreUserData(userData);
    onClose();
  };
  return (
    <>
      {userData && (
        <div className=" fixed inset-0 bg-black  bg-opacity-25 backdrop-blur-sm flex justify-center items-center ">
          <form
            id="AboutYouForm"
            onSubmit={handleSubmit}
            className="w-[80%] md:w-[40%] mx-auto h-[70%] overflow-y-auto bg-white px-5 pb-5 rounded-lg"
          >
            <div className="z-10 h-10 py-3 bg-white control flex justify-end sticky top-0">
              <button
                className="close_overlay items-center"
                onClick={() => onClose()}
              >
                <RxCross2 />
              </button>
            </div>
            <div className=" relative w-full mb-5 group  ">
              <label className="block mb-2 text-sm font-medium text-black ">
                Full Name
              </label>
              <input
                type="text"
                id="base-input"
                value={userData.FullName}
                name="FullName"
                ref={FullNameInput}
                className="bg-white border   text-sm rounded-lg  block w-full p-2.5  text-black  shadow-md required"
              />
            </div>
            <div className="relative z-0 w-full mb-5 group">
              <label className="block mb-2 text-sm font-medium text-black ">
                Course
              </label>
              <input
                type="text"
                id="base-input"
                name="Course"
                value={userData.Course}
                ref={CourseInput}
                className="bg-white border text-sm rounded-lg  block w-full p-2.5  text-black  shadow-md required"
              />
            </div>
            <div className="relative z-0 w-full mb-5 group">
              <label
                htmlFor="base-input"
                className="block mb-2 text-sm font-medium text-black "
              >
                Branch
              </label>
              <input
                type="text"
                id="base-input"
                name="Branch"
                value={userData.Branch}
                ref={BranchInput}
                className="bg-white border text-sm rounded-lg  block w-full p-2.5  text-black  shadow-md required"
              />
            </div>
            <div className="relative z-0 w-full mb-5 group">
              <label
                htmlFor="base-input"
                className="block mb-2 text-sm font-medium text-black "
              >
                Semester
              </label>
              <input
                type="text"
                id="base-input"
                name="Semester"
                value={userData.Semester}
                ref={SemesterInput}
                className="bg-white border text-sm rounded-lg  block w-full p-2.5  text-black  shadow-md required"
              />
            </div>
            <div className="relative z-0 w-full mb-5 group">
              <label
                htmlFor="base-input"
                className="block mb-2 text-sm font-medium text-black "
              >
                Specialization
              </label>
              <input
                type="text"
                id="base-input"
                name="Specialization"
                value={userData.Specialization}
                ref={SpecializationInput}
                className="bg-white border text-sm rounded-lg  block w-full p-2.5  text-black  shadow-md required"
              />
            </div>
            <div className="relative z-0 w-full mb-5 group space-x-2">
              <span className="block mb-2 text-sm font-medium text-black">
                Gender
              </span>
              <label htmlFor="male">Male</label>
              <input
                type="radio"
                id="male"
                name="Gender"
                value="Male"
                onChange={(e) => setGender(e.target.value)}
              />
              <label htmlFor="female">Female</label>
              <input
                type="radio"
                id="female"
                name="Gender"
                value="Female"
                onChange={(e) => setGender(e.target.value)}
              />
              <label htmlFor="other">Other</label>
              <input
                type="radio"
                id="other"
                name="Gender"
                value="Other"
                onChange={(e) => setGender(e.target.value)}
              />
            </div>
            <div className="relative z-0 w-full mb-5 group">
              <label
                htmlFor="base-input"
                className="block mb-2 text-sm font-medium text-black "
              >
                Date of Birth (DD/MM/YYYY)
              </label>
              <input
                type="date"
                id="base-input"
                name="DOB"
                value={userData.DOB}
                ref={DOBInput}
                className="bg-white border text-sm rounded-lg  block w-full p-2.5  text-black  shadow-md required"
              />
            </div>
            <button
              type="submit"
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              Update
            </button>{" "}
            <button
              type="reset"
              className="text-white bg-gray-400 hover:bg-gray-500 focus:outline-none font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-gray-400 dark:hover:bg-gray-500 "
            >
              reset
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default About_You;
