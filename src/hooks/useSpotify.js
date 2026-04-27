import { useState, useEffect } from 'react';
import { spotify } from '../services/spotify';

// Track initial global load
let isInitialLoad = true;

export const useSpotify = (method, ...args) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Determine artificial delay
        const delayMs = isInitialLoad ? 3000 : 1500;
        if (isInitialLoad) isInitialLoad = false;

        const startTime = Date.now();
        const result = await spotify[method](...args);
        const elapsedTime = Date.now() - startTime;
        
        // Wait for the remainder of the delay to ensure loader shows properly
        if (elapsedTime < delayMs) {
          await new Promise(resolve => setTimeout(resolve, delayMs - elapsedTime));
        }

        if (isMounted) {
          setData(result);
        }
      } catch (err) {
        console.error(`useSpotify error [${method}]:`, err);
        if (isMounted) setError(err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [method, JSON.stringify(args)]);

  return { data, loading, error };
};
