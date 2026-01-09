import { useState, useEffect, useCallback } from 'react';

const useApi = (apiCall, initialData = null, retries = 3, retryDelay = 1000) => {
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    for (let i = 0; i <= retries; i++) {
      try {
        const result = await apiCall();
        setData(result);
        setError(null);
        break; // Success, break out of retry loop
      } catch (err) {
        console.error(`API call failed (attempt ${i + 1}/${retries + 1}):`, err);
        if (i < retries) {
          await new Promise(resolve => setTimeout(resolve, retryDelay));
        } else {
          setError(err);
        }
      }
    }
    setLoading(false);
  }, [apiCall, retries, retryDelay]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
};

export default useApi;
