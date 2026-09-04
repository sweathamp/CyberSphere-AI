import React, { useEffect, useRef } from 'react';

interface CyberSphereVisualProps {
  size?: 'sm' | 'md' | 'lg' | 'hero';
  interactive?: boolean;
  statusText?: string;
  activeAgent?: string;
}

export const CyberSphereVisual: React.FC<CyberSphereVisualProps> = ({
  size = 'hero',
  interactive = true,
  statusText = 'AI SECURITY CORE ONLINE',
  activeAgent,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const dimension =
    size === 'hero' ? 440 : size === 'lg' ? 340 : size === 'md' ? 240 : 160;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let angle = 0;

    // Node network points
    const numPoints = 28;
    const points: Array<{ x: number; y: number; z: number; ox: number; oy: number; oz: number; pulse: number }> = [];
    const radius = dimension * 0.36;

    for (let i = 0; i < numPoints; i++) {
      const theta = Math.acos(2 * Math.random() - 1);
      const phi = Math.sqrt(numPoints * Math.PI) * theta;
      const x = radius * Math.sin(theta) * Math.cos(phi);
      const y = radius * Math.sin(theta) * Math.sin(phi);
      const z = radius * Math.cos(theta);
      points.push({ x, y, z, ox: x, oy: y, oz: z, pulse: Math.random() * Math.PI * 2 });
    }

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const cx = canvas.width / 2;
      const cy = canvas.height / 2;

      angle += 0.009;

      // 1. Ambient Glow Core
      const glowGrad = ctx.createRadialGradient(cx, cy, 10, cx, cy, radius * 1.3);
      glowGrad.addColorStop(0, 'rgba(6, 182, 212, 0.45)');
      glowGrad.addColorStop(0.3, 'rgba(37, 99, 235, 0.25)');
      glowGrad.addColorStop(0.65, 'rgba(139, 92, 246, 0.12)');
      glowGrad.addColorStop(1, 'rgba(5, 7, 17, 0)');
      ctx.fillStyle = glowGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, radius * 1.3, 0, Math.PI * 2);
      ctx.fill();

      // 2. Rotating Orbital Rings
      const ringConfigs = [
        { rad: radius * 1.08, tilt: 0.5, speed: 0.8, color: 'rgba(34, 211, 238, 0.45)', dash: [6, 8] },
        { rad: radius * 0.88, tilt: -0.65, speed: -1.1, color: 'rgba(59, 130, 246, 0.4)', dash: [10, 14] },
        { rad: radius * 1.22, tilt: 1.1, speed: 0.6, color: 'rgba(168, 85, 247, 0.35)', dash: [4, 12] },
      ];

      ringConfigs.forEach((ring) => {
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(angle * ring.speed);
        ctx.scale(1, Math.cos(ring.tilt));
        ctx.strokeStyle = ring.color;
        ctx.lineWidth = 1.4;
        ctx.setLineDash(ring.dash);
        ctx.beginPath();
        ctx.arc(0, 0, ring.rad, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      });

      // 3. Central Neural Sphere Nodes & Connections
      const rotatedPoints = points.map((p) => {
        p.pulse += 0.03;
        // Rotation around Y and X axis
        const cosY = Math.cos(angle);
        const sinY = Math.sin(angle);
        const cosX = Math.cos(angle * 0.5);
        const sinX = Math.sin(angle * 0.5);

        // rotate around Y
        let x1 = p.ox * cosY + p.oz * sinY;
        let z1 = -p.ox * sinY + p.oz * cosY;

        // rotate around X
        let y1 = p.oy * cosX - z1 * sinX;
        let z2 = p.oy * sinX + z1 * cosX;

        const scale = (z2 + radius * 1.8) / (radius * 2.8);
        return {
          px: cx + x1 * scale,
          py: cy + y1 * scale,
          pz: z2,
          scale: Math.max(0.2, scale),
          pulse: p.pulse,
        };
      });

      // Draw connection lines between near nodes
      ctx.lineWidth = 0.75;
      for (let i = 0; i < rotatedPoints.length; i++) {
        for (let j = i + 1; j < rotatedPoints.length; j++) {
          const p1 = rotatedPoints[i];
          const p2 = rotatedPoints[j];
          const dist = Math.hypot(p1.px - p2.px, p1.py - p2.py);
          if (dist < radius * 0.75) {
            const alpha = (1 - dist / (radius * 0.75)) * 0.35 * Math.min(p1.scale, p2.scale);
            ctx.strokeStyle = `rgba(34, 211, 238, ${alpha})`;
            ctx.beginPath();
            ctx.moveTo(p1.px, p1.py);
            ctx.lineTo(p2.px, p2.py);
            ctx.stroke();
          }
        }
      }

      // Draw nodes
      rotatedPoints.forEach((p) => {
        const glow = Math.sin(p.pulse) * 0.5 + 0.5;
        const nodeRad = (2.2 + glow * 1.8) * p.scale;
        const alpha = Math.min(1, 0.4 + p.scale * 0.5);

        ctx.fillStyle = `rgba(34, 211, 238, ${alpha})`;
        ctx.beginPath();
        ctx.arc(p.px, p.py, nodeRad, 0, Math.PI * 2);
        ctx.fill();

        // Highlighting core node
        if (p.scale > 0.8) {
          ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.8})`;
          ctx.beginPath();
          ctx.arc(p.px, p.py, nodeRad * 0.45, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      // 4. Central Solid Shield Core
      const coreGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius * 0.35);
      coreGrad.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
      coreGrad.addColorStop(0.2, 'rgba(34, 211, 238, 0.8)');
      coreGrad.addColorStop(0.55, 'rgba(37, 99, 235, 0.5)');
      coreGrad.addColorStop(1, 'rgba(15, 23, 42, 0)');

      ctx.fillStyle = coreGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, radius * 0.38, 0, Math.PI * 2);
      ctx.fill();

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [dimension]);

  return (
    <div className="relative flex flex-col items-center justify-center select-none">
      {/* Background ambient pulse */}
      <div
        className="absolute rounded-full bg-cyan-500/10 blur-3xl animate-pulse-slow pointer-events-none"
        style={{
          width: dimension * 1.15,
          height: dimension * 1.15,
        }}
      />
      <div
        className="absolute rounded-full bg-blue-600/10 blur-2xl pointer-events-none"
        style={{
          width: dimension * 0.85,
          height: dimension * 0.85,
        }}
      />

      {/* Main Canvas Sphere */}
      <canvas
        ref={canvasRef}
        width={dimension}
        height={dimension}
        className={`relative z-10 ${interactive ? 'cursor-pointer transition-transform duration-500 hover:scale-105' : ''}`}
      />

      {/* Status Overlay Badge */}
      {statusText && (
        <div className="relative z-20 mt-3 inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-900/80 border border-cyan-500/30 text-[11px] font-mono tracking-wider text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.25)] backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          <span className="w-2 h-2 rounded-full bg-cyan-400 absolute left-3.5" />
          <span>{activeAgent ? `${activeAgent.toUpperCase()} ACTIVE` : statusText}</span>
        </div>
      )}
    </div>
  );
};
