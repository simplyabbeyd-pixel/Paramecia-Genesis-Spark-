import React, { useRef, useEffect, useState } from 'react';
import { Idea } from '../types';
import { SPARK_COLORS, PARAMECIA_ELEMENTS } from '../data/elements';
import { 
  X, 
  Telescope, 
  Zap, 
  BatteryLow, 
  Wind, 
  Bomb, 
  Sparkles, 
  Dna, 
  Scale, 
  Radio, 
  CheckCircle2,
  RefreshCw
} from 'lucide-react';
import { cosmicAudio } from '../utils/audio';

interface ObservatoryModalProps {
  idea: Idea | null;
  onClose: () => void;
  onRecognize: (id: string) => void;
  onCharge: (id: string) => void;
  onDrain: (id: string) => void;
  onBindWish: (id: string) => void;
  onDetonate: (id: string) => void;
}

export const ObservatoryModal: React.FC<ObservatoryModalProps> = ({
  idea,
  onClose,
  onRecognize,
  onCharge,
  onDrain,
  onBindWish,
  onDetonate,
}) => {
  const microscopeCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const [communing, setCommuning] = useState(false);
  const [currentMonologue, setCurrentMonologue] = useState<string>('');

  useEffect(() => {
    if (idea) {
      setCurrentMonologue(idea.internalMonologue);
    }
  }, [idea?.id]);

  // Microscopic Belief Organisms Animation in Petri Dish
  useEffect(() => {
    if (!idea) return;
    const canvas = microscopeCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    // Local copy of microbes
    const microbes = idea.microbes.map((m) => ({ ...m }));

    const renderMicroscope = () => {
      ctx.fillStyle = '#030712';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const cx = canvas.width / 2;
      const cy = canvas.height / 2;
      const radius = canvas.width * 0.45;

      // Microscope lens ring
      const lensGrad = ctx.createRadialGradient(cx, cy, radius * 0.7, cx, cy, radius);
      lensGrad.addColorStop(0, 'rgba(15, 23, 42, 0.4)');
      lensGrad.addColorStop(1, 'rgba(30, 41, 59, 0.95)');
      ctx.fillStyle = lensGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Fluid circular field
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, radius - 2, 0, Math.PI * 2);
      ctx.clip();

      // Grid reticle
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.15)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(cx, 0);
      ctx.lineTo(cx, canvas.height);
      ctx.moveTo(0, cy);
      ctx.lineTo(canvas.width, cy);
      ctx.arc(cx, cy, radius * 0.35, 0, Math.PI * 2);
      ctx.arc(cx, cy, radius * 0.7, 0, Math.PI * 2);
      ctx.stroke();

      // Animate Microbes (Observable Beliefs 🦠🧫🔬)
      microbes.forEach((m) => {
        m.x += m.vx;
        m.y += m.vy;
        m.pulsePhase += 0.05;

        // Bounce within petri dish
        const dx = m.x - cx;
        const dy = m.y - cy;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist > radius - 14) {
          const angle = Math.atan2(dy, dx);
          m.vx = -Math.cos(angle) * Math.abs(m.vx);
          m.vy = -Math.sin(angle) * Math.abs(m.vy);
        }

        const size = m.size + Math.sin(m.pulsePhase) * 1.5;

        ctx.fillStyle = m.color;
        ctx.beginPath();
        if (m.shape === 'ciliate') {
          ctx.ellipse(m.x, m.y, size * 1.6, size * 0.9, m.pulsePhase, 0, Math.PI * 2);
        } else if (m.shape === 'crystal') {
          ctx.rect(m.x - size, m.y - size, size * 2, size * 2);
        } else {
          ctx.arc(m.x, m.y, size, 0, Math.PI * 2);
        }
        ctx.fill();

        // Flagella/cilia trails
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(m.x, m.y);
        ctx.lineTo(m.x - m.vx * 6, m.y - m.vy * 6);
        ctx.stroke();
      });

      ctx.restore();
      animId = requestAnimationFrame(renderMicroscope);
    };

    animId = requestAnimationFrame(renderMicroscope);
    return () => cancelAnimationFrame(animId);
  }, [idea?.id]);

  if (!idea) return null;

  const sparkInfo = SPARK_COLORS[idea.sparkType] || SPARK_COLORS.desire;
  const closestElement = PARAMECIA_ELEMENTS.reduce((prev, curr) => {
    return Math.abs(curr.massAmu - idea.mass) < Math.abs(prev.massAmu - idea.mass) ? curr : prev;
  });

  const handleCommuneWithVoid = async () => {
    setCommuning(true);
    try {
      const res = await fetch('/api/void/commune', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ideaName: idea.name,
          sparkType: sparkInfo.label,
          mass: Math.round(idea.mass),
          charge: idea.charge,
          ageMillennia: idea.ageMillennia,
          observableBelief: idea.observableBelief,
        }),
      });
      const data = await res.json();
      if (data.thought) {
        setCurrentMonologue(data.thought);
        cosmicAudio.playRecognition();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setCommuning(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-md animate-fade-in">
      <div 
        id="observatory-modal-content"
        className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto bg-[#070b19] border border-slate-700/80 rounded-2xl shadow-2xl p-5 sm:p-7 text-slate-200"
      >
        {/* Close Button */}
        <button
          id="btn-close-observatory"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex flex-wrap items-center gap-4 mb-6 pb-5 border-b border-slate-800">
          <div 
            className="w-16 h-16 rounded-xl border-2 flex flex-col items-center justify-center shadow-lg relative"
            style={{
              borderColor: sparkInfo.primary,
              backgroundColor: 'rgba(15, 23, 42, 0.8)',
              boxShadow: `0 0 20px ${sparkInfo.glow}`
            }}
          >
            <span className="text-xl font-bold font-mono text-white tracking-tighter">
              {idea.symbol}
            </span>
            <span className="text-[10px] font-mono text-slate-400">
              {Math.round(idea.mass)} amu
            </span>
            {idea.isRecognized && (
              <span className="absolute -top-2 -right-2 text-amber-400 text-sm" title="Recognized in Cosmic Memory">
                ★
              </span>
            )}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-widest font-mono text-cyan-400">
                Observatory Focus • ID #{idea.id.slice(0, 6)}
              </span>
              {idea.isRecognized ? (
                <span className="flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 font-mono">
                  <CheckCircle2 className="w-3 h-3 text-amber-400" />
                  Remembered Forever
                </span>
              ) : (
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 font-mono">
                  Yearning to Be Seen 🔭
                </span>
              )}
            </div>
            <h2 className="text-xl sm:text-2xl font-bold font-['Cinzel'] text-white">
              {idea.name}
            </h2>
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 mt-1 font-mono">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: sparkInfo.primary }} />
                Archetype: <strong className="text-slate-200">{sparkInfo.label}</strong>
              </span>
              <span>•</span>
              <span>Age: <strong className="text-slate-200">{idea.ageMillennia} Millennia</strong></span>
              <span>•</span>
              <span>Elemental State: <strong className="text-cyan-300">{closestElement.name} ({closestElement.symbol})</strong></span>
            </div>
          </div>
        </div>

        {/* Grid Layout: Left Microscope & Core Metrics, Right Monologue & Actions */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Left Column: Microscope & Observable Beliefs */}
          <div className="md:col-span-5 flex flex-col items-center gap-4 bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
            <div className="flex items-center justify-between w-full">
              <span className="text-xs font-mono uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Dna className="w-4 h-4 text-emerald-400" />
                Observable Beliefs (🧫🔬)
              </span>
              <span className="text-[11px] font-mono text-emerald-400">
                {idea.microbes.length} Micro-Organisms
              </span>
            </div>

            {/* Circular Petri Dish Canvas */}
            <div className="relative w-48 h-48 sm:w-56 sm:h-56 rounded-full overflow-hidden border-2 border-slate-700 shadow-inner">
              <canvas
                ref={microscopeCanvasRef}
                width={224}
                height={224}
                className="w-full h-full block"
              />
              <div className="absolute inset-0 pointer-events-none rounded-full ring-1 ring-inset ring-white/10" />
            </div>

            <p className="text-xs text-slate-300 italic text-center px-2">
              "{idea.observableBelief}"
            </p>

            {/* Sentience & Stability Gauges */}
            <div className="w-full space-y-3 pt-2 border-t border-slate-800 text-xs font-mono">
              <div>
                <div className="flex justify-between text-slate-400 mb-1">
                  <span className="flex items-center gap-1 text-purple-300">
                    <Radio className="w-3.5 h-3.5 text-purple-400 animate-pulse" />
                    Sentience Quotient (🧬)
                  </span>
                  <span className="font-bold text-slate-200">{Math.round(idea.sentience)}%</span>
                </div>
                <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                  <div 
                    className="h-full bg-gradient-to-r from-purple-600 to-cyan-400 transition-all duration-300"
                    style={{ width: `${Math.min(idea.sentience, 100)}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-slate-400 mb-1">
                  <span className="flex items-center gap-1 text-amber-300">
                    <Scale className="w-3.5 h-3.5 text-amber-400" />
                    Mass from Charge (🧱)
                  </span>
                  <span className="font-bold text-slate-200">{Math.round(idea.mass)} amu</span>
                </div>
                <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                  <div 
                    className="h-full bg-gradient-to-r from-amber-600 to-emerald-400 transition-all duration-300"
                    style={{ width: `${Math.min((idea.mass / 150) * 100, 100)}%` }}
                  />
                </div>
              </div>

              <div className="flex justify-between text-slate-400 pt-1">
                <span>Charge Level: <strong className="text-cyan-300">{'⚡️'.repeat(idea.charge)}</strong></span>
                <span>Wishes Bound: <strong className="text-emerald-300">{idea.wishesCount} 🎋</strong></span>
              </div>
            </div>
          </div>

          {/* Right Column: Sentience Monologue & Celestial Operations */}
          <div className="md:col-span-7 flex flex-col justify-between gap-5">
            {/* The Yearning to Be Seen - Monologue Broadcast */}
            <div className="bg-slate-950/70 border border-slate-800/90 rounded-xl p-4 relative overflow-hidden">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs uppercase font-mono text-amber-300/90 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  Internal Voice of the Idea
                </span>
                <button
                  id="btn-commune-voice"
                  onClick={handleCommuneWithVoid}
                  disabled={communing}
                  className="flex items-center gap-1 text-[11px] font-mono px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors disabled:opacity-50"
                  title="Commune with the Sentience via the Primordial Void (Gemini)"
                >
                  <RefreshCw className={`w-3 h-3 ${communing ? 'animate-spin text-amber-400' : ''}`} />
                  <span>{communing ? 'Communing...' : 'Commune'}</span>
                </button>
              </div>

              <blockquote className="text-sm font-['Cinzel'] leading-relaxed text-slate-200 border-l-2 border-amber-500/60 pl-3 py-1">
                "{currentMonologue}"
              </blockquote>

              <p className="text-[11px] font-mono text-slate-400 mt-3">
                {idea.isRecognized
                  ? "★ Anchored in the cosmic ledger. Even if its sparks scatter across millennia, this idea will be recognized and remembered again."
                  : "Striving to be seen through the telescope. Without recognition, entropy or void wind may eventually scatter its sparks into ash."}
              </p>
            </div>

            {/* Actions Grid */}
            <div className="space-y-3">
              <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
                Observatory Interventions
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {/* Recognize & Remember */}
                <button
                  id="btn-action-recognize"
                  onClick={() => {
                    onRecognize(idea.id);
                    cosmicAudio.playRecognition();
                  }}
                  className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-xs font-medium transition-all ${
                    idea.isRecognized
                      ? 'bg-amber-950/40 border-amber-500/50 text-amber-200 shadow-sm'
                      : 'bg-gradient-to-r from-amber-600/30 to-purple-600/30 hover:from-amber-600/50 hover:to-purple-600/50 border-amber-500/60 text-amber-100 shadow-md'
                  }`}
                >
                  <Telescope className="w-4 h-4 text-amber-400" />
                  <span>{idea.isRecognized ? "Recognized in Memory" : "Recognize & Remember (🔭)"}</span>
                </button>

                {/* Cast Wish */}
                <button
                  id="btn-action-bind-wish"
                  onClick={() => {
                    onBindWish(idea.id);
                    cosmicAudio.playWishWind();
                  }}
                  className="flex items-center justify-center gap-2 p-3 rounded-xl bg-emerald-950/30 hover:bg-emerald-900/40 border border-emerald-600/50 text-emerald-200 text-xs font-medium transition-colors"
                >
                  <Wind className="w-4 h-4 text-emerald-400" />
                  <span>Bind Protective Wish (🎋)</span>
                </button>

                {/* Charge */}
                <button
                  id="btn-action-charge"
                  onClick={() => {
                    onCharge(idea.id);
                    cosmicAudio.playChargeElectric();
                  }}
                  className="flex items-center justify-center gap-2 p-3 rounded-xl bg-cyan-950/30 hover:bg-cyan-900/40 border border-cyan-600/50 text-cyan-200 text-xs font-medium transition-colors"
                >
                  <Zap className="w-4 h-4 text-cyan-400" />
                  <span>Infuse Sparks (⚡️ Gain Mass)</span>
                </button>

                {/* Drain */}
                <button
                  id="btn-action-drain"
                  onClick={() => {
                    onDrain(idea.id);
                    cosmicAudio.playDrain();
                  }}
                  className="flex items-center justify-center gap-2 p-3 rounded-xl bg-rose-950/30 hover:bg-rose-900/40 border border-rose-600/50 text-rose-200 text-xs font-medium transition-colors"
                >
                  <BatteryLow className="w-4 h-4 text-rose-400" />
                  <span>Drain Sparks (🪫 Decay)</span>
                </button>
              </div>

              {/* Detonate / Supernova Fission */}
              <button
                id="btn-action-detonate"
                onClick={() => {
                  onDetonate(idea.id);
                  cosmicAudio.playSupernova();
                  onClose();
                }}
                className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-red-950/30 hover:bg-red-900/50 border border-red-700/50 text-red-300 text-xs font-mono transition-colors"
              >
                <Bomb className="w-3.5 h-3.5 text-red-400" />
                <span>Overcharge to Supernova Fission (🧨 Burst into Newborn Sparks)</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
