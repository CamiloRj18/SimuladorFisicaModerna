import { useState } from 'react';
import Sidebar from './components/Sidebar.jsx';
import Compton from './components/Compton.jsx';
import DeBroglie from './components/DeBroglie.jsx';
import Hidrogeno from './components/Hidrogeno.jsx';
import Moseley from './components/Moseley.jsx';
import styles from './components/Layout.module.css';

const MODULE_META = {
  compton:   { title: 'Efecto Compton',              subtitle: 'Dispersión de fotones por electrones — A.H. Compton, 1923' },
  debroglie: { title: 'Hipótesis de De Broglie',     subtitle: 'Dualidad onda-partícula del momento relativista — L. de Broglie, 1924' },
  hidrogeno: { title: 'Series Espectrales del Hidrógeno', subtitle: 'Transiciones electrónicas y fórmula de Rydberg — N. Bohr, 1913' },
  moseley:   { title: 'Ley de Moseley — Rayos X',    subtitle: 'Frecuencia de rayos X característicos vs. número atómico — H.G.J. Moseley, 1913' },
};

const MODULES = { compton: Compton, debroglie: DeBroglie, hidrogeno: Hidrogeno, moseley: Moseley };

export default function App() {
  const [active, setActive] = useState('compton');
  const Module = MODULES[active];
  const meta = MODULE_META[active];

  return (
    <div className={styles.app}>
      <Sidebar active={active} onSelect={setActive} />
      <main className={styles.main}>
        <div className={styles.pageHeader}>
          <div className={styles.pageTitle}>{meta.title}</div>
          <div className={styles.pageSubtitle}>{meta.subtitle}</div>
        </div>
        <Module />
      </main>
    </div>
  );
}
