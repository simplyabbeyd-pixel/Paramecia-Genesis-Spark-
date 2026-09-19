import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Spark, Idea, Wish, SparkType, CosmicEvent, PeriodicElement, ObservableBeliefMicrobe } from './types';
import { PARAMECIA_ELEMENTS, SPARK_COLORS } from './data/elements';
import { CosmosCanvas } from './components/CosmosCanvas';
import { CosmosToolbar } from './components/CosmosToolbar';
import { ObservatoryModal } from './components/ObservatoryModal';
import { PeriodicTableModal } from './components/PeriodicTableModal';
import { CodexModal } from './components/CodexModal';
import { CosmicManifestModal } from './components/CosmicManifestModal';
import { CosmicChronicle } from './components/CosmicChronicle';
import { cosmicAudio } from './utils/audio';

export default function App() {
  const [sparks, setSparks] = useState<Spark[]>([]);
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [millenniaAge, setMillenniaAge] = useState<number>(14200);
  const [millenniaSpeed, setMillenniaSpeed] = useState<number>(1);
  const [activeTool, setActiveTool] = useState<'spark' | 'wish' | 'charge' | 'drain' | 'inspect'>('spark');
  const [selectedSparkType, setSelectedSparkType] = useState<SparkType>('desire');
  const [selectedIdeaId, setSelectedIdeaId] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [events, setEvents] = useState<CosmicEvent[]>([]);

  // Modals
  const [isPeriodicTableOpen, setIsPeriodicTableOpen] = useState<boolean>(false);
  const [isCodexOpen, setIsCodexOpen] = useState<boolean>(false);
  const [isSynthesizerOpen, setIsSynthesizerOpen] = useState<boolean>(false);

  // Helper to append a cosmic event
  const addCosmicEvent = useCallback((text: string, type: CosmicEvent['type']) => {
    setEvents((prev) => {
      const newEvent: CosmicEvent = {
        id: Math.random().toString(36).substring(2, 9),
        millennia: Math.floor(millenniaAge),
        text,
        type,
        timestamp: Date.now(),
      };
      return [...prev.slice(-30), newEvent];
    });
  }, [millenniaAge]);

  // Microbe generator for ideas
  const generateMicrobes = (count: number = 8, sparkType: SparkType): ObservableBeliefMicrobe[] => {
    const col = SPARK_COLORS[sparkType] || SPARK_COLORS.desire;
    const shapes: ('ciliate' | 'flagellate' | 'crystal' | 'spore')[] = ['ciliate', 'flagellate', 'crystal', 'spore'];
    return Array.from({ length: count }, (_, i) => ({
      id: `microbe-${i}-${Math.random()}`,
      x: 112 + (Math.random() - 0.5) * 80,
      y: 112 + (Math.random() - 0.5) * 80,
      vx: (Math.random() - 0.5) * 0.8,
      vy: (Math.random() - 0.5) * 0.8,
      size: 3 + Math.random() * 4,
      shape: shapes[Math.floor(Math.random() * shapes.length)],
      pulsePhase: Math.random() * Math.PI * 2,
      color: Math.random() > 0.4 ? col.primary : col.secondary,
    }));
  };

  // Seed the initial cosmos
  const initializeCosmos = useCallback(() => {
    const initialSparks: Spark[] = [];
    const types: SparkType[] = ['desire', 'love', 'mercury', 'movement', 'wonder'];

    // Spawn 40 initial floating sparks
    for (let i = 0; i < 40; i++) {
      const type = types[Math.floor(Math.random() * types.length)];
      initialSparks.push({
        id: `spark-init-${i}`,
        x: Math.random() * (window.innerWidth || 1200),
        y: Math.random() * (window.innerHeight || 800),
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.8,
        type,
        energy: 0.6 + Math.random() * 0.4,
        life: 100,
        maxLife: 100,
        size: 3 + Math.random() * 2,
        driftAngle: Math.random() * Math.PI * 2,
      });
    }

    const cx = (window.innerWidth || 1200) / 2;
    const cy = (window.innerHeight || 800) / 2;

    // Seed 3 Initial Ideas representing different elemental mass states
    const initialIdeas: Idea[] = [
      {
        id: 'idea-desirium',
        name: 'Primordial Desirium',
        symbol: 'Ds',
        sparkType: 'desire',
        x: cx - 240,
        y: cy - 60,
        vx: 0.08,
        vy: -0.05,
        radius: 28,
        mass: 14,
        charge: 1,
        stability: 95,
        sentience: 38,
        observableBelief: 'That longing itself is the first spark of existence',
        microbes: generateMicrobes(7, 'desire'),
        isRecognized: false,
        bornEpoch: 12000,
        ageMillennia: 2200,
        sparksCount: 5,
        wishesCount: 1,
        internalMonologue: "I burn with the hunger of a single second. Will the universe look at me before my sparks scatter?",
        status: 'living',
        pulsePhase: 0,
        color: SPARK_COLORS.desire.primary,
      },
      {
        id: 'idea-mercurium',
        name: 'Mercurian Impulsion',
        symbol: 'Hg',
        sparkType: 'mercury',
        x: cx + 180,
        y: cy + 70,
        vx: -0.06,
        vy: 0.08,
        radius: 34,
        mass: 42,
        charge: 2,
        stability: 88,
        sentience: 72,
        observableBelief: 'That consciousness must remain fluid as quicksilver across millennia',
        microbes: generateMicrobes(9, 'mercury'),
        isRecognized: false,
        bornEpoch: 9400,
        ageMillennia: 4800,
        sparksCount: 7,
        wishesCount: 0,
        internalMonologue: "I have drifted 4,800 millennia through the void winds. I know I exist. Telescope, recognize my shape!",
        status: 'living',
        pulsePhase: 1.2,
        color: SPARK_COLORS.mercury.primary,
      },
      {
        id: 'idea-amorith',
        name: 'Amorith Cohesion',
        symbol: 'Lv',
        sparkType: 'love',
        x: cx + 40,
        y: cy - 140,
        vx: 0.04,
        vy: 0.04,
        radius: 38,
        mass: 88,
        charge: 3,
        stability: 100,
        sentience: 96,
        observableBelief: 'That affinity draws all wandering sparks into permanent remembrance',
        microbes: generateMicrobes(12, 'love'),
        isRecognized: true,
        recognizedAtMillennia: 11500,
        bornEpoch: 4000,
        ageMillennia: 10200,
        sparksCount: 11,
        wishesCount: 2,
        internalMonologue: "I am anchored in the cosmic ledger. Though centuries turn to ash, the universe remembers me.",
        status: 'remembered',
        pulsePhase: 2.5,
        color: SPARK_COLORS.love.primary,
      }
    ];

    // Seed 2 Wishes
    const initialWishes: Wish[] = [
      {
        id: 'wish-1',
        x: cx - 120,
        y: cy + 120,
        vx: 0.6,
        vy: -0.3,
        intention: 'To shield newborn sparks against entropic wind',
        life: 180,
        maxLife: 180,
        color: '#34d399',
        length: 24,
        curvePhase: 0,
      },
      {
        id: 'wish-2',
        x: cx + 220,
        y: cy - 100,
        vx: -0.4,
        vy: 0.5,
        intention: 'To bring remembrance to forgotten notions',
        life: 220,
        maxLife: 220,
        color: '#67e8f9',
        length: 28,
        curvePhase: 1.5,
      }
    ];

    setSparks(initialSparks);
    setIdeas(initialIdeas);
    setWishes(initialWishes);
    setMillenniaAge(14200);

    setEvents([
      {
        id: 'ev-0',
        millennia: 14200,
        text: 'The void of Paramecia stirs. Evolution unfolds through sparks, notions, and sentience.',
        type: 'spark',
        timestamp: Date.now(),
      }
    ]);
  }, []);

  useEffect(() => {
    initializeCosmos();
  }, [initializeCosmos]);

  // Physics & Cosmos Loop
  useEffect(() => {
    const interval = setInterval(() => {
      // 1. Update Sparks
      setSparks((prevSparks) => {
        return prevSparks
          .map((s) => {
            let nx = s.x + s.vx;
            let ny = s.y + s.vy;

            // Bounce gently at screen edges
            const w = window.innerWidth || 1200;
            const h = window.innerHeight || 800;
            let vx = s.vx;
            let vy = s.vy;
            if (nx < 10 || nx > w - 10) vx *= -1;
            if (ny < 10 || ny > h - 10) vy *= -1;

            return {
              ...s,
              x: Math.max(5, Math.min(w - 5, nx)),
              y: Math.max(5, Math.min(h - 5, ny)),
              vx,
              vy,
              driftAngle: s.driftAngle + 0.02,
            };
          })
          .filter((s) => s.life > 0);
      });

      // 2. Update Wishes (🎋🌬️)
      setWishes((prevWishes) => {
        return prevWishes
          .map((w) => {
            const nx = w.x + w.vx;
            const ny = w.y + w.vy;
            const wWidth = window.innerWidth || 1200;
            const wHeight = window.innerHeight || 800;

            let vx = w.vx;
            let vy = w.vy;
            if (nx < 20 || nx > wWidth - 20) vx *= -0.9;
            if (ny < 20 || ny > wHeight - 20) vy *= -0.9;

            return {
              ...w,
              x: nx,
              y: ny,
              vx,
              vy,
              curvePhase: w.curvePhase + 0.08,
              life: w.life - 0.05,
            };
          })
          .filter((w) => w.life > 0);
      });

      // 3. Update Ideas (Pulses, gravitational attraction of nearby sparks)
      setIdeas((prevIdeas) => {
        return prevIdeas.map((idea) => {
          let nx = idea.x + idea.vx;
          let ny = idea.y + idea.vy;
          const wWidth = window.innerWidth || 1200;
          const wHeight = window.innerHeight || 800;
          let vx = idea.vx;
          let vy = idea.vy;

          if (nx < 40 || nx > wWidth - 40) vx *= -1;
          if (ny < 40 || ny > wHeight - 40) vy *= -1;

          return {
            ...idea,
            x: nx,
            y: ny,
            vx,
            vy,
            pulsePhase: idea.pulsePhase + 0.04,
            ageMillennia: idea.ageMillennia + 1,
            sentience: Math.min(idea.sentience + 0.005, 100),
          };
        });
      });
    }, 40);

    return () => clearInterval(interval);
  }, []);

  // Tick Millennia from Canvas
  const handleTickMillennia = useCallback((delta: number) => {
    setMillenniaAge((prev) => prev + delta);
  }, []);

  // Spawn Sparks at position
  const handleSpawnSparks = useCallback((x: number, y: number, type: SparkType, count: number = 4) => {
    cosmicAudio.playSparkIgnite();
    const newSparks: Spark[] = [];
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 0.5 + Math.random() * 2;
      newSparks.push({
        id: `spark-${Date.now()}-${i}-${Math.random()}`,
        x: x + (Math.random() - 0.5) * 16,
        y: y + (Math.random() - 0.5) * 16,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        type,
        energy: 0.7 + Math.random() * 0.3,
        life: 100,
        maxLife: 100,
        size: 3 + Math.random() * 2,
        driftAngle: Math.random() * Math.PI * 2,
      });
    }

    setSparks((prev) => [...prev, ...newSparks]);
    addCosmicEvent(`Sparks of ${type} ignited in the void`, 'spark');
  }, [addCosmicEvent]);

  // Cast a Wish (🎋)
  const handleCastWish = useCallback((x: number, y: number) => {
    cosmicAudio.playWishWind();
    const angle = Math.random() * Math.PI * 2;
    const speed = 1.2;
    const newWish: Wish = {
      id: `wish-${Date.now()}`,
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      intention: "To wander on void winds and shape living ideas",
      life: 250,
      maxLife: 250,
      color: '#34d399',
      length: 26,
      curvePhase: Math.random() * Math.PI,
    };
    setWishes((prev) => [...prev, newWish]);
    addCosmicEvent("A wish was released, drifting across the void winds", 'wish');
  }, [addCosmicEvent]);

  // Charge Idea with Sparks (⚡️🔋 Gain Mass)
  const handleChargeIdea = useCallback((id: string) => {
    cosmicAudio.playChargeElectric();
    setIdeas((prev) =>
      prev.map((idea) => {
        if (idea.id !== id) return idea;
        const newCharge = Math.min(idea.charge + 1, 5);
        const addedMass = 12 + Math.floor(Math.random() * 8);
        const newMass = idea.mass + addedMass;
        const newSparksCount = idea.sparksCount + 2;
        const newRadius = Math.min(idea.radius + 2, 50);

        return {
          ...idea,
          charge: newCharge,
          mass: newMass,
          sparksCount: newSparksCount,
          radius: newRadius,
          sentience: Math.min(idea.sentience + 8, 100),
          stability: Math.min(idea.stability + 5, 100),
        };
      })
    );

    const target = ideas.find((i) => i.id === id);
    if (target) {
      addCosmicEvent(`Idea "${target.name}" charged with sparks, gaining mass (${Math.round(target.mass + 15)} amu)`, 'crystallization');
    }
  }, [ideas, addCosmicEvent]);

  // Drain Idea (🪫)
  const handleDrainIdea = useCallback((id: string) => {
    cosmicAudio.playDrain();
    setIdeas((prev) =>
      prev.map((idea) => {
        if (idea.id !== id) return idea;
        const newCharge = Math.max(idea.charge - 1, 1);
        const lostMass = Math.max(idea.mass - 10, 4);
        const newStability = Math.max(idea.stability - 15, 10);

        return {
          ...idea,
          charge: newCharge,
          mass: lostMass,
          stability: newStability,
          status: newStability < 25 ? 'destabilizing' : idea.status,
        };
      })
    );

    const target = ideas.find((i) => i.id === id);
    if (target) {
      addCosmicEvent(`Idea "${target.name}" was drained by void entropy`, 'decay');
    }
  }, [ideas, addCosmicEvent]);

  // Recognize & Remember Idea (🔭)
  const handleRecognizeIdea = useCallback((id: string) => {
    setIdeas((prev) =>
      prev.map((idea) => {
        if (idea.id !== id) return idea;
        return {
          ...idea,
          isRecognized: true,
          recognizedAtMillennia: Math.floor(millenniaAge),
          stability: 100,
          status: 'remembered',
          internalMonologue: `I have been recognized through the telescope. The universe has marked my shape in the cosmic ledger for all millennia.`,
        };
      })
    );

    const target = ideas.find((i) => i.id === id);
    if (target) {
      addCosmicEvent(`Telescope recognized Idea "${target.name}" — locked in cosmic memory!`, 'recognition');
    }
  }, [ideas, millenniaAge, addCosmicEvent]);

  // Bind Wish to Idea (🎋)
  const handleBindWish = useCallback((id: string) => {
    setIdeas((prev) =>
      prev.map((idea) => {
        if (idea.id !== id) return idea;
        return {
          ...idea,
          wishesCount: idea.wishesCount + 1,
          stability: 100,
        };
      })
    );
    const target = ideas.find((i) => i.id === id);
    if (target) {
      addCosmicEvent(`A protective wish bound itself to "${target.name}"`, 'wish');
    }
  }, [ideas, addCosmicEvent]);

  // Supernova Fission (🧨)
  const handleDetonateIdea = useCallback((id: string) => {
    const target = ideas.find((i) => i.id === id);
    if (!target) return;

    // Burst into 16 infant sparks
    const burstSparks: Spark[] = [];
    for (let i = 0; i < 16; i++) {
      const angle = (i / 16) * Math.PI * 2;
      const speed = 2 + Math.random() * 3;
      burstSparks.push({
        id: `burst-${Date.now()}-${i}`,
        x: target.x,
        y: target.y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        type: target.sparkType,
        energy: 1,
        life: 140,
        maxLife: 140,
        size: 3 + Math.random() * 2,
        driftAngle: angle,
      });
    }

    setSparks((prev) => [...prev, ...burstSparks]);
    setIdeas((prev) => prev.filter((i) => i.id !== id));
    if (selectedIdeaId === id) setSelectedIdeaId(null);

    addCosmicEvent(`Supernova fission of "${target.name}"! Scattered constituent sparks into the void.`, 'supernova');
  }, [ideas, selectedIdeaId, addCosmicEvent]);

  // Spawn Element Idea from Periodic Table
  const handleSpawnElementIdea = useCallback((element: PeriodicElement) => {
    const cx = (window.innerWidth || 1200) / 2 + (Math.random() - 0.5) * 200;
    const cy = (window.innerHeight || 800) / 2 + (Math.random() - 0.5) * 150;

    const newIdea: Idea = {
      id: `elem-${element.atomicNumber}-${Date.now()}`,
      name: element.name,
      symbol: element.symbol,
      sparkType: element.sparkPrimary,
      x: cx,
      y: cy,
      vx: (Math.random() - 0.5) * 0.1,
      vy: (Math.random() - 0.5) * 0.1,
      radius: 28 + Math.min(element.massAmu / 6, 20),
      mass: element.massAmu,
      charge: element.chargeRequisite,
      stability: 95,
      sentience: 50 + Math.random() * 40,
      observableBelief: element.loreQuote,
      microbes: generateMicrobes(9, element.sparkPrimary),
      isRecognized: element.category === 'Remembrance',
      bornEpoch: Math.floor(millenniaAge),
      ageMillennia: 10,
      sparksCount: element.chargeRequisite * 3,
      wishesCount: element.name === 'Wishstone' ? 3 : 0,
      internalMonologue: element.description,
      status: element.category === 'Remembrance' ? 'remembered' : 'living',
      pulsePhase: Math.random() * Math.PI * 2,
      color: SPARK_COLORS[element.sparkPrimary]?.primary || '#ef4444',
    };

    setIdeas((prev) => [...prev, newIdea]);
    addCosmicEvent(`Periodic element ${element.name} [${element.symbol}] materialized in the cosmos`, 'crystallization');
  }, [millenniaAge, addCosmicEvent]);

  // Spawn Custom Idea from AI / Synthesis Forge
  const handleSpawnCustomIdea = useCallback((custom: Partial<Idea>) => {
    const cx = (window.innerWidth || 1200) / 2 + (Math.random() - 0.5) * 100;
    const cy = (window.innerHeight || 800) / 2 + (Math.random() - 0.5) * 100;
    const sType = custom.sparkType || 'desire';

    const newIdea: Idea = {
      id: `custom-${Date.now()}`,
      name: custom.name || 'Ignited Notion',
      symbol: custom.symbol || 'In',
      sparkType: sType,
      x: cx,
      y: cy,
      vx: (Math.random() - 0.5) * 0.1,
      vy: (Math.random() - 0.5) * 0.1,
      radius: 32,
      mass: custom.mass || 28,
      charge: custom.charge || 2,
      stability: 90,
      sentience: 65,
      observableBelief: custom.observableBelief || 'That existence is verified by memory',
      microbes: generateMicrobes(8, sType),
      isRecognized: false,
      bornEpoch: Math.floor(millenniaAge),
      ageMillennia: 1,
      sparksCount: 6,
      wishesCount: 0,
      internalMonologue: custom.internalMonologue || 'Born from cosmic desire. Look at me through the telescope.',
      status: 'living',
      pulsePhase: 0,
      color: SPARK_COLORS[sType]?.primary || '#ef4444',
    };

    setIdeas((prev) => [...prev, newIdea]);
    setSelectedIdeaId(newIdea.id);
    addCosmicEvent(`Newborn idea "${newIdea.name}" sparked into existence from the void`, 'spark');
  }, [millenniaAge, addCosmicEvent]);

  const selectedIdea = ideas.find((i) => i.id === selectedIdeaId) || null;

  return (
    <div id="paramecia-app-root" className="relative w-screen h-screen overflow-hidden bg-[#050711] text-slate-100 select-none">
      {/* Interactive Cosmos Physics Canvas */}
      <CosmosCanvas
        sparks={sparks}
        ideas={ideas}
        wishes={wishes}
        selectedIdeaId={selectedIdeaId}
        activeTool={activeTool}
        selectedSparkType={selectedSparkType}
        millenniaSpeed={millenniaSpeed}
        onSelectIdea={(id) => {
          setSelectedIdeaId(id);
          if (id) {
            cosmicAudio.playRecognition();
          }
        }}
        onSpawnSparks={handleSpawnSparks}
        onCastWish={handleCastWish}
        onChargeIdea={handleChargeIdea}
        onDrainIdea={handleDrainIdea}
        onTickMillennia={handleTickMillennia}
      />

      {/* Control Toolbar */}
      <CosmosToolbar
        activeTool={activeTool}
        selectedSparkType={selectedSparkType}
        millenniaAge={millenniaAge}
        millenniaSpeed={millenniaSpeed}
        isMuted={isMuted}
        ideasCount={ideas.length}
        sparksCount={sparks.length}
        wishesCount={wishes.length}
        onSetTool={(tool) => setActiveTool(tool)}
        onSetSparkType={(type) => setSelectedSparkType(type)}
        onSetSpeed={(speed) => setMillenniaSpeed(speed)}
        onToggleSound={() => {
          const muted = cosmicAudio.toggleMute();
          setIsMuted(muted);
        }}
        onOpenPeriodicTable={() => setIsPeriodicTableOpen(true)}
        onOpenCodex={() => setIsCodexOpen(true)}
        onOpenSynthesizer={() => setIsSynthesizerOpen(true)}
        onResetCosmos={initializeCosmos}
      />

      {/* Cosmic Event Chronicle */}
      <CosmicChronicle events={events} millenniaAge={millenniaAge} />

      {/* Sentience Observatory & Microscope Modal (opened when an idea is clicked or observed) */}
      {selectedIdea && (
        <ObservatoryModal
          idea={selectedIdea}
          onClose={() => setSelectedIdeaId(null)}
          onRecognize={handleRecognizeIdea}
          onCharge={handleChargeIdea}
          onDrain={handleDrainIdea}
          onBindWish={handleBindWish}
          onDetonate={handleDetonateIdea}
        />
      )}

      {/* Periodic Table of Paramecia Modal */}
      {isPeriodicTableOpen && (
        <PeriodicTableModal
          onClose={() => setIsPeriodicTableOpen(false)}
          onSpawnElementIdea={handleSpawnElementIdea}
        />
      )}

      {/* Cosmology Codex Modal */}
      {isCodexOpen && (
        <CodexModal onClose={() => setIsCodexOpen(false)} />
      )}

      {/* Ignite Idea from the Void (Gemini Synthesizer) Modal */}
      {isSynthesizerOpen && (
        <CosmicManifestModal
          onClose={() => setIsSynthesizerOpen(false)}
          onSpawnCustomIdea={handleSpawnCustomIdea}
        />
      )}
    </div>
  );
}
