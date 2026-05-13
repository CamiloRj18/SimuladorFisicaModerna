// Constantes físicas universales en SI
export const h = 6.62607015e-34;       // Constante de Planck [J·s]
export const hbar = h / (2 * Math.PI); // Constante de Planck reducida [J·s]
export const c = 2.99792458e8;         // Velocidad de la luz en el vacío [m/s]
export const me = 9.1093837015e-31;    // Masa del electrón [kg]
export const mp = 1.67262192369e-27;   // Masa del protón [kg]
export const mn = 1.67492749804e-27;   // Masa del neutrón [kg]
export const malpha = 6.6446573357e-27; // Masa de la partícula alfa [kg]
export const e = 1.602176634e-19;      // Carga elemental [C]
export const eV = e;                   // 1 electronvoltio en Joules
export const R_inf = 1.0973731568e7;   // Constante de Rydberg [m^-1]
export const a0 = 5.29177210903e-11;   // Radio de Bohr [m]
export const lambda_C = h / (me * c);  // Longitud de onda de Compton del electrón [m]

// Factor de conversión
export const J_to_eV = 1 / eV;        // Joules a electronvoltios

// Masas de partículas predefinidas para De Broglie
export const PARTICLES = {
  electron: { label: 'Electrón', mass: me, symbol: 'e⁻' },
  proton:   { label: 'Protón',   mass: mp, symbol: 'p⁺' },
  neutron:  { label: 'Neutrón',  mass: mn, symbol: 'n⁰' },
  alpha:    { label: 'Alfa',     mass: malpha, symbol: 'α' },
};
