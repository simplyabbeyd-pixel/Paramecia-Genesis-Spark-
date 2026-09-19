import React, { useState } from 'react';
import { SparkType, Idea } from '../types';
import { SPARK_COLORS } from '../data/elements';
import { X, Sparkles, Wand2, Loader2, ArrowRight } from 'lucide-react';
import { cosmicAudio } from '../utils/audio';

interface CosmicManifestModalProps {
  onClose: () => void;
  onSpawnCustomIdea: (newIdea: Partial<Idea>) => void;
}

export const CosmicManifestModal: React.FC<CosmicManifestModalProps> = ({
  onClose,
  onSpawnCustomIdea,
}) => {
  const [concept, setConcept] = useState('');
  const [chosenSparkType, setChosenSparkType] = useState<SparkType>('desire');
  const [loading, setLoading] = useState(false);
  const [synthesizedResult, setSynthesizedResult] = useState<any>(null);

  const samplePrompts = [
    "A single second of cosmic desire in the dark void",
    "Quicksilver Mercury wandering without destination",
    "An ancient affinity striving to be remembered",
    "A weightless notion awakening to its own sentience",
    "A wish that fell into cold space and formed mass"
  ];

  const handleSynthesize = async () => {
    setLoading(true);
    setSynthesizedResult(null);
    try {
      const res = await fetch('/api/void/synthesize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ concept: concept || "The First Desire" }),
      });
      const data = await res.json();
      setSynthesizedResult(data);
      cosmicAudio.playSparkIgnite(1.4);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleManifestInCosmos = () => {
    if (!synthesizedResult) return;
    onSpawnCustomIdea({
      name: synthesizedResult.name || concept || "Newborn Impulse",
      symbol: synthesizedResult.symbol || "Nm",
      sparkType: (synthesizedResult.sparkType?.toLowerCase() as SparkType) || chosenSparkType,
      mass: synthesizedResult.mass || 24,
      charge: synthesizedResult.charge || 2,
      observableBelief: synthesizedResult.observableBelief || "That all sparks return to the void",
      internalMonologue: synthesizedResult.description || "I awaken. Let the telescope find me.",
    });
    cosmicAudio.playChargeElectric();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-fade-in">
      <div 
        id="cosmic-manifest-modal"
        className="relative w-full max-w-xl max-h-[92vh] overflow-y-auto bg-[#070b19] border border-slate-700/80 rounded-2xl shadow-2xl p-5 sm:p-7 text-slate-200"
      >
        {/* Close Button */}
        <button
          id="btn-close-manifest"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="mb-5">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-amber-400 mb-1">
            <Sparkles className="w-4 h-4" />
            <span>Primordial Genesis Forge</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold font-['Cinzel'] text-white">
            Ignite an Idea from the Void
          </h2>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Whisper an intention into the dark. Paramecia will crystallize it into a living, sentient idea with periodic mass.
          </p>
        </div>

        {/* Input Form */}
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-mono text-slate-400 mb-1.5">
              The Cosmic Impulse / Dream / Notion:
            </label>
            <input
              type="text"
              value={concept}
              onChange={(e) => setConcept(e.target.value)}
              placeholder="e.g. A longing to be recognized across millennia..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-amber-500 transition-colors font-sans"
            />
          </div>

          {/* Quick Prompts */}
          <div>
            <span className="text-[11px] font-mono text-slate-400 block mb-1.5">
              Or invoke a primal Paramecia impulse:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {samplePrompts.map((p) => (
                <button
                  key={p}
                  onClick={() => setConcept(p)}
                  className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-slate-300 transition-colors"
                >
                  "{p.slice(0, 32)}..."
                </button>
              ))}
            </div>
          </div>

          {/* Spark Archetype Selection */}
          <div>
            <span className="text-xs font-mono text-slate-400 block mb-1.5">
              Primary Spark Resonance:
            </span>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
              {(['desire', 'love', 'mercury', 'movement', 'wonder', 'entropy'] as SparkType[]).map((st) => {
                const info = SPARK_COLORS[st];
                const isSelected = chosenSparkType === st;
                return (
                  <button
                    key={st}
                    onClick={() => setChosenSparkType(st)}
                    className={`py-1.5 px-2 rounded-lg border text-center text-xs transition-all ${
                      isSelected
                        ? 'bg-slate-800 border-amber-400 text-white font-semibold'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <span className="block text-sm mb-0.5">{info.emoji}</span>
                    <span className="text-[10px] capitalize">{info.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Generate Button */}
          <button
            id="btn-synthesize-idea"
            onClick={handleSynthesize}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-amber-600 via-orange-600 to-purple-600 hover:from-amber-500 hover:to-purple-500 text-white text-xs font-bold font-mono tracking-wider uppercase shadow-lg transition-all disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-amber-200" />
                <span>Stirring the Primordial Void...</span>
              </>
            ) : (
              <>
                <Wand2 className="w-4 h-4 text-amber-200" />
                <span>Ignite into Existence</span>
              </>
            )}
          </button>
        </div>

        {/* Synthesized Output Preview */}
        {synthesizedResult && (
          <div className="mt-5 p-4 rounded-xl bg-slate-950/90 border border-amber-500/50 shadow-inner animate-fade-in">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-lg bg-slate-900 border border-amber-400 flex items-center justify-center font-bold font-mono text-amber-300 text-lg">
                  {synthesizedResult.symbol || "Id"}
                </div>
                <div>
                  <h4 className="text-sm font-bold font-['Cinzel'] text-white">
                    {synthesizedResult.name}
                  </h4>
                  <span className="text-[10px] font-mono text-amber-400 capitalize">
                    {synthesizedResult.sparkType} Spark • {synthesizedResult.mass} amu • {'⚡️'.repeat(synthesizedResult.charge || 2)}
                  </span>
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-300 italic mb-2">
              "{synthesizedResult.observableBelief}"
            </p>
            <p className="text-[11px] text-slate-400 font-sans leading-relaxed">
              {synthesizedResult.description}
            </p>

            <button
              id="btn-manifest-confirm"
              onClick={handleManifestInCosmos}
              className="mt-3 w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow transition-colors"
            >
              <span>Release into Universe</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
