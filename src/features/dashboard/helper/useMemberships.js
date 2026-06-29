import { useState, useEffect, useCallback } from 'react';
import { fetchMembershipPlans, transformMembershipData } from './api';

export default function useMemberships() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async function () {
    try {
      setLoading(true);
      setError(null);
      var rawPlans = await fetchMembershipPlans();
      var transformed = transformMembershipData(rawPlans);
      setCategories(transformed);
    } catch (err) {
      console.error('Failed to load memberships:', err);
      setError(err.message || 'Failed to load memberships');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(function () {
    load();
  }, [load]);

  return { categories: categories, loading: loading, error: error, refetch: load };
}