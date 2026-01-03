import { useEffect, useRef, forwardRef, useState } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  opacity: number;
}

interface ParticlesProps {
  className?: string;
  quantity?: number;
  color?: string;
}

const Particles = forwardRef<HTMLCanvasElement, ParticlesProps>(
  ({ className = "", quantity = 50, color = "139, 92, 246" }, ref) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const particlesRef = useRef<Particle[]>([]);
    const animationRef = useRef<number>();
    const mouseRef = useRef({ x: 0, y: 0 });
    
    // Reduce particles on mobile for better performance
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    const adjustedQuantity = isMobile ? Math.floor(quantity * 0.4) : quantity;
    const connectionDistance = isMobile ? 80 : 120;

    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const resizeCanvas = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      };

      const createParticles = () => {
        particlesRef.current = [];
        for (let i = 0; i < adjustedQuantity; i++) {
          particlesRef.current.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5,
            radius: Math.random() * 2 + 1,
            opacity: Math.random() * 0.5 + 0.2,
          });
        }
      };

      const drawParticles = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        particlesRef.current.forEach((particle, i) => {
          // Update position
          particle.x += particle.vx;
          particle.y += particle.vy;

          // Bounce off edges
          if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
          if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;

          // Draw particle
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${color}, ${particle.opacity})`;
          ctx.fill();

          // Draw connections (skip on very small screens for performance)
          if (!isMobile || i % 2 === 0) {
            particlesRef.current.slice(i + 1).forEach((otherParticle) => {
              const dx = particle.x - otherParticle.x;
              const dy = particle.y - otherParticle.y;
              const distance = Math.sqrt(dx * dx + dy * dy);

              if (distance < connectionDistance) {
                ctx.beginPath();
                ctx.moveTo(particle.x, particle.y);
                ctx.lineTo(otherParticle.x, otherParticle.y);
                ctx.strokeStyle = `rgba(${color}, ${0.15 * (1 - distance / connectionDistance)})`;
                ctx.lineWidth = 0.5;
                ctx.stroke();
              }
            });
          }

          // Mouse interaction
          const mouseDistance = Math.sqrt(
            Math.pow(particle.x - mouseRef.current.x, 2) +
            Math.pow(particle.y - mouseRef.current.y, 2)
          );

          if (mouseDistance < 150) {
            const angle = Math.atan2(
              particle.y - mouseRef.current.y,
              particle.x - mouseRef.current.x
            );
            particle.x += Math.cos(angle) * 1;
            particle.y += Math.sin(angle) * 1;
          }
        });

        animationRef.current = requestAnimationFrame(drawParticles);
      };

      const handleMouseMove = (e: MouseEvent) => {
        mouseRef.current = { x: e.clientX, y: e.clientY };
      };

      resizeCanvas();
      createParticles();
      drawParticles();

      window.addEventListener("resize", () => {
        resizeCanvas();
        createParticles();
      });
      window.addEventListener("mousemove", handleMouseMove);

      return () => {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
        window.removeEventListener("resize", resizeCanvas);
        window.removeEventListener("mousemove", handleMouseMove);
      };
    }, [adjustedQuantity, color, connectionDistance, isMobile]);

    return (
      <canvas
        ref={canvasRef}
        className={`fixed inset-0 pointer-events-none ${className}`}
        style={{ zIndex: 0 }}
      />
    );
  }
);

Particles.displayName = "Particles";

export default Particles;
