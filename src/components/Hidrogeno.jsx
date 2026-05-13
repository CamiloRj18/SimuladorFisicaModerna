import { useHidrogeno } from '../hooks/useHidrogeno.js';
import { SERIES } from '../physics/hidrogeno.js';
import HidrogenoCanvas from './HidrogenoCanvas.jsx';
import DataPanel from './DataPanel.jsx';
import styles from './Hidrogeno.module.css';

const SERIES_STYLE = {
  lyman:   styles.lyman,
  balmer:  styles.balmer,
  paschen: styles.paschen,
};

export default function Hidrogeno() {
  const { activeSeries, setActiveSeries, selectedNi, setSelectedNi, series, nf, transition } = useHidrogeno();

  const rows = transition
    ? [
        { label: 'Transición',       value: `n=${transition.ni} → n=${transition.nf}`,       color: '' },
        { label: 'λ emitida',        value: `${transition.lambda_nm.toFixed(3)} nm`,          color: 'cyan' },
        { label: 'Energía ΔE',       value: `${transition.dE_eV.toFixed(4)} eV`,             color: 'gold' },
        { label: 'Región espectral', value: transition.region,                                color: 'green' },
      ]
    : [{ label: 'Selecciona una transición', value: '—', color: '' }];

  return (
    <div className={styles.container}>
      <div className={styles.left}>
        <div className={styles.canvasWrap}>
          <HidrogenoCanvas
            activeSeries={activeSeries}
            selectedNi={selectedNi}
            nf={nf}
            transition={transition}
          />
        </div>
        <div className={styles.controls}>
          <div>
            <div className={styles.controlLabel}>Serie espectral</div>
            <div className={styles.seriesSelector}>
              {Object.entries(SERIES).map(([key, s]) => (
                <button
                  key={key}
                  className={`${styles.seriesBtn} ${activeSeries === key ? SERIES_STYLE[key] : ''}`}
                  onClick={() => { setActiveSeries(key); setSelectedNi(s.nf + 1); }}
                >
                  <div>{s.name}</div>
                  <div style={{ fontSize: 10, opacity: 0.7 }}>{s.region}</div>
                </button>
              ))}
            </div>
          </div>
          <div className={styles.transitionSelector}>
            <div className={styles.controlLabel}>
              Nivel inicial n_i (n_f = {nf} — {series.name})
            </div>
            <div className={styles.transButtons}>
              {series.transitions.map(ni => (
                <button
                  key={ni}
                  className={`${styles.transBtn} ${selectedNi === ni ? styles.active : ''}`}
                  onClick={() => setSelectedNi(ni)}
                >
                  n={ni}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className={styles.right}>
        <DataPanel title={`Serie ${series.name} — n_f = ${nf}`} rows={rows} />
        <DataPanel
          title="Fórmula de Rydberg"
          rows={[
            { label: '1/λ = R∞(1/n_f² − 1/n_i²)', value: `R∞ = 1.097×10⁷ m⁻¹`, color: 'gold' },
          ]}
        />
      </div>
    </div>
  );
}
