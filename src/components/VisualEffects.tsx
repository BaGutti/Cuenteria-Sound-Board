'use client';

import { useEffect, useRef } from 'react';

interface VisualEffectsProps {
  activeEffects: Set<string>;
  isTheaterMode: boolean;
  onExitTheater: () => void;
}

interface RainDrop {
  x: number;
  y: number;
  speed: number;
  opacity: number;
  length: number;
}

interface WindParticle {
  x: number;
  y: number;
  speedX: number;
  speedY: number;
  size: number;
  opacity: number;
  rotation: number;
}

interface FireParticle {
  x: number;
  y: number;
  speedX: number;
  speedY: number;
  size: number;
  opacity: number;
  life: number;
  maxLife: number;
}

interface ForestParticle {
  x: number;
  y: number;
  speedX: number;
  speedY: number;
  size: number;
  opacity: number;
  life: number;
  maxLife: number;
  type: 'leaf' | 'sparkle';
}

interface WaterParticle {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  opacity: number;
  life: number;
  maxLife: number;
}

interface MovementParticle {
  x: number;
  y: number;
  speedX: number;
  speedY: number;
  size: number;
  opacity: number;
  life: number;
  maxLife: number;
  type: 'dust' | 'hoof';
}

interface AmbientParticle {
  x: number;
  y: number;
  speedX: number;
  speedY: number;
  size: number;
  opacity: number;
  life: number;
  maxLife: number;
  type: 'crowd' | 'door' | 'bell';
}

export default function VisualEffects({ activeEffects, isTheaterMode, onExitTheater }: VisualEffectsProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationIdRef = useRef<number>(0);
  const rainDropsRef = useRef<RainDrop[]>([]);
  const windParticlesRef = useRef<WindParticle[]>([]);
  const fireParticlesRef = useRef<FireParticle[]>([]);
  const forestParticlesRef = useRef<ForestParticle[]>([]);
  const waterParticlesRef = useRef<WaterParticle[]>([]);
  const movementParticlesRef = useRef<MovementParticle[]>([]);
  const ambientParticlesRef = useRef<AmbientParticle[]>([]);
  const lightningFlashRef = useRef<number>(0);

  // Handle escape key to exit theater mode
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isTheaterMode) {
        onExitTheater();
      }
    };

    if (isTheaterMode) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isTheaterMode, onExitTheater]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !isTheaterMode) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Initialize particles for active effects
    const initParticles = () => {
      // Initialize rain if active and not already initialized
      if (activeEffects.has('rain') && rainDropsRef.current.length === 0) {
        rainDropsRef.current = [];
        for (let i = 0; i < 200; i++) {
          rainDropsRef.current.push({
            x: Math.random() * (canvas.width + 200) - 100,
            y: Math.random() * canvas.height - canvas.height,
            speed: 3 + Math.random() * 8,
            opacity: 0.3 + Math.random() * 0.4,
            length: 10 + Math.random() * 20,
          });
        }
      }

      // Initialize wind if active and not already initialized
      if (activeEffects.has('wind') && windParticlesRef.current.length === 0) {
        windParticlesRef.current = [];
        for (let i = 0; i < 50; i++) {
          windParticlesRef.current.push({
            x: -50,
            y: Math.random() * canvas.height,
            speedX: 8 + Math.random() * 12,
            speedY: (Math.random() - 0.5) * 4,
            size: 2 + Math.random() * 6,
            opacity: 0.4 + Math.random() * 0.4,
            rotation: Math.random() * 360,
          });
        }
      }

      // Initialize fire if active and not already initialized
      if (activeEffects.has('fire') && fireParticlesRef.current.length === 0) {
        fireParticlesRef.current = [];
        for (let i = 0; i < 100; i++) {
          fireParticlesRef.current.push({
            x: canvas.width * 0.2 + Math.random() * canvas.width * 0.6,
            y: canvas.height,
            speedX: (Math.random() - 0.5) * 4,
            speedY: -2 - Math.random() * 8,
            size: 3 + Math.random() * 8,
            opacity: 0.8 + Math.random() * 0.2,
            life: 0,
            maxLife: 60 + Math.random() * 40,
          });
        }
      }

      // Initialize forest/nature if active and not already initialized
      if ((activeEffects.has('forest') || activeEffects.has('birds')) && forestParticlesRef.current.length === 0) {
        forestParticlesRef.current = [];
        for (let i = 0; i < 80; i++) {
          forestParticlesRef.current.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            speedX: (Math.random() - 0.5) * 2,
            speedY: 0.5 + Math.random() * 2,
            size: 2 + Math.random() * 4,
            opacity: 0.3 + Math.random() * 0.4,
            life: 0,
            maxLife: 120 + Math.random() * 80,
            type: Math.random() > 0.7 ? 'sparkle' : 'leaf',
          });
        }
      }

      // Initialize water if active and not already initialized
      if (activeEffects.has('water') && waterParticlesRef.current.length === 0) {
        waterParticlesRef.current = [];
        for (let i = 0; i < 15; i++) {
          waterParticlesRef.current.push({
            x: Math.random() * canvas.width,
            y: canvas.height * 0.7 + Math.random() * canvas.height * 0.3,
            radius: 0,
            maxRadius: 20 + Math.random() * 40,
            opacity: 0.6,
            life: 0,
            maxLife: 60 + Math.random() * 40,
          });
        }
      }

      // Initialize movement effects if active and not already initialized
      if ((activeEffects.has('footsteps') || activeEffects.has('horse')) && movementParticlesRef.current.length === 0) {
        movementParticlesRef.current = [];
        const particleCount = activeEffects.has('horse') ? 60 : 40;
        for (let i = 0; i < particleCount; i++) {
          movementParticlesRef.current.push({
            x: Math.random() * canvas.width,
            y: canvas.height * 0.8 + Math.random() * canvas.height * 0.2,
            speedX: (Math.random() - 0.5) * 6,
            speedY: -1 - Math.random() * 3,
            size: 1 + Math.random() * 3,
            opacity: 0.4 + Math.random() * 0.3,
            life: 0,
            maxLife: 30 + Math.random() * 20,
            type: activeEffects.has('horse') ? 'hoof' : 'dust',
          });
        }
      }

      // Initialize ambient effects if active and not already initialized
      if ((activeEffects.has('crowd') || activeEffects.has('door') || activeEffects.has('bell')) && ambientParticlesRef.current.length === 0) {
        ambientParticlesRef.current = [];
        let particleCount = 30;
        let effectType: 'crowd' | 'door' | 'bell' = 'crowd';

        if (activeEffects.has('crowd')) {
          particleCount = 50;
          effectType = 'crowd';
        } else if (activeEffects.has('door')) {
          particleCount = 20;
          effectType = 'door';
        } else if (activeEffects.has('bell')) {
          particleCount = 25;
          effectType = 'bell';
        }

        for (let i = 0; i < particleCount; i++) {
          ambientParticlesRef.current.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            speedX: (Math.random() - 0.5) * 4,
            speedY: (Math.random() - 0.5) * 4,
            size: 1 + Math.random() * 3,
            opacity: 0.2 + Math.random() * 0.3,
            life: 0,
            maxLife: 40 + Math.random() * 30,
            type: effectType,
          });
        }
      }

      // Initialize lightning if active
      if (activeEffects.has('lightning')) {
        lightningFlashRef.current = 10; // Flash duration
      }

      // Clean up particles for inactive effects
      if (!activeEffects.has('rain')) {
        rainDropsRef.current = [];
      }
      if (!activeEffects.has('wind')) {
        windParticlesRef.current = [];
      }
      if (!activeEffects.has('fire')) {
        fireParticlesRef.current = [];
      }
      if (!activeEffects.has('forest') && !activeEffects.has('birds')) {
        forestParticlesRef.current = [];
      }
      if (!activeEffects.has('water')) {
        waterParticlesRef.current = [];
      }
      if (!activeEffects.has('footsteps') && !activeEffects.has('horse')) {
        movementParticlesRef.current = [];
      }
      if (!activeEffects.has('crowd') && !activeEffects.has('door') && !activeEffects.has('bell')) {
        ambientParticlesRef.current = [];
      }
      if (!activeEffects.has('lightning')) {
        lightningFlashRef.current = 0;
      }
    };

    // Animation loop
    const animate = () => {
      if (activeEffects.size === 0) {
        if (animationIdRef.current) {
          cancelAnimationFrame(animationIdRef.current);
        }
        return;
      }

      // Update particles first
      initParticles();

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Render all active effects (order matters for layering)

      // 1. Fire effect (background layer)
      if (activeEffects.has('fire')) {
        for (const particle of fireParticlesRef.current) {
          particle.x += particle.speedX;
          particle.y += particle.speedY;
          particle.life++;

          const lifeRatio = particle.life / particle.maxLife;
          particle.opacity = 1 - lifeRatio;
          particle.size *= 1.02;

          if (particle.life >= particle.maxLife) {
            particle.x = canvas.width * 0.2 + Math.random() * canvas.width * 0.6;
            particle.y = canvas.height;
            particle.speedX = (Math.random() - 0.5) * 4;
            particle.speedY = -2 - Math.random() * 8;
            particle.size = 3 + Math.random() * 8;
            particle.life = 0;
          }

          const red = 255;
          const green = Math.floor(140 + (1 - lifeRatio) * 115);
          const blue = Math.floor(lifeRatio * 100);

          ctx.save();
          ctx.globalAlpha = particle.opacity;
          ctx.fillStyle = `rgb(${red}, ${green}, ${blue})`;
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      }

      // 2. Forest/Nature effect (background-middle layer)
      if (activeEffects.has('forest') || activeEffects.has('birds')) {
        for (const particle of forestParticlesRef.current) {
          particle.x += particle.speedX;
          particle.y += particle.speedY;
          particle.life++;

          if (particle.y > canvas.height || particle.life >= particle.maxLife) {
            particle.x = Math.random() * canvas.width;
            particle.y = -10;
            particle.life = 0;
          }

          const lifeRatio = particle.life / particle.maxLife;
          const opacity = particle.opacity * (1 - lifeRatio * 0.5);

          ctx.save();
          ctx.globalAlpha = opacity;

          if (particle.type === 'sparkle') {
            // Sparkle effect for birds/nature magic
            ctx.fillStyle = activeEffects.has('birds') ? '#FFD700' : '#90EE90';
            ctx.shadowBlur = 10;
            ctx.shadowColor = ctx.fillStyle;
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            ctx.fill();
          } else {
            // Leaf effect for forest
            ctx.fillStyle = '#228B22';
            ctx.beginPath();
            ctx.ellipse(particle.x, particle.y, particle.size, particle.size * 1.5, Math.PI / 4, 0, Math.PI * 2);
            ctx.fill();
          }

          ctx.restore();
        }
      }

      // 3. Water effect (middle layer)
      if (activeEffects.has('water')) {
        for (const particle of waterParticlesRef.current) {
          particle.life++;
          particle.radius = (particle.life / particle.maxLife) * particle.maxRadius;

          if (particle.life >= particle.maxLife) {
            particle.x = Math.random() * canvas.width;
            particle.y = canvas.height * 0.7 + Math.random() * canvas.height * 0.3;
            particle.radius = 0;
            particle.life = 0;
          }

          const opacity = particle.opacity * (1 - particle.life / particle.maxLife);

          ctx.save();
          ctx.globalAlpha = opacity;
          ctx.strokeStyle = '#4FC3F7';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
          ctx.stroke();
          ctx.restore();
        }
      }

      // 4. Movement effects (ground layer)
      if (activeEffects.has('footsteps') || activeEffects.has('horse')) {
        for (const particle of movementParticlesRef.current) {
          particle.x += particle.speedX;
          particle.y += particle.speedY;
          particle.life++;

          if (particle.y < 0 || particle.life >= particle.maxLife) {
            particle.x = Math.random() * canvas.width;
            particle.y = canvas.height * 0.8 + Math.random() * canvas.height * 0.2;
            particle.speedX = (Math.random() - 0.5) * 6;
            particle.speedY = -1 - Math.random() * 3;
            particle.life = 0;
          }

          const lifeRatio = particle.life / particle.maxLife;
          const opacity = particle.opacity * (1 - lifeRatio);

          ctx.save();
          ctx.globalAlpha = opacity;

          if (particle.type === 'hoof') {
            ctx.fillStyle = '#8B4513';
            ctx.beginPath();
            ctx.ellipse(particle.x, particle.y, particle.size * 1.5, particle.size, 0, 0, Math.PI * 2);
            ctx.fill();
          } else {
            ctx.fillStyle = '#D2B48C';
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            ctx.fill();
          }

          ctx.restore();
        }
      }

      // 5. Ambient effects (atmospheric layer)
      if (activeEffects.has('crowd') || activeEffects.has('door') || activeEffects.has('bell')) {
        for (const particle of ambientParticlesRef.current) {
          particle.x += particle.speedX;
          particle.y += particle.speedY;
          particle.life++;

          // Wrap around screen edges
          if (particle.x < 0) particle.x = canvas.width;
          if (particle.x > canvas.width) particle.x = 0;
          if (particle.y < 0) particle.y = canvas.height;
          if (particle.y > canvas.height) particle.y = 0;

          if (particle.life >= particle.maxLife) {
            particle.life = 0;
          }

          const lifeRatio = particle.life / particle.maxLife;
          const opacity = particle.opacity * Math.sin(lifeRatio * Math.PI);

          ctx.save();
          ctx.globalAlpha = opacity;

          if (particle.type === 'crowd') {
            ctx.fillStyle = '#FF69B4';
            ctx.shadowBlur = 5;
            ctx.shadowColor = '#FF69B4';
          } else if (particle.type === 'door') {
            ctx.fillStyle = '#8B4513';
            ctx.shadowBlur = 3;
            ctx.shadowColor = '#8B4513';
          } else if (particle.type === 'bell') {
            ctx.fillStyle = '#FFD700';
            ctx.shadowBlur = 8;
            ctx.shadowColor = '#FFD700';
          }

          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      }

      // 6. Wind effect (middle layer)
      if (activeEffects.has('wind')) {
        for (const particle of windParticlesRef.current) {
          particle.x += particle.speedX;
          particle.y += particle.speedY;
          particle.rotation += 5;

          if (particle.x > canvas.width + 50) {
            particle.x = -50;
            particle.y = Math.random() * canvas.height;
          }

          ctx.save();
          ctx.globalAlpha = particle.opacity;
          ctx.fillStyle = '#D1D5DB';
          ctx.translate(particle.x, particle.y);
          ctx.rotate((particle.rotation * Math.PI) / 180);
          ctx.fillRect(-particle.size / 2, -particle.size / 2, particle.size, particle.size);
          ctx.restore();
        }
      }

      // 7. Rain effect (foreground layer)
      if (activeEffects.has('rain')) {
        for (const drop of rainDropsRef.current) {
          drop.y += drop.speed;
          drop.x -= 1;

          if (drop.y > canvas.height || drop.x < -50) {
            drop.y = -50;
            drop.x = Math.random() * (canvas.width + 200) - 100;
          }

          ctx.save();
          ctx.globalAlpha = drop.opacity;
          ctx.strokeStyle = '#60A5FA';
          ctx.lineWidth = 2;
          ctx.lineCap = 'round';
          ctx.beginPath();
          ctx.moveTo(drop.x, drop.y);
          ctx.lineTo(drop.x - 3, drop.y + drop.length);
          ctx.stroke();
          ctx.restore();
        }
      }

      // 8. Lightning effect (top layer)
      if (activeEffects.has('lightning')) {
        if (lightningFlashRef.current > 0) {
          // Random lightning strikes
          if (Math.random() < 0.3) {
            const startX = Math.random() * canvas.width;
            const segments = 8 + Math.random() * 12;

            ctx.save();
            ctx.strokeStyle = '#FFFFFF';
            ctx.lineWidth = 3 + Math.random() * 4;
            ctx.shadowBlur = 20;
            ctx.shadowColor = '#60A5FA';

            ctx.beginPath();
            let currentX = startX;
            let currentY = 0;
            ctx.moveTo(currentX, currentY);

            for (let i = 0; i < segments; i++) {
              currentX += (Math.random() - 0.5) * 100;
              currentY += canvas.height / segments;
              ctx.lineTo(currentX, currentY);
            }

            ctx.stroke();
            ctx.restore();
          }

          // Flash background
          ctx.save();
          ctx.globalAlpha = lightningFlashRef.current / 20;
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.restore();

          lightningFlashRef.current--;
        }
      }

      animationIdRef.current = requestAnimationFrame(animate);
    };

    if (activeEffects.size > 0) {
      initParticles();
      animate();
    }

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
    };
  }, [activeEffects, isTheaterMode]);

  if (!isTheaterMode) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Theater Mode Background */}
      <div className="absolute inset-0 bg-black" />

      {/* Canvas for effects */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none"
        style={{ zIndex: 51 }}
      />

      {/* Theater mode indicator */}
      <div className="absolute top-4 left-4 text-white/70 text-sm bg-black/50 px-3 py-2 rounded-lg z-52">
        🎭 Modo Teatro Activo
      </div>

      {/* Exit theater mode button */}
      <button
        onClick={onExitTheater}
        className="absolute top-4 right-4 text-white/70 hover:text-white bg-black/50 hover:bg-black/70 px-4 py-2 rounded-lg text-sm transition-all z-52 hover:scale-105"
      >
        ✕ Salir
      </button>
    </div>
  );
}