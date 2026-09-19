import React, { useRef, useEffect, useCallback } from 'react';
import { Spark, Idea, Wish, SparkType } from '../types';
import { SPARK_COLORS } from '../data/elements';

interface CosmosCanvasProps {
  sparks: Spark[];
  ideas: Idea[];
  wishes: Wish[];
  selectedIdeaId: string | null;
  activeTool: 'spark' | 'wish' | 'charge' | 'drain' | 'inspect';
  selectedSparkType: SparkType;
  millenniaSpeed: number; // 1, 10, 50, 0
  onSelectIdea: (id: string | null) => void;
  onSpawnSparks: (x: number, y: number, type: SparkType, count?: number) => void;
  onCastWish: (x: number, y: number) => void;
  onChargeIdea: (id: string) => void;
  onDrainIdea: (id: string) => void;
  onTickMillennia: (delta: number) => void;
}

export const CosmosCanvas: React.FC<CosmosCanvasProps> = ({
  sparks,
  ideas,
  wishes,
  selectedIdeaId,
  activeTool,
  selectedSparkType,
  millenniaSpeed,
  onSelectIdea,
  onSpawnSparks,
  onCastWish,
  onChargeIdea,
  onDrainIdea,
  onTickMillennia,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mousePosRef = useRef<{ x: number; y: number } | null>(null);
  const isMouseDownRef = useRef<boolean>(false);
  const hoveredIdeaRef = useRef<Idea | null>(null);

  // Maintain local mutable state for ultra-smooth 60fps canvas simulation
  const stateRef = useRef({
    sparks,
    ideas,
    wishes,
    selectedIdeaId,
    activeTool,
    selectedSparkType,
    millenniaSpeed,
  });

  useEffect(() => {
    stateRef.current = {
      sparks,
      ideas,
      wishes,
      selectedIdeaId,
      activeTool,
      selectedSparkType,
      millenniaSpeed,
    };
  }, [sparks, ideas, wishes, selectedIdeaId, activeTool, selectedSparkType, millenniaSpeed]);

  // Handle Resize
  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const handleResize = () => {
      const rect = container.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);
    handleResize();

    return () => resizeObserver.disconnect();
  }, []);

  // Main Rendering Loop
  useEffect(() => {
    let animFrame: number;
    let lastTime = performance.now();
    let nebulaTime = 0;

    const render = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;
      nebulaTime += dt * 0.2;

      const canvas = canvasRef.current;
      if (!canvas) {
        animFrame = requestAnimationFrame(render);
        return;
      }

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        animFrame = requestAnimationFrame(render);
        return;
      }

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = canvas.width / dpr;
      const height = canvas.height / dpr;

      ctx.save();
      ctx.scale(dpr, dpr);

      // 1. Draw Primordial Void Background
      ctx.fillStyle = '#050711';
      ctx.fillRect(0, 0, width, height);

      // Subtle celestial nebula drifts
      const grad = ctx.createRadialGradient(
        width * 0.5 + Math.sin(nebulaTime * 0.7) * 80,
        height * 0.5 + Math.cos(nebulaTime * 0.5) * 60,
        50,
        width * 0.5,
        height * 0.5,
        width * 0.75
      );
      grad.addColorStop(0, 'rgba(30, 27, 75, 0.28)');
      grad.addColorStop(0.5, 'rgba(15, 23, 42, 0.18)');
      grad.addColorStop(1, 'rgba(5, 7, 17, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Subtle cosmic coordinates grid
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.025)';
      ctx.lineWidth = 1;
      const gridSize = 80;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      const { sparks: currentSparks, ideas: currentIdeas, wishes: currentWishes, selectedIdeaId: activeSelId } = stateRef.current;

      // 2. Render Filament Attractions between close sparks
      ctx.lineWidth = 0.75;
      for (let i = 0; i < currentSparks.length; i++) {
        const s1 = currentSparks[i];
        for (let j = i + 1; j < currentSparks.length && j < i + 12; j++) {
          const s2 = currentSparks[j];
          const dx = s2.x - s1.x;
          const dy = s2.y - s1.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 65) {
            const alpha = (1 - dist / 65) * 0.35 * (s1.energy + s2.energy) * 0.5;
            ctx.strokeStyle = s1.type === s2.type ? SPARK_COLORS[s1.type].glow : `rgba(226, 232, 240, ${alpha})`;
            ctx.beginPath();
            ctx.moveTo(s1.x, s1.y);
            ctx.lineTo(s2.x, s2.y);
            ctx.stroke();
          }
        }
      }

      // 3. Render Sparks
      currentSparks.forEach((s) => {
        const col = SPARK_COLORS[s.type] || SPARK_COLORS.desire;
        const radius = s.size * (0.8 + s.energy * 0.4);

        // Glow halo
        ctx.fillStyle = col.glow;
        ctx.beginPath();
        ctx.arc(s.x, s.y, radius * 3.5, 0, Math.PI * 2);
        ctx.fill();

        // Spark core
        ctx.fillStyle = col.primary;
        ctx.beginPath();
        ctx.arc(s.x, s.y, radius, 0, Math.PI * 2);
        ctx.fill();

        // Bright white center spark
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(s.x, s.y, radius * 0.45, 0, Math.PI * 2);
        ctx.fill();
      });

      // 4. Render Wishes (Bamboo Ribbon Streamers 🎋🌬️)
      currentWishes.forEach((w) => {
        const lifeRatio = w.life / w.maxLife;
        ctx.strokeStyle = w.color;
        ctx.lineWidth = 2.5 * lifeRatio;
        ctx.lineCap = 'round';
        ctx.beginPath();

        const steps = 6;
        for (let s = 0; s <= steps; s++) {
          const segRatio = s / steps;
          const wave = Math.sin(w.curvePhase + segRatio * Math.PI * 2) * 12;
          const px = w.x - w.vx * segRatio * 18 + Math.cos(w.curvePhase + segRatio) * wave;
          const py = w.y - w.vy * segRatio * 18 + Math.sin(w.curvePhase + segRatio) * wave;
          if (s === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.stroke();

        // Wish head luminescent spark
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(w.x, w.y, 3 * lifeRatio, 0, Math.PI * 2);
        ctx.fill();
      });

      // 5. Render Ideas
      let currentHovered: Idea | null = null;
      const mPos = mousePosRef.current;

      currentIdeas.forEach((idea) => {
        const isSelected = idea.id === activeSelId;
        const col = SPARK_COLORS[idea.sparkType] || SPARK_COLORS.desire;
        const pulse = Math.sin(idea.pulsePhase) * 3;
        const r = idea.radius + pulse;

        // Check hover
        if (mPos) {
          const dx = mPos.x - idea.x;
          const dy = mPos.y - idea.y;
          if (Math.sqrt(dx * dx + dy * dy) < r + 15) {
            currentHovered = idea;
          }
        }

        // Recognition Beam / Crown if Recognized 🔭
        if (idea.isRecognized) {
          ctx.save();
          ctx.strokeStyle = 'rgba(251, 191, 36, 0.35)';
          ctx.lineWidth = 1.5;
          ctx.setLineDash([4, 4]);
          ctx.beginPath();
          ctx.moveTo(idea.x, 0);
          ctx.lineTo(idea.x, height);
          ctx.stroke();
          ctx.setLineDash([]);

          // Golden Diamond Crown
          ctx.strokeStyle = '#fbbf24';
          ctx.fillStyle = 'rgba(251, 191, 36, 0.2)';
          ctx.lineWidth = 2;
          ctx.beginPath();
          const crownY = idea.y - r - 14;
          ctx.moveTo(idea.x, crownY - 8);
          ctx.lineTo(idea.x + 8, crownY);
          ctx.lineTo(idea.x, crownY + 8);
          ctx.lineTo(idea.x - 8, crownY);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();
          ctx.restore();
        }

        // Outer Mass Ring (gained from charge ⚡️🔋)
        const massRounds = Math.min(idea.mass, 200) / 20;
        ctx.strokeStyle = isSelected ? '#38bdf8' : col.glow;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(idea.x, idea.y, r + 8, 0, Math.PI * 2);
        ctx.stroke();

        // Mass Tick Notches
        const ticks = Math.min(Math.floor(idea.mass / 5) + 3, 24);
        for (let t = 0; t < ticks; t++) {
          const angle = (t / ticks) * Math.PI * 2 + (idea.pulsePhase * 0.2);
          const t1 = r + 7;
          const t2 = r + 12;
          ctx.strokeStyle = isSelected ? '#38bdf8' : 'rgba(255, 255, 255, 0.4)';
          ctx.beginPath();
          ctx.moveTo(idea.x + Math.cos(angle) * t1, idea.y + Math.sin(angle) * t1);
          ctx.lineTo(idea.x + Math.cos(angle) * t2, idea.y + Math.sin(angle) * t2);
          ctx.stroke();
        }

        // Sentience Halo (🧬)
        const sentienceRatio = idea.sentience / 100;
        const haloGrad = ctx.createRadialGradient(idea.x, idea.y, r * 0.4, idea.x, idea.y, r * 2.2);
        haloGrad.addColorStop(0, col.primary);
        haloGrad.addColorStop(0.5, col.glow);
        haloGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = haloGrad;
        ctx.beginPath();
        ctx.arc(idea.x, idea.y, r * 2.2, 0, Math.PI * 2);
        ctx.fill();

        // Electric Charge Arcs (⚡️)
        if (idea.charge > 1) {
          ctx.strokeStyle = '#67e8f9';
          ctx.lineWidth = 1.5;
          for (let c = 0; c < idea.charge; c++) {
            const arcAngle = (c / idea.charge) * Math.PI * 2 + idea.pulsePhase * 2;
            const ax1 = idea.x + Math.cos(arcAngle) * (r + 4);
            const ay1 = idea.y + Math.sin(arcAngle) * (r + 4);
            const midAngle = arcAngle + 0.3;
            const axMid = idea.x + Math.cos(midAngle) * (r + 14);
            const ayMid = idea.y + Math.sin(midAngle) * (r + 14);
            const ax2 = idea.x + Math.cos(arcAngle + 0.6) * (r + 4);
            const ay2 = idea.y + Math.sin(arcAngle + 0.6) * (r + 4);

            ctx.beginPath();
            ctx.moveTo(ax1, ay1);
            ctx.lineTo(axMid, ayMid);
            ctx.lineTo(ax2, ay2);
            ctx.stroke();
          }
        }

        // Inner Core of Idea
        ctx.fillStyle = idea.status === 'ash' ? '#475569' : '#0f172a';
        ctx.beginPath();
        ctx.arc(idea.x, idea.y, r, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = isSelected ? '#38bdf8' : col.primary;
        ctx.lineWidth = isSelected ? 2.5 : 1.5;
        ctx.stroke();

        // Periodic Symbol & Atomic Mass Label inside the core
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 15px "Space Mono", monospace';
        ctx.fillText(idea.symbol, idea.x, idea.y - 4);

        ctx.font = '9px "Space Mono", monospace';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.fillText(`${Math.round(idea.mass)} amu`, idea.x, idea.y + 11);

        // Orbiting Satellite Sparks
        const satCount = Math.min(idea.sparksCount, 8);
        for (let s = 0; s < satCount; s++) {
          const satAngle = (s / satCount) * Math.PI * 2 + idea.pulsePhase * 0.8;
          const satDist = r + 18 + Math.sin(satAngle * 3) * 4;
          const sx = idea.x + Math.cos(satAngle) * satDist;
          const sy = idea.y + Math.sin(satAngle) * satDist;

          ctx.fillStyle = col.primary;
          ctx.beginPath();
          ctx.arc(sx, sy, 2.5, 0, Math.PI * 2);
          ctx.fill();
        }

        // Selection boundary indicator
        if (isSelected) {
          ctx.strokeStyle = '#38bdf8';
          ctx.lineWidth = 1;
          ctx.setLineDash([2, 4]);
          ctx.beginPath();
          ctx.arc(idea.x, idea.y, r + 24, 0, Math.PI * 2);
          ctx.stroke();
          ctx.setLineDash([]);
        }
      });

      hoveredIdeaRef.current = currentHovered;

      // 6. Draw Hover Tooltip if hovering over an idea
      if (currentHovered && mPos) {
        const h = currentHovered as Idea;
        const boxWidth = 220;
        const boxHeight = 84;
        let bx = h.x + 25;
        let by = h.y - 40;
        if (bx + boxWidth > width - 10) bx = h.x - boxWidth - 25;
        if (by < 10) by = 10;
        if (by + boxHeight > height - 10) by = height - boxHeight - 10;

        ctx.fillStyle = 'rgba(9, 14, 26, 0.94)';
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.5)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.roundRect(bx, by, boxWidth, boxHeight, 8);
        ctx.fill();
        ctx.stroke();

        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';
        ctx.font = 'bold 13px "Cinzel", serif';
        ctx.fillStyle = '#f8fafc';
        ctx.fillText(`${h.name} [${h.symbol}]`, bx + 12, by + 10);

        ctx.font = '11px "Space Mono", monospace';
        ctx.fillStyle = '#94a3b8';
        ctx.fillText(`Mass: ${Math.round(h.mass)} amu | Charge: ${h.charge}⚡️`, bx + 12, by + 30);
        ctx.fillText(`Sentience: ${Math.round(h.sentience)}% 🧬 | ${h.ageMillennia} Millennia`, bx + 12, by + 46);

        ctx.font = 'italic 10px "Plus Jakarta Sans", sans-serif';
        ctx.fillStyle = h.isRecognized ? '#fcd34d' : '#cbd5e1';
        const quoteSnippet = h.isRecognized ? "★ Recognized in cosmic memory" : `"${h.observableBelief.slice(0, 32)}..."`;
        ctx.fillText(quoteSnippet, bx + 12, by + 64);
      }

      ctx.restore();

      // Continuous Millennia time progression
      if (stateRef.current.millenniaSpeed > 0) {
        onTickMillennia(dt * stateRef.current.millenniaSpeed * 10);
      }

      animFrame = requestAnimationFrame(render);
    };

    animFrame = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animFrame);
  }, [onTickMillennia]);

  // Mouse / Pointer Event Handlers
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    isMouseDownRef.current = true;
    mousePosRef.current = { x, y };

    const { activeTool, selectedSparkType, ideas } = stateRef.current;

    // Check if clicked an existing idea
    const clickedIdea = ideas.find((idea) => {
      const dx = idea.x - x;
      const dy = idea.y - y;
      return Math.sqrt(dx * dx + dy * dy) <= idea.radius + 15;
    });

    if (clickedIdea) {
      if (activeTool === 'charge') {
        onChargeIdea(clickedIdea.id);
        return;
      }
      if (activeTool === 'drain') {
        onDrainIdea(clickedIdea.id);
        return;
      }
      onSelectIdea(clickedIdea.id);
      return;
    }

    // Clicked empty void
    if (activeTool === 'spark') {
      onSpawnSparks(x, y, selectedSparkType, 5);
    } else if (activeTool === 'wish') {
      onCastWish(x, y);
    } else {
      onSelectIdea(null);
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    mousePosRef.current = { x, y };

    if (isMouseDownRef.current && stateRef.current.activeTool === 'spark') {
      // Spawn subtle drag stream
      if (Math.random() < 0.4) {
        onSpawnSparks(x, y, stateRef.current.selectedSparkType, 1);
      }
    }
  };

  const handlePointerUp = () => {
    isMouseDownRef.current = false;
  };

  return (
    <div
      ref={containerRef}
      id="paramecia-canvas-container"
      className="relative w-full h-full select-none overflow-hidden cursor-crosshair bg-[#050711]"
    >
      <canvas
        ref={canvasRef}
        id="paramecia-universe-canvas"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={() => {
          isMouseDownRef.current = false;
          mousePosRef.current = null;
          hoveredIdeaRef.current = null;
        }}
        className="w-full h-full block touch-none"
      />
    </div>
  );
};
