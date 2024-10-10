import React, { useState, useEffect } from "react";
import { X, Plus, Github } from "lucide-react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "../../firebase.config";

const ProjectsSection = () => {
  const [projects, setProjects] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newProject, setNewProject] = useState({
    name: "",
    description: "",
    githubLink: "",
    tags: [],
  });
  const [newTag, setNewTag] = useState("");

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    const user = auth.currentUser;
    if (user) {
      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists() && userDoc.data().projects) {
        setProjects(userDoc.data().projects);
      }
    }
  };

  const addProject = async () => {
    if (
      newProject.name &&
      newProject.githubLink &&
      newProject.tags.length > 0
    ) {
      const user = auth.currentUser;
      if (user) {
        const userDocRef = doc(db, "users", user.uid);
        const updatedProjects = [...projects, newProject];
        await updateDoc(userDocRef, {
          projects: updatedProjects,
        });
        setProjects(updatedProjects);
        setNewProject({ name: "", description: "", githubLink: "", tags: [] });
        setIsModalOpen(false);
      }
    }
  };

  const removeProject = async (index) => {
    const user = auth.currentUser;
    if (user) {
      const userDocRef = doc(db, "users", user.uid);
      const updatedProjects = projects.filter((_, i) => i !== index);
      await updateDoc(userDocRef, {
        projects: updatedProjects,
      });
      setProjects(updatedProjects);
    }
  };

  const addTag = () => {
    if (newTag && !newProject.tags.includes(newTag)) {
      setNewProject({ ...newProject, tags: [...newProject.tags, newTag] });
      setNewTag("");
    }
  };

  const removeTag = (tag) => {
    setNewProject({
      ...newProject,
      tags: newProject.tags.filter((t) => t !== tag),
    });
  };

  return (
    <div className="w-full p-6 bg-gray-100 rounded-3xl shadow border-2 border-blue-400">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Projects</h2>
        <button
          className="bg-blue-500 hover:bg-blue-600 text-sm text-white px-3 py-1 rounded-2xl flex items-center"
          onClick={() => setIsModalOpen(true)}
        >
          <Plus className="w-4 h-4 mr-1" />
          Add Project
        </button>
      </div>

      <div className="space-y-6">
        {projects.map((project, index) => (
          <div key={index} className="p-4 bg-white rounded-md border shadow-sm">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium">{project.name}</h3>
                <p className="text-sm text-gray-600 mt-1">
                  {project.description}
                </p>
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
              </div>
              <div className="flex space-x-2">
                <a
                  href={project.githubLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-500 hover:text-gray-700"
                >
                  <Github className="w-5 h-5" />
                </a>
                <button
                  onClick={() => removeProject(index)}
                  className="text-gray-500 hover:text-red-500"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Add New Project</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Project Name"
                  className="border p-2 rounded"
                  value={newProject.name}
                  onChange={(e) =>
                    setNewProject({ ...newProject, name: e.target.value })
                  }
                />
                <input
                  type="url"
                  placeholder="GitHub Link"
                  className="border p-2 rounded"
                  value={newProject.githubLink}
                  onChange={(e) =>
                    setNewProject({ ...newProject, githubLink: e.target.value })
                  }
                />
              </div>
              <textarea
                placeholder="Project Description"
                className="border p-2 rounded w-full"
                value={newProject.description}
                onChange={(e) =>
                  setNewProject({ ...newProject, description: e.target.value })
                }
              />
              <div className="flex space-x-2">
                <input
                  type="text"
                  placeholder="Add technology tag"
                  className="border p-2 rounded flex-grow"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && addTag()}
                />
                <button
                  onClick={addTag}
                  className="bg-gray-200 px-4 py-2 rounded"
                >
                  Add Tag
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {newProject.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded flex items-center"
                  >
                    {tag}
                    <button
                      onClick={() => removeTag(tag)}
                      className="ml-1 text-blue-800"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 border rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={addProject}
                className="px-4 py-2 bg-blue-500 text-white rounded-md"
              >
                Add Project
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectsSection;
