import { useDeBroglie } from '../hooks/useDeBroglie.js';
import { PARTICLES } from '../constants/physics.js';
import DeBroglieCanvas from './DeBroglieCanvas.jsx';
import DataPanel from './DataPanel.jsx';
import styles from './DeBroglie.module.css';

function formatLambda(lambda_pm) {
  if (lambda_pm >= 1) return `${lambda_pm.toFixed(4)} pm`;
  if (lambda_pm >= 1e-3) return `${(lambda_pm * 1000).toFixed(4)} fm`;
  return `${lambda_pm.toExponential(3)} pm`;
}

function formatMomentum(p) {
  return `${p.toExponential(3)} kg·m/s`;
}

function formatEnergy(T_eV) {
  if (T_eV >= 1e9) return `${(T_eV / 1e9).toFixed(4)} GeV`;
  if (T_eV >= 1e6) return `${(T_eV / 1e6).toFixed(4)} MeV`;
  if (T_eV >= 1e3) return `${(T_eV / 1e3).toFixed(4)} keV`;
  return `${T_eV.toFixed(4)} eV`;
}

export default function DeBroglie() {
  const { particleKey, setParticleKey, beta, setBeta, particle, results } = useDeBroglie();

  const rows = [
    { label: 'λ de Broglie',         value: formatLambda(results.lambda_pm),       color: 'purple' },
    { label: 'Momento p = γmv',      value: formatMomentum(results.p_SI),           color: '' },
    { label: 'Energía cinética T',   value: formatEnergy(results.T_eV),             color: 'green' },
    { label: 'Factor Lorentz γ',     value: results.gamma.toFixed(4),               color: 'gold' },
    { label: 'Velocidad v',          value: `${(results.v_ms / 1e6).toFixed(3)} Mm/s`, color: '' },
    { label: 'β = v/c',             value: results.beta.toFixed(4),                color: 'cyan' },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.left}>
        <div className={styles.canvasWrap}>
          <DeBroglieCanvas
            beta={beta}
            lambda_pm={results.lambda_pm}
            particleLabel={particle.symbol}
          />
        </div>
        <div className={styles.controls}>
          <div className={styles.controlRow}>
            <div className={styles.controlHeader}>
              <span className={styles.controlLabel}>Partícula</span>
            </div>
            <div className={styles.particleSelector}>
              {Object.entries(PARTICLES).map(([key, p]) => (
                <button
                  key={key}
                  className={`${styles.particleBtn} ${particleKey === key ? styles.active : ''}`}
                  onClick={() => setParticleKey(key)}
                >
                  <div>{p.symbol}</div>
                  <div style={{ fontSize: 10, marginTop: 2, color: 'inherit', opacity: 0.7 }}>{p.label}</div>
                </button>
              ))}
            </div>
          </div>
          <div className={styles.controlRow}>
            <div className={styles.controlHeader}>
              <span className={styles.controlLabel}>Velocidad β = v/c</span>
              <span className={styles.controlValue}>{beta.toFixed(3)} c</span>
            </div>
            <input
              type="range"
              min={0.01} max={0.99} step={0.01}
              value={beta}
              onChange={e => setBeta(Number(e.target.value))}
              style={{ '--slider-fill': `${((beta - 0.01) / 0.98) * 100}%` }}
            />
          </div>
        </div>
      </div>
      <div className={styles.right}>
        <DataPanel title={`De Broglie — ${particle.label}`} rows={rows} />
        <DataPanel
          title="Fórmula"
          rows={[
            { label: 'λ = h / (γmv)', value: 'momento relativista', color: 'purple' },
          ]}
        />
      </div>
    </div>
  );
}
