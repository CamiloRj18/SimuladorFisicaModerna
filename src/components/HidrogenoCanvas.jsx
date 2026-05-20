import { useRef, useEffect } from 'react';
import { ENERGY_LEVELS, BALMER_LINES } from '../physics/hidrogeno.js';

const SERIES_COLORS = {
  lyman:   '#7c3aed',
  balmer:  '#4a9eff',
  paschen: '#f59e0b',
};

const MARGIN_TOP = 20;
const MARGIN_BOTTOM = 30;
const E_MIN = -14;
const E_MAX = 0.5;
const MIN_SPACING = 42;

function computeLevelYPositions(H) {
  const chartH = H - MARGIN_TOP - MARGIN_BOTTOM;
  const linearY = (eV) => {
    const t = (eV - E_MIN) / (E_MAX - E_MIN);
    return MARGIN_TOP + chartH * (1 - t);
  };

  // Compute linear positions then enforce minimum spacing top-down
  const levels = ENERGY_LEVELS.map(l => ({ n: l.n, energy_eV: l.energy_eV, y: linearY(l.energy_eV) }));
  levels.sort((a, b) => a.y - b.y); // ascending Y = top of chart first (high energy)

  for (let i = 1; i < levels.length; i++) {
    if (levels[i].y - levels[i - 1].y < MIN_SPACING) {
      levels[i].y = levels[i - 1].y + MIN_SPACING;
    }
  }

  const map = {};
  levels.forEach(l => { map[l.n] = l.y; });
  return map;
}

function linearEnergyToY(eV, H) {
  const chartH = H - MARGIN_TOP - MARGIN_BOTTOM;
  const t = (eV - E_MIN) / (E_MAX - E_MIN);
  return MARGIN_TOP + chartH * (1 - t);
}

export default function HidrogenoCanvas({ activeSeries, selectedNi, nf, transition }) {
  const canvasRef = useRef(null);
  const animRef = useRef(null);
  const stateRef = useRef(null);

  if (!stateRef.current) {
    stateRef.current = {
      activeSeries,
      selectedNi,
      nf,
      transition,
      arrowProgress: 0,
      arrowStart: null,
      photonPhase: 0,
      photonActive: false,
      photonX: 0,
      glowT: 0,
      bgParticles: [],
    };
  }

  useEffect(() => {
    const s = stateRef.current;
    const changed = selectedNi !== s.selectedNi || nf !== s.nf || activeSeries !== s.activeSeries;
    s.activeSeries = activeSeries;
    s.selectedNi = selectedNi;
    s.nf = nf;
    s.transition = transition;
    if (changed && transition) {
      s.arrowProgress = 0;
      s.arrowStart = performance.now();
      s.photonActive = false;
      s.photonX = 0;
    }
  }, [activeSeries, selectedNi, nf, transition]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.width;
    const H = canvas.height;
    const s = stateRef.current;

    s.bgParticles = Array.from({ length: 18 }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.09,
      vy: (Math.random() - 0.5) * 0.09,
      r: Math.random() * 1.1 + 0.3,
      alpha: Math.random() * 0.18 + 0.04,
    }));

    // Precompute stable Y positions with minimum spacing — computed once, not per frame
    const levelY = computeLevelYPositions(H);
    const leftX = 80;
    const rightX = W - 20;

    const draw = (timestamp) => {
      const isLight = document.documentElement.getAttribute('data-theme') === 'light';
      const C = {
        bg:        isLight ? '#f0f4f8' : '#0f172a',
        bgPx:      isLight ? '30,64,175' : '74,158,255',
        levelDim:  isLight ? '#e2e8f0'  : '#1e3a5f',
        levelHi:   isLight ? '#1e40af'  : '#4a9eff',
        labelDim:  isLight ? '#6b7280'  : '#94a3b8',
        labelHi:   isLight ? '#1e40af'  : '#4a9eff',
        evLabel:   isLight ? '#9ca3af'  : '#4a5568',
        ionLine:   isLight ? '#059669'  : '#10b981',
        specLabel: isLight ? '#6b7280'  : '#4a5568',
      };

      s.glowT += 0.035;
      s.photonPhase += 0.09;

      if (s.arrowStart !== null) {
        s.arrowProgress = Math.min((timestamp - s.arrowStart) / 650, 1);
        if (s.arrowProgress >= 1) {
          s.arrowStart = null;
          s.photonActive = true;
          s.photonX = leftX + 40;
        }
      }

      if (s.photonActive) {
        s.photonX += 2.8;
        if (s.photonX > rightX + 50) s.photonActive = false;
      }

      ctx.fillStyle = C.bg;
      ctx.fillRect(0, 0, W, H);

      // Background particles
      s.bgParticles.forEach(p => {
        p.x = (p.x + p.vx + W) % W;
        p.y = (p.y + p.vy + H) % H;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${C.bgPx},${isLight ? (p.alpha * 0.3).toFixed(2) : p.alpha})`;
        ctx.fill();
      });

      // Energy level lines using adjusted positions
      ENERGY_LEVELS.forEach(({ n, energy_eV }) => {
        const y = levelY[n];
        const isNF = n === s.nf;
        const isNI = s.transition && n === s.selectedNi;

        if (isNF || isNI) {
          const glowAlpha = 0.18 + 0.12 * Math.sin(s.glowT + n * 1.3);
          ctx.beginPath();
          ctx.moveTo(leftX, y);
          ctx.lineTo(rightX, y);
          ctx.strokeStyle = isNF
            ? `rgba(${C.bgPx},${(glowAlpha * 2.2).toFixed(2)})`
            : `rgba(${C.bgPx},${glowAlpha.toFixed(2)})`;
          ctx.lineWidth = 7;
          ctx.stroke();
        }

        ctx.beginPath();
        ctx.moveTo(leftX, y);
        ctx.lineTo(rightX, y);
        ctx.strokeStyle = isNF ? C.levelHi : C.levelDim;
        ctx.lineWidth = isNF ? 2 : 1;
        ctx.stroke();

        ctx.fillStyle = isNF ? C.labelHi : C.labelDim;
        ctx.font = `${isNF ? 'bold ' : ''}12px system-ui`;
        ctx.textAlign = 'right';
        ctx.textBaseline = 'middle';
        ctx.fillText(`n=${n}`, leftX - 6, y);

        ctx.fillStyle = C.evLabel;
        ctx.font = '10px system-ui';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'alphabetic';
        ctx.fillText(`${energy_eV.toFixed(2)} eV`, rightX - 55, y - 8);
      });

      // Ionization line — at true linear position for E=0
      const ionY = linearEnergyToY(0, H);
      ctx.beginPath();
      ctx.moveTo(leftX, ionY);
      ctx.lineTo(rightX, ionY);
      ctx.strokeStyle = C.ionLine;
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = C.ionLine;
      ctx.font = '10px system-ui';
      ctx.textAlign = 'right';
      ctx.fillText('Ionización 0 eV', leftX - 6, ionY - 3);

      // Animated transition arrow (ni → nf)
      if (s.transition && s.selectedNi > s.nf) {
        const y_ni = levelY[s.selectedNi];
        const y_nf = levelY[s.nf];
        const arrowX = leftX + 40;
        const color = SERIES_COLORS[s.activeSeries] || C.levelHi;
        const currentEnd = y_ni + (y_nf - y_ni) * s.arrowProgress;

        ctx.beginPath();
        ctx.moveTo(arrowX, y_ni);
        ctx.lineTo(arrowX, currentEnd);
        ctx.strokeStyle = color;
        ctx.lineWidth = 2.5;
        ctx.stroke();

        if (s.arrowProgress >= 1) {
          ctx.beginPath();
          ctx.moveTo(arrowX, y_nf);
          ctx.lineTo(arrowX - 7, y_nf + 14);
          ctx.lineTo(arrowX + 7, y_nf + 14);
          ctx.closePath();
          ctx.fillStyle = color;
          ctx.fill();

          ctx.fillStyle = color;
          ctx.font = 'bold 11px system-ui';
          ctx.textAlign = 'left';
          ctx.textBaseline = 'middle';
          ctx.fillText(`${s.transition.lambda_nm.toFixed(1)} nm`, arrowX + 10, (y_ni + y_nf) / 2);
          ctx.textBaseline = 'alphabetic';
        }
      }

      // Emitted photon wave traveling right
      if (s.photonActive && s.transition) {
        const y_nf = levelY[s.nf];
        const color = s.transition.color || SERIES_COLORS[s.activeSeries] || C.levelHi;
        const waveLen = 18;
        const ampW = 5;
        const startX = leftX + 40;
        const endX = Math.min(s.photonX, rightX);

        ctx.beginPath();
        for (let x = startX; x <= endX; x++) {
          const waveY = y_nf + ampW * Math.sin(((x - startX) / waveLen) * Math.PI * 2 + s.photonPhase);
          x === startX ? ctx.moveTo(x, waveY) : ctx.lineTo(x, waveY);
        }
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.globalAlpha = 0.9;
        ctx.stroke();
        ctx.globalAlpha = 1;
      }

      // Balmer spectral bar
      const specY = H - 18;
      const specH = 12;
      const specX = leftX;
      const specW = rightX - leftX;

      ctx.fillStyle = '#000';
      ctx.fillRect(specX, specY, specW, specH);

      BALMER_LINES.forEach(line => {
        const tl = (line.nm - 380) / (700 - 380);
        const lx = specX + tl * specW;
        const isSelected = s.transition && Math.abs(s.transition.lambda_nm - line.nm) < 5;

        if (isSelected) {
          const gAlpha = 0.45 + 0.3 * Math.sin(s.glowT * 2.2);
          ctx.beginPath();
          ctx.moveTo(lx, specY - 2);
          ctx.lineTo(lx, specY + specH + 2);
          ctx.strokeStyle = line.color;
          ctx.lineWidth = 9;
          ctx.globalAlpha = gAlpha * 0.5;
          ctx.stroke();
          ctx.globalAlpha = 1;
        }

        ctx.beginPath();
        ctx.moveTo(lx, specY);
        ctx.lineTo(lx, specY + specH);
        ctx.strokeStyle = line.color;
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.fillStyle = line.color;
        ctx.font = '9px system-ui';
        ctx.textAlign = 'center';
        ctx.fillText(line.name, lx, specY - 4);
      });

      ctx.fillStyle = C.specLabel;
      ctx.font = '9px system-ui';
      ctx.textAlign = 'left';
      ctx.fillText('Serie Balmer — espectro visible', specX, specY - 14);

      animRef.current = requestAnimationFrame(draw);
    };

    animRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animRef.current);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      width={480}
      height={360}
      style={{ width: '100%', maxWidth: 480, height: 'auto', borderRadius: 6, border: '1px solid var(--border-color)' }}
    />
  );
}
