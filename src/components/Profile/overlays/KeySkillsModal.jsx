import React, { useRef, useState, useCallback, useMemo } from "react";
import { updateAndStoreUserData } from "../../../utils";
import { IoMdClose } from "react-icons/io";

const KeySkillsModal = ({ showModal, onClose, currentSkills }) => {
  const [newSkills, setNewSkills] = useState([]);
  const [error, setError] = useState("");
  const skillInput = useRef();

  const handleAdd = useCallback(() => {
    const newSkill = skillInput.current.value.trim();
    if (
      newSkill &&
      !currentSkills.includes(newSkill) &&
      !newSkills.includes(newSkill)
    ) {
      setNewSkills((prevSkills) => [...prevSkills, newSkill]);
      skillInput.current.value = "";
    } else {
      setError("Skill already exists or is empty");
      setTimeout(() => setError(""), 3000);
    }
  }, [currentSkills, newSkills]);

  const handleUpdate = useCallback(() => {
    const skillsData = {
      skills: [...currentSkills, ...newSkills],
    };
    updateAndStoreUserData(skillsData);
    onClose();
  }, [currentSkills, newSkills, onClose]);

  const removeNewSkill = useCallback((skillToRemove) => {
    setNewSkills((prevSkills) =>
      prevSkills.filter((skill) => skill !== skillToRemove)
    );
  }, []);

  const AddedSkills = useMemo(
    () =>
      newSkills.map((skill) => (
        <div
          key={skill}
          className="bg-blue-100 rounded-lg p-2 flex items-center justify-between"
        >
          <span className="text-sm font-medium text-blue-700 truncate">
            {skill}
          </span>
          <button
            onClick={() => removeNewSkill(skill)}
            className="ml-2 text-blue-400 hover:text-red-500 transition-colors"
            aria-label={`Remove ${skill}`}
          >
            <IoMdClose size={16} />
          </button>
        </div>
      )),
    [newSkills, removeNewSkill]
  );

  if (!showModal) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm flex justify-center items-center">
      <div className="max-w-md w-full mx-auto bg-white p-6 rounded-lg shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">
            Add Key Skills
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <IoMdClose size={24} />
          </button>
        </div>
        <p className="text-gray-600 mb-4">
          Add new skills to appear in searches. You can remove skills from your
          profile page.
        </p>
        <div className="mb-4">
          <input
            ref={skillInput}
            type="text"
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter a new skill"
          />
          <button
            onClick={handleAdd}
            className="mt-2 bg-blue-500 text-sm text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
          >
            Add Skill
          </button>
        </div>
        {error && <p className="text-red-500 mb-2">{error}</p>}
        <div className="grid grid-cols-2 gap-2 mb-4">{AddedSkills}</div>
        <button
          onClick={handleUpdate}
          className="w-full bg-green-600 text-white text-sm px-4 py-2 rounded-md hover:bg-green-600 transition-colors"
        >
          Save New Skills
        </button>
      </div>
    </div>
  );
};

export default KeySkillsModal;
