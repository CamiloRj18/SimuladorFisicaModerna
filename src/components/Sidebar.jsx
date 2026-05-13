import styles from './Sidebar.module.css';

const MODULES = [
  { id: 'compton',   label: 'Efecto Compton',         sub: 'Dispersión de fotones' },
  { id: 'debroglie', label: 'Hipótesis de De Broglie', sub: 'Dualidad onda-partícula' },
  { id: 'hidrogeno', label: 'Series del Hidrógeno',    sub: 'Espectros atómicos' },
  { id: 'moseley',   label: 'Ley de Moseley',          sub: 'Rayos X característicos' },
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
