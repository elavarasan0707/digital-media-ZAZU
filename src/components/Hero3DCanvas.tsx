import React, { useEffect, useRef } from 'react';

export const Hero3DCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || window.innerHeight);

    // Mobile check
    const isMobile = width < 768;
    const particleCount = isMobile ? 32 : 72;

    // Check reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Mouse coordinates for interactive parallax
    const mouse = {
      x: width / 2,
      y: height / 2,
      targetX: width / 2,
      targetY: height / 2
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (isMobile || prefersReducedMotion) return;
      const rect = canvas.getBoundingClientRect();
      mouse.targetX = e.clientX - rect.left;
      mouse.targetY = e.clientY - rect.top;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
      height = canvas.height = canvas.parentElement?.clientHeight || window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Particle nodes definition
    interface Particle {
      x: number;
      y: number;
      z: number;
      vx: number;
      vy: number;
      vz: number;
      radius: number;
      color: string;
      glow: number;
    }

    const goldColors = ['#F5C542', '#FFD966', '#FFE58F', '#D4AF37'];
    const particles: Particle[] = [];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: (Math.random() - 0.5) * width * 1.2,
        y: (Math.random() - 0.5) * height * 1.2,
        z: Math.random() * 400 + 100,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        vz: (Math.random() - 0.5) * 0.3,
        radius: Math.random() * 2.5 + 1.2,
        color: goldColors[Math.floor(Math.random() * goldColors.length)],
        glow: Math.random() * 0.5 + 0.3
      });
    }

    // 3D Geometric Ring / Shape vertices
    let angleX = 0;
    let angleY = 0;
    const ringRadius = isMobile ? 120 : 180;
    const ringPointsCount = isMobile ? 16 : 24;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Smooth mouse follow
      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      const mouseOffsetX = (mouse.x - width / 2) * 0.08;
      const mouseOffsetY = (mouse.y - height / 2) * 0.08;

      const fov = 350;
      const centerX = width / 2 + mouseOffsetX;
      const centerY = height / 2 + mouseOffsetY;

      // Draw subtle ambient gold energy radial backdrop
      const radialGrad = ctx.createRadialGradient(
        centerX,
        centerY,
        10,
        centerX,
        centerY,
        Math.max(width, height) * 0.45
      );
      radialGrad.addColorStop(0, 'rgba(245, 197, 66, 0.08)');
      radialGrad.addColorStop(0.5, 'rgba(245, 197, 66, 0.02)');
      radialGrad.addColorStop(1, 'rgba(8, 8, 8, 0)');
      ctx.fillStyle = radialGrad;
      ctx.fillRect(0, 0, width, height);

      // Rotate 3D Wireframe Orbit Rings
      if (!prefersReducedMotion) {
        angleX += 0.004;
        angleY += 0.006;
      }

      // 3D Ring 1
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(245, 197, 66, 0.22)';
      ctx.lineWidth = 1.2;
      for (let i = 0; i <= ringPointsCount; i++) {
        const theta = (i / ringPointsCount) * Math.PI * 2;
        const x3d = Math.cos(theta) * ringRadius;
        const y3d = Math.sin(theta) * ringRadius * Math.sin(angleX);
        const z3d = Math.sin(theta) * ringRadius * Math.cos(angleX) + 200;

        const scale = fov / (fov + z3d);
        const px = centerX + x3d * scale;
        const py = centerY + y3d * scale;

        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.stroke();

      // 3D Ring 2 (Orthogonal tilt)
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(255, 217, 102, 0.16)';
      ctx.lineWidth = 1;
      for (let i = 0; i <= ringPointsCount; i++) {
        const theta = (i / ringPointsCount) * Math.PI * 2;
        const x3d = Math.cos(theta) * (ringRadius * 0.8) * Math.cos(angleY);
        const y3d = Math.sin(theta) * (ringRadius * 0.8);
        const z3d = Math.cos(theta) * (ringRadius * 0.8) * Math.sin(angleY) + 200;

        const scale = fov / (fov + z3d);
        const px = centerX + x3d * scale;
        const py = centerY + y3d * scale;

        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.stroke();

      // Update and project particles
      const projected = particles.map((p) => {
        if (!prefersReducedMotion) {
          p.x += p.vx;
          p.y += p.vy;
          p.z += p.vz;

          // Wrap boundaries
          if (p.x < -width) p.x = width;
          if (p.x > width) p.x = -width;
          if (p.y < -height) p.y = height;
          if (p.y > height) p.y = -height;
          if (p.z < 50) p.z = 450;
          if (p.z > 450) p.z = 50;
        }

        const scale = fov / (fov + p.z);
        const screenX = centerX + p.x * scale;
        const screenY = centerY + p.y * scale;

        return {
          ...p,
          screenX,
          screenY,
          scale
        };
      });

      // Draw connecting network lines
      const maxDistance = isMobile ? 70 : 100;
      for (let i = 0; i < projected.length; i++) {
        for (let j = i + 1; j < projected.length; j++) {
          const dx = projected[i].screenX - projected[j].screenX;
          const dy = projected[i].screenY - projected[j].screenY;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxDistance) {
            const alpha = (1 - dist / maxDistance) * 0.18;
            ctx.beginPath();
            ctx.strokeStyle = `rgba(245, 197, 66, ${alpha})`;
            ctx.lineWidth = 0.8;
            ctx.moveTo(projected[i].screenX, projected[i].screenY);
            ctx.lineTo(projected[j].screenX, projected[j].screenY);
            ctx.stroke();
          }
        }
      }

      // Draw particle nodes
      for (const p of projected) {
        ctx.beginPath();
        const r = Math.max(1, p.radius * p.scale);
        ctx.arc(p.screenX, p.screenY, r, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = isMobile ? 4 : 8;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-0 opacity-80"
      aria-hidden="true"
    />
  );
};
