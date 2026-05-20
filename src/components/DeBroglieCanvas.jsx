import { useRef, useEffect } from 'react';

function lambdaToT(lambda_pm) {
  const logMin = Math.log10(0.001);
  const logMax = Math.log10(10000);
  const logL = Math.log10(Math.max(0.001, lambda_pm));
  return Math.max(0, Math.min(1, 1 - (logL - logMin) / (logMax - logMin)));
}

export default function DeBroglieCanvas({ beta, lambda_pm, particleLabel }) {
  const canvasRef = useRef(null);
  const animRef = useRef(null);
  const stateRef = useRef(null);

  if (!stateRef.current) {
    const t0 = lambdaToT(lambda_pm);
    stateRef.current = {
      phase: 0,
      beta,
      particleLabel,
      displayCycles: 1 + t0 * 11,
      prevCycles: 1 + t0 * 11,
      targetCycles: 1 + t0 * 11,
      displayBar: t0,
      prevBar: t0,
      targetBar: t0,
      cyclesStart: null,
      bgParticles: [],
    };
  }

  useEffect(() => {
    const s = stateRef.current;
    s.beta = beta;
    s.particleLabel = particleLabel;
    const t = lambdaToT(lambda_pm);
    const newCycles = 1 + t * 11;
    const newBar = Math.max(0.01, t);
    if (Math.abs(newCycles - s.targetCycles) > 0.05) {
      s.prevCycles = s.displayCycles;
      s.prevBar = s.displayBar;
      s.targetCycles = newCycles;
      s.targetBar = newBar;
      s.cyclesStart = performance.now();
    } else {
      s.targetCycles = newCycles;
      s.targetBar = newBar;
    }
  }, [beta, lambda_pm, particleLabel]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.width;
    const H = canvas.height;
    const s = stateRef.current;

    s.bgParticles = Array.from({ length: 22 }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.11,
      vy: (Math.random() - 0.5) * 0.11,
      r: Math.random() * 1.0 + 0.3,
      alpha: Math.random() * 0.18 + 0.05,
    }));

    const draw = (timestamp) => {
      const isLight = document.documentElement.getAttribute('data-theme') === 'light';
      const C = {
        bg:       isLight ? '#f0f4f8' : '#0f172a',
        bgPx:     isLight ? '99,102,241' : '124,58,237',
        axis:     isLight ? '#d1d5db'  : '#1e3a5f',
        envelope: isLight ? 'rgba(109,40,217,0.2)' : 'rgba(124,58,237,0.18)',
        wave:     isLight ? '#6d28d9'  : '#7c3aed',
        pFill:    isLight ? '#6d28d9'  : '#7c3aed',
        pStroke:  isLight ? '#8b5cf6'  : '#a78bfa',
        pText:    isLight ? '#111827'  : '#e2e8f0',
        barBg:    isLight ? '#e2e8f0'  : '#111827',
        barBord:  isLight ? '#d1d5db'  : '#1e3a5f',
        barFill:  isLight ? '#6d28d9'  : '#7c3aed',
        label:    isLight ? '#6b7280'  : '#94a3b8',
        betaLbl:  isLight ? '#1e40af'  : '#4a9eff',
      };

      s.phase += 0.055;

      // Animate cycles/bar transition
      if (s.cyclesStart !== null) {
        const t = Math.min((timestamp - s.cyclesStart) / 480, 1);
        const eased = 1 - Math.pow(1 - t, 3);
        s.displayCycles = s.prevCycles + (s.targetCycles - s.prevCycles) * eased;
        s.displayBar = s.prevBar + (s.targetBar - s.prevBar) * eased;
        if (t >= 1) {
          s.cyclesStart = null;
          s.displayCycles = s.targetCycles;
          s.displayBar = s.targetBar;
        }
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

      const midY = H / 2 - 30;
      const amp = 28;

      // Center axis
      ctx.beginPath();
      ctx.moveTo(20, midY);
      ctx.lineTo(W - 20, midY);
      ctx.strokeStyle = C.axis;
      ctx.lineWidth = 1;
      ctx.stroke();

      // Gaussian envelopes
      for (const sign of [-1, 1]) {
        ctx.beginPath();
        for (let x = 20; x <= W - 20; x++) {
          const nx = (x - W / 2) / (W / 4);
          const env = amp * 1.2 * Math.exp(-nx * nx * 1.5);
          const y = midY - sign * env;
          x === 20 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.strokeStyle = C.envelope;
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 4]);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // Traveling wave
      ctx.beginPath();
      for (let x = 20; x <= W - 20; x++) {
        const tx = (x - 20) / (W - 40);
        const y = midY - amp * Math.sin(tx * Math.PI * 2 * s.displayCycles + s.phase);
        x === 20 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.strokeStyle = C.wave;
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // Particle oscillating on the wave
      const px = W / 2;
      const waveY = midY - amp * Math.sin(Math.PI * s.displayCycles + s.phase) * 0.82;

      ctx.beginPath();
      ctx.arc(px, waveY, 10, 0, Math.PI * 2);
      ctx.fillStyle = C.pFill;
      ctx.globalAlpha = 0.9;
      ctx.fill();
      ctx.globalAlpha = 1;
      ctx.strokeStyle = C.pStroke;
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.fillStyle = C.pText;
      ctx.font = 'bold 10px system-ui';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(s.particleLabel, px, waveY);
      ctx.textBaseline = 'alphabetic';

      // Lambda bar
      const barY = H - 40;
      const barW = W - 60;
      const barX = 30;

      ctx.fillStyle = C.barBg;
      ctx.fillRect(barX, barY - 10, barW, 20);
      ctx.strokeStyle = C.barBord;
      ctx.lineWidth = 1;
      ctx.strokeRect(barX, barY - 10, barW, 20);

      const segLen = Math.min(barW, Math.max(4, s.displayBar * barW));
      ctx.fillStyle = C.barFill;
      ctx.globalAlpha = 0.7;
      ctx.fillRect(barX, barY - 10, segLen, 20);
      ctx.globalAlpha = 1;

      ctx.fillStyle = C.label;
      ctx.font = '10px system-ui';
      ctx.textAlign = 'left';
      ctx.fillText('λ relativa', barX, barY - 16);

      ctx.fillStyle = C.betaLbl;
      ctx.font = '12px system-ui';
      ctx.textAlign = 'center';
      ctx.fillText(`β = ${s.beta.toFixed(3)}c`, W / 2, H - 12);

      animRef.current = requestAnimationFrame(draw);
    };

    animRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animRef.current);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      width={500}
      height={260}
      style={{ width: '100%', maxWidth: 500, height: 'auto', borderRadius: 6, border: '1px solid var(--border-color)' }}
    />
  );
}
