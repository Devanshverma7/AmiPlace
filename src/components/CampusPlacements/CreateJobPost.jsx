import { addDoc, collection, doc, getDoc, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import React, { useEffect, useState } from "react";
import { auth, db, storage } from "../../firebase.config";

const techCourses = [
  "All_Tech",
  "B.Tech Computer Science",
  "B.Tech Information Technology",
  "B.Tech Electronics",
  "B.Tech Mechanical",
  "MCA",
  "M.Tech Computer Science",
];

const nonTechCourses = [
  "All_NonTech",
  "BBA",
  "MBA",
  "B.Com",
  "M.Com",
  "BA Economics",
  "MA Economics",
];

// Define gender criteria options
const GENDER_CRITERIA = {
  FOR_ALL: "ForAll",
  FEMALE_ONLY: "Female",
  MALE_ONLY: "Male"
};

const CreateJobPost = ({ onClose, jobId }) => {
  const initialFormData = {
    companyName: "",
    jobRole: "",
    ctc: "",
    location: "",
    requirements: "",
    jobOpeningDate: "",
    openedTill: "",
    jobDescriptionFile: null,
    jobDescriptionFileUrl: "",
    maxAge: "",
    selectedCourses: [],
    genderCriteria: "",
    maxBacklogs: "",
    placedCriteria: "",
    minCGPA: "",
    min12thPercentage: "",
    min10thPercentage: "",
  };

  const [formData, setFormData] = useState(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [isLoading, setIsLoading] = useState(!!jobId);

  useEffect(() => {
    const fetchJobData = async () => {
      if (!jobId) return;

      try {
        const jobDoc = await getDoc(doc(db, "Jobs", jobId));
        if (jobDoc.exists()) {
          const data = jobDoc.data();
          // Transform the data to match form structure
          setFormData({
            ...initialFormData,
            ...data,
            maxAge: data.EligibilityCriteria?.maxAge || "",
            placedCriteria: data.EligibilityCriteria?.placedCriteria ? "1" : "0",
            maxBacklogs: data.EligibilityCriteria?.maxBacklogs || "",
            minCGPA: data.EligibilityCriteria?.minCGPA || "",
            selectedCourses: data.EligibilityCriteria?.selectedCourses || [],
            min12thPercentage: data.EligibilityCriteria?.min12thPercentage || "",
            min10thPercentage: data.EligibilityCriteria?.min10thPercentage || "",
            genderCriteria: data.EligibilityCriteria?.genderCriteria || "", // Added this line
          });
        }
      } catch (error) {
        console.error("Error fetching job data:", error);
        setSubmitError("Failed to load job data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobData();
  }, [jobId]);

  const handleChange = (e) => {
    const { name, value, type, files, checked } = e.target;

    if (type === "checkbox" && name === "selectedCourses") {
      const updatedCourses = [...formData.selectedCourses];
      if (checked) {
        updatedCourses.push(value);
      } else {
        const index = updatedCourses.indexOf(value);
        if (index > -1) {
          updatedCourses.splice(index, 1);
        }
      }
      setFormData((prevData) => ({
        ...prevData,
        selectedCourses: updatedCourses,
      }));
    } else if (type === "file") {
      setFormData((prevData) => ({
        ...prevData,
        jobDescriptionFile: files[0],
        jobDescriptionFileUrl: "", // Reset URL when new file is selected
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      let fileUrl = formData.jobDescriptionFileUrl;
      if (formData.jobDescriptionFile) {
        const storageRef = ref(
          storage,
          `job-descriptions/${formData.jobDescriptionFile.name}`
        );
        await uploadBytes(storageRef, formData.jobDescriptionFile);
        fileUrl = await getDownloadURL(storageRef);
      }

      const jobData = {
        companyName: formData.companyName,
        jobRole: formData.jobRole,
        ctc: formData.ctc,
        location: formData.location,
        requirements: formData.requirements,
        companyNameUpper: formData.companyName.toUpperCase(),
        jobDescriptionFileUrl: fileUrl,
        jobOpeningDate: formData.jobOpeningDate,
        openedTill: formData.openedTill,
        createdAt: jobId ? formData.createdAt : new Date(),
        createdBy: jobId ? formData.createdBy : auth.currentUser.uid,
        applicants: jobId ? formData.applicants : [],
        EligibilityCriteria: {
          maxAge: Number(formData.maxAge),
          placedCriteria: formData.placedCriteria === "1",
          maxBacklogs: Number(formData.maxBacklogs),
          minCGPA: Number(formData.minCGPA),
          selectedCourses: [...formData.selectedCourses],
          min12thPercentage: Number(formData.min12thPercentage),
          min10thPercentage: Number(formData.min10thPercentage),
          genderCriteria: formData.genderCriteria, // Added this line
        },
      };

      if (jobId) {
        await updateDoc(doc(db, "Jobs", jobId), jobData);
        alert("Job post updated successfully!");
      } else {
        await addDoc(collection(db, "Jobs"), jobData);
        alert("Job post created successfully!");
      }
      onClose();
    } catch (error) {
      console.error("Error submitting form: ", error);
      setSubmitError(
        "An error occurred while submitting the form. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Disable scroll for number inputs
  useEffect(() => {
    const numberInputs = document.querySelectorAll('input[type="number"]');
    const preventScroll = (e) => e.preventDefault();
    numberInputs.forEach((input) => {
      input.addEventListener("wheel", preventScroll, { passive: false });
    });
    return () => {
      numberInputs.forEach((input) => {
        input.removeEventListener("wheel", preventScroll);
      });
    };
  }, []);

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white p-6 rounded-lg">
          <p>Loading job data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
      <div className="relative bg-white max-w-2xl w-full max-h-[80%] overflow-auto mx-4 p-6 rounded-lg shadow-lg">
        <button
          onClick={onClose}
          className="absolute text-3xl top-5 right-5 text-gray-600 hover:text-gray-900 focus:outline-none"
        >
          &times;
        </button>

        <form onSubmit={handleSubmit} className="mt-4">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">
            {jobId ? "Update Job Post" : "Create New Job Post"}
          </h2>

          <div className="mb-4">
            <label
              htmlFor="companyName"
              className="block text-sm font-medium text-gray-700"
            >
              Company Name
            </label>
            <input
              type="text"
              id="companyName"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="jobRole"
              className="block text-sm font-medium text-gray-700"
            >
              Job Role
            </label>
            <input
              type="text"
              id="jobRole"
              name="jobRole"
              value={formData.jobRole}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="ctc"
              className="block text-sm font-medium text-gray-700"
            >
              CTC (in LPA)
            </label>
            <input
              type="number"
              id="ctc"
              name="ctc"
              value={formData.ctc}
              onChange={handleChange}
              required
              className="mt-1 block w-[30%] px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="location"
              className="block text-sm font-medium text-gray-700"
            >
              Location
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="requirements"
              className="block text-sm font-medium text-gray-700"
            >
              Requirements
            </label>
            <textarea
              id="requirements"
              name="requirements"
              value={formData.requirements}
              onChange={handleChange}
              required
              rows={4}
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            ></textarea>
          </div>
          <div className="mb-4">
            <label
              htmlFor="jobOpeningDate"
              className="block text-sm font-medium text-gray-700"
            >
              Job Opening Date
            </label>
            <input
              type="datetime-local"
              id="jobOpeningDate"
              name="jobOpeningDate"
              value={formData.jobOpeningDate}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="openedTill"
              className="block text-sm font-medium text-gray-700"
            >
              Opened Till
            </label>
            <input
              type="datetime-local"
              id="openedTill"
              name="openedTill"
              value={formData.openedTill}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="jobDescriptionFile"
              className="block text-sm font-medium text-gray-700"
            >
              Job Description File
            </label>
            <input
              type="file"
              id="jobDescriptionFile"
              name="jobDescriptionFile"
              onChange={handleChange}
              accept=".pdf,.doc,.docx"
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <h1 className="font-semibold text-xl my-2 border-b-2 border-black">
            Job Criterias:
          </h1>
          <div className="mb-4">
            <label
              htmlFor="maxAge"
              className="block text-sm font-medium text-gray-700"
            >
              Maximum Age
            </label>
            <input
              type="number"
              id="maxAge"
              name="maxAge"
              value={formData.maxAge}
              onChange={handleChange}
              required
              className="mt-1 block w-[30%] px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Eligible Courses
            </label>
            <div className="space-y-2">
              <h4 className="font-medium text-gray-600">Tech Courses</h4>
              {techCourses.map((course) => (
                <div key={course} className="flex items-center">
                  <input
                    type="checkbox"
                    id={course}
                    name="selectedCourses"
                    value={course}
                    checked={formData.selectedCourses.includes(course)}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  <label htmlFor={course}>{course}</label>
                </div>
              ))}
              <h4 className="font-medium text-gray-600 mt-4">
                Non-Tech Courses
              </h4>
              {nonTechCourses.map((course) => (
                <div key={course} className="flex items-center">
                  <input
                    type="checkbox"
                    id={course}
                    name="selectedCourses"
                    value={course}
                    checked={formData.selectedCourses.includes(course)}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  <label htmlFor={course}>{course}</label>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <label
              htmlFor="maxBacklogs"
              className="block text-sm font-medium text-gray-700"
            >
              Maximum Backlogs Allowed
            </label>
            <input
              type="number"
              step={1}
              id="maxBacklogs"
              name="maxBacklogs"
              value={formData.maxBacklogs}
              onChange={handleChange}
              required
              className="mt-1 block w-[30%] px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="mb-4">
          <label
            htmlFor="genderCriteria"
            className="block text-sm font-medium text-gray-700"
          >
            Gender Criteria
          </label>
          <select
            id="genderCriteria"
            name="genderCriteria"
            value={formData.genderCriteria}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select</option>
            <option value={GENDER_CRITERIA.FOR_ALL}>For all</option>
            <option value={GENDER_CRITERIA.FEMALE_ONLY}>Females Only</option>
            <option value={GENDER_CRITERIA.MALE_ONLY}>Male Only</option>
          </select>
        </div>
          <div className="mb-4">
            <label
              htmlFor="placedCriteria"
              className="block text-sm font-medium text-gray-700"
            >
              Placed/Unplaced Criteria
            </label>
            <select
              id="placedCriteria"
              name="placedCriteria"
              value={formData.placedCriteria}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select</option>
              <option value={0}>For all</option>
              <option value={1}>Unplaced Only</option>
            </select>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="mb-4">
              <label
                htmlFor="minCGPA"
                className="block text-sm font-medium text-gray-700"
              >
                Min CGPA
              </label>
              <input
                type="number"
                step="0.01"
                id="minCGPA"
                name="minCGPA"
                value={formData.minCGPA}
                onChange={handleChange}
                required
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="min12thPercentage"
                className="block text-sm font-medium text-gray-700"
              >
                Min 12th %
              </label>
              <input
                type="number"
                id="min12thPercentage"
                name="min12thPercentage"
                value={formData.min12thPercentage}
                onChange={handleChange}
                required
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="min10thPercentage"
                className="block text-sm font-medium text-gray-700"
              >
                Min 10th %
              </label>
              <input
                type="number"
                id="min10thPercentage"
                name="min10thPercentage"
                value={formData.min10thPercentage}
                onChange={handleChange}
                required
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div className="mt-6">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-300 ${
                isSubmitting ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {isSubmitting
                ? jobId
                  ? "Updating Job Post..."
                  : "Creating Job Post..."
                : jobId
                ? "Update Job Post"
                : "Create Job Post"}
            </button>
          </div>

          {submitError && (
            <p className="mt-4 text-red-500 text-sm">{submitError}</p>
          )}
        </form>
      </div>
    </div>
  );
};

export default CreateJobPost;
