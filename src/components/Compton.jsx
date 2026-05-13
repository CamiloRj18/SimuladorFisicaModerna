import { useCompton } from '../hooks/useCompton.js';
import ComptonCanvas from './ComptonCanvas.jsx';
import DataPanel from './DataPanel.jsx';
import styles from './Compton.module.css';

export default function Compton() {
  const { theta, setTheta, lambda0, setLambda0, results } = useCompton();

  const rows = [
    { label: 'λ₀  (incidente)',      value: `${results.lambda0_pm.toFixed(3)} pm`,       color: '' },
    { label: "λ'  (dispersado)",     value: `${results.lambdaPrime_pm.toFixed(3)} pm`,    color: 'cyan' },
    { label: 'Δλ  (cambio)',         value: `${results.deltaLambda_pm.toFixed(4)} pm`,    color: 'gold' },
    { label: 'E₀  (fotón incid.)',   value: `${results.E0_eV.toFixed(2)} eV`,             color: '' },
    { label: "E'  (fotón disp.)",    value: `${results.Eprime_eV.toFixed(2)} eV`,         color: 'cyan' },
    { label: 'Tₑ  (electrón)',       value: `${results.Te_eV.toFixed(4)} eV`,             color: 'green' },
    { label: 'θ   (ángulo)',         value: `${theta}°`,                                   color: 'gold' },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.left}>
        <div className={styles.canvasWrap}>
          <ComptonCanvas theta={theta} results={results} />
        </div>
        <div className={styles.controls}>
          <div className={styles.controlRow}>
            <div className={styles.controlHeader}>
              <span className={styles.controlLabel}>Ángulo de dispersión θ</span>
              <span className={styles.controlValue}>{theta}°</span>
            </div>
            <input
              type="range"
              min={0} max={180} step={1}
              value={theta}
              onChange={e => setTheta(Number(e.target.value))}
              style={{ '--slider-fill': `${(theta / 180) * 100}%` }}
            />
          </div>
          <div className={styles.controlRow}>
            <div className={styles.controlHeader}>
              <span className={styles.controlLabel}>Longitud de onda incidente λ₀</span>
              <span className={styles.controlValue}>{lambda0} pm</span>
            </div>
            <input
              type="range"
              min={1} max={100} step={0.5}
              value={lambda0}
              onChange={e => setLambda0(Number(e.target.value))}
              style={{ '--slider-fill': `${((lambda0 - 1) / 99) * 100}%` }}
            />
          </div>
        </div>
      </div>
      <div className={styles.right}>
        <DataPanel title="Resultados — Efecto Compton" rows={rows} />
        <DataPanel
          title="Fórmula"
          rows={[
            { label: 'Δλ = (h/mₑc)(1 − cos θ)', value: `λ_C = 2.426 pm`, color: 'gold' },
          ]}
        />
      </div>
    </div>
  );
}
