/**
 * Lightweight, high-performance confetti animation using HTML5 Canvas.
 * No external dependencies required.
 */

interface Particle {
  x: number;
  y: number;
  w: number;
  h: number;
  color: string;
  vx: number;
  vy: number;
  rotation: number;
  vRot: number;
  opacity: number;
  shape: 'rect' | 'circle' | 'ribbon';
}

const FESTIVE_COLORS = [
  '#0284c7', // Sky Blue
  '#10b981', // Emerald
  '#f59e0b', // Amber / Gold
  '#8b5cf6', // Violet
  '#ec4899', // Pink
  '#06b6d4', // Cyan
  '#f97316', // Orange
  '#14b8a6', // Teal
];

export const triggerConfetti = (options?: { particleCount?: number; originY?: number }) => {
  if (typeof window === 'undefined') return;

  const count = options?.particleCount || 90;
  const originY = options?.originY ?? 0.6; // Start slightly below mid-screen

  let canvas = document.getElementById('visa-confetti-canvas') as HTMLCanvasElement | null;
  if (!canvas) {
    canvas = document.createElement('canvas');
    canvas.id = 'visa-confetti-canvas';
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100vw';
    canvas.style.height = '100vh';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '99999';
    document.body.appendChild(canvas);
  }

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const width = (canvas.width = window.innerWidth);
  const height = (canvas.height = window.innerHeight);

  const particles: Particle[] = [];
  const startX = width / 2;
  const startY = height * originY;

  for (let i = 0; i < count; i++) {
    const angle = (Math.random() * Math.PI) + (Math.PI * 0.05); // Upward spray
    const speed = Math.random() * 14 + 8;
    const spread = (Math.random() - 0.5) * 16;
    const color = FESTIVE_COLORS[Math.floor(Math.random() * FESTIVE_COLORS.length)];
    const shapes: ('rect' | 'circle' | 'ribbon')[] = ['rect', 'circle', 'ribbon'];
    const shape = shapes[Math.floor(Math.random() * shapes.length)];

    particles.push({
      x: startX + (Math.random() - 0.5) * 60,
      y: startY,
      w: shape === 'ribbon' ? Math.random() * 5 + 3 : Math.random() * 9 + 6,
      h: shape === 'ribbon' ? Math.random() * 16 + 10 : Math.random() * 9 + 6,
      color,
      vx: Math.cos(angle) * speed + spread,
      vy: -Math.sin(angle) * speed - Math.random() * 4,
      rotation: Math.random() * 360,
      vRot: (Math.random() - 0.5) * 12,
      opacity: 1,
      shape,
    });
  }

  let animationFrameId: number;
  const gravity = 0.42;
  const drag = 0.985;
  const startTime = Date.now();
  const maxDuration = 3200; // 3.2 seconds total animation

  const render = () => {
    const elapsed = Date.now() - startTime;
    if (elapsed > maxDuration || particles.length === 0) {
      if (canvas && canvas.parentNode) {
        canvas.parentNode.removeChild(canvas);
      }
      return;
    }

    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += gravity;
      p.vx *= drag;
      p.vy *= drag;
      p.rotation += p.vRot;

      // Start fading after 1.8 seconds
      if (elapsed > 1800) {
        p.opacity = Math.max(0, 1 - (elapsed - 1800) / 1400);
      }

      ctx.save();
      ctx.globalAlpha = p.opacity;
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);
      ctx.fillStyle = p.color;

      if (p.shape === 'circle') {
        ctx.beginPath();
        ctx.arc(0, 0, p.w / 2, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      }

      ctx.restore();
    }

    animationFrameId = requestAnimationFrame(render);
  };

  animationFrameId = requestAnimationFrame(render);
};
