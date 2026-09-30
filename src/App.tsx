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
import { GoogleDriveModal } from './components/GoogleDriveModal';
import { cosmicAudio } from './utils/audio';

export default function App() {
  const [sparks, setSparks] = useState<Spark[]>([]);
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [millenniaAge, setMillenniaAge] = useState<number>(14200);
  const [millenniaSpeed, setMillenniaSpeed] = useState<number>(0.1); // 0.1x = Endless Time default
  const [activeTool, setActiveTool] = useState<'spark' | 'wish' | 'charge' | 'drain' | 'inspect'>('spark');
  const [selectedSparkType, setSelectedSparkType] = useState<SparkType>('desire');
  const [selectedIdeaId, setSelectedIdeaId] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [events, setEvents] = useState<CosmicEvent[]>([]);

  // Track ideas that have triggered the high-frequency sentience harmonic swell (>= 90%)
  const triggeredSentienceIdeasRef = useRef<Set<string>>(new Set(['idea-amorith']));
  const lastReplenishSoundTimeRef = useRef<number>(0);
  const lastReplenishEventTimeRef = useRef<number>(0);

  // Modals
  const [isPeriodicTableOpen, setIsPeriodicTableOpen] = useState<boolean>(false);
  const [isCodexOpen, setIsCodexOpen] = useState<boolean>(false);
  const [isSynthesizerOpen, setIsSynthesizerOpen] = useState<boolean>(false);
  const [isDriveOpen, setIsDriveOpen] = useState<boolean>(false);

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

    // Spawn 22 beginning floating sparks adrift in endless time subject to entropy
    for (let i = 0; i < 22; i++) {
      const type = types[Math.floor(Math.random() * types.length)];
      const size = 2.8 + Math.random() * 2.2;
      const energy = 0.65 + Math.random() * 0.35;
      initialSparks.push({
        id: `spark-init-${i}`,
        x: Math.random() * (window.innerWidth || 1200),
        y: Math.random() * (window.innerHeight || 800),
        vx: (Math.random() - 0.5) * 0.05,
        vy: (Math.random() - 0.5) * 0.05,
        type,
        energy,
        initialEnergy: energy,
        life: 700,
        maxLife: 700,
        size,
        initialSize: size,
        entropyRate: 0.0003 + Math.random() * 0.00035,
        driftAngle: Math.random() * Math.PI * 2,
        pulsePhase: Math.random() * Math.PI * 2,
        pulseSpeed: 0.002 + Math.random() * 0.003,
        bornMillennia: 14200,
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
        vx: 0.006,
        vy: -0.004,
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
        vx: -0.005,
        vy: 0.006,
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
        vx: 0.003,
        vy: 0.003,
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
        vx: 0.05,
        vy: -0.025,
        intention: 'To shield newborn sparks against entropic wind',
        life: 750,
        maxLife: 750,
        color: '#34d399',
        length: 24,
        curvePhase: 0,
      },
      {
        id: 'wish-2',
        x: cx + 220,
        y: cy - 100,
        vx: -0.035,
        vy: 0.04,
        intention: 'To bring remembrance to forgotten notions',
        life: 850,
        maxLife: 850,
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
        text: 'The void of Paramecia stirs. Evolution unfolds through sparks, notions, and sentience across endless time.',
        type: 'spark',
        timestamp: Date.now(),
      }
    ]);
  }, []);

  useEffect(() => {
    initializeCosmos();
  }, [initializeCosmos]);

  // Synchronize Generative Ambient Soundscape with Millennia Speed
  useEffect(() => {
    cosmicAudio.setMillenniaSpeed(millenniaSpeed);
  }, [millenniaSpeed]);

  // Physics & Cosmos Loop - Gentle, continuous, meditative eon drift
  useEffect(() => {
    const types: SparkType[] = ['desire', 'love', 'mercury', 'movement', 'wonder'];

    const interval = setInterval(() => {
      // 1. Update Sparks with Entropy Effect & Natural Replenishment Cycle
      setSparks((prevSparks) => {
        const speedFactor = millenniaSpeed;
        if (speedFactor <= 0) return prevSparks;

        const w = window.innerWidth || 1200;
        const h = window.innerHeight || 800;

        let expiredCount = 0;

        const updated: Spark[] = prevSparks
          .map((s): Spark => {
            let nx = s.x + (s.vx + Math.cos(s.driftAngle) * 0.015) * (speedFactor * 3);
            let ny = s.y + (s.vy + Math.sin(s.driftAngle) * 0.015) * (speedFactor * 3);

            // Boundless void toroidal wrap
            const pad = 25;
            if (nx < -pad) nx = w + pad;
            else if (nx > w + pad) nx = -pad;
            if (ny < -pad) ny = h + pad;
            else if (ny > h + pad) ny = -pad;

            // Entropy Effect: gradually reduces energy and size over time
            const rate = s.entropyRate ?? 0.00035;
            const newEnergy = Math.max(0, s.energy - rate * (speedFactor * 0.85));
            const baseSize = s.initialSize ?? s.size;
            // Physical size reduces proportionally as energy diminishes
            const newSize = Math.max(0.6, baseSize * (0.25 + 0.75 * newEnergy));

            return {
              ...s,
              x: nx,
              y: ny,
              energy: newEnergy,
              size: newSize,
              driftAngle: s.driftAngle + 0.002 * speedFactor,
              pulsePhase: (s.pulsePhase ?? 0) + (s.pulseSpeed ?? 0.002) * speedFactor,
              life: s.life - 0.012 * speedFactor,
            };
          })
          .filter((s) => {
            const alive = s.energy > 0.03 && s.life > 0;
            if (!alive) expiredCount++;
            return alive;
          });

        // Natural Void Replenishment Cycle:
        // When floating sparks dwindle or extinguish through entropy, the void naturally condenses fresh sparks
        const targetEquilibrium = 24;
        const deficit = targetEquilibrium - updated.length;
        const now = Date.now();

        // Higher chance when population is below target equilibrium or sparks recently dissolved
        const replenishChance = deficit > 0 ? (0.015 + deficit * 0.007) * speedFactor : 0.003 * speedFactor;

        if ((Math.random() < replenishChance || expiredCount > 0) && updated.length < 32) {
          const spawnBatch = deficit > 6 ? 2 : 1;
          for (let k = 0; k < spawnBatch; k++) {
            const type = types[Math.floor(Math.random() * types.length)];
            const size = 2.8 + Math.random() * 2.2;
            const energy = 0.85 + Math.random() * 0.15; // Vibrant initial energy
            const nascent: Spark = {
              id: `spark-void-${Date.now()}-${k}-${Math.random()}`,
              x: Math.random() * w,
              y: Math.random() * h,
              vx: (Math.random() - 0.5) * 0.05,
              vy: (Math.random() - 0.5) * 0.05,
              type,
              energy,
              initialEnergy: energy,
              life: 680,
              maxLife: 680,
              size,
              initialSize: size,
              entropyRate: 0.0003 + Math.random() * 0.00035,
              driftAngle: Math.random() * Math.PI * 2,
              pulsePhase: 0,
              pulseSpeed: 0.002 + Math.random() * 0.003,
              bornMillennia: Math.floor(millenniaAge),
            };
            updated.push(nascent);
          }

          // Trigger soft celestial chime during void replenishment waves
          if (now - lastReplenishSoundTimeRef.current > 7500 && deficit > 3) {
            lastReplenishSoundTimeRef.current = now;
            cosmicAudio.playReplenishmentSwell();
          }

          // Occasional chronicle entry for natural cycle
          if (now - lastReplenishEventTimeRef.current > 24000 && deficit > 4) {
            lastReplenishEventTimeRef.current = now;
            addCosmicEvent("Natural replenishment cycle: Void condensation seeded fresh sparks", 'spark');
          }
        }

        return updated;
      });

      // 2. Update Wishes (🎋🌬️)
      setWishes((prevWishes) => {
        const speedFactor = millenniaSpeed;
        if (speedFactor <= 0) return prevWishes;

        const wWidth = window.innerWidth || 1200;
        const wHeight = window.innerHeight || 800;

        return prevWishes
          .map((w) => {
            let nx = w.x + w.vx * (speedFactor * 3);
            let ny = w.y + w.vy * (speedFactor * 3);

            const pad = 30;
            if (nx < -pad) nx = wWidth + pad;
            else if (nx > wWidth + pad) nx = -pad;
            if (ny < -pad) ny = wHeight + pad;
            else if (ny > wHeight + pad) ny = -pad;

            return {
              ...w,
              x: nx,
              y: ny,
              curvePhase: w.curvePhase + 0.012 * speedFactor,
              life: w.life - 0.015 * speedFactor,
            };
          })
          .filter((w) => w.life > 0);
      });

      // 3. Update Ideas (Pulses, gravitational attraction of nearby sparks, sentience progression)
      setIdeas((prevIdeas) => {
        const speedFactor = millenniaSpeed;
        if (speedFactor <= 0) return prevIdeas;

        const wWidth = window.innerWidth || 1200;
        const wHeight = window.innerHeight || 800;

        return prevIdeas.map((idea) => {
          let nx = idea.x + idea.vx * (speedFactor * 2);
          let ny = idea.y + idea.vy * (speedFactor * 2);
          let vx = idea.vx;
          let vy = idea.vy;

          if (nx < 40 || nx > wWidth - 40) vx *= -1;
          if (ny < 40 || ny > wHeight - 40) vy *= -1;

          const newSentience = Math.min(idea.sentience + 0.0003 * speedFactor, 100);

          // Trigger subtle, high-frequency harmonic swell when an idea reaches 90 sentience or above
          if (newSentience >= 90 && !triggeredSentienceIdeasRef.current.has(idea.id)) {
            triggeredSentienceIdeasRef.current.add(idea.id);
            cosmicAudio.playSentienceHarmonicSwell(idea.name);
            addCosmicEvent(
              `Idea "${idea.name}" reached transcendent sentience (${Math.round(newSentience)}% 🧬) — high-frequency harmonic swells resonate across the void`,
              'crystallization'
            );
          }

          return {
            ...idea,
            x: nx,
            y: ny,
            vx,
            vy,
            pulsePhase: idea.pulsePhase + 0.008 * speedFactor,
            ageMillennia: idea.ageMillennia + 0.05 * speedFactor,
            sentience: newSentience,
          };
        });
      });
    }, 45);

    return () => clearInterval(interval);
  }, [millenniaSpeed]);

  // Tick Millennia from Canvas
  const handleTickMillennia = useCallback((delta: number) => {
    setMillenniaAge((prev) => prev + delta);
  }, []);

  // Spawn Sparks at position - slow and ethereal expansion
  const handleSpawnSparks = useCallback((x: number, y: number, type: SparkType, count: number = 4) => {
    cosmicAudio.playSparkIgnite();
    const newSparks: Spark[] = [];
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 0.05 + Math.random() * 0.12;
      const energy = 0.8 + Math.random() * 0.2;
      const size = 2.8 + Math.random() * 2;
      newSparks.push({
        id: `spark-${Date.now()}-${i}-${Math.random()}`,
        x: x + (Math.random() - 0.5) * 16,
        y: y + (Math.random() - 0.5) * 16,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        type,
        energy,
        initialEnergy: energy,
        life: 680,
        maxLife: 680,
        size,
        initialSize: size,
        entropyRate: 0.0003 + Math.random() * 0.00035,
        driftAngle: Math.random() * Math.PI * 2,
        pulsePhase: Math.random() * Math.PI * 2,
        pulseSpeed: 0.002 + Math.random() * 0.003,
        bornMillennia: Math.floor(millenniaAge),
      });
    }

    setSparks((prev) => [...prev, ...newSparks]);
    addCosmicEvent(`Sparks of ${type} ignited in the void`, 'spark');
  }, [millenniaAge, addCosmicEvent]);

  // Cast a Wish (🎋) - slow, majestic drift
  const handleCastWish = useCallback((x: number, y: number) => {
    cosmicAudio.playWishWind();
    const angle = Math.random() * Math.PI * 2;
    const speed = 0.12;
    const newWish: Wish = {
      id: `wish-${Date.now()}`,
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      intention: "To wander on void winds and shape living ideas",
      life: 750,
      maxLife: 750,
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
        const newSentience = Math.min(idea.sentience + 8, 100);

        // Check for sentience harmonic swell trigger (>= 90%)
        if (newSentience >= 90 && !triggeredSentienceIdeasRef.current.has(idea.id)) {
          triggeredSentienceIdeasRef.current.add(idea.id);
          cosmicAudio.playSentienceHarmonicSwell(idea.name);
          addCosmicEvent(
            `Idea "${idea.name}" attained transcendent sentience (${Math.round(newSentience)}% 🧬) — high-frequency harmonic swells resonate across the void`,
            'crystallization'
          );
        }

        return {
          ...idea,
          charge: newCharge,
          mass: newMass,
          sparksCount: newSparksCount,
          radius: newRadius,
          sentience: newSentience,
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
    if (newIdea.sentience >= 90 && !triggeredSentienceIdeasRef.current.has(newIdea.id)) {
      triggeredSentienceIdeasRef.current.add(newIdea.id);
      cosmicAudio.playSentienceHarmonicSwell(newIdea.name);
    }
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
      sentience: custom.sentience || 65,
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
    if (newIdea.sentience >= 90 && !triggeredSentienceIdeasRef.current.has(newIdea.id)) {
      triggeredSentienceIdeasRef.current.add(newIdea.id);
      cosmicAudio.playSentienceHarmonicSwell(newIdea.name);
    }
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
        onOpenDrive={() => setIsDriveOpen(true)}
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
          onExportToDrive={() => setIsDriveOpen(true)}
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

      {/* Google Drive Cosmic Vault Modal */}
      {isDriveOpen && (
        <GoogleDriveModal
          onClose={() => setIsDriveOpen(false)}
          cosmosState={{
            sparks,
            ideas,
            wishes,
            millenniaAge,
            events,
          }}
          onRestoreCosmos={(saved) => {
            setSparks(saved.sparks || []);
            setIdeas(saved.ideas || []);
            setWishes(saved.wishes || []);
            setMillenniaAge(saved.millenniaAge || 14200);
            if (saved.events && saved.events.length > 0) {
              setEvents(saved.events);
            }
          }}
          onAddCosmicEvent={addCosmicEvent}
        />
      )}
    </div>
  );
}
