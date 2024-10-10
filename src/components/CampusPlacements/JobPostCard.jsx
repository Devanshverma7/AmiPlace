import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { useState, useRef, useEffect } from "react";
import { BsThreeDots } from "react-icons/bs";
import { useSelector } from "react-redux";
import { auth, db } from "../../firebase.config";
import CreateJobPost from "./CreateJobPost";
import JobDataIssueForm from "./JobDataIssue";
import * as XLSX from "xlsx";

const JobPostCard = ({ job }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const userData = useSelector((store) => store.userDetails.userData);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [jobStatus, setJobStatus] = useState("");
  const [applyStatus, setApplyStatus] = useState("Apply");
  const menuRef = useRef(null);
  const data = job.applicants;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  useEffect(() => {
    const checkJobStatus = () => {
      const now = new Date();
      const closingDate = new Date(job.openedTill);
      const openingDate = new Date(job.jobOpeningDate);
      if (now >= closingDate) {
        setJobStatus("closed");
      } else if (now >= openingDate && now < closingDate) {
        setJobStatus("open");
      } else if (now < openingDate) {
        setJobStatus("yetToOpen");
      }
    };

    checkJobStatus();
  }, []);

  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  const downloadJobDescription = () => {
    if (job.jobDescriptionFileUrl) {
      const link = document.createElement("a");
      link.href = job.jobDescriptionFileUrl;
      link.target = "_blank";
      link.download = `${job.companyName}-${job.jobRole}-Description.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };
  const handleDeleteJob = async () => {
    if (userData.userType == "Admin") {
      try {
        await deleteDoc(doc(db, "Jobs", job.id));
      } catch (error) {
        console.error("Error removing document: ", error);
      }
    }
  };

  const DeleteConfirmationDialog = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md mx-4">
        <h3 className="text-lg font-medium mb-2">Are you sure?</h3>
        <p className="text-gray-500 mb-4">
          This action cannot be undone. This will permanently delete the job
          posting.
        </p>
        <div className="flex justify-end gap-2">
          <button
            onClick={() => setShowDeleteDialog(false)}
            className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              handleDeleteJob();
              setShowDeleteDialog(false);
            }}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
  const applyBtnLogic = () => {
    const EC = job.EligibilityCriteria;
    if (userData.isDebard) {
      return [false, 0];
    }
    if (EC.placedCriteria && userData.isPlaced) {
      return [false, 1];
    }
    if (
      userData.TenthPercentage >= EC.min10thPercentage &&
      userData.TwelfthPercentage >= EC.min12thPercentage &&
      userData.CurrentCGPA >= EC.minCGPA &&
      userData.CurrentBacklogs <= EC.maxBacklogs &&
      userData.Age <= EC.maxAge
    ) {
      if (
        (userData.Gender == "Male" && EC.genderCriteria == "Male") ||
        (userData.Gender == "Female" && EC.genderCriteria == "Female") ||
        EC.genderCriteria == "ForAll"
      ) {
        return [true, 2];
      } else {
        return [false, 3];
      }
    } else {
      return [false, 3];
    }
  };
  function Component() {
    const applyBtnLogicResult = applyBtnLogic()[1];
    let message;

    switch (applyBtnLogicResult) {
      case 0:
        message = "you are debarded!";
        break;
      case 1:
        message = "you are placed!";
        break;
      case 3:
        message = "Not Eligible!";
        break;
      default:
        message = "";
    }

    return <span className="text-red-600 font-medium pt-5">{message}</span>;
  }
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (userData && job.applicants) {
      const hasApplied = job.applicants.some(
        (applicant) => applicant.uid === userData.uid
      );
      setApplyStatus(hasApplied ? "Applied!" : "Apply");
    }
  }, [job.applicants, userData]);

  const handleApplyBtn = async () => {
    if (!userData) return;

    setIsProcessing(true);
    try {
      let updatedApplicants;

      if (applyStatus === "Applied!") {
        // Remove the user's data from applicants
        updatedApplicants = job.applicants.filter(
          (applicant) => applicant.uid !== userData.uid
        );
        setApplyStatus("Apply");
      } else {
        // Add the complete userData object along with application timestamp
        const applicantData = {
          ...userData,
          appliedAt: new Date().toISOString(),
        };
        updatedApplicants = [...(job.applicants || []), applicantData];
        setApplyStatus("Applied!");
      }

      await updateDoc(doc(db, "Jobs", job.id), {
        applicants: updatedApplicants,
      });
    } catch (err) {
      console.error("Error updating application: ", err);
      setApplyStatus(applyStatus === "Applied!" ? "Applied!" : "Apply");
    } finally {
      setIsProcessing(false);
    }
  };

  // Function to export array of objects to .xlsx file
  const exportToExcel = () => {
    // Step 1: Create a new workbook
    const wb = XLSX.utils.book_new();

    // Step 2: Convert array of objects to a worksheet
    const ws = XLSX.utils.json_to_sheet(data);

    // Step 3: Append the worksheet to the workbook
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

    // Step 4: Write the workbook to binary string
    const wbout = XLSX.write(wb, { bookType: "xlsx", type: "binary" });

    // Step 5: Create a blob for the binary string
    const s2ab = (s) => {
      const buf = new ArrayBuffer(s.length);
      const view = new Uint8Array(buf);
      for (let i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xff;
      return buf;
    };

    // Step 6: Create a blob and trigger the download
    const blob = new Blob([s2ab(wbout)], { type: "application/octet-stream" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "JobData.xlsx";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div
      className={`w-full max-w-2xl border-2 rounded-lg p-6 mx-auto my-2 ${
        jobStatus == "closed"
          ? "border-red-400 bg-red-50"
          : jobStatus == "open"
          ? "border-green-400 bg-green-50"
          : "border-blue-400 bg-blue-50"
      }`}
    >
      <div className="flex justify-between items-start">
        <span className="text-xl font-semibold">{job.companyName}</span>
        <div className="flex items-center gap-4">
          <div className="flex text-sm">
            <span className="font-medium">
              {jobStatus == "closed"
                ? "Closed on:"
                : jobStatus == "open"
                ? "Open Till:"
                : "Opening on:"}
            </span>
            <span
              className={`ml-1 ${
                jobStatus == "closed"
                  ? "text-red-600"
                  : jobStatus == "open"
                  ? "text-green-600"
                  : "text-blue-600"
              }`}
            >
              {jobStatus == "open"
                ? formatDate(job.openedTill)
                : jobStatus == "closed"
                ? formatDate(job.openedTill)
                : formatDate(job.jobOpeningDate)}
            </span>
          </div>
          <div className="relative" ref={menuRef}>
            {jobStatus !== "closed" && (
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="p-1 hover:bg-gray-100 rounded-full"
              >
                <BsThreeDots className="w-5 h-5" />
              </button>
            )}
            {showMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-10">
                {userData.userType == "Admin" && (
                  <>
                    <button
                      className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                      onClick={() => {
                        setIsFormVisible(true);
                        setShowMenu(false);
                      }}
                    >
                      Update Job Data
                    </button>
                    <button
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                      onClick={() => {
                        setShowDeleteDialog(true);
                        setShowMenu(false);
                      }}
                    >
                      Permanent Delete
                    </button>
                  </>
                )}
                <button className="text-left px-2 py-1 text-sm hover:bg-gray-100">
                  <JobDataIssueForm />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      {isFormVisible && (
        <CreateJobPost onClose={() => setIsFormVisible()} jobId={job.id} />
      )}
      <div className="flex flex-wrap justify-between my-4 ">
        <div className="font-medium mb-2 w-full sm:w-auto">
          <span className="">Job Role: </span>
          <span className="text-blue-600">{job.jobRole}</span>
        </div>
        <div className="mb-2 w-full sm:w-auto font-medium">
          <span className="font-medium">CTC: </span>
          <span className="text-blue-600">INR. {job.ctc} LPA</span>
        </div>
        <div className="mb-2 w-full sm:w-auto">
          <span className="font-medium">Location: </span>
          <span>{job.location}</span>
        </div>
      </div>

      <div className="mb-4">
        <span className="font-medium text-base">Requirements: </span>
        <p className="whitespace-pre-line">{job.requirements}</p>
      </div>

      <div
        className={`text-sm flex flex-wrap w-full mt-4 ${
          userData.userType == "Student" ? "justify-end" : "justify-between"
        }`}
      >
        {userData.userType == "Admin" && jobStatus == "closed" && (
          <button
            className="border text-white border-gray-300 bg-blue-600 px-4 py-2 rounded hover:bg-blue-700 transition-colors duration-200"
            onClick={exportToExcel}
          >
            Fetch Applicants
          </button>
        )}
        <div className="flex space-x-2 mt-2 sm:mt-0">
          <button
            onClick={downloadJobDescription}
            className="border border-gray-300 px-4 py-2 rounded hover:bg-gray-100 transition-colors duration-200"
          >
            View Details
          </button>
          {userData.userType == "Student" && (
            <div className="">
              {jobStatus == "closed" ? (
                <span className="text-red-600 font-medium mt-2">Closed !</span>
              ) : jobStatus == "open" ? (
                applyBtnLogic()[0] ? (
                  <button
                    className={`px-4 py-2 rounded transition-colors duration-200 ${
                      applyStatus === "Applied!"
                        ? "bg-green-600 hover:bg-green-700"
                        : "bg-blue-600 hover:bg-blue-700"
                    } text-white`}
                    onClick={handleApplyBtn}
                    disabled={isProcessing}
                  >
                    {isProcessing ? "Processing..." : applyStatus}
                  </button>
                ) : (
                  Component()
                )
              ) : (
                <span className="text-blue-600 font-medium">Not opened!</span>
              )}
            </div>
          )}
        </div>
      </div>
      {showDeleteDialog && <DeleteConfirmationDialog />}
    </div>
  );
};

export default JobPostCard;
