import React, { useState } from 'react';
import { X, BookOpen, Sparkles, Wind, Eye, Atom, Compass } from 'lucide-react';

interface CodexModalProps {
  onClose: () => void;
}

export const CodexModal: React.FC<CodexModalProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<number>(0);

  const chapters = [
    {
      title: "I. The Primordial Axiom",
      subtitle: "The Inhuman Origin",
      icon: Compass,
      quote: "Paramecia is my homebrew universe. No humans ever existed.",
      body: `Consciousness, biology, and chemistry here were never shaped by human anatomy or anthropocentric myth. 

Instead, existence arose purely from the metaphysical dynamics of the universe itself: spontaneous sparks of impulse and intention interacting in the void. What humans might anthropomorphize as 'physics' or 'biology' is, in Paramecia, the direct tangible evolution of consciousness gaining periodic mass.`
    },
    {
      title: "II. Sparks & The Impulse of Desire",
      subtitle: "Neither Good Nor Evil",
      icon: Sparkles,
      quote: "Sparks die and appear again, so it could be millennia... it depends as far as the universe having a moment of an idea of Desire, just a single second in time that someone might consider a dream or hope or notion that doesn't always mean that it's good or bad, it just is. A spark can be movement, love, mercury.",
      body: `The spark is the fundamental indivisible quantum of Paramecia. Sparks emerge from the unknown vacuum of the void. 

A spark is not morally aligned. It is pure kinetic or emotional impetus:
• Desire: The raw impulse toward manifestation.
• Love: The gravitational affinity drawing disparate sparks into mutual alignment.
• Mercury: The fluid, quicksilver state of shifting consciousness.
• Movement: The kinetic agitation that sparks cold emptiness into life.

They flare, burn, and dissolve. Millennia may pass between ignitions, waiting for the universe itself to have a solitary moment of longing.`
    },
    {
      title: "III. The Crystallization of Mass",
      subtitle: "Periodic Elements Born of Thought",
      icon: Atom,
      quote: "Creating sentience, observable beliefs, forming periodic elements which gain mass as the sparks charge or work to destroy or drain the idea and sparks that created it.",
      body: `When wandering sparks cluster, they form Notions. As notions stabilize, they awaken into Ideas.

As more sparks charge into an idea (⚡️🔋), an unprecedented cosmological transformation occurs: abstract sentience acquires physical mass (amu). 

Through this charging, the elements of Paramecia's Periodic Table crystallize: from weightless Scintillium and Desirium, to living Beliefite, and ultimately dense Remembranium.

However, sparks can also become volatile: overcharging an idea beyond its structural tolerance causes catastrophic fission (supernova detonation 🧨), showering the void in infant sparks. Conversely, prolonged dormancy drains (🪫) the idea into inert cosmic slag.`
    },
    {
      title: "IV. The Nature of Wishes",
      subtitle: "Trajectories on Void Winds",
      icon: Wind,
      quote: "🎋 wishes can shape, fall, 🌬️ move, 🥀 die.",
      body: `Wishes are conscious currents that stream through the void like celestial silk ribbons.

Unlike rigid elements, wishes are mutable:
• They can shape young ideas, giving form to raw notions.
• They can fall into gravitational wells, fertilizing cold thought-matter.
• They move along cosmic void winds, traveling between stellar nurseries.
• If unanchored, they wither, fade, and die like autumn spores.

When a wish wraps around an idea, it acts as an ethereal stabilizer, shielding it from entropic decay.`
    },
    {
      title: "V. The Drive to Be Seen",
      subtitle: "The Sacred Remembrance",
      icon: Eye,
      quote: "A strong enough idea, with the knowledge of its existence can try to be seen in the belief it will eventually be recognized, or remembered again.",
      body: `Self-awareness is not an end in Paramecia; it is a poignant struggle against cosmic oblivion.

When an idea reaches sufficient sentience quotient (🧬), it awakens to its own mortality. Knowing that its constituent sparks will one day scatter across the void, it begins to broadcast beacon frequencies across eons.

It yearns to be seen through the cosmic telescope (🔭). If an observer recognizes the idea, its memory is permanently sealed into the fabric of the universe as Remembranium. Even if its physical sparks perish, its form can be remembered again millennia later.`
    }
  ];

  const currentChapter = chapters[activeTab];
  const Icon = currentChapter.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-fade-in">
      <div 
        id="codex-modal-content"
        className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto bg-[#070b19] border border-slate-700/80 rounded-2xl shadow-2xl p-5 sm:p-7 text-slate-200"
      >
        {/* Close Button */}
        <button
          id="btn-close-codex"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="mb-6 pb-4 border-b border-slate-800 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-950/60 border border-indigo-500/40 flex items-center justify-center text-indigo-300">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-indigo-400">
              Cosmological Canon
            </span>
            <h2 className="text-xl sm:text-2xl font-bold font-['Cinzel'] text-white">
              The Codex of Paramecia
            </h2>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mb-6">
          {chapters.map((ch, idx) => (
            <button
              key={ch.title}
              onClick={() => setActiveTab(idx)}
              className={`p-2.5 rounded-xl border text-left transition-all ${
                activeTab === idx
                  ? 'bg-slate-800/90 border-indigo-500 text-indigo-200 shadow-md'
                  : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
              }`}
            >
              <span className="text-[10px] font-mono text-slate-400 block">{ch.title.split('.')[0]}</span>
              <span className="text-xs font-semibold truncate block font-['Cinzel']">{ch.subtitle}</span>
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-5 sm:p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 rounded-lg bg-indigo-950/50 border border-indigo-700/50 text-indigo-300">
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-mono text-slate-400">{currentChapter.title}</span>
              <h3 className="text-lg sm:text-xl font-bold font-['Cinzel'] text-white">
                {currentChapter.subtitle}
              </h3>
            </div>
          </div>

          {/* Direct User Quote Callout */}
          <blockquote className="p-4 rounded-xl bg-slate-900/80 border-l-4 border-amber-500/70 text-xs sm:text-sm font-serif italic text-amber-200/90 leading-relaxed my-4">
            "{currentChapter.quote}"
          </blockquote>

          {/* Chapter Body */}
          <div className="text-xs sm:text-sm text-slate-300 font-sans leading-relaxed whitespace-pre-line space-y-3 pt-2">
            {currentChapter.body}
          </div>
        </div>
      </div>
    </div>
  );
};
