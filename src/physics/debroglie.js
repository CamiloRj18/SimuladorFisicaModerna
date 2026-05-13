// Física de la hipótesis de De Broglie
// Referencia: L. de Broglie (1924), Recherches sur la théorie des quanta
import { h, c, J_to_eV } from '../constants/physics.js';

/**
 * Factor de Lorentz γ = 1 / √(1 - β²), donde β = v/c
 * @param {number} beta - velocidad normalizada v/c
 * @returns {number} factor de Lorentz
 */
export function lorentzFactor(beta) {
  return 1 / Math.sqrt(1 - beta * beta);
}

/**
 * Longitud de onda de De Broglie relativista.
 * λ = h / (γ·m·v) = h / p
 * @param {number} mass - masa de la partícula en kg
 * @param {number} beta - velocidad normalizada v/c (0 < β < 1)
 * @returns {number} longitud de onda en metros
 */
export function deBroglieWavelength(mass, beta) {
  const v = beta * c;
  const gamma = lorentzFactor(beta);
  const p = gamma * mass * v; // momento relativista
  return h / p;
}

/**
 * Momento lineal relativista p = γ·m·v
 * @param {number} mass - masa en kg
 * @param {number} beta - velocidad normalizada
 * @returns {number} momento en kg·m/s
 */
export function relativisticMomentum(mass, beta) {
  const v = beta * c;
  const gamma = lorentzFactor(beta);
  return gamma * mass * v;
}

/**
 * Energía cinética relativista.
 * T = (γ - 1)·m·c²
 * @param {number} mass - masa en kg
 * @param {number} beta - velocidad normalizada
 * @returns {number} energía cinética en Joules
 */
export function relativisticKineticEnergy(mass, beta) {
  const gamma = lorentzFactor(beta);
  return (gamma - 1) * mass * c * c;
}

/**
 * Calcula todos los resultados de De Broglie.
 * @param {number} mass - masa de la partícula en kg
 * @param {number} beta - velocidad normalizada v/c
 */
export function computeDeBroglie(mass, beta) {
  const lambda = deBroglieWavelength(mass, beta);
  const p = relativisticMomentum(mass, beta);
  const T = relativisticKineticEnergy(mass, beta);
  const gamma = lorentzFactor(beta);

  return {
    lambda_m: lambda,
    lambda_pm: lambda * 1e12,   // en picómetros
    lambda_fm: lambda * 1e15,   // en femtómetros
    p_SI: p,                    // en kg·m/s
    T_J: T,                     // en Joules
    T_eV: T * J_to_eV,         // en electronvoltios
    gamma,
    beta,
    v_ms: beta * c,             // velocidad en m/s
  };
}
