import React from "react";
import "remixicon/fonts/remixicon.css";
import KeySkills from "./KeySkills";
import LinkedIn from "./LinkedIn";
import GitHub from "./GitHub";
import UserResume from "./UserResume";
import ProjectsSection from "./ProjectsSection";
import CertificationSection from "./CertificationSection";

const Info_fill = () => {
  return (
    <div className="flex flex-col bg-slate-50 rounded-xl justify-start items-center h-full w-full border-solid gap-4 p-4 shadow-xl ">
      <KeySkills />
      <ProjectsSection />
      {/* <CertificationSection /> */}
      <div className="md:flex w-full md:space-x-6">
        <LinkedIn />
        <GitHub />
      </div>

      <UserResume />
    </div>
  );
};

export default Info_fill;
