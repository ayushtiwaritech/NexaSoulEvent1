import React, { useEffect, useRef } from 'react';

export const CursedBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Particle pool for cursed energy motes
    const particleCount = prefersReducedMotion ? 0 : 38;
    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 2.5 + 1.2,
      vx: (Math.random() - 0.5) * 0.4,
      vy: -(Math.random() * 0.6 + 0.2), // gentle upward drift
      alpha: Math.random() * 0.5 + 0.2,
      dAlpha: (Math.random() * 0.01 + 0.005) * (Math.random() > 0.5 ? 1 : -1),
      // Cursed energy colors: violet, purple, cyan, subtle crimson
      color: [
        'rgba(168, 85, 247,', // Electric violet
        'rgba(124, 58, 237,', // Deep purple
        'rgba(0, 240, 255,',  // Cyan flame
        'rgba(244, 63, 94,',  // Subtle cursed crimson
      ][Math.floor(Math.random() * 4)],
    }));

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Render drifting cursed motes
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.alpha += p.dAlpha;

        if (p.alpha <= 0.1 || p.alpha >= 0.7) {
          p.dAlpha *= -1;
        }

        // Wrap around screen
        if (p.y < -10) {
          p.y = canvas.height + 10;
          p.x = Math.random() * canvas.width;
        }
        if (p.x < -10) p.x = canvas.width + 10;
        if (p.x > canvas.width + 10) p.x = -10;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color} ${p.alpha})`;
        ctx.shadowBlur = 8;
        ctx.shadowColor = p.color === 'rgba(0, 240, 255,' ? '#00f0ff' : '#a855f7';
        ctx.fill();
      }

      ctx.shadowBlur = 0;
      animationFrameId = requestAnimationFrame(render);
    };

    if (!prefersReducedMotion) {
      render();
    }

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="cursed-background-root" aria-hidden="true">
      {/* Deep Obsidian Canvas */}
      <canvas ref={canvasRef} className="cursed-canvas" />

      {/* Atmospheric Cursed Fog Orbs */}
      <div className="cursed-radial-fog fog-violet"></div>
      <div className="cursed-radial-fog fog-cyan"></div>
      <div className="cursed-radial-fog fog-crimson"></div>

      {/* Faint Sacred Cursed Sigil Watermark in Background */}
      <div className="faint-cursed-sigil">
        <svg viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="250" cy="250" r="230" stroke="currentColor" strokeWidth="1" strokeDasharray="6 6" />
          <circle cx="250" cy="250" r="190" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="250" cy="250" r="140" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" />
          <polygon points="250,60 415,345 85,345" stroke="currentColor" strokeWidth="1.2" />
          <polygon points="250,440 85,155 415,155" stroke="currentColor" strokeWidth="1.2" />
          <circle cx="250" cy="250" r="60" stroke="currentColor" strokeWidth="1.5" />
          <text x="250" y="260" textAnchor="middle" fill="currentColor" fontSize="28" fontFamily="serif" opacity="0.6">
            呪
          </text>
        </svg>
      </div>
    </div>
  );
};
