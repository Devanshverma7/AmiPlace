import React, { useEffect, useState } from "react";
import { RxCross2 } from "react-icons/rx";
import { auth, db } from "../../../firebase.config";
import { doc, getDoc } from "firebase/firestore";
import { updateAndStoreUserData } from "../../../utils";

const About_You = ({ isVisible, onClose }) => {
  if (!isVisible) return null;

  const [formData, setFormData] = useState({
    FullName: "",
    Course: "B.Tech",
    Branch: "",
    Semester: "",
    Specialization: "",
    Gender: "",
    DOB: "",
    PersonalEmail: "",
    EnrollmentNumber: "",
  });

  const [errors, setErrors] = useState({});

  const branches = ["CSE", "ECE", "ME", "Civil Er.", "EE", "Chemical Er."];
  const specializations = ["AI&ML", "Data Science", "IOT", "Other"];

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (user) {
        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          setFormData(userDoc.data());
        }
      }
    };
    fetchUserData();
  }, []);

  const validateFullName = (name) => {
    const regex = /^[a-zA-Z]+(\s[a-zA-Z]+)?$/;
    return regex.test(name);
  };

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: null,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!validateFullName(formData.FullName)) {
      newErrors.FullName =
        "Full Name should only contain letters and at most one space between words.";
    }

    if (!formData.Branch) {
      newErrors.Branch = "Please select a branch.";
    }

    if (!formData.Semester) {
      newErrors.Semester = "Please select a semester.";
    }

    if (!formData.Specialization) {
      newErrors.Specialization = "Please select a specialization.";
    }

    if (!validateEmail(formData.PersonalEmail)) {
      newErrors.PersonalEmail = "Please enter a valid email address.";
    }

    if (Object.keys(newErrors).length === 0) {
      updateAndStoreUserData(formData);
      onClose();
    } else {
      setErrors(newErrors);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm flex justify-center items-center">
      <form
        onSubmit={handleSubmit}
        className="w-[80%] md:w-[40%] mx-auto h-[70%] overflow-y-auto bg-white px-5 pb-5 rounded-lg"
      >
        <div className="z-10 h-10 py-3 bg-white control flex justify-end sticky top-0">
          <button className="close_overlay items-center" onClick={onClose}>
            <RxCross2 />
          </button>
        </div>

        <div className="mb-5">
          <label className="block mb-2 text-sm font-medium text-black">
            Full Name
          </label>
          <input
            type="text"
            name="FullName"
            value={formData.FullName}
            onChange={handleChange}
            className="bg-white border text-sm rounded-lg block w-full p-2.5 text-black shadow-md"
          />
          {errors.FullName && (
            <p className="text-red-500 text-xs mt-1">{errors.FullName}</p>
          )}
        </div>
        <div className="mb-5">
          <label className="block mb-2 text-sm font-medium text-black">
            Personal Email
          </label>
          <input
            type="email"
            name="PersonalEmail"
            value={formData.PersonalEmail}
            onChange={handleChange}
            className="bg-white border text-sm rounded-lg block w-full p-2.5 text-black shadow-md"
          />
          {errors.PersonalEmail && (
            <p className="text-red-500 text-xs mt-1">{errors.PersonalEmail}</p>
          )}
        </div>
        <div className="mb-5">
          <label className="block mb-2 text-sm font-medium text-black">
            Enrollment Number
          </label>
          <input
            type="text"
            name="EnrollmentNumber"
            value={formData.EnrollmentNumber}
            onChange={handleChange}
            className="bg-white border text-sm rounded-lg block w-full p-2.5 text-black shadow-md"
          />
          {errors.EnrollmentNumber && (
            <p className="text-red-500 text-xs mt-1">
              {errors.EnrollmentNumber}
            </p>
          )}
        </div>
        <div className="mb-5">
          <label className="block mb-2 text-sm font-medium text-black">
            Course
          </label>
          <select
            name="Course"
            value={formData.Course}
            onChange={handleChange}
            className="bg-white border text-sm rounded-lg block w-full p-2.5 text-black shadow-md"
          >
            <option value="B.Tech">B.Tech</option>
          </select>
        </div>

        <div className="mb-5">
          <label className="block mb-2 text-sm font-medium text-black">
            Branch
          </label>
          <select
            name="Branch"
            value={formData.Branch}
            onChange={handleChange}
            className="bg-white border text-sm rounded-lg block w-full p-2.5 text-black shadow-md"
          >
            <option value="">Select Branch</option>
            {branches.map((branch, index) => (
              <option key={index} value={branch}>
                {branch}
              </option>
            ))}
          </select>
          {errors.Branch && (
            <p className="text-red-500 text-xs mt-1">{errors.Branch}</p>
          )}
        </div>

        <div className="mb-5">
          <label className="block mb-2 text-sm font-medium text-black">
            Semester
          </label>
          <select
            name="Semester"
            value={formData.Semester}
            onChange={handleChange}
            className="bg-white border text-sm rounded-lg block w-full p-2.5 text-black shadow-md"
          >
            <option value="">Select Semester</option>
            {[...Array(8)].map((_, i) => (
              <option key={i} value={i + 1}>
                {i + 1}
              </option>
            ))}
          </select>
          {errors.Semester && (
            <p className="text-red-500 text-xs mt-1">{errors.Semester}</p>
          )}
        </div>

        <div className="mb-5">
          <label className="block mb-2 text-sm font-medium text-black">
            Specialization
          </label>
          <select
            name="Specialization"
            value={formData.Specialization}
            onChange={handleChange}
            className="bg-white border text-sm rounded-lg block w-full p-2.5 text-black shadow-md"
          >
            <option value="">Select Specialization</option>
            {specializations.map((spec, index) => (
              <option key={index} value={spec}>
                {spec}
              </option>
            ))}
          </select>
          {errors.Specialization && (
            <p className="text-red-500 text-xs mt-1">{errors.Specialization}</p>
          )}
        </div>

        <div className="mb-5 space-x-2">
          <span className="block mb-2 text-sm font-medium text-black">
            Gender
          </span>
          {["Male", "Female", "Other"].map((option) => (
            <React.Fragment key={option}>
              <label htmlFor={option.toLowerCase()}>{option}</label>
              <input
                type="radio"
                id={option.toLowerCase()}
                name="Gender"
                value={option}
                checked={formData.Gender === option}
                onChange={handleChange}
              />
            </React.Fragment>
          ))}
        </div>

        <div className="mb-5">
          <label className="block mb-2 text-sm font-medium text-black">
            Date of Birth
          </label>
          <input
            type="date"
            name="DOB"
            value={formData.DOB}
            onChange={handleChange}
            className="bg-white border text-sm rounded-lg block w-full p-2.5 text-black shadow-md"
          />
        </div>

        <button
          type="submit"
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          Update
        </button>
        <button
          type="button"
          onClick={() => setFormData({})}
          className="ml-2 text-white bg-gray-400 hover:bg-gray-500 focus:outline-none font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-gray-400 dark:hover:bg-gray-500"
        >
          Reset
        </button>
      </form>
    </div>
  );
};

export default About_You;
