import { useState, useMemo } from 'react';
import { computeMoseley, ELEMENTS } from '../physics/moseley.js';

export function useMoseley() {
  const [elementIndex, setElementIndex] = useState(6); // Titanio por defecto

  const element = ELEMENTS[elementIndex];
  const data = useMemo(() => computeMoseley(element.Z), [element.Z]);

  return { elementIndex, setElementIndex, element, data };
}
