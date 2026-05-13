import { useState, useMemo } from 'react';
import { computeDeBroglie } from '../physics/debroglie.js';
import { PARTICLES } from '../constants/physics.js';

export function useDeBroglie() {
  const [particleKey, setParticleKey] = useState('electron');
  const [beta, setBeta] = useState(0.5);

  const particle = PARTICLES[particleKey];

  const results = useMemo(
    () => computeDeBroglie(particle.mass, beta),
    [particle.mass, beta]
  );

  return { particleKey, setParticleKey, beta, setBeta, particle, results };
}
