import React, { useState, useEffect } from "react";
import KeySkillsModal from "./overlays/KeySkillsModal";
import { auth, db } from "../../firebase.config";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { IoMdClose } from "react-icons/io";

const KeySkills = () => {
  const [isOpenSkills, setIsOpenSkills] = useState(false);
  const [skills, setSkills] = useState([]);

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    const user = auth.currentUser;
    if (user) {
      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        const skillsData = userDoc.data().skills || [];
        setSkills(
          skillsData.map((skill) =>
            typeof skill === "string" ? skill : skill.text
          )
        );
      }
    }
  };

  const removeSkill = async (skillToRemove) => {
    const user = auth.currentUser;
    if (user) {
      const userDocRef = doc(db, "users", user.uid);
      const updatedSkills = skills.filter((skill) => skill !== skillToRemove);
      await updateDoc(userDocRef, { skills: updatedSkills });
      setSkills(updatedSkills);
    }
  };

  return (
    <div className="bg-slate-100 border-2 w-full border-blue-400 p-4 rounded-3xl">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-semibold text-xl">Key Skills</h2>
        <button
          onClick={() => setIsOpenSkills(true)}
          className="bg-blue-500 text-white text-sm px-3 py-1 rounded-full hover:bg-blue-600 transition-colors"
        >
          Add Skills
        </button>
      </div>
      <KeySkillsModal
        showModal={isOpenSkills}
        onClose={() => {
          setIsOpenSkills(false);
          fetchSkills();
        }}
        currentSkills={skills}
      />
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
        {skills.map((skill, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-md p-2 flex items-center justify-between"
          >
            <span className="text-sm font-medium text-gray-700 truncate">
              {skill}
            </span>
            <button
              onClick={() => removeSkill(skill)}
              className="ml-2 text-gray-400 hover:text-red-500 transition-colors"
              aria-label={`Remove ${skill}`}
            >
              <IoMdClose size={16} />
            </button>
          </div>
        ))}
      </div>
      {skills.length === 0 && (
        <p className="text-center text-gray-500 mt-4">
          No skills added yet. Click 'Add Skills' to get started!
        </p>
      )}
    </div>
  );
};

export default KeySkills;
