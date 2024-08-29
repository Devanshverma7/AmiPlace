import React, { useEffect, useState, useRef } from "react";
import "remixicon/fonts/remixicon.css";
import { auth, db, storage } from "../../firebase.config";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import KeySkills from "./KeySkills";
import LinkedIn from "./LinkedIn";
import GitHub from "./GitHub";
import UserResume from "./UserResume";

const Info_fill = () => {
  return (
    <div className="flex flex-col bg-slate-50 rounded-xl justify-start items-center h-full w-4/5 border-solid m-3 gap-4 p-4 shadow-xl xsm:w-4/5 sm:w-4/5 md:w-4/5 lg:w-4/5">
      <KeySkills />
      <LinkedIn />
      <GitHub />
      <UserResume />
    </div>
  );
};

export default Info_fill;
