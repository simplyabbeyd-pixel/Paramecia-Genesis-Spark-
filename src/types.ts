export type SparkType = 'desire' | 'love' | 'mercury' | 'movement' | 'wonder' | 'entropy';

export interface Spark {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  type: SparkType;
  energy: number; // 0 to 1
  life: number;
  maxLife: number;
  size: number;
  parentIdeaId?: string;
  driftAngle: number;
}

export interface ObservableBeliefMicrobe {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  shape: 'ciliate' | 'flagellate' | 'crystal' | 'spore';
  pulsePhase: number;
  color: string;
}

export interface Idea {
  id: string;
  name: string;
  symbol: string;
  sparkType: SparkType;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  mass: number; // in amu (gained from charge)
  charge: number; // 1 to 5 (⚡️)
  stability: number; // 0 to 100%
  sentience: number; // 0 to 100% (🧬)
  observableBelief: string;
  microbes: ObservableBeliefMicrobe[];
  isRecognized: boolean; // Seen through telescope 🔭
  recognizedAtMillennia?: number;
  bornEpoch: number;
  ageMillennia: number;
  sparksCount: number;
  wishesCount: number;
  internalMonologue: string;
  status: 'nascent' | 'living' | 'crystallizing' | 'destabilizing' | 'remembered' | 'ash';
  pulsePhase: number;
  color: string;
}

export interface Wish {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  intention: string;
  life: number;
  maxLife: number;
  targetIdeaId?: string;
  color: string;
  length: number;
  curvePhase: number;
}

export interface PeriodicElement {
  atomicNumber: number;
  symbol: string;
  name: string;
  category: 'Sparkide' | 'Notionoid' | 'Sentient' | 'Beliefite' | 'Remembrance' | 'Void Residue';
  massAmu: number;
  chargeRequisite: number;
  sparkPrimary: SparkType;
  description: string;
  loreQuote: string;
  halfLifeMillennia: number | 'Infinite';
  density: string;
}

export interface CosmicEvent {
  id: string;
  millennia: number;
  text: string;
  type: 'spark' | 'fusion' | 'crystallization' | 'decay' | 'wish' | 'recognition' | 'supernova';
  timestamp: number;
}
