// Física de la Ley de Moseley y rayos X característicos
// Referencia: H.G.J. Moseley (1913), Philosophical Magazine 26, 1024
// Ley de Moseley: √f = k·(Z - σ)
// Para serie K-α: k ≈ 4.9664e7 Hz^(1/2), σ = 1
import { h, c, J_to_eV } from '../constants/physics.js';

// Constantes de Moseley para serie K-α
export const k_moseley = 4.9664e7; // Hz^(1/2)
export const sigma_K = 1;          // constante de apantallamiento K-α

/**
 * Frecuencia K-α según la ley de Moseley.
 * f = [k·(Z - σ)]²
 * @param {number} Z - número atómico
 * @returns {number} frecuencia en Hz
 */
export function kAlphaFrequency(Z) {
  const sqrtF = k_moseley * (Z - sigma_K);
  return sqrtF * sqrtF;
}

/**
 * Raíz cuadrada de la frecuencia K-α.
 * @param {number} Z - número atómico
 * @returns {number} √f en Hz^(1/2)
 */
export function sqrtKAlphaFrequency(Z) {
  return k_moseley * (Z - sigma_K);
}

/**
 * Longitud de onda del rayo X K-α.
 * λ = c / f
 * @param {number} Z - número atómico
 * @returns {number} longitud de onda en metros
 */
export function kAlphaWavelength(Z) {
  return c / kAlphaFrequency(Z);
}

/**
 * Energía del fotón K-α.
 * @param {number} Z - número atómico
 * @returns {number} energía en eV
 */
export function kAlphaEnergy_eV(Z) {
  return (h * kAlphaFrequency(Z)) * J_to_eV;
}

// Elementos reales con sus datos experimentales (serie K-α)
export const ELEMENTS = [
  { Z: 11, symbol: 'Na', name: 'Sodio' },
  { Z: 13, symbol: 'Al', name: 'Aluminio' },
  { Z: 14, symbol: 'Si', name: 'Silicio' },
  { Z: 16, symbol: 'S',  name: 'Azufre' },
  { Z: 19, symbol: 'K',  name: 'Potasio' },
  { Z: 20, symbol: 'Ca', name: 'Calcio' },
  { Z: 22, symbol: 'Ti', name: 'Titanio' },
  { Z: 24, symbol: 'Cr', name: 'Cromo' },
  { Z: 26, symbol: 'Fe', name: 'Hierro' },
  { Z: 28, symbol: 'Ni', name: 'Níquel' },
  { Z: 29, symbol: 'Cu', name: 'Cobre' },
  { Z: 30, symbol: 'Zn', name: 'Zinc' },
  { Z: 42, symbol: 'Mo', name: 'Molibdeno' },
];

/**
 * Calcula todos los datos de Moseley para un elemento.
 */
export function computeMoseley(Z) {
  const f = kAlphaFrequency(Z);
  const sqrtF = sqrtKAlphaFrequency(Z);
  const lambda = kAlphaWavelength(Z);
  const E_eV = kAlphaEnergy_eV(Z);

  return {
    Z,
    frequency_Hz: f,
    sqrtFrequency: sqrtF,
    lambda_m: lambda,
    lambda_nm: lambda * 1e9,
    E_eV,
  };
}

// Pre-calcula datos para todos los elementos
export const ELEMENTS_DATA = ELEMENTS.map(el => ({
  ...el,
  ...computeMoseley(el.Z),
}));
