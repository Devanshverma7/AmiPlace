import React from "react";
import { useSelector } from "react-redux";
import JobPostCard from "./JobPostCard";
import { useJobsFetch } from "./useJobsFetch";

const JobsList = ({ filter }) => {
  const { loading, error } = useJobsFetch();
  const jobs = useSelector((state) => state.jobs.jobs);

  if (loading) return <div className="text-center">Loading...</div>;
  if (error)
    return <div className="text-center text-red-600">Error: {error}</div>;

  const filterJobs = (jobs) => {
    const currentDate = new Date();
    switch (filter) {
      case "Currently Opened":
        return jobs.filter((job) => {
          const openingDate = new Date(job.jobOpeningDate);
          const closingDate = new Date(job.openedTill);
          return currentDate >= openingDate && currentDate <= closingDate;
        });
      case "Upcoming":
        return jobs.filter((job) => new Date(job.jobOpeningDate) > currentDate);
      case "Closed":
        return jobs.filter((job) => new Date(job.openedTill) < currentDate);
      default:
        return jobs;
    }
  };

  const filteredJobs = filterJobs(jobs);

  return (
    <div className="space-y-6">
      {filteredJobs.length === 0 ? (
        <p className="text-center text-gray-600">
          No jobs found for the selected filter.
        </p>
      ) : (
        filteredJobs.map((job) => <JobPostCard key={job.id} job={job} />)
      )}
    </div>
  );
};

export default JobsList;
