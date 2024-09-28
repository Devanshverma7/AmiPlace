import { addDoc, collection } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import React, { useState, useEffect } from "react";
import { db, storage, auth } from "../../firebase.config";

const FeatureBugForm = () => {
  const [formData, setFormData] = useState({
    type: "feature",
    title: "",
    description: "",
    email: "",
  });
  const [screenshot, setScreenshot] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Set the email from the authenticated user
    if (auth.currentUser) {
      setFormData((prevData) => ({
        ...prevData,
        email: auth.currentUser.email,
      }));
    }
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setScreenshot(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.type === "bug" && !screenshot) {
      alert("Please upload a screenshot for bug reports");
      return;
    }
    setIsSubmitting(true);
    try {
      let screenshotURL = null;
      if (screenshot) {
        console.log("Uploading screenshot...");
        const storageRef = ref(
          storage,
          `screenshots/${Date.now()}_${screenshot.name}`
        );
        const uploadResult = await uploadBytes(storageRef, screenshot);
        console.log("Screenshot uploaded:", uploadResult);
        screenshotURL = await getDownloadURL(storageRef);
        console.log("Screenshot URL:", screenshotURL);
      }

      console.log("Submitting form data to Firestore...");
      const docRef = await addDoc(collection(db, "changesRequired"), {
        ...formData,
        screenshotURL,
        timestamp: new Date(),
      });

      console.log("Document written with ID: ", docRef.id);
      alert("Your submission has been received!");

      // Reset form
      setFormData((prevData) => ({
        type: "feature",
        title: "",
        description: "",
        email: prevData.email, // Keep the email
      }));
      setScreenshot(null);
    } catch (error) {
      console.error("Error submitting form: ", error);
      console.error("Error details:", error.message);
      if (error.code) {
        console.error("Error code:", error.code);
      }
      alert(`An error occurred: ${error.message}. Please try again.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-6">
        Feature Request / Bug Report
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            className="block text-gray-700 font-medium mb-2"
            htmlFor="type"
          >
            Type
          </label>
          <select
            id="type"
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-blue-200"
          >
            <option value="feature">Feature Request</option>
            <option value="bug">Bug Report</option>
          </select>
        </div>

        <div className="mb-4">
          <label
            className="block text-gray-700 font-medium mb-2"
            htmlFor="title"
          >
            Title
          </label>
          <input
            id="title"
            name="title"
            type="text"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter a brief title"
            className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-blue-200"
            required
          />
        </div>

        <div className="mb-4">
          <label
            className="block text-gray-700 font-medium mb-2"
            htmlFor="description"
          >
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe the feature or bug in detail"
            className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-blue-200"
            rows="5"
            required
          ></textarea>
        </div>

        <div className="mb-4">
          <label
            className="text-gray-700 font-medium mb-2 flex"
            htmlFor="screenshot"
          >
            Screenshot{" "}
            {formData.type === "bug" ? (
              <p className="text-red-400 ml-1">&#91;required for bug reports&#93;</p>
            ) : (
              "(optional)"
            )}
          </label>
          <input
            id="screenshot"
            name="screenshot"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-blue-200"
            required={formData.type === "bug"}
          />
        </div>

        <div className="mb-6">
          <label
            className="block text-gray-700 font-medium mb-2"
            htmlFor="email"
          >
            Your Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            className="w-full px-4 py-2 border rounded-lg bg-gray-100"
            readOnly
          />
        </div>

        <div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors disabled:bg-blue-300"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default FeatureBugForm;
