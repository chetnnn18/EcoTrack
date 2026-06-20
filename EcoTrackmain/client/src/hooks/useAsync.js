import { useCallback, useEffect, useState } from 'react';
import { getErrorMessage } from '../services/api';

export const useAsync = (task, dependencies = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const run = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await task();
      setData(response?.data?.data ?? response?.data ?? response);
      return response;
    } catch (err) {
      setError(getErrorMessage(err));
      throw err;
    } finally {
      setLoading(false);
    }
  }, dependencies);

  useEffect(() => {
    run().catch(() => {});
  }, [run]);

  return { data, loading, error, refresh: run, setData };
};
