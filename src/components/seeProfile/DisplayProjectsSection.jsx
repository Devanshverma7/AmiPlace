import React, { useEffect, useState } from "react";
import { Github } from "lucide-react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase.config";

const DisplayProjectsSection = ({ userUID }) => {
  const [projectsInput, setProjectsInput] = useState("");

  useEffect(() => {
    const fetchLinkedInProfile = async () => {
      const userDocRef = doc(db, "users", userUID);
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        setProjectsInput(userDoc.data().projects || []);
      }
    };

    fetchLinkedInProfile();
  }, []);

  if (!projectsInput || projectsInput.length === 0) {
    return (
      <div className="w-full p-6 bg-gray-100 rounded-3xl shadow border-2 border-blue-400">
        <h2 className="text-xl font-semibold mb-4">Projects</h2>
        <p className="text-gray-500 text-center py-4">No projects to display</p>
      </div>
    );
  }

  return (
    <div className="w-full p-6 bg-gray-100 rounded-3xl shadow border-2 border-blue-400">
      <h2 className="text-xl font-semibold mb-4">Projects</h2>

      <div className="space-y-6">
        {projectsInput.map((project, index) => (
          <div key={index} className="p-4 bg-white rounded-md border shadow-sm">
            <div className="flex justify-between items-start">
              <div className="flex-grow">
                <div className="flex justify-between items-start">
                  <h3 className="font-medium">{project.name}</h3>
                  {project.githubLink && (
                    <a
                      href={project.githubLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-500 hover:text-gray-700 ml-2"
                    >
                      <Github className="w-5 h-5" />
                    </a>
                  )}
                </div>
                {project.description && (
                  <p className="text-sm text-gray-600 mt-1">
                    {project.description}
                  </p>
                )}
                {project.tags && project.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {project.tags.map((tag, tagIndex) => (
                      <span
                        key={tagIndex}
                        className="bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DisplayProjectsSection;
