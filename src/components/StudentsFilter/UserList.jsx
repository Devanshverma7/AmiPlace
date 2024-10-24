import React, { useState, useEffect, useRef } from "react";
import { ChevronDown, UserCheck, UserX, Shield, ShieldOff } from "lucide-react";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  deleteField,
} from "firebase/firestore";
import { db } from "../../firebase.config";
import * as XLSX from "xlsx";
import Header from "../xyzComponents/Header";

const UserList = () => {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [showBranchFilter, setShowBranchFilter] = useState(false);
  const [queryResults, setQueryResults] = useState([""]);
  const [debarEnrollment, setDebarEnrollment] = useState("");
  const [placedEnrollment, setPlacedEnrollment] = useState("");
  const [userFriendlyQuery, setUserFriendlyQuery] = useState([]);
  const [loading, setLoading] = useState(false);
  const [companyName, setCompanyName] = useState("");
  const [statusMessage, setStatusMessage] = useState({
    text: "",
    isError: false,
  });
  const [currentQuery, setCurrentQuery] = useState({});

  const dropdownRefs = useRef({});

  useEffect(() => {
    const handleClickOutside = (event) => {
      Object.entries(dropdownRefs.current).forEach(([title, ref]) => {
        if (ref && !ref.contains(event.target)) {
          setActiveDropdown((prev) => (prev === title ? null : prev));
        }
      });
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    updateQuery();
  }, [selectedOptions]);

  useEffect(() => {
    const selectedCourses = selectedOptions["Course"] || {};
    const shouldShowBranchFilter =
      selectedCourses["B.Tech"] || selectedCourses["M.Tech"];
    setShowBranchFilter(shouldShowBranchFilter);
  }, [selectedOptions]);

  const toggleDropdown = (dropdown) => {
    setActiveDropdown(activeDropdown === dropdown ? null : dropdown);
  };

  const handleEnrollmentChange = (setter) => (e) => {
    setter(e.target.value);
  };

  const updateStudentStatus = async (
    field,
    value,
    enrollmentNumber,
    company = null
  ) => {
    if (!enrollmentNumber) {
      setStatusMessage({
        text: "Please enter an enrollment number.",
        isError: true,
      });
      return;
    }

    if (field === "isPlaced" && value && !company) {
      setStatusMessage({
        text: "Please enter a company name.",
        isError: true,
      });
      return;
    }

    try {
      const querySnapshot = await getDocs(collection(db, "users"));
      let userDoc = null;
      querySnapshot.forEach((doc) => {
        if (doc.data().EnrollmentNumber === enrollmentNumber) {
          userDoc = doc;
        }
      });

      if (userDoc) {
        if (field === "isPlaced") {
          if (value) {
            // Mark as placed with company
            await updateDoc(doc(db, "users", userDoc.id), {
              isPlaced: true,
              PlacedIn: company,
            });
          } else {
            // Mark as unplaced and remove company
            await updateDoc(doc(db, "users", userDoc.id), {
              isPlaced: false,
              PlacedIn: deleteField(),
            });
          }
        } else {
          // Handle debar status
          await updateDoc(doc(db, "users", userDoc.id), {
            [field]: value,
          });
        }

        setStatusMessage({
          text: `Student ${
            field === "isDebard"
              ? value
                ? "debared"
                : "undebared"
              : value
              ? `marked as placed at ${company}`
              : "marked as unplaced"
          } successfully.`,
          isError: false,
        });

        if (field === "isDebard") {
          setDebarEnrollment("");
        } else {
          setPlacedEnrollment("");
          setCompanyName("");
        }
      } else {
        setStatusMessage({
          text: "Student not found. Please check the enrollment number.",
          isError: true,
        });
      }
    } catch (error) {
      console.error("Error updating student status:", error);
      setStatusMessage({
        text: "An error occurred. Please try again.",
        isError: true,
      });
    }
  };
  const downloadExcel = () => {
    if (queryResults.length === 0) {
      setStatusMessage({
        text: "No data to export. Please apply filters and get students first.",
        isError: true,
      });
      return;
    }

    const worksheet = XLSX.utils.json_to_sheet(
      queryResults.map(getSpecificFields)
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Students");

    const fileName = `filtered_students.xlsx`;

    XLSX.writeFile(workbook, fileName);

    setStatusMessage({
      text: `Excel file "${fileName}" has been downloaded.`,
      isError: false,
    });
  };
  useEffect(() => {
    updateQuery();
  }, [selectedOptions]);

  const updateQuery = () => {
    const query = {};
    const newUserFriendlyQuery = [];

    const addToQuery = (
      queryKey,
      dropdownTitle,
      transform = (x) => x,
      multiSelect = true,
      formatDisplay = (x) => x
    ) => {
      const selected = Object.entries(selectedOptions[dropdownTitle] || {})
        .filter(([_, isSelected]) => isSelected)
        .map(([option]) => transform(option));

      if (selected.length > 0) {
        if (selected.includes("All")) {
          newUserFriendlyQuery.push({
            label: dropdownTitle,
            value: "All",
          });
        } else {
          query[queryKey] = multiSelect ? selected : selected[0];
          newUserFriendlyQuery.push({
            label: dropdownTitle,
            value: formatDisplay(multiSelect ? selected : selected[0]),
          });
        }
      }
    };

    addToQuery("Course", "Course", undefined, true, (courses) =>
      courses.join(", ")
    );
    addToQuery("Branch", "Branch", undefined, true, (branches) =>
      branches.join(", ")
    );
    addToQuery("passingOutYear", "Passout Batch", undefined, true, (years) =>
      years.join(", ")
    );
    addToQuery(
      "Gender",
      "Gender Criteria",
      (gender) => gender,
      false,
      (gender) => gender,
      true // Include "All" in the query display
    );
    addToQuery(
      "CurrentCGPA",
      "Min CGPA",
      parseFloat,
      false,
      (cgpa) => `${cgpa} or higher`
    );
    addToQuery(
      "TwelfthPercentage",
      "12th",
      parseInt,
      false,
      (percentage) => `${percentage}% or higher`
    );
    addToQuery(
      "TenthPercentage",
      "10th",
      parseInt,
      false,
      (percentage) => `${percentage}% or higher`
    );
    addToQuery(
      "isDebard",
      "Debar Criteria",
      (option) => {
        if (option === "Undebar only") return false;
        if (option === "Debard only") return true;
        return undefined;
      },
      false,
      (value) => {
        if (value === true) return "Debared students only";
        if (value === false) return "Undebared students only";
        return "All students";
      }
    );
    addToQuery(
      "CurrentBacklogs",
      "Min Backlogs",
      parseInt,
      false,
      (backlogs) => `${backlogs} or fewer`
    );
    addToQuery(
      "isPlaced",
      "Placed Criteria",
      (option) => {
        if (option === "Unplaced Only") return false;
        if (option === "Placed Only") return true;
        return undefined;
      },
      false,
      (value) => {
        if (value === true) return "Placed students only";
        if (value === false) return "Unplaced students only";
        return "All students";
      }
    );

    Object.keys(query).forEach(
      (key) => query[key] === undefined && delete query[key]
    );
    setCurrentQuery(query);
    setUserFriendlyQuery(newUserFriendlyQuery);
  };
  const handleOptionChange = (dropdown, option, isChecked) => {
    setSelectedOptions((prev) => {
      if (isChecked) {
        // If it's a single-select dropdown, clear other selections
        if (!multiSelectDropdowns.includes(dropdown)) {
          return {
            ...prev,
            [dropdown]: { [option]: true },
          };
        }
        // For multi-select, add the new selection
        return {
          ...prev,
          [dropdown]: {
            ...(prev[dropdown] || {}),
            [option]: true,
          },
        };
      } else {
        // If unchecking, remove the selection
        const newDropdownState = { ...(prev[dropdown] || {}) };
        delete newDropdownState[option];
        return {
          ...prev,
          [dropdown]: newDropdownState,
        };
      }
    });
  };

  const resetFilters = () => {
    setSelectedOptions({});
    setShowBranchFilter(false);
    setQueryResults([]);
    setStatusMessage({ text: "", isError: false });
    setCurrentQuery({});
  };

  const multiSelectDropdowns = ["Course", "Branch", "Passout Batch"];

  const Dropdown = ({ title, options }) => {
    const isMultiSelect = multiSelectDropdowns.includes(title);

    return (
      <div
        className="relative"
        ref={(el) => (dropdownRefs.current[title] = el)}
      >
        <button
          className="px-[10px] my-2 py-[5px] bg-gray-100 rounded-md flex items-center"
          onClick={(e) => {
            e.stopPropagation();
            toggleDropdown(title);
          }}
        >
          {title} <ChevronDown size={16} className="ml-1" />
        </button>
        {activeDropdown === title && (
          <div className="absolute mt-1 w-48 bg-white shadow-lg rounded-md z-10">
            <div className="py-1">
              {options.map((option, index) => (
                <div
                  key={index}
                  className="flex items-center px-4 py-2 hover:bg-gray-100"
                  onClick={(e) => {
                    e.stopPropagation();
                    const currentState =
                      selectedOptions[title]?.[option] || false;
                    handleOptionChange(title, option, !currentState);
                    if (!isMultiSelect) {
                      setActiveDropdown(null);
                    }
                  }}
                >
                  <input
                    type={isMultiSelect ? "checkbox" : "radio"}
                    id={`${title}-${option}`}
                    name={title}
                    checked={selectedOptions[title]?.[option] || false}
                    onChange={() => {}} // Handle changes in the onClick of the parent div
                    className="mr-2"
                  />
                  <label
                    htmlFor={`${title}-${option}`}
                    className="text-sm text-gray-700 w-full cursor-pointer"
                  >
                    {option}
                  </label>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const executeQuery = async (query) => {
    setLoading(true);
    try {
      const users = await fetchUsers();
      let result = users.filter((s) => {
        for (let key in query) {
          if (Array.isArray(query[key])) {
            if (!query[key].includes(s[key])) return false;
          } else if (
            ["CurrentCGPA", "TenthPercentage", "TwelfthPercentage"].includes(
              key
            )
          ) {
            if (s[key] < query[key]) return false;
          } else if (key === "CurrentBacklogs") {
            if (s[key] > query[key]) return false;
          } else if (s[key] !== query[key]) {
            return false;
          }
        }
        return true;
      });
      setQueryResults(result);
    } catch (error) {
      console.error("Error executing query:", error);
      setStatusMessage({
        text: "An error occurred while fetching results. Please try again.",
        isError: true,
      });
    }
    setLoading(false);
  };

  const fetchUsers = async () => {
    const querySnapshot = await getDocs(collection(db, "users"));
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  };

  const formatValue = (value) => {
    if (typeof value === "object" && value !== null) {
      if (value.seconds && value.nanoseconds) {
        return new Date(value.seconds * 1000).toLocaleString();
      } else if (value.name) {
        return value.name;
      } else {
        return JSON.stringify(value);
      }
    }
    return value;
  };

  const getSpecificFields = (student) => {
    const fields = [
      "FullName",
      "Course",
      "Branch",
      "Semester",
      "Specialization",
      "PlacedIn",
      "passingOutYear",
      "EnrollmentNumber",
      "CurrentCGPA",
      "TwelfthPercentage",
      "TenthPercentage",
      "CurrentBacklogs",
      "Gender",
      "PhoneNumber",
      "DOB",
      "email",
      "PersonalEmail",
    ];

    return fields.reduce((acc, field) => {
      acc[field] = student[field];
      return acc;
    }, {});
  };
  return (
    <div className="w-full">
      <Header />
      <div className="container mx-auto p-4 font-sans">
        {/* Mark Students Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800 border-b pb-3">
            Student Status Management
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Placement Management Card */}
            <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
              <div className="flex items-center gap-2 mb-4 text-gray-700">
                <UserCheck size={24} />
                <h3 className="text-lg font-medium">Placement Status</h3>
              </div>

              <div className="space-y-4">
                <div className="flex flex-col space-y-2">
                  <label
                    htmlFor="placed"
                    className="text-sm font-medium text-gray-600"
                  >
                    Enrollment Number
                  </label>
                  <input
                    type="text"
                    name="placed"
                    id="placed"
                    value={placedEnrollment}
                    onChange={handleEnrollmentChange(setPlacedEnrollment)}
                    placeholder="Enter enrollment number..."
                    className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="flex flex-col space-y-2">
                  <label
                    htmlFor="company"
                    className="text-sm font-medium text-gray-600"
                  >
                    Company Name
                  </label>
                  <input
                    type="text"
                    name="company"
                    id="company"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="Enter company name..."
                    className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md flex items-center justify-center gap-2 transition-colors duration-200"
                    onClick={() =>
                      updateStudentStatus(
                        "isPlaced",
                        true,
                        placedEnrollment,
                        companyName
                      )
                    }
                  >
                    <UserCheck size={18} />
                    Mark Placed
                  </button>
                  <button
                    className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-md flex items-center justify-center gap-2 transition-colors duration-200"
                    onClick={() =>
                      updateStudentStatus("isPlaced", false, placedEnrollment)
                    }
                  >
                    <UserX size={18} />
                    Mark Unplaced
                  </button>
                </div>
              </div>
            </div>

            {/* Debarment Management Card */}
            <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
              <div className="flex items-center gap-2 mb-4 text-gray-700">
                <Shield size={24} />
                <h3 className="text-lg font-medium">Debarment Status</h3>
              </div>

              <div className="space-y-4">
                <div className="flex flex-col space-y-2">
                  <label
                    htmlFor="debar"
                    className="text-sm font-medium text-gray-600"
                  >
                    Enrollment Number
                  </label>
                  <input
                    type="text"
                    name="debar"
                    id="debar"
                    value={debarEnrollment}
                    onChange={handleEnrollmentChange(setDebarEnrollment)}
                    placeholder="Enter enrollment number..."
                    className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="flex gap-3 pt-2 mt-[4.2rem]">
                  <button
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md flex items-center justify-center gap-2 transition-colors duration-200"
                    onClick={() =>
                      updateStudentStatus("isDebard", true, debarEnrollment)
                    }
                  >
                    <Shield size={18} />
                    Debar
                  </button>
                  <button
                    className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-md flex items-center justify-center gap-2 transition-colors duration-200"
                    onClick={() =>
                      updateStudentStatus("isDebard", false, debarEnrollment)
                    }
                  >
                    <ShieldOff size={18} />
                    Undebar
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Status Message */}
          {statusMessage.text && (
            <div
              className={`mt-6 p-4 rounded-md ${
                statusMessage.isError
                  ? "bg-red-50 text-red-800 border border-red-200"
                  : "bg-green-50 text-green-800 border border-green-200"
              }`}
            >
              {statusMessage.text}
            </div>
          )}
        </div>
        {/* Filter Students */}
        <div className="shadow-md p-5 rounded-lg">
          <h2 className={`text-2xl font-semibold my-3`}>Filter Students</h2>
          <hr className="mb-4" />
          <div className="flex gap-x-2 flex-wrap mb-4">
            <Dropdown
              title="Course"
              options={["B.Tech", "M.Tech", "MCA", "BCA"]}
            />
            {showBranchFilter && (
              <Dropdown
                title="Branch"
                options={[
                  "All",
                  "CSE",
                  "ECE",
                  "ME",
                  "Civil Er.",
                  "EE",
                  "Chemical Er.",
                  "Other",
                ]}
              />
            )}
            <Dropdown
              title="Passout Batch"
              options={["2025", "2026", "2027", "2028"]}
            />
            <Dropdown
              title="Gender Criteria"
              options={["All", "Male", "Female"]}
            />
            <Dropdown
              title="Min CGPA"
              options={["6", "6.5", "7", "7.5", "8", "8.5", "9", "9.5"]}
            />
            <Dropdown
              title="12th"
              options={["60", "65", "70", "75", "80", "85", "90", "95"]}
            />
            <Dropdown
              title="10th"
              options={["60", "65", "70", "75", "80", "85", "90", "95"]}
            />
            <Dropdown
              title="Debar Criteria"
              options={["All", "Undebar only", "Debard only"]}
            />
            <Dropdown
              title="Min Backlogs"
              options={["0", "1", "2", "3", "4"]}
            />
            <Dropdown
              title="Placed Criteria"
              options={["All", "Unplaced Only", "Placed Only"]}
            />
          </div>
          <div className="my-4 p-4 bg-gray-100 rounded-md">
            <h3 className="text-lg font-semibold mb-2">
              Current Filter Criteria:
            </h3>
            {userFriendlyQuery.length > 0 ? (
              <ul className="list-disc pl-5">
                {userFriendlyQuery.map((item, index) => (
                  <li key={index} className="mb-2">
                    <span className="font-medium">{item.label}:</span>{" "}
                    {item.value}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No filters applied. All students will be shown.</p>
            )}
          </div>
          {/* Buttons div */}
          <div className="flex justify-end gap-2 my-1 px-1">
            {" "}
            <button
              className="px-2 py-1 bg-green-600 hover:bg-green-700 text-white rounded-md flex items-center"
              onClick={() => executeQuery(currentQuery)}
            >
              Get Students
            </button>
            <button
              className="px-2 py-1 bg-gray-500 hover:bg-gray-600 text-white rounded-md flex items-center"
              onClick={resetFilters}
            >
              Reset Filters
            </button>
            <button
              className="px-2 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded-md flex items-center"
              onClick={downloadExcel}
            >
              Get Excel File
            </button>
          </div>
          {queryResults.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full table-auto">
                <thead>
                  <tr className="bg-gray-200">
                    {Object.keys(getSpecificFields(queryResults[0])).map(
                      (key) => (
                        <th
                          key={key}
                          className="px-4 py-2 text-left whitespace-nowrap"
                        >
                          {key}
                        </th>
                      )
                    )}
                  </tr>
                </thead>
                <tbody>
                  {queryResults.map((student, index) => (
                    <tr
                      key={index}
                      className={index % 2 === 0 ? "bg-gray-100" : "bg-white"}
                    >
                      {Object.entries(getSpecificFields(student)).map(
                        ([key, value]) => (
                          <td
                            key={`${index}-${key}`}
                            className="border px-4 py-2 whitespace-nowrap"
                          >
                            {formatValue(value)}
                          </td>
                        )
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="flex justify-center mt-5 text-xl font-semibold">
              {loading
                ? "Loading . . ."
                : "No students exists with these criterias"}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserList;
