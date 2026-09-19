import React, { useState } from 'react';
import { PeriodicElement, SparkType } from '../types';
import { PARAMECIA_ELEMENTS, SPARK_COLORS } from '../data/elements';
import { X, Sparkles, Scale, Zap, Info, Plus } from 'lucide-react';
import { cosmicAudio } from '../utils/audio';

interface PeriodicTableModalProps {
  onClose: () => void;
  onSpawnElementIdea: (element: PeriodicElement) => void;
}

export const PeriodicTableModal: React.FC<PeriodicTableModalProps> = ({
  onClose,
  onSpawnElementIdea,
}) => {
  const [selectedElement, setSelectedElement] = useState<PeriodicElement>(PARAMECIA_ELEMENTS[0]);
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const categories = ['all', 'Sparkide', 'Notionoid', 'Sentient', 'Beliefite', 'Remembrance', 'Void Residue'];

  const filteredElements = filterCategory === 'all'
    ? PARAMECIA_ELEMENTS
    : PARAMECIA_ELEMENTS.filter((el) => el.category === filterCategory);

  const activeSpark = SPARK_COLORS[selectedElement.sparkPrimary] || SPARK_COLORS.desire;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-fade-in">
      <div 
        id="periodic-table-modal"
        className="relative w-full max-w-5xl max-h-[92vh] overflow-y-auto bg-[#070b19] border border-slate-700/80 rounded-2xl shadow-2xl p-5 sm:p-7 text-slate-200"
      >
        {/* Close Button */}
        <button
          id="btn-close-periodic-table"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-cyan-400 mb-1">
            <Scale className="w-4 h-4" />
            <span>Cosmological Chemistry of Paramecia</span>
          </div>
          <h2 className="text-2xl font-bold font-['Cinzel'] text-white">
            The Periodic Table of Charged Ideas
          </h2>
          <p className="text-xs text-slate-400 font-mono mt-1">
            "Forming periodic elements which gain mass as the sparks charge... or work to destroy or drain the idea and sparks that created it."
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center gap-1.5 mb-6">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-3 py-1 rounded-lg text-xs font-mono transition-all border ${
                filterCategory === cat
                  ? 'bg-slate-800 border-cyan-500 text-cyan-300 font-semibold shadow'
                  : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {cat === 'all' ? 'All Elements' : cat}
            </button>
          ))}
        </div>

        {/* Table & Inspector Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Elements Tiles Grid */}
          <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
            {filteredElements.map((el) => {
              const isSelected = selectedElement.atomicNumber === el.atomicNumber;
              const sp = SPARK_COLORS[el.sparkPrimary];
              return (
                <div
                  key={el.atomicNumber}
                  onClick={() => {
                    setSelectedElement(el);
                    cosmicAudio.playSparkIgnite(1 + el.atomicNumber * 0.05);
                  }}
                  className={`p-3 rounded-xl border cursor-pointer transition-all duration-200 flex flex-col justify-between ${
                    isSelected
                      ? 'bg-slate-800/90 border-cyan-400 shadow-lg scale-[1.02]'
                      : 'bg-slate-950/70 border-slate-800/90 hover:border-slate-700 hover:bg-slate-900/60'
                  }`}
                  style={{
                    boxShadow: isSelected ? `0 0 15px ${sp.glow}` : undefined,
                  }}
                >
                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                    <span>#{el.atomicNumber}</span>
                    <span className="text-[9px] px-1 rounded bg-slate-900 border border-slate-800">
                      {el.category.slice(0, 4)}
                    </span>
                  </div>

                  <div className="my-2">
                    <span className="text-2xl font-bold font-mono text-white tracking-tighter">
                      {el.symbol}
                    </span>
                    <h4 className="text-xs font-semibold text-slate-200 truncate">
                      {el.name}
                    </h4>
                  </div>

                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 border-t border-slate-800/60 pt-1.5">
                    <span>{el.massAmu} amu</span>
                    <span className="text-amber-400">{'⚡️'.repeat(el.chargeRequisite)}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Selected Element Detail Inspector */}
          <div className="lg:col-span-4 bg-slate-950/80 border border-slate-800 rounded-xl p-5 flex flex-col justify-between gap-4">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div 
                  className="w-16 h-16 rounded-xl border-2 flex flex-col items-center justify-center bg-slate-900 shadow-md"
                  style={{ borderColor: activeSpark.primary }}
                >
                  <span className="text-2xl font-bold font-mono text-white">
                    {selectedElement.symbol}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">
                    #{selectedElement.atomicNumber}
                  </span>
                </div>
                <div className="text-right font-mono text-xs text-slate-400">
                  <span className="text-amber-400 text-sm">{'⚡️'.repeat(selectedElement.chargeRequisite)}</span>
                  <p>Charge Needed</p>
                  <p className="text-slate-200 font-bold">{selectedElement.massAmu} amu</p>
                </div>
              </div>

              <div className="mt-3">
                <span className="text-[11px] font-mono uppercase tracking-widest text-cyan-400">
                  {selectedElement.category}
                </span>
                <h3 className="text-xl font-bold font-['Cinzel'] text-white">
                  {selectedElement.name}
                </h3>
              </div>

              <div className="mt-3 space-y-2 text-xs font-mono text-slate-300">
                <div className="flex justify-between border-b border-slate-800/60 py-1">
                  <span className="text-slate-500">Primary Spark:</span>
                  <span className="font-semibold text-slate-200 capitalize">{selectedElement.sparkPrimary}</span>
                </div>
                <div className="flex justify-between border-b border-slate-800/60 py-1">
                  <span className="text-slate-500">Density Lattice:</span>
                  <span className="text-slate-200">{selectedElement.density}</span>
                </div>
                <div className="flex justify-between border-b border-slate-800/60 py-1">
                  <span className="text-slate-500">Half-Life:</span>
                  <span className="text-amber-300">{selectedElement.halfLifeMillennia} {selectedElement.halfLifeMillennia === 'Infinite' ? '' : 'Millennia'}</span>
                </div>
              </div>

              <p className="text-xs text-slate-300 mt-4 leading-relaxed">
                {selectedElement.description}
              </p>

              <blockquote className="mt-3 p-2.5 rounded-lg bg-slate-900/90 border-l-2 border-cyan-500 text-[11px] font-serif italic text-slate-400">
                "{selectedElement.loreQuote}"
              </blockquote>
            </div>

            {/* Spawn Element into Universe Button */}
            <button
              id="btn-spawn-element"
              onClick={() => {
                onSpawnElementIdea(selectedElement);
                cosmicAudio.playChargeElectric();
                onClose();
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-md transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Manifest {selectedElement.name} in Cosmos</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
