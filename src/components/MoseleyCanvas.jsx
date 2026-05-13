import { useRef, useEffect } from 'react';
import { ELEMENTS_DATA, sqrtKAlphaFrequency } from '../physics/moseley.js';

export default function MoseleyCanvas({ elementIndex, selectedElement }) {
  const canvasRef = useRef(null);
  const animRef = useRef(null);
  const stateRef = useRef(null);

  if (!stateRef.current) {
    stateRef.current = {
      elementIndex,
      prevElementIndex: elementIndex,
      targetElementIndex: elementIndex,
      selectedElement,
      pointStart: null,
      orbitAngles: [0, Math.PI * 0.7, Math.PI * 1.3],
      orbitSpeeds: [0.036, 0.022, 0.013],
      flashT: 0,
      entryProgress: 0,
      entryStart: null,
      initialized: false,
      bgParticles: [],
    };
  }

  useEffect(() => {
    const s = stateRef.current;
    s.selectedElement = selectedElement;
    if (elementIndex !== s.targetElementIndex) {
      s.prevElementIndex = s.targetElementIndex;
      s.targetElementIndex = elementIndex;
      s.elementIndex = elementIndex;
      s.pointStart = performance.now();
      s.entryProgress = 0;
      s.entryStart = performance.now();
    }
    s.elementIndex = elementIndex;
  }, [elementIndex, selectedElement]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.width;
    const H = canvas.height;
    const s = stateRef.current;

    const chartW = W - 180;
    const chartH = H - 50;
    const originX = 60;
    const originY = chartH;
    const zMin = ELEMENTS_DATA[0].Z;
    const zMax = ELEMENTS_DATA[ELEMENTS_DATA.length - 1].Z + 2;
    const sqrtFMax = sqrtKAlphaFrequency(zMax) * 1.05;

    const toCanvasX = (Z) => originX + ((Z - zMin) / (zMax - zMin)) * (chartW - originX);
    const toCanvasY = (sqrtF) => originY - (sqrtF / sqrtFMax) * (chartH - 20);

    s.bgParticles = Array.from({ length: 20 }, () => ({
      x: Math.random() * chartW,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.1,
      vy: (Math.random() - 0.5) * 0.1,
      r: Math.random() * 1.0 + 0.3,
      alpha: Math.random() * 0.13 + 0.04,
    }));

    const draw = (timestamp) => {
      // Cascade entry on first frame
      if (!s.initialized) {
        s.initialized = true;
        s.entryProgress = 0;
        s.entryStart = timestamp;
      }

      s.orbitAngles = s.orbitAngles.map((a, i) => a + s.orbitSpeeds[i]);
      s.flashT += 0.05;

      // Point movement animation
      let easedPoint = 1;
      if (s.pointStart !== null) {
        const t = Math.min((timestamp - s.pointStart) / 420, 1);
        easedPoint = 1 - Math.pow(1 - t, 3);
        if (t >= 1) s.pointStart = null;
      }

      // Cascade entry animation
      if (s.entryStart !== null) {
        s.entryProgress = Math.min((timestamp - s.entryStart) / 900, 1);
        if (s.entryProgress >= 1) s.entryStart = null;
      }

      ctx.fillStyle = '#0d1420';
      ctx.fillRect(0, 0, W, H);

      // Background particles (chart area only)
      s.bgParticles.forEach(p => {
        p.x = (p.x + p.vx + chartW) % chartW;
        p.y = (p.y + p.vy + H) % H;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(245,158,11,${p.alpha})`;
        ctx.fill();
      });

      // Axes
      ctx.strokeStyle = '#1e2d42';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(originX, originY);
      ctx.lineTo(chartW, originY);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(originX, 10);
      ctx.lineTo(originX, originY);
      ctx.stroke();

      ctx.fillStyle = '#94a3b8';
      ctx.font = '11px Inter, system-ui';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'alphabetic';
      ctx.fillText('Número atómico Z', originX + (chartW - originX) / 2, H - 6);
      ctx.save();
      ctx.translate(14, originY - (chartH - 20) / 2);
      ctx.rotate(-Math.PI / 2);
      ctx.fillText('√f  (Hz½)', 0, 0);
      ctx.restore();

      // Moseley theoretical line
      ctx.beginPath();
      for (let Z = zMin; Z <= zMax; Z += 0.5) {
        const x = toCanvasX(Z);
        const y = toCanvasY(sqrtKAlphaFrequency(Z));
        Z === zMin ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.strokeStyle = 'rgba(245,158,11,0.3)';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 3]);
      ctx.stroke();
      ctx.setLineDash([]);

      // Data points with cascade entry
      ELEMENTS_DATA.forEach((el, idx) => {
        const isSelected = idx === s.targetElementIndex;
        const cascadeThresh = (idx / ELEMENTS_DATA.length) * 0.78;
        if (s.entryProgress < cascadeThresh && s.entryStart !== null) return;

        let x = toCanvasX(el.Z);
        let y = toCanvasY(el.sqrtFrequency);

        // Animate selected point from previous position
        if (isSelected && s.pointStart !== null) {
          const prevEl = ELEMENTS_DATA[s.prevElementIndex];
          if (prevEl) {
            const px = toCanvasX(prevEl.Z);
            const py = toCanvasY(prevEl.sqrtFrequency);
            x = px + (x - px) * easedPoint;
            y = py + (y - py) * easedPoint;
          }
        }

        ctx.beginPath();
        ctx.arc(x, y, isSelected ? 7 : 4, 0, Math.PI * 2);
        ctx.fillStyle = isSelected ? '#f59e0b' : '#4a9eff';
        ctx.globalAlpha = isSelected ? 1 : 0.72;
        ctx.fill();
        ctx.globalAlpha = 1;

        if (isSelected) {
          const glowAlpha = 0.28 + 0.2 * Math.sin(s.flashT);
          ctx.beginPath();
          ctx.arc(x, y, 13, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(245,158,11,${glowAlpha})`;
          ctx.lineWidth = 2.5;
          ctx.stroke();
          ctx.beginPath();
          ctx.arc(x, y, 7, 0, Math.PI * 2);
          ctx.strokeStyle = '#fff';
          ctx.lineWidth = 1.5;
          ctx.stroke();
        }

        ctx.fillStyle = isSelected ? '#f59e0b' : '#4a5568';
        ctx.font = `${isSelected ? 'bold ' : ''}10px Inter, system-ui`;
        ctx.textAlign = 'center';
        ctx.fillText(el.symbol, x, y - 10);
      });

      // X-axis ticks
      [11, 15, 20, 25, 30, 35, 40, 42].forEach(Z => {
        if (Z > zMax) return;
        const x = toCanvasX(Z);
        ctx.beginPath();
        ctx.moveTo(x, originY);
        ctx.lineTo(x, originY + 4);
        ctx.strokeStyle = '#4a5568';
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.fillStyle = '#4a5568';
        ctx.font = '9px Inter, system-ui';
        ctx.textAlign = 'center';
        ctx.fillText(Z, x, originY + 13);
      });

      // Right panel — atomic layers
      const panelX = chartW + 10;
      const panelW = W - panelX - 10;
      const panelCX = panelX + panelW / 2;
      const panelCY = 100;

      ctx.fillStyle = '#111827';
      ctx.fillRect(panelX, 10, panelW, 200);
      ctx.strokeStyle = '#1e2d42';
      ctx.lineWidth = 1;
      ctx.strokeRect(panelX, 10, panelW, 200);

      ctx.fillStyle = '#94a3b8';
      ctx.font = '10px Inter, system-ui';
      ctx.textAlign = 'center';
      ctx.fillText('Transición K-α', panelCX, 26);

      const radii = { K: 28, L: 50, M: 70 };
      const layerColors = { K: '#f59e0b', L: '#4a9eff', M: '#7c3aed' };

      Object.entries(radii).forEach(([layer, r]) => {
        ctx.beginPath();
        ctx.arc(panelCX, panelCY + 20, r, 0, Math.PI * 2);
        ctx.strokeStyle = layerColors[layer];
        ctx.lineWidth = 1;
        ctx.globalAlpha = 0.4;
        ctx.stroke();
        ctx.globalAlpha = 1;
        ctx.fillStyle = layerColors[layer];
        ctx.font = '10px Inter, system-ui';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(layer, panelCX + r + 8, panelCY + 20);
      });
      ctx.textBaseline = 'alphabetic';

      // Nucleus
      ctx.beginPath();
      ctx.arc(panelCX, panelCY + 20, 8, 0, Math.PI * 2);
      ctx.fillStyle = '#ef4444';
      ctx.fill();
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 8px Inter, system-ui';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(s.selectedElement?.symbol || '', panelCX, panelCY + 20);
      ctx.textBaseline = 'alphabetic';

      // Orbiting electrons
      const layerKeys = ['K', 'L', 'M'];
      layerKeys.forEach((layer, i) => {
        const r = radii[layer];
        const ex = panelCX + r * Math.cos(s.orbitAngles[i]);
        const ey = panelCY + 20 + r * Math.sin(s.orbitAngles[i]);
        ctx.beginPath();
        ctx.arc(ex, ey, 4, 0, Math.PI * 2);
        ctx.fillStyle = layerColors[layer];
        ctx.fill();
      });

      // K-alpha transition flash (periodic)
      const flashCycle = s.flashT % (Math.PI * 5);
      const flashAlpha = flashCycle < Math.PI ? Math.sin(flashCycle) * 0.85 : 0;

      if (flashAlpha > 0.05) {
        const lX = panelCX + radii.L * Math.cos(s.orbitAngles[1]);
        const lY = panelCY + 20 + radii.L * Math.sin(s.orbitAngles[1]);
        const kX = panelCX + radii.K * Math.cos(s.orbitAngles[0] + Math.PI);
        const kY = panelCY + 20 + radii.K * Math.sin(s.orbitAngles[0] + Math.PI);

        ctx.beginPath();
        ctx.moveTo(lX, lY);
        ctx.lineTo(kX, kY);
        ctx.strokeStyle = `rgba(245,158,11,${flashAlpha})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(kX, kY, 6 * flashAlpha, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(245,158,11,${flashAlpha * 0.45})`;
        ctx.fill();
      }

      // Info text
      if (s.selectedElement) {
        ctx.fillStyle = '#f59e0b';
        ctx.font = '10px Inter, system-ui';
        ctx.textAlign = 'center';
        ctx.fillText(`${s.selectedElement.E_eV?.toFixed(0) || ''} eV`, panelCX, panelCY + 115);
        ctx.fillStyle = '#94a3b8';
        ctx.font = '9px Inter, system-ui';
        ctx.fillText(`Z = ${s.selectedElement.Z}`, panelCX, panelCY + 130);
        ctx.fillText(`${s.selectedElement.lambda_nm?.toFixed(3) || ''} nm`, panelCX, panelCY + 143);
      }

      animRef.current = requestAnimationFrame(draw);
    };

    animRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animRef.current);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      width={520}
      height={310}
      style={{ width: '100%', maxWidth: 520, height: 'auto', borderRadius: 6, border: '1px solid var(--border-color)' }}
    />
  );
}
