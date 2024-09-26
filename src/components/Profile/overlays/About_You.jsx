import React, { useEffect, useState, useCallback } from "react";
import { RxCross2 } from "react-icons/rx";
import { auth, db } from "../../../firebase.config";
import { doc, getDoc } from "firebase/firestore";
import { updateAndStoreUserData } from "../../../utils";

const About_You = ({ isVisible, onClose, refresh }) => {
  const [formData, setFormData] = useState({
    FullName: "",
    Course: "",
    Branch: "",
    Semester: "",
    Specialization: "",
    Gender: "",
    DOB: "",
    PersonalEmail: "",
    EnrollmentNumber: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const branches = [
    "CSE",
    "ECE",
    "ME",
    "Civil Er.",
    "EE",
    "Chemical Er.",
    "Other",
  ];
  const specializations = ["AI&ML", "Data Science", "IOT", "Other"];
  const courses = ["B.Tech", "Other"];
  const semesters = Array.from({ length: 8 }, (_, i) => i + 1);

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (user) {
        const userDocRef = doc(db, "users", user.uid);
        try {
          const userDoc = await getDoc(userDocRef);
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setFormData((prevData) => ({
              ...prevData,
              ...userData,
              Course: userData.Course || "B.Tech",
            }));
          }
        } catch (error) {
          setErrors((prevErrors) => ({
            ...prevErrors,
            fetch: "Failed to fetch user data. Please try again.",
          }));
        }
      }
    };
    if (isVisible) {
      fetchUserData();
    }
  }, [isVisible]);

  const validateFullName = useCallback((name) => {
    const regex = /^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/;
    return regex.test(name);
  }, []);

  const validateEmail = useCallback((email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }, []);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: null,
    }));
  }, []);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      const newErrors = {};

      if (!validateFullName(formData.FullName)) {
        newErrors.FullName = "Please enter a valid full name.";
      }
      if (!formData.Course) {
        newErrors.Course = "Please select your course.";
      }
      if (!formData.Branch) {
        newErrors.Branch = "Please select your branch.";
      }
      if (!formData.Semester) {
        newErrors.Semester = "Please select your semester.";
      }
      if (!formData.Specialization) {
        newErrors.Specialization = "Please select your specialization.";
      }
      if (!validateEmail(formData.PersonalEmail)) {
        newErrors.PersonalEmail = "Please enter a valid email address.";
      }

      if (Object.keys(newErrors).length === 0) {
        setIsSubmitting(true);
        try {
          await updateAndStoreUserData(formData);
          onClose();
        } catch (error) {
          setErrors({
            submit: "Failed to update user data. Please try again.",
          });
        } finally {
          refresh();
          setIsSubmitting(false);
        }
      } else {
        setErrors(newErrors);
      }
    },
    [formData, validateFullName, validateEmail, onClose]
  );

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm flex justify-center items-center">
      <form
        onSubmit={handleSubmit}
        className="w-[80%] md:w-[40%] mx-auto h-[70%] overflow-y-auto bg-white px-5 pb-5 rounded-lg"
      >
        <div className="z-10 h-10 py-3 bg-white control flex justify-end sticky top-0">
          <button
            type="button"
            className="close_overlay items-center"
            onClick={onClose}
          >
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
            Course
          </label>
          <select
            name="Course"
            value={formData.Course}
            onChange={handleChange}
            className="bg-white border text-sm rounded-lg block w-full p-2.5 text-black shadow-md"
          >
            <option value="">Select Course</option>
            {courses.map((course) => (
              <option key={course} value={course}>
                {course}
              </option>
            ))}
          </select>
          {errors.Course && (
            <p className="text-red-500 text-xs mt-1">{errors.Course}</p>
          )}
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
            {branches.map((branch) => (
              <option key={branch} value={branch}>
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
            {semesters.map((semester) => (
              <option key={semester} value={semester}>
                {semester}
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
            {specializations.map((spec) => (
              <option key={spec} value={spec}>
                {spec}
              </option>
            ))}
          </select>
          {errors.Specialization && (
            <p className="text-red-500 text-xs mt-1">{errors.Specialization}</p>
          )}
        </div>

        <div className="mb-5">
          <label className="block mb-2 text-sm font-medium text-black">
            Gender
          </label>
          <div className="flex space-x-4">
            {["Male", "Female", "Other"].map((gender) => (
              <label key={gender} className="inline-flex items-center">
                <input
                  type="radio"
                  name="Gender"
                  value={gender}
                  checked={formData.Gender === gender}
                  onChange={handleChange}
                  className="form-radio h-5 w-5 text-blue-600"
                />
                <span className="ml-2 text-gray-700">{gender}</span>
              </label>
            ))}
          </div>
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
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={`text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center ${
            isSubmitting ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {isSubmitting ? "Updating..." : "Update"}
        </button>
        {errors.submit && (
          <p className="text-red-500 text-xs mt-2">{errors.submit}</p>
        )}
      </form>
    </div>
  );
};

export default About_You;
