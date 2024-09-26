import React, { useRef, useState, useEffect } from "react";
import { auth, db, storage } from "../../firebase.config";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { FaCheckCircle } from "react-icons/fa";
import { FaCloudUploadAlt } from "react-icons/fa";

const UserResume = () => {
  const fileInputRef = useRef(null);
  const [uploadStatus, setUploadStatus] = useState("");
  const [isUploaded, setIsUploaded] = useState(false);
  const [resumeURL, setResumeURL] = useState("");

  useEffect(() => {
    const fetchResumeStatus = async () => {
      const user = auth.currentUser;
      if (!user) {
        console.log("User not authenticated");
        return;
      }

      try {
        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const userData = userDoc.data();
          if (userData.resumeURL) {
            setIsUploaded(true);
            setResumeURL(userData.resumeURL);
          }
        }
      } catch (error) {
        console.error("Error fetching resume status:", error);
      }
    };

    fetchResumeStatus();
  }, []);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setUploadStatus("Uploading...");
    const user = auth.currentUser;
    if (!user) {
      setUploadStatus("User not authenticated");
      return;
    }

    try {
      const storageRef = ref(storage, `resumes/${user.uid}/${file.name}`);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);

      const userDocRef = doc(db, "users", user.uid);
      await updateDoc(userDocRef, { resumeURL: downloadURL });

      setUploadStatus("Resume uploaded successfully");
      setIsUploaded(true);
      setResumeURL(downloadURL);
    } catch (error) {
      console.error("Error uploading resume:", error);
      setUploadStatus("Error uploading resume");
      setIsUploaded(false);
    }
  };

  return (
    <div className="bg-slate-100 border-2 border-blue-400 h-1/3 w-full p-4 rounded-3xl">
      <h2 className="font-semibold text-lg pb-1">Resume</h2>
      <div className="rounded-lg flex flex-col items-center gap-4 p-4">
        <input
          type="file"
          id="user_resume"
          className="hidden"
          ref={fileInputRef}
          accept=".doc,.docx,.rtf,.pdf"
          onChange={handleFileUpload}
        />
        <label
          htmlFor="user_resume"
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-2 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          {isUploaded ? (
            <span className="flex">
              Uploaded
              <FaCheckCircle className="ml-1 mt-[1px] text-base text-green-500" />
            </span>
          ) : (
            <span className="flex">
              Upload resume
              <FaCloudUploadAlt className="ml-1 mt-[1px] text-base" />
            </span>
          )}
        </label>
        {isUploaded && (
          <a
            href={resumeURL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline text-base"
          >
            View Uploaded Resume
          </a>
        )}
        <div className="help-text title-14-medium text-sm text-gray-500">
          {isUploaded
            ? "You can upload a new resume to replace the current one by click on uploaded button"
            : "Supported formats: doc, docx, rtf, pdf, up to 2MB"}
        </div>
        {uploadStatus && (
          <div className="text-sm text-blue-600">{uploadStatus}</div>
        )}
      </div>
    </div>
  );
};

export default UserResume;
