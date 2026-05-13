import { useRef, useEffect } from 'react';
import { ENERGY_LEVELS, BALMER_LINES } from '../physics/hidrogeno.js';

const SERIES_COLORS = {
  lyman:   '#7c3aed',
  balmer:  '#4a9eff',
  paschen: '#f59e0b',
};

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

    const E_min = -14;
    const E_max = 0.5;
    const marginTop = 20;
    const marginBottom = 30;
    const chartH = H - marginTop - marginBottom;
    const leftX = 80;
    const rightX = W - 20;

    const energyToY = (eV) => {
      const t = (eV - E_min) / (E_max - E_min);
      return marginTop + chartH * (1 - t);
    };

    const draw = (timestamp) => {
      s.glowT += 0.035;
      s.photonPhase += 0.09;

      // Animate arrow
      if (s.arrowStart !== null) {
        s.arrowProgress = Math.min((timestamp - s.arrowStart) / 650, 1);
        if (s.arrowProgress >= 1) {
          s.arrowStart = null;
          s.photonActive = true;
          s.photonX = leftX + 40;
        }
      }

      // Animate photon wave moving right
      if (s.photonActive) {
        s.photonX += 2.8;
        if (s.photonX > rightX + 50) s.photonActive = false;
      }

      ctx.fillStyle = '#0d1420';
      ctx.fillRect(0, 0, W, H);

      // Background particles
      s.bgParticles.forEach(p => {
        p.x = (p.x + p.vx + W) % W;
        p.y = (p.y + p.vy + H) % H;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(74,158,255,${p.alpha})`;
        ctx.fill();
      });

      // Energy level lines
      ENERGY_LEVELS.forEach(({ n, energy_eV }) => {
        const y = energyToY(energy_eV);
        const isNF = n === s.nf;
        const isNI = s.transition && n === s.selectedNi;

        // Glow halo on active levels
        if (isNF || isNI) {
          const glowAlpha = 0.18 + 0.12 * Math.sin(s.glowT + n * 1.3);
          ctx.beginPath();
          ctx.moveTo(leftX, y);
          ctx.lineTo(rightX, y);
          ctx.strokeStyle = isNF ? `rgba(74,158,255,${glowAlpha * 2.2})` : `rgba(74,158,255,${glowAlpha})`;
          ctx.lineWidth = 7;
          ctx.stroke();
        }

        ctx.beginPath();
        ctx.moveTo(leftX, y);
        ctx.lineTo(rightX, y);
        ctx.strokeStyle = isNF ? '#4a9eff' : '#1e2d42';
        ctx.lineWidth = isNF ? 2 : 1;
        ctx.stroke();

        ctx.fillStyle = isNF ? '#4a9eff' : '#94a3b8';
        ctx.font = `${isNF ? 'bold ' : ''}12px Inter, system-ui`;
        ctx.textAlign = 'right';
        ctx.textBaseline = 'middle';
        ctx.fillText(`n=${n}`, leftX - 6, y);

        ctx.fillStyle = '#4a5568';
        ctx.font = '10px Inter, system-ui';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'alphabetic';
        ctx.fillText(`${energy_eV.toFixed(2)} eV`, rightX - 55, y - 8);
      });

      // Ionization line
      const ionY = energyToY(0);
      ctx.beginPath();
      ctx.moveTo(leftX, ionY);
      ctx.lineTo(rightX, ionY);
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = '#10b981';
      ctx.font = '10px Inter, system-ui';
      ctx.textAlign = 'right';
      ctx.fillText('Ionización 0 eV', leftX - 6, ionY - 3);

      // Transition arrow (animated from ni to nf)
      if (s.transition && s.selectedNi > s.nf) {
        const y_ni = energyToY(ENERGY_LEVELS[s.selectedNi - 1].energy_eV);
        const y_nf = energyToY(ENERGY_LEVELS[s.nf - 1].energy_eV);
        const arrowX = leftX + 40;
        const color = SERIES_COLORS[s.activeSeries] || '#4a9eff';
        const currentEnd = y_ni + (y_nf - y_ni) * s.arrowProgress;

        ctx.beginPath();
        ctx.moveTo(arrowX, y_ni);
        ctx.lineTo(arrowX, currentEnd);
        ctx.strokeStyle = color;
        ctx.lineWidth = 2.5;
        ctx.stroke();

        if (s.arrowProgress >= 1) {
          // Arrow head
          ctx.beginPath();
          ctx.moveTo(arrowX, y_nf);
          ctx.lineTo(arrowX - 7, y_nf + 14);
          ctx.lineTo(arrowX + 7, y_nf + 14);
          ctx.closePath();
          ctx.fillStyle = color;
          ctx.fill();

          // Wavelength label
          ctx.fillStyle = color;
          ctx.font = 'bold 11px Inter, system-ui';
          ctx.textAlign = 'left';
          ctx.textBaseline = 'middle';
          ctx.fillText(`${s.transition.lambda_nm.toFixed(1)} nm`, arrowX + 10, (y_ni + y_nf) / 2);
          ctx.textBaseline = 'alphabetic';
        }
      }

      // Emitted photon wave
      if (s.photonActive && s.transition) {
        const y_nf = energyToY(ENERGY_LEVELS[s.nf - 1].energy_eV);
        const color = s.transition.color || SERIES_COLORS[s.activeSeries] || '#4a9eff';
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
          // Glow halo on selected spectral line
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
        ctx.font = '9px Inter, system-ui';
        ctx.textAlign = 'center';
        ctx.fillText(line.name, lx, specY - 4);
      });

      ctx.fillStyle = '#4a5568';
      ctx.font = '9px Inter, system-ui';
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
      style={{ width: '100%', maxWidth: 480, borderRadius: 6, border: '1px solid var(--border-color)' }}
    />
  );
}
