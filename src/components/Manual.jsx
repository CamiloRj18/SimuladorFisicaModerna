import styles from './Manual.module.css';

const MODULES_DOC = [
  {
    id: 'compton',
    accent: 'blue',
    title: 'Efecto Compton',
    description:
      'El efecto Compton describe la colisión entre un fotón de rayos X de alta energía y un electrón en reposo. Durante la colisión, el fotón transfiere parte de su energía y momento al electrón: el fotón sale dispersado con una longitud de onda mayor (menor energía) y el electrón adquiere energía cinética. Este fenómeno, descubierto por Arthur Compton en 1923, demostró experimentalmente que la luz tiene propiedades corpusculares y fue una de las primeras evidencias directas de la dualidad onda-partícula.',
    steps: [
      {
        text: (
          <>
            Ajusta el slider <strong>Ángulo de dispersión θ</strong> (0° a 180°) para cambiar la dirección en la que el fotón sale tras la colisión. A 0° no hay colisión efectiva; a 180° el fotón regresa en sentido opuesto y la transferencia de energía al electrón es máxima.
          </>
        ),
      },
      {
        text: (
          <>
            Ajusta el slider <strong>Longitud de onda incidente λ₀</strong> (1 pm a 100 pm) para cambiar la energía del fotón que entra. Fotones con λ₀ menor tienen mayor energía.
          </>
        ),
      },
      {
        text: (
          <>
            Observa el diagrama animado: el fotón azul viaja hacia el electrón central, y el fotón cian sale dispersado hacia el ángulo seleccionado. Los ciclos de onda en cada fotón reflejan su longitud de onda relativa.
          </>
        ),
      },
      {
        text: (
          <>
            En el panel de resultados: <strong>λ₀</strong> es la longitud de onda incidente, <strong>λ'</strong> la dispersada (siempre mayor que λ₀), <strong>Δλ</strong> es el cambio según la fórmula de Compton Δλ = (h/mₑc)(1 − cosθ), <strong>E₀</strong> y <strong>E'</strong> son las energías del fotón antes y después de la colisión, y <strong>Tₑ</strong> es la energía cinética ganada por el electrón.
          </>
        ),
      },
    ],
  },
  {
    id: 'debroglie',
    accent: 'purple',
    title: 'Hipótesis de De Broglie',
    description:
      'Louis de Broglie propuso en 1924 que toda partícula con momento p tiene asociada una longitud de onda λ = h/p, donde h es la constante de Planck. Esta hipótesis extiende la dualidad onda-partícula de los fotones a la materia ordinaria. Para partículas relativistas el momento se escribe como p = γmv, donde γ es el factor de Lorentz. La longitud de onda de De Broglie es inversamente proporcional al momento: partículas más rápidas o con mayor masa tienen longitudes de onda más cortas.',
    steps: [
      {
        text: (
          <>
            Selecciona una <strong>partícula</strong> con los botones: electrón (e⁻), protón (p), neutrón (n) o partícula alfa (α). Cada una tiene una masa distinta; masas mayores producen longitudes de onda más cortas para la misma velocidad.
          </>
        ),
      },
      {
        text: (
          <>
            Ajusta el slider <strong>Velocidad β = v/c</strong> (0.01c a 0.99c). Al acercarse a la velocidad de la luz el factor de Lorentz γ crece significativamente, lo que comprime aún más la longitud de onda.
          </>
        ),
      },
      {
        text: (
          <>
            Observa la onda en el diagrama: la onda viaja continuamente de izquierda a derecha y la partícula central oscila siguiendo su amplitud. Más ciclos visibles indican una longitud de onda más corta.
          </>
        ),
      },
      {
        text: (
          <>
            En el panel de resultados: <strong>λ</strong> es la longitud de onda de De Broglie (puede estar en pm o fm), <strong>p</strong> es el momento relativista, <strong>T</strong> es la energía cinética, <strong>γ</strong> es el factor de Lorentz y <strong>β</strong> es la velocidad adimensional v/c.
          </>
        ),
      },
    ],
  },
  {
    id: 'hidrogeno',
    accent: 'cyan',
    title: 'Series Espectrales del Hidrógeno',
    description:
      'Cuando el electrón del hidrógeno cae de un nivel de energía superior n_i a uno inferior n_f, emite un fotón cuya energía es exactamente la diferencia entre niveles. La fórmula de Rydberg 1/λ = R∞(1/n_f² − 1/n_i²) permite calcular la longitud de onda emitida. Las transiciones se agrupan en series según el nivel final: serie de Lyman (n_f=1, ultravioleta), serie de Balmer (n_f=2, visible y UV cercano) y serie de Paschen (n_f=3, infrarrojo cercano).',
    steps: [
      {
        text: (
          <>
            Selecciona una <strong>serie espectral</strong>: Lyman (ultravioleta), Balmer (visible/UV) o Paschen (infrarrojo). Cada botón fija el nivel final n_f de todas las transiciones de esa serie.
          </>
        ),
      },
      {
        text: (
          <>
            Selecciona el <strong>nivel inicial n_i</strong> con los botones de transición. Solo están disponibles los niveles superiores al n_f de la serie activa.
          </>
        ),
      },
      {
        text: (
          <>
            Observa la <strong>flecha animada</strong> que recorre el diagrama de niveles de energía desde n_i hacia n_f. El recorrido representa el proceso de emisión espontánea del fotón.
          </>
        ),
      },
      {
        text: (
          <>
            Tras completarse la transición, una onda pequeña sale hacia la derecha con el <strong>color espectral</strong> correspondiente a la longitud de onda emitida (si cae en el rango visible). Los fotones UV e IR no tienen color perceptible.
          </>
        ),
      },
      {
        text: (
          <>
            En el panel de resultados: <strong>λ emitida</strong> es la longitud de onda del fotón, <strong>ΔE</strong> es la energía del fotón en eV y <strong>Región espectral</strong> indica si cae en UV, visible o infrarrojo. La barra inferior muestra las cuatro líneas visibles de la serie de Balmer (Hα, Hβ, Hγ, Hδ) con sus colores reales.
          </>
        ),
      },
    ],
  },
  {
    id: 'moseley',
    accent: 'gold',
    title: 'Ley de Moseley — Rayos X',
    description:
      'Henry Moseley demostró en 1913 que la raíz cuadrada de la frecuencia de los rayos X característicos K-alfa de un elemento es proporcional a su número atómico Z: √f = k(Z − σ). Esta relación permitió ordenar los elementos por número atómico en lugar de por masa atómica, confirmando la estructura de la tabla periódica. Los rayos X K-alfa se producen cuando un electrón de la capa L ocupa una vacante en la capa K, emitiendo un fotón de alta energía cuya frecuencia depende del número de protones del núcleo.',
    steps: [
      {
        text: (
          <>
            Selecciona un <strong>elemento</strong> de la cuadrícula inferior, que incluye elementos del sodio (Z=11) al molibdeno (Z=42). El punto dorado de la gráfica se desplaza animadamente hacia su posición.
          </>
        ),
      },
      {
        text: (
          <>
            Observa la <strong>gráfica principal</strong>: el eje horizontal es el número atómico Z y el eje vertical es √f. La línea discontinua es la predicción teórica de Moseley; los puntos azules son valores calculados según la ley. La relación lineal confirma que √f es proporcional a Z.
          </>
        ),
      },
      {
        text: (
          <>
            En el <strong>diagrama de capas</strong> del panel derecho, tres electrones orbitan continuamente las capas K (dorado), L (azul) y M (morado). El destello periódico representa la transición K-alfa: un electrón de la capa L cae a la capa K emitiendo el rayo X.
          </>
        ),
      },
      {
        text: (
          <>
            En el panel de resultados: <strong>Frecuencia K-alfa</strong> es la frecuencia del rayo X en petahercios, <strong>√f</strong> es el valor graficado en la ley de Moseley, <strong>λ</strong> es la longitud de onda del rayo X en nanómetros y <strong>E</strong> es la energía del fotón en electronvoltios.
          </>
        ),
      },
    ],
  },
];

function Card({ mod }) {
  return (
    <div className={`${styles.card} ${styles[mod.accent]}`}>
      <div className={styles.cardTitle}>{mod.title}</div>
      <p className={styles.description}>{mod.description}</p>
      <div className={styles.divider} />
      <div className={styles.stepsLabel}>Instrucciones de uso</div>
      <ol className={styles.steps}>
        {mod.steps.map((step, i) => (
          <li key={i} className={styles.step}>
            <span className={styles.stepNum}>{i + 1}</span>
            <span className={styles.stepText}>{step.text}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}

export default function Manual() {
  return (
    <div className={styles.container}>
      {MODULES_DOC.map(mod => (
        <Card key={mod.id} mod={mod} />
      ))}
    </div>
  );
}
