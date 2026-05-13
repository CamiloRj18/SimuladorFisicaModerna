import { useState, useEffect, useRef } from 'react';
import styles from './DataPanel.module.css';

function extractLeadingNumber(str) {
  const m = str.match(/^(-?[\d]+\.?[\d]*(?:[eE][+-]?\d+)?)/);
  if (!m) return null;
  const decimals = m[1].includes('.') ? m[1].split('.')[1].length : 0;
  return { num: parseFloat(m[1]), rest: str.slice(m[0].length), decimals };
}

function AnimatedValue({ value, colorClass }) {
  const [displayed, setDisplayed] = useState(value);
  const [flashing, setFlashing] = useState(false);
  const prevRef = useRef(value);
  const rafRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    if (value === prevRef.current) return;

    // Trigger flash by toggling off then on (restarts the CSS animation)
    setFlashing(false);
    const tid = setTimeout(() => setFlashing(true), 0);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setFlashing(false), 350);

    const curr = extractLeadingNumber(value);
    const prev = extractLeadingNumber(prevRef.current);
    prevRef.current = value;

    if (curr && prev && curr.rest === prev.rest) {
      const startNum = prev.num;
      const endNum = curr.num;
      const { decimals, rest } = curr;
      const startTime = performance.now();

      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      const animate = (now) => {
        const t = Math.min((now - startTime) / 230, 1);
        const eased = 1 - Math.pow(1 - t, 2);
        setDisplayed((startNum + (endNum - startNum) * eased).toFixed(decimals) + rest);
        if (t < 1) rafRef.current = requestAnimationFrame(animate);
        else setDisplayed(value);
      };
      rafRef.current = requestAnimationFrame(animate);
    } else {
      setDisplayed(value);
    }

    return () => clearTimeout(tid);
  }, [value]);

  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return (
    <span className={`${styles.rowValue}${colorClass ? ' ' + colorClass : ''}${flashing ? ' ' + styles.flash : ''}`}>
      {displayed}
    </span>
  );
}

export default function DataPanel({ title, rows }) {
  const [glowing, setGlowing] = useState(false);
  const prevValsRef = useRef(rows.map(r => r.value));
  const timerRef = useRef(null);

  useEffect(() => {
    const currVals = rows.map(r => r.value);
    const changed = currVals.some((v, i) => v !== prevValsRef.current[i]);
    if (changed) {
      setGlowing(false);
      const tid = setTimeout(() => setGlowing(true), 0);
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setGlowing(false), 700);
      prevValsRef.current = currVals;
      return () => clearTimeout(tid);
    }
    prevValsRef.current = currVals;
  }, [rows]);

  useEffect(() => {
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, []);

  return (
    <div className={`${styles.panel}${glowing ? ' ' + styles.panelGlow : ''}`}>
      {title && <div className={styles.panelTitle}>{title}</div>}
      {rows.map((row, i) => (
        <div key={i} className={styles.row}>
          <span className={styles.rowLabel}>{row.label}</span>
          <AnimatedValue value={row.value} colorClass={row.color ? styles[row.color] : ''} />
        </div>
      ))}
    </div>
  );
}
