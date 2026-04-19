import { useState, useEffect } from 'react';
import { spotify } from '../services/spotify';

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
        const result = await spotify[method](...args);
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
