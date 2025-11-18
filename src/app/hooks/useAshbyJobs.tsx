
import { useState, useEffect } from "react";
import { useStore } from "../useStore";

const useAshbyJobs = () => {
    const {setJobs} = useStore();
    const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch(
          "https://api.ashbyhq.com/posting-api/job-board/amca?includeCompensation=true"
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        // Map jobs to your desired format
        const formattedJobs = data.jobs.map((job) => ({
          title: job.title,
          department: job.department,
          apply: job.applyUrl,
        }));

        setJobs(formattedJobs);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  return { loading, error };
};

export default useAshbyJobs;
