import React from 'react';
import { SparkType } from '../types';
import { SPARK_COLORS } from '../data/elements';
import { 
  Sparkles, 
  Wind, 
  Zap, 
  BatteryLow, 
  Telescope, 
  Volume2, 
  VolumeX, 
  BookOpen, 
  Grid3X3, 
  PlusCircle, 
  Play, 
  Pause, 
  FastForward,
  RotateCcw,
  HardDrive
} from 'lucide-react';

interface CosmosToolbarProps {
  activeTool: 'spark' | 'wish' | 'charge' | 'drain' | 'inspect';
  selectedSparkType: SparkType;
  millenniaAge: number;
  millenniaSpeed: number;
  isMuted: boolean;
  ideasCount: number;
  sparksCount: number;
  wishesCount: number;
  onSetTool: (tool: 'spark' | 'wish' | 'charge' | 'drain' | 'inspect') => void;
  onSetSparkType: (type: SparkType) => void;
  onSetSpeed: (speed: number) => void;
  onToggleSound: () => void;
  onOpenPeriodicTable: () => void;
  onOpenCodex: () => void;
  onOpenSynthesizer: () => void;
  onOpenDrive?: () => void;
  onResetCosmos: () => void;
}

export const CosmosToolbar: React.FC<CosmosToolbarProps> = ({
  activeTool,
  selectedSparkType,
  millenniaAge,
  millenniaSpeed,
  isMuted,
  ideasCount,
  sparksCount,
  wishesCount,
  onSetTool,
  onSetSparkType,
  onSetSpeed,
  onToggleSound,
  onOpenPeriodicTable,
  onOpenCodex,
  onOpenSynthesizer,
  onOpenDrive,
  onResetCosmos,
}) => {
  const sparkTypes: SparkType[] = ['desire', 'love', 'mercury', 'movement', 'wonder', 'entropy'];

  return (
    <header className="absolute top-0 left-0 right-0 z-20 pointer-events-none p-3 sm:p-4 flex flex-col gap-2">
      {/* Top Bar: Universe Title, Millennia Counter & Global Modals */}
      <div className="flex items-center justify-between gap-2 pointer-events-auto bg-[#080d1e]/85 backdrop-blur-md border border-slate-800/80 rounded-xl px-4 py-2.5 shadow-2xl">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500/20 via-purple-500/20 to-cyan-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300 font-bold text-base shadow-inner">
            ✨
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-bold tracking-wider font-['Cinzel'] text-slate-100 uppercase">
                Paramecia
              </h1>
              <span className="hidden md:inline-block text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-indigo-950/70 border border-indigo-700/50 text-indigo-300">
                Homebrew Cosmos
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-mono hidden sm:block">
              ✨ Endless Time • Entropy & Natural Replenishment Cycles across Millennia
            </p>
          </div>
        </div>

        {/* Center: Live Cosmic Stats */}
        <div className="hidden lg:flex items-center gap-6 px-4 py-1 rounded-lg bg-slate-950/60 border border-slate-800/60 text-xs font-mono">
          <div className="flex items-center gap-1.5 text-amber-300/90">
            <span className="text-slate-400">Epoch:</span>
            <span className="font-bold text-slate-100">{Math.floor(millenniaAge).toLocaleString()}</span>
            <span className="text-[10px] text-slate-500">Millennia</span>
          </div>
          <div className="h-3 w-px bg-slate-800" />
          <div className="flex items-center gap-3 text-slate-300">
            <span 
              className="flex items-center gap-1 cursor-help"
              title="Cosmic Entropy reduces spark energy and size over time, triggering natural replenishment condensation in the void"
            >
              <span>✨ {sparksCount} Sparks</span>
              <span className="text-[9px] px-1 py-0.2 rounded bg-indigo-950/70 border border-indigo-700/50 text-indigo-300">Entropy Cycle</span>
            </span>
            <span>💡 {ideasCount} Ideas</span>
            <span>🎋 {wishesCount} Wishes</span>
          </div>
        </div>

        {/* Right Actions: Modals, Sound, Speed */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Google Drive Vault Button */}
          {onOpenDrive && (
            <button
              id="btn-open-google-drive"
              onClick={onOpenDrive}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg bg-blue-950/70 hover:bg-blue-900/80 border border-blue-600/60 text-blue-200 transition-colors shadow-sm"
              title="Google Drive Cosmic Vault & Cloud Archives"
            >
              <HardDrive className="w-3.5 h-3.5 text-blue-400" />
              <span className="hidden sm:inline">Drive Vault</span>
            </button>
          )}

          {/* Synthesizer Button */}
          <button
            id="btn-open-synthesizer"
            onClick={onOpenSynthesizer}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-gradient-to-r from-amber-500/20 to-orange-500/20 hover:from-amber-500/30 hover:to-orange-500/30 border border-amber-500/40 text-amber-200 transition-colors shadow-sm"
            title="Ignite an Idea from the Void with Gemini"
          >
            <PlusCircle className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Ignite Idea</span>
          </button>

          {/* Periodic Table Button */}
          <button
            id="btn-open-periodic-table"
            onClick={onOpenPeriodicTable}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 text-slate-200 transition-colors"
            title="Periodic Table of Paramecia Elements"
          >
            <Grid3X3 className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden md:inline">Periodic Table</span>
          </button>

          {/* Codex Lore Button */}
          <button
            id="btn-open-codex"
            onClick={onOpenCodex}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 text-slate-200 transition-colors"
            title="Cosmology Lore Codex"
          >
            <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden md:inline">Codex</span>
          </button>

          {/* Sound Toggle */}
          <button
            id="btn-toggle-sound"
            onClick={onToggleSound}
            className={`p-1.5 rounded-lg border transition-all flex items-center gap-1.5 text-xs ${
              isMuted 
                ? 'bg-slate-900 border-slate-800 text-slate-500 hover:text-slate-300' 
                : 'bg-emerald-950/70 border-emerald-500/60 text-emerald-300 hover:bg-emerald-900/60 shadow-[0_0_12px_rgba(16,185,129,0.2)]'
            }`}
            title={isMuted ? "Unmute Generative Soundscape (morphs pitch & texture with time speed)" : "Mute Generative Soundscape"}
          >
            {isMuted ? (
              <VolumeX className="w-4 h-4" />
            ) : (
              <>
                <Volume2 className="w-4 h-4 animate-pulse text-emerald-400" />
                <span className="hidden lg:inline text-[10px] font-mono text-emerald-300/90">Soundscape</span>
              </>
            )}
          </button>

          {/* Reset Void */}
          <button
            id="btn-reset-cosmos"
            onClick={onResetCosmos}
            className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-rose-300 hover:border-rose-900/60 transition-colors"
            title="Reset Primordial Cosmos"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Floating Control Shelf: Interaction Tools & Spark Archetypes */}
      <div className="flex flex-wrap items-center justify-between gap-2 pointer-events-auto bg-[#080d1e]/85 backdrop-blur-md border border-slate-800/80 rounded-xl px-3 py-2 shadow-xl">
        {/* Tool Selector */}
        <div className="flex items-center gap-1 bg-slate-950/70 p-1 rounded-lg border border-slate-800">
          <button
            id="tool-spark"
            onClick={() => onSetTool('spark')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium transition-all ${
              activeTool === 'spark'
                ? 'bg-amber-500/20 border border-amber-500/50 text-amber-300 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Click or drag to spawn Sparks ✨"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Spark ✨</span>
          </button>

          <button
            id="tool-wish"
            onClick={() => onSetTool('wish')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium transition-all ${
              activeTool === 'wish'
                ? 'bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Cast a Wish 🎋 to drift on void winds 🌬️"
          >
            <Wind className="w-3.5 h-3.5" />
            <span>Wish 🎋</span>
          </button>

          <button
            id="tool-charge"
            onClick={() => onSetTool('charge')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium transition-all ${
              activeTool === 'charge'
                ? 'bg-cyan-500/20 border border-cyan-500/50 text-cyan-300 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Click an Idea to Charge ⚡️ it with Mass 🧱"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Charge ⚡️</span>
          </button>

          <button
            id="tool-drain"
            onClick={() => onSetTool('drain')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium transition-all ${
              activeTool === 'drain'
                ? 'bg-rose-500/20 border border-rose-500/50 text-rose-300 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Drain energy 🪫 or destabilize towards fission 🧨"
          >
            <BatteryLow className="w-3.5 h-3.5" />
            <span>Drain 🪫</span>
          </button>

          <button
            id="tool-inspect"
            onClick={() => onSetTool('inspect')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium transition-all ${
              activeTool === 'inspect'
                ? 'bg-purple-500/20 border border-purple-500/50 text-purple-300 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Focus the Observatory Telescope 🔭 on an Idea"
          >
            <Telescope className="w-3.5 h-3.5" />
            <span>Observe 🔭</span>
          </button>
        </div>

        {/* Spark Archetype Sub-Selector (when Spark tool is active) */}
        {activeTool === 'spark' && (
          <div className="flex items-center gap-1 overflow-x-auto py-0.5">
            <span className="text-[11px] text-slate-400 font-mono hidden sm:inline mr-1">Archetype:</span>
            {sparkTypes.map((st) => {
              const info = SPARK_COLORS[st];
              const isSelected = selectedSparkType === st;
              return (
                <button
                  key={st}
                  id={`spark-type-${st}`}
                  onClick={() => onSetSparkType(st)}
                  className={`flex items-center gap-1 px-2 py-0.5 rounded text-xs transition-all border ${
                    isSelected
                      ? 'border-slate-300 bg-slate-800 text-white font-medium shadow'
                      : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                  }`}
                  style={{
                    borderColor: isSelected ? info.primary : undefined,
                  }}
                >
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: info.primary }}
                  />
                  <span>{info.label}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* Millennia Time Speed Controls */}
        <div className="flex items-center gap-1 bg-slate-950/70 p-1 rounded-lg border border-slate-800">
          <span className="text-[10px] text-slate-400 font-mono hidden xl:inline px-1">Flow:</span>
          <button
            id="speed-pause"
            onClick={() => onSetSpeed(0)}
            className={`p-1 rounded text-xs ${
              millenniaSpeed === 0 ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Pause Cosmic Millennia (Stillness & Deep Low Frequency Drone)"
          >
            <Pause className="w-3.5 h-3.5" />
          </button>
          <button
            id="speed-0-05x"
            onClick={() => onSetSpeed(0.05)}
            className={`px-1.5 py-0.5 rounded text-[11px] font-mono ${
              millenniaSpeed === 0.05 ? 'bg-indigo-600/50 text-indigo-200 border border-indigo-500/50' : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Eternal Void (0.05x Slowest Time • Cavernous Deep Bass)"
          >
            0.05x
          </button>
          <button
            id="speed-0-1x"
            onClick={() => onSetSpeed(0.1)}
            className={`px-2 py-0.5 rounded text-[11px] font-mono flex items-center gap-1 ${
              millenniaSpeed === 0.1 ? 'bg-indigo-600/60 text-indigo-100 border border-indigo-400/60 shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Endless Time (0.1x Millennia Drift • Solemn Contemplative Soundscape)"
          >
            <Sparkles className="w-2.5 h-2.5 text-amber-300" />
            <span>0.1x (Endless)</span>
          </button>
          <button
            id="speed-0-5x"
            onClick={() => onSetSpeed(0.5)}
            className={`px-1.5 py-0.5 rounded text-[11px] font-mono ${
              millenniaSpeed === 0.5 ? 'bg-indigo-600/50 text-indigo-200 border border-indigo-500/50' : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Serene Drift (0.5x • Resonant Cosmic Harmonic Chords)"
          >
            0.5x
          </button>
          <button
            id="speed-1x"
            onClick={() => onSetSpeed(1)}
            className={`px-1.5 py-0.5 rounded text-[11px] font-mono ${
              millenniaSpeed === 1 ? 'bg-indigo-600/50 text-indigo-200 border border-indigo-500/50' : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Epoch Flow (1x • Harmonic Forward Motion & Lighter Ether)"
          >
            1x
          </button>
          <button
            id="speed-5x"
            onClick={() => onSetSpeed(5)}
            className={`p-1 rounded text-xs ${
              millenniaSpeed === 5 ? 'bg-amber-600/50 text-amber-200 border border-amber-500/50' : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Accelerate Cosmic Flow (5x • High Pitch Radiant Shimmer & Air)"
          >
            <FastForward className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
};
