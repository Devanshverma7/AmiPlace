import { useState } from "react";
import CompanyDetails from "./CompanyDetails";
import { FaRegBuilding } from "react-icons/fa";

const CompanyCard = ({
  companyName,
  CTC,
  Location,
  ForBatch,
  ProfileOffered,
  FunctinalArea,
  Round1,
  Round2,
  Round3,
  Round4,
  Website,
  logo,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <div
        className="company_card border-[1px] border-gray-300 px-5 pb-4 my-5 hover:shadow-xl hover:bg-gray-100 hover:cursor-pointer transition-shadow rounded-md"
        onClick={() => setIsOpen(true)}
      >
        <div className="logo_name flex justify-start mb-3 items-center">
          <div className="logo_name flex space-x-2">
            <FaRegBuilding className="text-2xl font-bold mt-5" />
            <span className="c-name font-bold mt-4 text-xl">{companyName}</span>
          </div>
        </div>

        <div className="hidden location-size-industry sm:flex justify-between my-3">
          <div className="location">
            <p className="font-semibold">Location</p>
            <span className="text-gray-600">{Location}</span>
          </div>
          <div className="employee_size">
            <p className="font-semibold">For Batch</p>
            <span className="text-gray-600">{ForBatch}</span>
          </div>
          <div className="CTC">
            <p className="font-bold">Package </p>
            <span className="font-semibold text-green-700">{CTC}</span>
          </div>
        </div>

        <div className="hidden sm:block role mt-3">
          <span className="font-semibold">Profile Offered: </span>
          <span className="text-blue-700 font-semibold">{ProfileOffered}</span>
        </div>
      </div>
      <CompanyDetails
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        companyName={companyName}
        CTC={CTC}
        Location={Location}
        ForBatch={ForBatch}
        ProfileOffered={ProfileOffered}
        FunctinalArea={FunctinalArea}
        Round1={Round1}
        Round2={Round2}
        Round3={Round3}
        Round4={Round4}
        Website={Website}
      />
    </>
  );
};
export default CompanyCard;
