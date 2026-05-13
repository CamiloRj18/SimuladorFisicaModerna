import { useState, useMemo } from 'react';
import { computeCompton } from '../physics/compton.js';

export function useCompton() {
  const [theta, setTheta] = useState(90);      // grados
  const [lambda0, setLambda0] = useState(10);  // picómetros

  const results = useMemo(
    () => computeCompton(lambda0, theta),
    [lambda0, theta]
  );

  return { theta, setTheta, lambda0, setLambda0, results };
}
