import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "../../firebase.config";
import { setJobs } from "../../store/JobsSlice";

export const useJobsFetch = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        // Create a query with orderBy
        const jobsQuery = query(
          collection(db, "Jobs"),
          orderBy("createdAt", "desc")
        );
        
        const querySnapshot = await getDocs(jobsQuery);
        const jobsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        dispatch(setJobs(jobsData));
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchJobs();
  }, [dispatch]);

  return { loading, error };
};