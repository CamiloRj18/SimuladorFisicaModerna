import { useRef, useEffect } from 'react';

function drawWave(ctx, x1, y1, x2, y2, color, cycles, phase, amp) {
  const len = Math.hypot(x2 - x1, y2 - y1);
  if (len < 1) return;
  const dx = (x2 - x1) / len;
  const dy = (y2 - y1) / len;
  const nx = -dy;
  const ny = dx;

  ctx.beginPath();
  const steps = Math.ceil(len / 1.5);
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const lx = x1 + dx * len * t;
    const ly = y1 + dy * len * t;
    const wave = Math.sin(t * Math.PI * 2 * cycles + phase) * amp;
    i === 0 ? ctx.moveTo(lx + nx * wave, ly + ny * wave)
            : ctx.lineTo(lx + nx * wave, ly + ny * wave);
  }
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.stroke();

  // Arrow head
  const angle = Math.atan2(dy, dx);
  ctx.beginPath();
  ctx.moveTo(x2, y2);
  ctx.lineTo(x2 - 10 * Math.cos(angle - 0.4), y2 - 10 * Math.sin(angle - 0.4));
  ctx.lineTo(x2 - 10 * Math.cos(angle + 0.4), y2 - 10 * Math.sin(angle + 0.4));
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.fill();
}

function spawnParticles(cx, cy) {
  return Array.from({ length: 14 }, () => {
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 2.2 + 0.4;
    return {
      x: cx, y: cy,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      r: Math.random() * 2 + 0.8,
      life: 1,
    };
  });
}

export default function ComptonCanvas({ theta, results }) {
  const canvasRef = useRef(null);
  const animRef = useRef(null);
  const stateRef = useRef(null);

  if (!stateRef.current) {
    stateRef.current = {
      phase: 0,
      pulseT: 0,
      displayTheta: theta,
      prevTheta: theta,
      targetTheta: theta,
      thetaStart: null,
      particles: [],
      bgParticles: [],
      results,
    };
  }

  // Sync props into stateRef
  useEffect(() => {
    const s = stateRef.current;
    s.results = results;
    if (theta !== s.targetTheta) {
      s.prevTheta = s.displayTheta;
      s.targetTheta = theta;
      s.thetaStart = performance.now();
      const canvas = canvasRef.current;
      if (canvas) {
        s.particles.push(...spawnParticles(canvas.width / 2, canvas.height / 2));
      }
    }
  }, [theta, results]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.width;
    const H = canvas.height;
    const s = stateRef.current;

    s.bgParticles = Array.from({ length: 24 }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.14,
      vy: (Math.random() - 0.5) * 0.14,
      r: Math.random() * 1.1 + 0.3,
      alpha: Math.random() * 0.22 + 0.04,
    }));

    const draw = (timestamp) => {
      s.phase += 0.065;
      s.pulseT += 0.045;

      if (s.thetaStart !== null) {
        const t = Math.min((timestamp - s.thetaStart) / 380, 1);
        s.displayTheta = s.prevTheta + (s.targetTheta - s.prevTheta) * (1 - Math.pow(1 - t, 3));
        if (t >= 1) s.thetaStart = null;
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

      const cx = W / 2;
      const cy = H / 2;
      const thetaRad = (s.displayTheta * Math.PI) / 180;
      const cyclesIn = Math.max(3, Math.min(12, 500 / s.results.lambda0_pm));
      const cyclesOut = Math.max(3, Math.min(12, 500 / s.results.lambdaPrime_pm));

      // Incident photon traveling left to right
      drawWave(ctx, 30, cy, cx - 25, cy, '#4a9eff', cyclesIn, s.phase, 8);

      // Electron at rest — pulsing
      const pulseR = 14 + Math.sin(s.pulseT) * 2.2;
      ctx.beginPath();
      ctx.arc(cx, cy, pulseR + 5, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(74,158,255,${0.15 + Math.sin(s.pulseT) * 0.12})`;
      ctx.lineWidth = 3;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(cx, cy, pulseR, 0, Math.PI * 2);
      ctx.fillStyle = '#1a2235';
      ctx.fill();
      ctx.strokeStyle = '#4a9eff';
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.fillStyle = '#e2e8f0';
      ctx.font = '11px Inter, system-ui';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('e⁻', cx, cy);
      ctx.textBaseline = 'alphabetic';

      // Scattered electron
      const eAngle = s.displayTheta / 180 * Math.PI / 2 + Math.PI / 2;
      const eX = cx + 60 * Math.cos(eAngle);
      const eY = cy + 60 * Math.sin(eAngle);

      ctx.beginPath();
      ctx.arc(eX, eY, 10, 0, Math.PI * 2);
      ctx.fillStyle = '#10b981';
      ctx.globalAlpha = 0.75;
      ctx.fill();
      ctx.globalAlpha = 1;
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.fillStyle = '#10b981';
      ctx.font = '10px Inter, system-ui';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('e⁻', eX, eY);
      ctx.textBaseline = 'alphabetic';

      ctx.beginPath();
      ctx.moveTo(cx + 16 * Math.cos(eAngle), cy + 16 * Math.sin(eAngle));
      ctx.lineTo(eX - 12 * Math.cos(eAngle), eY - 12 * Math.sin(eAngle));
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 1;
      ctx.setLineDash([3, 3]);
      ctx.stroke();
      ctx.setLineDash([]);

      // Scattered photon
      const scatX = cx + 120 * Math.cos(thetaRad);
      const scatY = cy - 120 * Math.sin(thetaRad);
      drawWave(ctx, cx + 16, cy, scatX, scatY, '#00d4ff', cyclesOut, s.phase + Math.PI, 8);

      // Theta arc label
      if (s.displayTheta > 5) {
        ctx.beginPath();
        ctx.arc(cx, cy, 40, -thetaRad, 0, thetaRad > 0);
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 1;
        ctx.setLineDash([2, 3]);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.fillStyle = '#f59e0b';
        ctx.font = '12px Inter, system-ui';
        ctx.textAlign = 'left';
        const midAngle = -thetaRad / 2;
        ctx.fillText('θ', cx + 44 * Math.cos(midAngle), cy + 44 * Math.sin(midAngle));
      }

      // Reference line
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + 120, cy);
      ctx.strokeStyle = '#1e2d42';
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);
      ctx.stroke();
      ctx.setLineDash([]);

      // Photon labels
      ctx.fillStyle = '#4a9eff';
      ctx.font = '11px Inter, system-ui';
      ctx.textAlign = 'center';
      ctx.fillText('λ₀', 90, cy - 18);
      ctx.fillStyle = '#00d4ff';
      ctx.fillText("λ'", cx + 60 * Math.cos(thetaRad) + 14, cy - 60 * Math.sin(thetaRad) - 8);

      // Collision particles
      s.particles = s.particles.filter(p => p.life > 0);
      s.particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.04;
        p.life -= 0.022;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(16,185,129,${p.life.toFixed(2)})`;
        ctx.fill();
      });

      animRef.current = requestAnimationFrame(draw);
    };

    animRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animRef.current);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      width={500}
      height={300}
      style={{ width: '100%', maxWidth: 500, borderRadius: 6, border: '1px solid var(--border-color)' }}
    />
  );
}
