/**
 * Lightweight, high-performance celebratory confetti animation using HTML5 Canvas.
 * Supports multiple consecutive bursts without tearing down active particles.
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
  bornAt: number;
  lifeSpan: number;
  shape: 'rect' | 'circle' | 'ribbon' | 'star';
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
  '#e11d48', // Rose
  '#eab308', // Yellow
];

let activeParticles: Particle[] = [];
let animFrameId: number | null = null;
let canvasEl: HTMLCanvasElement | null = null;

const drawStar = (ctx: CanvasRenderingContext2D, cx: number, cy: number, spikes: number, outerRadius: number, innerRadius: number) => {
  let rot = (Math.PI / 2) * 3;
  let x = cx;
  let y = cy;
  const step = Math.PI / spikes;

  ctx.beginPath();
  ctx.moveTo(cx, cy - outerRadius);
  for (let i = 0; i < spikes; i++) {
    x = cx + Math.cos(rot) * outerRadius;
    y = cy + Math.sin(rot) * outerRadius;
    ctx.lineTo(x, y);
    rot += step;

    x = cx + Math.cos(rot) * innerRadius;
    y = cy + Math.sin(rot) * innerRadius;
    ctx.lineTo(x, y);
    rot += step;
  }
  ctx.lineTo(cx, cy - outerRadius);
  ctx.closePath();
  ctx.fill();
};

export const triggerConfetti = (options?: { particleCount?: number; originY?: number }) => {
  if (typeof window === 'undefined') return;

  const count = options?.particleCount || 100;
  const originY = options?.originY ?? 0.65;

  if (!canvasEl || !canvasEl.parentNode) {
    canvasEl = document.getElementById('visa-confetti-canvas') as HTMLCanvasElement | null;
    if (!canvasEl) {
      canvasEl = document.createElement('canvas');
      canvasEl.id = 'visa-confetti-canvas';
      canvasEl.style.position = 'fixed';
      canvasEl.style.top = '0';
      canvasEl.style.left = '0';
      canvasEl.style.width = '100vw';
      canvasEl.style.height = '100vh';
      canvasEl.style.pointerEvents = 'none';
      canvasEl.style.zIndex = '99999';
      document.body.appendChild(canvasEl);
    }
  }

  const ctx = canvasEl.getContext('2d');
  if (!ctx) return;

  const width = (canvasEl.width = window.innerWidth);
  const height = (canvasEl.height = window.innerHeight);

  const startX = width / 2;
  const startY = height * originY;
  const now = Date.now();

  const shapes: ('rect' | 'circle' | 'ribbon' | 'star')[] = ['rect', 'circle', 'ribbon', 'star', 'rect'];

  for (let i = 0; i < count; i++) {
    const angle = (Math.random() * Math.PI) + (Math.PI * 0.05); // Upward spray
    const speed = Math.random() * 16 + 9;
    const spread = (Math.random() - 0.5) * 18;
    const color = FESTIVE_COLORS[Math.floor(Math.random() * FESTIVE_COLORS.length)];
    const shape = shapes[Math.floor(Math.random() * shapes.length)];
    const lifeSpan = Math.random() * 1200 + 2400; // 2.4s to 3.6s life

    activeParticles.push({
      x: startX + (Math.random() - 0.5) * 100,
      y: startY,
      w: shape === 'ribbon' ? Math.random() * 5 + 3 : Math.random() * 9 + 6,
      h: shape === 'ribbon' ? Math.random() * 18 + 10 : Math.random() * 9 + 6,
      color,
      vx: Math.cos(angle) * speed + spread,
      vy: -Math.sin(angle) * speed - Math.random() * 6,
      rotation: Math.random() * 360,
      vRot: (Math.random() - 0.5) * 14,
      opacity: 1,
      bornAt: now,
      lifeSpan,
      shape,
    });
  }

  if (animFrameId) return; // Loop already running

  const gravity = 0.40;
  const drag = 0.982;

  const render = () => {
    if (!canvasEl || !ctx) {
      animFrameId = null;
      return;
    }

    const currentNow = Date.now();
    ctx.clearRect(0, 0, canvasEl.width, canvasEl.height);

    activeParticles = activeParticles.filter((p) => {
      const age = currentNow - p.bornAt;
      if (age > p.lifeSpan) return false;

      p.x += p.vx;
      p.y += p.vy;
      p.vy += gravity;
      p.vx *= drag;
      p.vy *= drag;
      p.rotation += p.vRot;

      const fadeStart = p.lifeSpan * 0.6;
      if (age > fadeStart) {
        p.opacity = Math.max(0, 1 - (age - fadeStart) / (p.lifeSpan - fadeStart));
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
      } else if (p.shape === 'star') {
        drawStar(ctx, 0, 0, 5, p.w, p.w / 2);
      } else {
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      }

      ctx.restore();
      return true;
    });

    if (activeParticles.length > 0) {
      animFrameId = requestAnimationFrame(render);
    } else {
      if (canvasEl && canvasEl.parentNode) {
        canvasEl.parentNode.removeChild(canvasEl);
        canvasEl = null;
      }
      animFrameId = null;
    }
  };

  animFrameId = requestAnimationFrame(render);
};
