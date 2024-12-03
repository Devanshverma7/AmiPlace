import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import CreateJobPost from "./CreateJobPost";
import JobsList from "./JobsList";
import SearchJobPost from "./SearchJobPost";
import Header from "../xyzComponents/Header";
import { Plus, ChevronDown } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const TypewriterText = ({
  texts,
  typingSpeed = 50,
  deletingSpeed = 50,
  pauseDuration = 1000,
}) => {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [currentText, setCurrentText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let timer;

    if (isDeleting) {
      if (currentText === "") {
        setIsDeleting(false);
        setCurrentTextIndex((prevIndex) => (prevIndex + 1) % texts.length);
        timer = setTimeout(() => {}, pauseDuration);
      } else {
        timer = setTimeout(() => {
          setCurrentText((prevText) => prevText.slice(0, -1));
        }, deletingSpeed);
      }
    } else {
      if (currentText === texts[currentTextIndex]) {
        timer = setTimeout(() => {
          setIsDeleting(true);
        }, pauseDuration);
      } else {
        timer = setTimeout(() => {
          setCurrentText((prevText) =>
            texts[currentTextIndex].slice(0, prevText.length + 1)
          );
        }, typingSpeed);
      }
    }

    return () => clearTimeout(timer);
  }, [
    currentText,
    currentTextIndex,
    isDeleting,
    texts,
    typingSpeed,
    deletingSpeed,
    pauseDuration,
  ]);

  return (
    <div className="relative min-h-[1.5em]">
      <span className="text-3xl font-semibold">
        {currentText}
        <span className="animate-pulse">|</span>
      </span>
    </div>
  );
};

const CampusPlacements = () => {
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [filter, setFilter] = useState("Currently Opened");
  const { userType } = useSelector((store) => store.userDetails.userData);

  const typingTexts = [
    "Career Opportunities",
    "Campus Placements",
    "Job Listings",
    "Recruitment Drive",
  ];

  const filterOptions = ["All", "Currently Opened", "Upcoming", "Closed"];

  return (
    <div className="w-full min-h-screen bg-cover bg-center bg-no-repeat relative"
    
    >

      {/* Overlay to improve readability */}
      <div className="absolute inset-0 bg-white/80"
      style={{
        backgroundImage: `url("https://firebasestorage.googleapis.com/v0/b/amiplace-3c576.appspot.com/o/amitybg%2Fbig-tech-bg.webp?alt=media&token=d28d9ac5-d513-4a3c-bc92-09a6aa708893")`,
        backgroundAttachment: "fixed",
      }}
      ></div>
      <Header />

      <div className="container mx-auto px-4 -mt-8 relative z-10">
        <Card className="">
          <CardContent
            className="p-4 sm:p-6"
            style={{
              backgroundImage: `url("https://firebasestorage.googleapis.com/v0/b/amiplace-3c576.appspot.com/o/amitybg%2Fbig-tech-bg.webp?alt=media&token=d28d9ac5-d513-4a3c-bc92-09a6aa708893")`,
              backgroundAttachment: "fixed",
            }}
          >

            <div className="container mx-auto px-4 py-10">
              <div className="text-center text-gray-700 space-y-4">
                <TypewriterText texts={typingTexts} />
              </div>
            </div>
            <div className="mb-8">
              <SearchJobPost />
            </div>

            {/* Responsive Filters and Actions */}
            <div className="flex sm:flex-row sm:items-center justify-between gap-4 mb-8">
              {/* Mobile dropdown for filters */}
              <div></div>
              <div className="sm:hidden w-full">
                <DropdownMenu>
                  <DropdownMenuTrigger className="w-full inline-flex items-center justify-between px-4 py-2 bg-gray-100 rounded-full text-gray-700">
                    <span>{filter}</span>
                    <ChevronDown className="w-4 h-4 ml-2" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-full">
                    {filterOptions.map((option) => (
                      <DropdownMenuItem
                        key={option}
                        onClick={() => setFilter(option)}
                        className={
                          filter === option ? "bg-[#4269F2] text-white" : ""
                        }
                      >
                        {option}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Desktop filter buttons */}
              <div className="hidden sm:flex gap-2 flex-wrap ml-[14%]">
                {filterOptions.map((option) => (
                  <button
                    key={option}
                    onClick={() => setFilter(option)}
                    className={`px-4 py-2 rounded-full text-sm transition-colors ${
                      filter === option
                        ? "bg-[#4269F2] text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>

              {userType === "Admin" && (
                <button
                  onClick={() => setIsFormVisible(true)}
                  className="flex items-center justify-center text-sm gap-2 px-4 py-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors w-full sm:w-auto"
                >
                  <Plus className="w-5 h-5" />
                  <span>Create Job Post</span>
                </button>
              )}
            </div>

            <JobsList filter={filter} />
          </CardContent>
        </Card>
      </div>

      {isFormVisible && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="max-w-2xl w-full">
            <CardContent className="p-6">
              <CreateJobPost onClose={() => setIsFormVisible(false)} jobId="" />
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default CampusPlacements;
