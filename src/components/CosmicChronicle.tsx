import React, { useState } from 'react';
import { CosmicEvent } from '../types';
import { History, ChevronUp, ChevronDown, Sparkles, Zap, Wind, Telescope, AlertTriangle } from 'lucide-react';

interface CosmicChronicleProps {
  events: CosmicEvent[];
  millenniaAge: number;
}

export const CosmicChronicle: React.FC<CosmicChronicleProps> = ({ events, millenniaAge }) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const getEventIcon = (type: CosmicEvent['type']) => {
    switch (type) {
      case 'spark':
        return <Sparkles className="w-3 h-3 text-amber-400" />;
      case 'fusion':
      case 'crystallization':
        return <Zap className="w-3 h-3 text-cyan-400" />;
      case 'wish':
        return <Wind className="w-3 h-3 text-emerald-400" />;
      case 'recognition':
        return <Telescope className="w-3 h-3 text-amber-300" />;
      case 'supernova':
      case 'decay':
        return <AlertTriangle className="w-3 h-3 text-rose-400" />;
      default:
        return <Sparkles className="w-3 h-3 text-slate-400" />;
    }
  };

  const latestEvent = events[events.length - 1];

  return (
    <aside 
      id="paramecia-cosmic-chronicle"
      aria-label="Cosmic Chronicle"
      className="absolute bottom-3 left-3 right-3 sm:left-6 sm:right-6 z-20 pointer-events-auto flex flex-col items-center"
    >
      <div className="w-full max-w-3xl bg-[#080d1e]/90 backdrop-blur-md border border-slate-800/90 rounded-xl shadow-2xl overflow-hidden transition-all duration-300">
        {/* Toggle Bar / Latest Feed Line */}
        <div 
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center justify-between px-3.5 py-2 cursor-pointer hover:bg-slate-900/50 transition-colors select-none text-xs font-mono"
        >
          <div className="flex items-center gap-2 overflow-hidden mr-2">
            <div className="flex items-center gap-1.5 text-indigo-400 font-semibold uppercase tracking-wider shrink-0">
              <History className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Chronicle:</span>
            </div>
            {latestEvent ? (
              <div className="flex items-center gap-1.5 truncate text-slate-300">
                {getEventIcon(latestEvent.type)}
                <span className="text-slate-500 shrink-0">[{latestEvent.millennia}M]</span>
                <span className="truncate">{latestEvent.text}</span>
              </div>
            ) : (
              <span className="text-slate-500 italic">The primordial void is still...</span>
            )}
          </div>

          <button 
            className="p-1 text-slate-400 hover:text-white shrink-0"
            title={isExpanded ? "Collapse Chronicle" : "Expand Chronicle"}
          >
            {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </button>
        </div>

        {/* Expanded Event History Feed */}
        {isExpanded && (
          <div className="max-h-48 overflow-y-auto px-4 py-2 border-t border-slate-800/80 space-y-1.5 text-xs font-mono">
            {events.length === 0 ? (
              <p className="text-slate-500 italic py-2 text-center">No major cosmological events yet.</p>
            ) : (
              [...events].reverse().map((ev) => (
                <div key={ev.id} className="flex items-start gap-2 py-1 border-b border-slate-900/60 last:border-0">
                  <span className="mt-0.5">{getEventIcon(ev.type)}</span>
                  <span className="text-slate-500 shrink-0">[{ev.millennia}M]</span>
                  <span className="text-slate-300 flex-1 leading-snug">{ev.text}</span>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </aside>
  );
};
