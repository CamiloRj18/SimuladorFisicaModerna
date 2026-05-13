import { useMoseley } from '../hooks/useMoseley.js';
import { ELEMENTS, ELEMENTS_DATA } from '../physics/moseley.js';
import MoseleyCanvas from './MoseleyCanvas.jsx';
import DataPanel from './DataPanel.jsx';
import styles from './Moseley.module.css';

export default function Moseley() {
  const { elementIndex, setElementIndex, element, data } = useMoseley();
  const selectedData = { ...element, ...data };

  const rows = [
    { label: 'Elemento',             value: `${element.symbol} — ${element.name}`,        color: 'gold' },
    { label: 'Número atómico Z',     value: `${element.Z}`,                               color: '' },
    { label: 'Frecuencia K-α',       value: `${(data.frequency_Hz / 1e15).toFixed(4)} PHz`, color: 'cyan' },
    { label: '√f  (Moseley)',         value: `${(data.sqrtFrequency / 1e7).toFixed(3)} ×10⁷ Hz½`, color: 'gold' },
    { label: 'Longitud de onda λ',   value: `${data.lambda_nm.toFixed(4)} nm`,            color: 'cyan' },
    { label: 'Energía E',            value: `${data.E_eV.toFixed(2)} eV`,                 color: 'green' },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.left}>
        <div className={styles.canvasWrap}>
          <MoseleyCanvas elementIndex={elementIndex} selectedElement={selectedData} />
        </div>
        <div className={styles.controls}>
          <div className={styles.controlHeader}>
            <span className={styles.controlLabel}>Elemento seleccionado</span>
            <span className={styles.controlValue}>{element.symbol} (Z={element.Z})</span>
          </div>
          <div className={styles.elementGrid}>
            {ELEMENTS.map((el, idx) => (
              <button
                key={el.Z}
                className={`${styles.elemBtn} ${idx === elementIndex ? styles.active : ''}`}
                onClick={() => setElementIndex(idx)}
              >
                {el.symbol}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className={styles.right}>
        <DataPanel title="Ley de Moseley — K-α" rows={rows} />
        <DataPanel
          title="Fórmula"
          rows={[
            { label: '√f = k(Z − σ)', value: 'σ = 1,  k = 4.97×10⁷', color: 'gold' },
          ]}
        />
      </div>
    </div>
  );
}
