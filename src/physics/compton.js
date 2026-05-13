// Física del Efecto Compton
// Referencia: A.H. Compton (1923), Physical Review 21, 483
import { h, me, c, J_to_eV } from '../constants/physics.js';

// Longitud de onda de Compton del electrón: λ_C = h / (m_e · c)
export const lambdaC = h / (me * c); // ≈ 2.426e-12 m

/**
 * Cambio de longitud de onda en la dispersión Compton.
 * Δλ = (h / m_e·c) · (1 - cos θ)
 * @param {number} thetaDeg - ángulo de dispersión en grados
 * @returns {number} Δλ en metros
 */
export function deltaLambda(thetaDeg) {
  const theta = (thetaDeg * Math.PI) / 180;
  return lambdaC * (1 - Math.cos(theta));
}

/**
 * Longitud de onda del fotón dispersado.
 * λ' = λ_0 + Δλ
 * @param {number} lambda0 - longitud de onda incidente en metros
 * @param {number} thetaDeg - ángulo de dispersión en grados
 * @returns {number} λ' en metros
 */
export function scatteredLambda(lambda0, thetaDeg) {
  return lambda0 + deltaLambda(thetaDeg);
}

/**
 * Energía del fotón: E = h·c / λ
 * @param {number} lambda - longitud de onda en metros
 * @returns {number} energía en Joules
 */
export function photonEnergy(lambda) {
  return (h * c) / lambda;
}

/**
 * Energía cinética transferida al electrón.
 * T_e = E_0 - E' = h·c·(1/λ_0 - 1/λ')
 * @param {number} lambda0 - longitud de onda incidente en metros
 * @param {number} thetaDeg - ángulo de dispersión en grados
 * @returns {number} energía cinética en Joules
 */
export function electronKineticEnergy(lambda0, thetaDeg) {
  const lambdaPrime = scatteredLambda(lambda0, thetaDeg);
  return photonEnergy(lambda0) - photonEnergy(lambdaPrime);
}

/**
 * Calcula todos los resultados del efecto Compton.
 * @param {number} lambda0Pm - longitud de onda incidente en picómetros
 * @param {number} thetaDeg - ángulo de dispersión en grados
 */
export function computeCompton(lambda0Pm, thetaDeg) {
  const lambda0 = lambda0Pm * 1e-12; // pm a m
  const dl = deltaLambda(thetaDeg);
  const lambdaPrime = scatteredLambda(lambda0, thetaDeg);
  const E0 = photonEnergy(lambda0);
  const Eprime = photonEnergy(lambdaPrime);
  const Te = E0 - Eprime;

  return {
    deltaLambda_pm: dl * 1e12,           // Δλ en picómetros
    lambda0_pm: lambda0 * 1e12,          // λ₀ en picómetros
    lambdaPrime_pm: lambdaPrime * 1e12,  // λ' en picómetros
    E0_eV: E0 * J_to_eV,                // energía incidente en eV
    Eprime_eV: Eprime * J_to_eV,        // energía dispersada en eV
    Te_eV: Te * J_to_eV,               // energía cinética del electrón en eV
    thetaDeg,
  };
}
