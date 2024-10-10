import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import JobPostCard from "./JobPostCard";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../firebase.config";

const SearchJobPost = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (searchTerm) {
        performSearch();
      } else {
        setSearchResults([]);
      }
    }, 500); // Debounce delay of 300ms

    return () => clearTimeout(delayDebounce);
  }, [searchTerm]);

  const performSearch = async () => {
    if (!searchTerm) return;

    setIsLoading(true);
    setError(null);

    try {
      const jobsRef = collection(db, "Jobs");
      // Using >= and <= for a range query on a single field
      const q = query(
        jobsRef,
        where("companyName", ">=", searchTerm),
        where("companyName", "<=", searchTerm + "\uf8ff")
      );

      const querySnapshot = await getDocs(q);

      const results = [];
      querySnapshot.forEach((doc) => {
        // Additional client-side filtering for case-insensitive partial matches
        if (
          doc
            .data()
            .companyName.toLowerCase()
            .includes(searchTerm.toLowerCase())
        ) {
          results.push({ id: doc.id, ...doc.data() });
        }
      });

      setSearchResults(results);
    } catch (err) {
      console.error("Error searching for jobs:", err);
      setError("Failed to search for jobs. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full mx-auto p-4 ">
      <div className="relative max-w-md mx-auto">
        <div className="flex mb-4">
          <input
            type="text"
            placeholder="Search by company name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-grow  px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <div className="absolute right-2 top-2">
            {isLoading ? (
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
            ) : (
              <Search className="h-6 w-6 text-gray-400" />
            )}
          </div>
        </div>
      </div>

      {error && <p className="text-red-500 mt-2">{error}</p>}

      <div className="space-y-4 max-w-lg mx-auto ">
        {searchResults.length > 0
          ? searchResults.map((job) => <JobPostCard key={job.id} job={job} />)
          : searchTerm &&
            !isLoading && (
              <p className="text-gray-500">
                No companies found matching '{searchTerm}'
              </p>
            )}
      </div>
    </div>
  );
};

export default SearchJobPost;
