import styles from './Sidebar.module.css';

const MODULES = [
  { id: 'compton',   label: 'Efecto Compton',          shortLabel: 'Compton',    sub: 'Dispersión de fotones' },
  { id: 'debroglie', label: 'Hipótesis de De Broglie',  shortLabel: 'De Broglie', sub: 'Dualidad onda-partícula' },
  { id: 'hidrogeno', label: 'Series del Hidrógeno',     shortLabel: 'Hidrógeno',  sub: 'Espectros atómicos' },
  { id: 'moseley',   label: 'Ley de Moseley',           shortLabel: 'Moseley',    sub: 'Rayos X característicos' },
  { id: 'manual',    label: 'Manual de uso',             shortLabel: 'Manual',     sub: 'Guía de referencia' },
];

export default function Sidebar({ active, onSelect }) {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>
        <div className={styles.logoTitle}>Física Moderna</div>
        <div className={styles.logoSub}>Simulador interactivo</div>
      </div>
      <nav className={styles.nav}>
        <div className={styles.navSection}>Módulos</div>
        {MODULES.map(mod => (
          <div
            key={mod.id}
            className={`${styles.navItem} ${active === mod.id ? styles.active : ''}`}
            onClick={() => onSelect(mod.id)}
          >
            <span className={styles.navLabel}>{mod.label}</span>
            <span className={styles.navShort}>{mod.shortLabel}</span>
            <span className={styles.navSub}>{mod.sub}</span>
          </div>
        ))}
      </nav>
      <div className={styles.footer}>
        Dualidad onda-partícula
      </div>
    </aside>
  );
}
