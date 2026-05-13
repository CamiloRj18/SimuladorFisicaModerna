import { useState, useMemo } from 'react';
import { computeTransition, SERIES } from '../physics/hidrogeno.js';

export function useHidrogeno() {
  const [activeSeries, setActiveSeries] = useState('balmer');
  const [selectedNi, setSelectedNi] = useState(3);

  const series = SERIES[activeSeries];
  const nf = series.nf;

  const transition = useMemo(() => {
    if (selectedNi <= nf) return null;
    return computeTransition(selectedNi, nf);
  }, [selectedNi, nf]);

  return {
    activeSeries, setActiveSeries,
    selectedNi, setSelectedNi,
    series, nf, transition,
  };
}
