// Física de las series espectrales del hidrógeno
// Referencia: N. Bohr (1913), Philosophical Magazine 26, 1
// Fórmula de Rydberg: 1/λ = R_∞·(1/n_f² - 1/n_i²)
import { R_inf, h, c, J_to_eV, eV } from '../constants/physics.js';

/**
 * Energía del nivel n del hidrógeno: E_n = -13.6 eV / n²
 * @param {number} n - número cuántico principal
 * @returns {number} energía en eV (negativa)
 */
export function energyLevel(n) {
  return -13.6 / (n * n); // eV
}

/**
 * Longitud de onda emitida en la transición n_i → n_f (n_i > n_f).
 * 1/λ = R_∞ · (1/n_f² - 1/n_i²)
 * @param {number} ni - nivel inicial (superior)
 * @param {number} nf - nivel final (inferior)
 * @returns {number} longitud de onda en metros
 */
export function transitionWavelength(ni, nf) {
  const inv_lambda = R_inf * (1 / (nf * nf) - 1 / (ni * ni));
  return 1 / inv_lambda;
}

/**
 * Energía del fotón emitido en la transición.
 * ΔE = E_ni - E_nf = 13.6·(1/n_f² - 1/n_i²) eV
 * @param {number} ni - nivel inicial
 * @param {number} nf - nivel final
 * @returns {number} energía en eV
 */
export function transitionEnergy(ni, nf) {
  return energyLevel(nf) - energyLevel(ni); // positivo porque nf < ni
}

/**
 * Determina la región del espectro electromagnético.
 * @param {number} lambda - longitud de onda en metros
 * @returns {string} región del espectro
 */
export function spectralRegion(lambda) {
  const nm = lambda * 1e9;
  if (nm < 10)     return 'Rayos X';
  if (nm < 122)    return 'Ultravioleta extremo';
  if (nm < 380)    return 'Ultravioleta';
  if (nm < 700)    return 'Visible';
  if (nm < 1000)   return 'Infrarrojo cercano';
  if (nm < 3000)   return 'Infrarrojo medio';
  return 'Infrarrojo lejano';
}

/**
 * Devuelve el color aproximado en el rango visible.
 * @param {number} lambda - longitud de onda en metros
 * @returns {string} color CSS
 */
export function visibleColor(lambda) {
  const nm = lambda * 1e9;
  if (nm < 380 || nm > 700) return null;
  if (nm < 450) return '#7B00FF'; // violeta
  if (nm < 495) return '#0000FF'; // azul
  if (nm < 570) return '#00FF00'; // verde
  if (nm < 590) return '#FFFF00'; // amarillo
  if (nm < 620) return '#FF7F00'; // naranja
  return '#FF0000';               // rojo
}

// Series espectrales predefinidas
export const SERIES = {
  lyman: {
    name: 'Lyman',
    nf: 1,
    color: '#7c3aed',
    region: 'Ultravioleta',
    transitions: [2, 3, 4, 5, 6],
  },
  balmer: {
    name: 'Balmer',
    nf: 2,
    color: '#4a9eff',
    region: 'Visible / UV',
    transitions: [3, 4, 5, 6],
  },
  paschen: {
    name: 'Paschen',
    nf: 3,
    color: '#f59e0b',
    region: 'Infrarrojo',
    transitions: [4, 5, 6],
  },
};

/**
 * Calcula todos los datos de una transición.
 */
export function computeTransition(ni, nf) {
  const lambda = transitionWavelength(ni, nf);
  const dE = transitionEnergy(ni, nf);
  return {
    ni,
    nf,
    lambda_m: lambda,
    lambda_nm: lambda * 1e9,
    dE_eV: dE,
    region: spectralRegion(lambda),
    color: visibleColor(lambda),
  };
}

// Niveles de energía n=1..6
export const ENERGY_LEVELS = [1, 2, 3, 4, 5, 6].map(n => ({
  n,
  energy_eV: energyLevel(n),
}));

// Líneas de Balmer con colores reales
export const BALMER_LINES = [
  { ni: 3, nf: 2, name: 'Hα', color: '#FF4444', nm: 656.3 },
  { ni: 4, nf: 2, name: 'Hβ', color: '#4488FF', nm: 486.1 },
  { ni: 5, nf: 2, name: 'Hγ', color: '#8844FF', nm: 434.0 },
  { ni: 6, nf: 2, name: 'Hδ', color: '#6622FF', nm: 410.2 },
];
