import React from "react";
import CompanyDetails from "./CompanyDetails";
import { Link } from "react-router-dom";

export default function CompanyCard(props) {
  return (
    <div className="border-[1px] border-gray-300  w-[823px] mb-5 mr-5 p-5 rounded hover:shadow-xl hover:shadow-gray-300 hover:duration-500">
      <div className="flex">
        <img
          src={props.image}
          alt=""
          className="w-12 border-[1px] border-white rounded bg-white"
        />
        <h1 className="font-black ml-3 text-xl">{props.name}</h1>
      </div>
      <div className="flex mt-2">
        <div>
          <h1 className="font-bold">Location</h1>
          <h2>{props.location}</h2>
        </div>
        <div className="ml-40">
          <h1 className="font-bold">Job Title</h1>
          <h2>{props.jTitle}</h2>
        </div>
      </div>

      <h1 className="font-bold mt-2">Description</h1>
      <h3>{props.desc}</h3>
      <button className="bg-[#285375] text-white p-1 rounded-lg ml-[670px] mt-5 px-2 hover:bg-[#80AA84] hover:text-black hover:duration-500">
        <Link to="/details">View Details</Link>
      </button>
    </div>
  );
}