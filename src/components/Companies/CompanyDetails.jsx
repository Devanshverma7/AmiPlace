import { FcLink } from "react-icons/fc";

const CompanyDetails = ({
  isOpen,
  onClose,
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
}) => {
  return (
    <>
      {isOpen ? (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
          onClick={onClose}
        >
          <div
            className="relative w-full md:max-w-xl h-full md:max-h-full md:h-fit bg-white md:rounded-lg md:shadow-lg"
            onClick={(e) => e.stopPropagation()} 
          >
            <button
              className="absolute top-0 right-0 p-2 text-gray-600 hover:text-gray-800 focus:outline-none"
              onClick={onClose}
            >
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
            </button>
            <div className="p-6">
              <div className="md:grid md:grid-cols-3 md:grid-rows-4 md:gap-6">
                <div className="col-span-3 mb-6">
                  <p className="text-lg font-semibold text-gray-800">
                    NameOfCompany:
                  </p>
                  <a
                    href={`${Website}`}
                    className="font-semibold text-lg text-blue-600 flex gap-2"
                    target={"_blank"}
                  >
                    <FcLink className="mt-[5px] text-xl" />
                    {companyName}
                    <span className="text-sm text-gray-400 mt-[6px]">
                      visit
                    </span>
                  </a>
                </div>
                <div className="mb-4">
                  <p className="font-semibold text-gray-800">ProfileOffered:</p>
                  <p className="text-gray-600">{ProfileOffered}</p>
                </div>
                <div className="mb-4">
                  <p className="font-semibold text-gray-800">Location:</p>
                  <p className="text-gray-600">{Location}</p>
                </div>
                <div className="mb-4">
                  <p className="font-semibold text-gray-800">
                    FunctionalArea:
                  </p>
                  <p className="text-gray-600">{FunctinalArea}</p>
                </div>
                <div className="mb-4">
                  <p className="font-semibold text-gray-800">AnnualCTC:</p>
                  <p className="text-gray-600">{CTC}</p>
                </div>
                <div className="mb-4">
                  <p className="font-semibold text-gray-800">ForBatch:</p>
                  <p className="text-gray-600">{ForBatch}</p>
                </div>
                <div className="mb-4">
                  <p className="font-semibold text-gray-800">Round1:</p>
                  <p className="text-gray-600">{Round1}</p>
                </div>
                <div className="mb-4">
                  <p className="font-semibold text-gray-800">Round2:</p>
                  <p className="text-gray-600">{Round2}</p>
                </div>
                <div className="mb-4">
                  <p className="font-semibold text-gray-800">Round3:</p>
                  <p className="text-gray-600">{Round3}</p>
                </div>
                <div className="mb-4">
                  <p className="font-semibold text-gray-800">Round4:</p>
                  <p className="text-gray-600">{Round4}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default CompanyDetails;
