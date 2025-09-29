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

interface ButterflyParticle {
  x: number;
  y: number;
  speedX: number;
  speedY: number;
  size: number;
  opacity: number;
  wingAngle: number;
  wingSpeed: number;
}

interface NewsParticle {
  x: number;
  y: number;
  speedY: number;
  opacity: number;
  rotation: number;
  size: number;
  text: string;
}

interface MirrorParticle {
  x: number;
  y: number;
  size: number;
  opacity: number;
  rotation: number;
  shimmer: number;
  life: number;
  maxLife: number;
}

interface RadioWave {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  opacity: number;
  life: number;
  maxLife: number;
}

interface GlassShardParticle {
  x: number;
  y: number;
  speedX: number;
  speedY: number;
  rotation: number;
  rotationSpeed: number;
  size: number;
  opacity: number;
  life: number;
  maxLife: number;
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

  // New effect refs for story-specific animations
  const butterfliesRef = useRef<ButterflyParticle[]>([]);
  const newsParticlesRef = useRef<NewsParticle[]>([]);
  const mirrorParticlesRef = useRef<MirrorParticle[]>([]);
  const radioWavesRef = useRef<RadioWave[]>([]);
  const glassShardsRef = useRef<GlassShardParticle[]>([]);

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

      // Initialize butterflies effect
      if (activeEffects.has('butterflies') && butterfliesRef.current.length === 0) {
        butterfliesRef.current = [];
        for (let i = 0; i < 15; i++) {
          butterfliesRef.current.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            speedX: 1 + Math.random() * 2,
            speedY: (Math.random() - 0.5) * 1,
            size: 8 + Math.random() * 6,
            opacity: 0.6 + Math.random() * 0.3,
            wingAngle: 0,
            wingSpeed: 0.2 + Math.random() * 0.1,
          });
        }
      }

      // Initialize news/rain particles (lluvia de noticias)
      if ((activeEffects.has('rain_soft') || activeEffects.has('rain_intense') || activeEffects.has('old_radio')) && newsParticlesRef.current.length === 0) {
        newsParticlesRef.current = [];
        const particleCount = activeEffects.has('rain_intense') ? 40 : 25;
        const newsTexts = ['📰', '📄', '📝', '🗞️', '📋'];
        for (let i = 0; i < particleCount; i++) {
          newsParticlesRef.current.push({
            x: Math.random() * canvas.width,
            y: -Math.random() * canvas.height,
            speedY: activeEffects.has('rain_intense') ? 3 + Math.random() * 5 : 1 + Math.random() * 2,
            opacity: 0.4 + Math.random() * 0.4,
            rotation: Math.random() * 360,
            size: 15 + Math.random() * 10,
            text: newsTexts[Math.floor(Math.random() * newsTexts.length)],
          });
        }
      }

      // Initialize mirror particles
      if (activeEffects.has('magic_mirrors') && mirrorParticlesRef.current.length === 0) {
        mirrorParticlesRef.current = [];
        for (let i = 0; i < 20; i++) {
          mirrorParticlesRef.current.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: 30 + Math.random() * 40,
            opacity: 0.3 + Math.random() * 0.3,
            rotation: Math.random() * 360,
            shimmer: Math.random() * Math.PI * 2,
            life: 0,
            maxLife: 120 + Math.random() * 80,
          });
        }
      }

      // Initialize radio waves
      if ((activeEffects.has('old_radio') || activeEffects.has('static')) && radioWavesRef.current.length === 0) {
        radioWavesRef.current = [];
        for (let i = 0; i < 10; i++) {
          radioWavesRef.current.push({
            x: canvas.width / 2 + (Math.random() - 0.5) * 200,
            y: canvas.height / 2 + (Math.random() - 0.5) * 200,
            radius: 0,
            maxRadius: 100 + Math.random() * 200,
            opacity: 0.6,
            life: Math.random() * 30,
            maxLife: 80 + Math.random() * 40,
          });
        }
      }

      // Initialize glass shards
      if (activeEffects.has('glass_break') && glassShardsRef.current.length === 0) {
        glassShardsRef.current = [];
        for (let i = 0; i < 50; i++) {
          glassShardsRef.current.push({
            x: canvas.width / 2 + (Math.random() - 0.5) * 100,
            y: canvas.height / 2 + (Math.random() - 0.5) * 100,
            speedX: (Math.random() - 0.5) * 15,
            speedY: -Math.random() * 10,
            rotation: Math.random() * 360,
            rotationSpeed: (Math.random() - 0.5) * 20,
            size: 5 + Math.random() * 15,
            opacity: 0.7 + Math.random() * 0.3,
            life: 0,
            maxLife: 60 + Math.random() * 40,
          });
        }
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
      if (!activeEffects.has('butterflies')) {
        butterfliesRef.current = [];
      }
      if (!activeEffects.has('rain_soft') && !activeEffects.has('rain_intense') && !activeEffects.has('old_radio')) {
        newsParticlesRef.current = [];
      }
      if (!activeEffects.has('magic_mirrors')) {
        mirrorParticlesRef.current = [];
      }
      if (!activeEffects.has('old_radio') && !activeEffects.has('static')) {
        radioWavesRef.current = [];
      }
      if (!activeEffects.has('glass_break')) {
        glassShardsRef.current = [];
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

      // 3. Water/River effect (middle layer) - flowing river with horizontal waves
      if (activeEffects.has('water')) {
        ctx.save();

        // Draw multiple horizontal flowing waves across the entire screen
        const numWaves = 5;
        const baseY = canvas.height * 0.75;
        const time = Date.now() * 0.001; // Time for animation

        for (let i = 0; i < numWaves; i++) {
          const yOffset = i * 20;
          const waveY = baseY + yOffset;
          const opacity = 0.3 - (i * 0.05);

          ctx.globalAlpha = opacity;
          ctx.strokeStyle = '#4FC3F7';
          ctx.lineWidth = 3;
          ctx.beginPath();

          // Draw a continuous wavy line across the entire width
          for (let x = 0; x <= canvas.width; x += 5) {
            const wave = Math.sin((x * 0.01) + (time * 2) + (i * 0.5)) * 15;
            const y = waveY + wave;

            if (x === 0) {
              ctx.moveTo(x, y);
            } else {
              ctx.lineTo(x, y);
            }
          }
          ctx.stroke();
        }

        // Add some flowing particles for extra river effect
        for (const particle of waterParticlesRef.current) {
          particle.x += 2; // Move particles to the right (flowing)
          particle.life++;

          if (particle.x > canvas.width || particle.life >= particle.maxLife) {
            particle.x = -20;
            particle.y = canvas.height * 0.7 + Math.random() * canvas.height * 0.25;
            particle.life = 0;
          }

          const opacity = 0.4 * (1 - particle.life / particle.maxLife);

          ctx.globalAlpha = opacity;
          ctx.fillStyle = '#4FC3F7';
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, 3, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
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

      // 7. Butterflies effect (atmospheric layer)
      if (activeEffects.has('butterflies')) {
        for (const butterfly of butterfliesRef.current) {
          butterfly.x += butterfly.speedX;
          butterfly.y += butterfly.speedY;
          butterfly.wingAngle += butterfly.wingSpeed;

          // Flutter movement
          butterfly.speedY = Math.sin(butterfly.wingAngle) * 2;

          // Wrap around edges
          if (butterfly.x > canvas.width + 50) butterfly.x = -50;
          if (butterfly.y < -50) butterfly.y = canvas.height + 50;
          if (butterfly.y > canvas.height + 50) butterfly.y = -50;

          ctx.save();
          ctx.globalAlpha = butterfly.opacity;
          ctx.translate(butterfly.x, butterfly.y);

          // Draw butterfly (two wings)
          const wingSpread = Math.abs(Math.sin(butterfly.wingAngle)) * butterfly.size * 0.5;

          // Left wing
          ctx.fillStyle = '#FFD700'; // Golden yellow
          ctx.beginPath();
          ctx.ellipse(-wingSpread, 0, butterfly.size * 0.7, butterfly.size, 0, 0, Math.PI * 2);
          ctx.fill();

          // Right wing
          ctx.beginPath();
          ctx.ellipse(wingSpread, 0, butterfly.size * 0.7, butterfly.size, 0, 0, Math.PI * 2);
          ctx.fill();

          // Body
          ctx.fillStyle = '#8B4513';
          ctx.fillRect(-1, -butterfly.size * 0.5, 2, butterfly.size);

          ctx.restore();
        }
      }

      // 8. News particles (lluvia de noticias) - special effect
      if (activeEffects.has('rain_soft') || activeEffects.has('rain_intense') || activeEffects.has('old_radio')) {
        for (const news of newsParticlesRef.current) {
          news.y += news.speedY;
          news.rotation += 2;

          if (news.y > canvas.height + 50) {
            news.y = -50;
            news.x = Math.random() * canvas.width;
          }

          ctx.save();
          ctx.globalAlpha = news.opacity;
          ctx.translate(news.x, news.y);
          ctx.rotate((news.rotation * Math.PI) / 180);
          ctx.font = `${news.size}px Arial`;
          ctx.fillText(news.text, 0, 0);
          ctx.restore();
        }
      }

      // 9. Mirror particles (espejos mágicos)
      if (activeEffects.has('magic_mirrors')) {
        for (const mirror of mirrorParticlesRef.current) {
          mirror.life++;
          mirror.shimmer += 0.1;
          mirror.rotation += 0.5;

          if (mirror.life >= mirror.maxLife) {
            mirror.x = Math.random() * canvas.width;
            mirror.y = Math.random() * canvas.height;
            mirror.life = 0;
          }

          const shimmerOpacity = mirror.opacity * (0.5 + Math.sin(mirror.shimmer) * 0.5);

          ctx.save();
          ctx.globalAlpha = shimmerOpacity;
          ctx.translate(mirror.x, mirror.y);
          ctx.rotate((mirror.rotation * Math.PI) / 180);

          // Mirror frame (diamond shape)
          ctx.strokeStyle = '#C0C0C0'; // Silver
          ctx.lineWidth = 3;
          ctx.shadowBlur = 20;
          ctx.shadowColor = '#FFFFFF';
          ctx.beginPath();
          ctx.moveTo(0, -mirror.size / 2);
          ctx.lineTo(mirror.size / 2, 0);
          ctx.lineTo(0, mirror.size / 2);
          ctx.lineTo(-mirror.size / 2, 0);
          ctx.closePath();
          ctx.stroke();

          // Reflection shimmer
          ctx.fillStyle = '#E0E0E0';
          ctx.globalAlpha = shimmerOpacity * 0.3;
          ctx.fill();

          ctx.restore();
        }
      }

      // 10. Radio waves
      if (activeEffects.has('old_radio') || activeEffects.has('static')) {
        for (const wave of radioWavesRef.current) {
          wave.life++;
          wave.radius = (wave.life / wave.maxLife) * wave.maxRadius;

          if (wave.life >= wave.maxLife) {
            wave.x = canvas.width / 2 + (Math.random() - 0.5) * 200;
            wave.y = canvas.height / 2 + (Math.random() - 0.5) * 200;
            wave.radius = 0;
            wave.life = 0;
          }

          const opacity = wave.opacity * (1 - wave.life / wave.maxLife);

          ctx.save();
          ctx.globalAlpha = opacity;
          ctx.strokeStyle = activeEffects.has('static') ? '#FF6B6B' : '#4ECDC4';
          ctx.lineWidth = 2;
          ctx.setLineDash([5, 5]);
          ctx.beginPath();
          ctx.arc(wave.x, wave.y, wave.radius, 0, Math.PI * 2);
          ctx.stroke();
          ctx.restore();
        }
      }

      // 11. Glass shards
      if (activeEffects.has('glass_break')) {
        for (const shard of glassShardsRef.current) {
          shard.x += shard.speedX;
          shard.y += shard.speedY;
          shard.speedY += 0.5; // Gravity
          shard.rotation += shard.rotationSpeed;
          shard.life++;

          if (shard.life >= shard.maxLife) {
            shard.x = canvas.width / 2 + (Math.random() - 0.5) * 100;
            shard.y = canvas.height / 2 + (Math.random() - 0.5) * 100;
            shard.speedX = (Math.random() - 0.5) * 15;
            shard.speedY = -Math.random() * 10;
            shard.life = 0;
          }

          const lifeRatio = shard.life / shard.maxLife;
          const opacity = shard.opacity * (1 - lifeRatio);

          ctx.save();
          ctx.globalAlpha = opacity;
          ctx.translate(shard.x, shard.y);
          ctx.rotate((shard.rotation * Math.PI) / 180);

          // Glass shard (triangle)
          ctx.fillStyle = '#E0F7FF';
          ctx.strokeStyle = '#FFFFFF';
          ctx.lineWidth = 1;
          ctx.shadowBlur = 10;
          ctx.shadowColor = '#FFFFFF';

          ctx.beginPath();
          ctx.moveTo(0, -shard.size / 2);
          ctx.lineTo(shard.size / 3, shard.size / 2);
          ctx.lineTo(-shard.size / 3, shard.size / 2);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();

          ctx.restore();
        }
      }

      // 12. Rain effect (foreground layer)
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