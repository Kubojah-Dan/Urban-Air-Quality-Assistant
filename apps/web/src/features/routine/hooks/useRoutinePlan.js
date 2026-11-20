import { useState } from 'react';
import { previewRecommendation, reviseRecommendation } from '../api/routineApi.js';

export function useRoutinePlan(initialLocation) {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const generatePlan = async (baseline, location = initialLocation) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await previewRecommendation(baseline, location);
      setData(res);
      return res;
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  const revisePlan = async (baseline, modifiedConstraint, location = initialLocation) => {
    if (!data?.candidates) return;
    setIsLoading(true);
    try {
      const res = await reviseRecommendation(baseline, modifiedConstraint, data.candidates, location);
      setData(res);
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  return { data, isLoading, error, generatePlan, revisePlan };
}
