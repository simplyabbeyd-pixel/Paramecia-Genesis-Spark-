class CosmicAudioEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = true;
  private currentSpeed: number = 0.1; // Default 0.1x (Endless Time)
  private masterGain: GainNode | null = null;
  private ambientGain: GainNode | null = null;

  // Drone and Harmonic Oscillators
  private ambientOsc1: OscillatorNode | null = null; // Sub fundamental (Sine)
  private ambientOsc2: OscillatorNode | null = null; // Fifth harmonic (Warm Triangle)
  private ambientOsc3: OscillatorNode | null = null; // Ethereal overtone shimmer (Detuned Sine)

  // Texture Filtering & Generative Breathing
  private mainFilter: BiquadFilterNode | null = null;
  private lfo: OscillatorNode | null = null;
  private lfoGain: GainNode | null = null;

  // Cosmic Stellar Wind (Textured Air Buffer)
  private noiseNode: AudioBufferSourceNode | null = null;
  private noiseFilter: BiquadFilterNode | null = null;
  private noiseGain: GainNode | null = null;

  // Generative Stochastic Tones
  private generativeTimer: number | null = null;
  private isAmbienceRunning: boolean = false;
  private currentBaseFreq: number = 55.0; // Hz

  public init() {
    if (this.ctx) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 0.35, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
      this.startVoidAmbience();
    } catch (e) {
      console.warn("Web Audio not supported or blocked:", e);
    }
  }

  public toggleMute(): boolean {
    this.init();
    if (!this.ctx) return true;
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    this.isMuted = !this.isMuted;
    if (this.masterGain) {
      const now = this.ctx.currentTime;
      this.masterGain.gain.cancelScheduledValues(now);
      this.masterGain.gain.linearRampToValueAtTime(this.isMuted ? 0 : 0.35, now + 0.25);
    }

    if (!this.isMuted) {
      this.startGenerativeCycle();
    } else {
      this.stopGenerativeCycle();
    }

    return this.isMuted;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public getMillenniaSpeed(): number {
    return this.currentSpeed;
  }

  /**
   * Dynamically alters the pitch, filter cutoff, modulation rhythm, and texture
   * of the ambient soundscape based on the universe's speed through time.
   */
  public setMillenniaSpeed(speed: number) {
    this.currentSpeed = Math.max(0, speed);
    if (this.ctx && this.isAmbienceRunning) {
      this.applySpeedParameters(this.currentSpeed, false);
    }
  }

  private calculateCosmicTuning(speed: number) {
    // Pitch: deep cavernous bass at eternal speeds, elevating into celestial fifths and octaves
    let baseFreq = 55.0; // A1 (default endless 0.1x)
    let fifthFreq = 82.4; // E2
    let overtoneFreq = 164.81; // E3
    let cutoff = 150; // Hz
    let lfoRate = 0.035; // Hz (slow breathing)
    let windFreq = 220; // Hz
    let windGain = 0.012;

    if (speed === 0) {
      // Paused stasis: subterranean frozen hum
      baseFreq = 38.0;
      fifthFreq = 57.0;
      overtoneFreq = 114.0;
      cutoff = 85;
      lfoRate = 0.015;
      windFreq = 140;
      windGain = 0.003;
    } else if (speed <= 0.05) {
      // Eternal Void (0.05x): vast, heavy primordial bass
      baseFreq = 43.65; // F0
      fifthFreq = 65.4; // C1
      overtoneFreq = 130.8;
      cutoff = 115;
      lfoRate = 0.025;
      windFreq = 170;
      windGain = 0.007;
    } else if (speed <= 0.1) {
      // Endless Time (0.1x): solemn, contemplative, patient space
      baseFreq = 55.0; // A1
      fifthFreq = 82.4; // E2
      overtoneFreq = 164.8;
      cutoff = 150;
      lfoRate = 0.035;
      windFreq = 220;
      windGain = 0.012;
    } else if (speed <= 0.5) {
      // Serene Drift (0.5x): resonant cosmic drone
      baseFreq = 65.41; // C2
      fifthFreq = 98.0; // G2
      overtoneFreq = 196.0;
      cutoff = 240;
      lfoRate = 0.065;
      windFreq = 320;
      windGain = 0.017;
    } else if (speed <= 1.0) {
      // Epoch Flow (1x): clear, harmonic forward flow
      baseFreq = 73.42; // D2
      fifthFreq = 110.0; // A2
      overtoneFreq = 220.0;
      cutoff = 360;
      lfoRate = 0.095;
      windFreq = 450;
      windGain = 0.022;
    } else {
      // Fast Acceleration (5x+): brightened, compressed eons rushing past
      baseFreq = 98.0; // G2
      fifthFreq = 146.83; // D3
      overtoneFreq = 293.66;
      cutoff = 680;
      lfoRate = 0.16;
      windFreq = 680;
      windGain = 0.032;
    }

    return { baseFreq, fifthFreq, overtoneFreq, cutoff, lfoRate, windFreq, windGain };
  }

  private applySpeedParameters(speed: number, immediate: boolean = false) {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const rampTime = immediate ? 0.05 : 1.8;

    const { baseFreq, fifthFreq, overtoneFreq, cutoff, lfoRate, windFreq, windGain } = this.calculateCosmicTuning(speed);
    this.currentBaseFreq = baseFreq;

    try {
      // 1. Morph Drone Pitch
      if (this.ambientOsc1) {
        this.ambientOsc1.frequency.cancelScheduledValues(now);
        this.ambientOsc1.frequency.linearRampToValueAtTime(baseFreq, now + rampTime);
      }
      if (this.ambientOsc2) {
        this.ambientOsc2.frequency.cancelScheduledValues(now);
        this.ambientOsc2.frequency.linearRampToValueAtTime(fifthFreq, now + rampTime);
      }
      if (this.ambientOsc3) {
        this.ambientOsc3.frequency.cancelScheduledValues(now);
        this.ambientOsc3.frequency.linearRampToValueAtTime(overtoneFreq, now + rampTime);
      }

      // 2. Morph Filter Cutoff & Texture
      if (this.mainFilter) {
        this.mainFilter.frequency.cancelScheduledValues(now);
        this.mainFilter.frequency.linearRampToValueAtTime(cutoff, now + rampTime);
      }

      // 3. Morph Breathing Rhythm
      if (this.lfo) {
        this.lfo.frequency.cancelScheduledValues(now);
        this.lfo.frequency.linearRampToValueAtTime(lfoRate, now + rampTime);
      }

      // 4. Morph Stellar Wind Texture
      if (this.noiseFilter) {
        this.noiseFilter.frequency.cancelScheduledValues(now);
        this.noiseFilter.frequency.linearRampToValueAtTime(windFreq, now + rampTime);
      }
      if (this.noiseGain) {
        this.noiseGain.gain.cancelScheduledValues(now);
        this.noiseGain.gain.linearRampToValueAtTime(windGain, now + rampTime);
      }
    } catch (e) {
      console.warn("Failed to apply speed tuning to audio:", e);
    }
  }

  private createPinkNoiseBuffer(ctx: AudioContext): AudioBuffer {
    const bufferSize = ctx.sampleRate * 4; // 4 seconds loop
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      // Pink noise filter approximation
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.035;
      b6 = white * 0.115926;
    }
    return buffer;
  }

  private startVoidAmbience() {
    if (!this.ctx || !this.masterGain || this.isAmbienceRunning) return;
    try {
      const now = this.ctx.currentTime;
      const tuning = this.calculateCosmicTuning(this.currentSpeed);
      this.currentBaseFreq = tuning.baseFreq;

      // Master Ambient Bus
      this.ambientGain = this.ctx.createGain();
      this.ambientGain.gain.setValueAtTime(0.18, now);

      // Warm Analog Lowpass Filter
      this.mainFilter = this.ctx.createBiquadFilter();
      this.mainFilter.type = "lowpass";
      this.mainFilter.frequency.setValueAtTime(tuning.cutoff, now);
      this.mainFilter.Q.setValueAtTime(1.4, now);

      // Layer 1: Sub Fundamental Sine (Deep Void Gravity)
      this.ambientOsc1 = this.ctx.createOscillator();
      this.ambientOsc1.type = "sine";
      this.ambientOsc1.frequency.setValueAtTime(tuning.baseFreq, now);

      // Layer 2: Warm Harmonic Fifth (Consonant Sacred Space)
      this.ambientOsc2 = this.ctx.createOscillator();
      this.ambientOsc2.type = "triangle";
      this.ambientOsc2.frequency.setValueAtTime(tuning.fifthFreq, now);

      // Layer 3: Detuned Ethereal Shimmer (Subtle Binaural Drift)
      this.ambientOsc3 = this.ctx.createOscillator();
      this.ambientOsc3.type = "sine";
      this.ambientOsc3.frequency.setValueAtTime(tuning.overtoneFreq, now);
      this.ambientOsc3.detune.setValueAtTime(5, now); // +5 cents for slow phasing

      const osc2Gain = this.ctx.createGain();
      osc2Gain.gain.setValueAtTime(0.4, now);
      this.ambientOsc2.connect(osc2Gain);

      const osc3Gain = this.ctx.createGain();
      osc3Gain.gain.setValueAtTime(0.25, now);
      this.ambientOsc3.connect(osc3Gain);

      this.ambientOsc1.connect(this.mainFilter);
      osc2Gain.connect(this.mainFilter);
      osc3Gain.connect(this.mainFilter);

      // Generative Breathing LFO (Slow harmonic swelling)
      this.lfo = this.ctx.createOscillator();
      this.lfo.type = "sine";
      this.lfo.frequency.setValueAtTime(tuning.lfoRate, now);

      this.lfoGain = this.ctx.createGain();
      this.lfoGain.gain.setValueAtTime(30, now); // +/- 30Hz filter breathing

      this.lfo.connect(this.lfoGain);
      this.lfoGain.connect(this.mainFilter.frequency);

      // Layer 4: Stellar Cosmic Wind (Pink Noise Ether Loop)
      const noiseBuf = this.createPinkNoiseBuffer(this.ctx);
      this.noiseNode = this.ctx.createBufferSource();
      this.noiseNode.buffer = noiseBuf;
      this.noiseNode.loop = true;

      this.noiseFilter = this.ctx.createBiquadFilter();
      this.noiseFilter.type = "bandpass";
      this.noiseFilter.frequency.setValueAtTime(tuning.windFreq, now);
      this.noiseFilter.Q.setValueAtTime(0.9, now);

      this.noiseGain = this.ctx.createGain();
      this.noiseGain.gain.setValueAtTime(tuning.windGain, now);

      this.noiseNode.connect(this.noiseFilter);
      this.noiseFilter.connect(this.noiseGain);
      this.noiseGain.connect(this.ambientGain);

      // Connect filter to main ambient bus and output to master
      this.mainFilter.connect(this.ambientGain);
      this.ambientGain.connect(this.masterGain);

      // Start all nodes
      this.ambientOsc1.start(now);
      this.ambientOsc2.start(now);
      this.ambientOsc3.start(now);
      this.lfo.start(now);
      this.noiseNode.start(now);

      this.isAmbienceRunning = true;

      if (!this.isMuted) {
        this.startGenerativeCycle();
      }
    } catch (err) {
      console.warn("Void ambience error:", err);
    }
  }

  // Generative Stochastic Chimes: faint celestial notes emerging from deep space
  private startGenerativeCycle() {
    this.stopGenerativeCycle();
    this.scheduleNextGenerativeTone();
  }

  private stopGenerativeCycle() {
    if (this.generativeTimer !== null) {
      clearTimeout(this.generativeTimer);
      this.generativeTimer = null;
    }
  }

  private scheduleNextGenerativeTone() {
    if (!this.ctx || this.isMuted) return;

    // Time between generative echoes scales with cosmic speed:
    // Endless/Slow time = long, patient intervals (7-14s)
    // Faster epoch time = more frequent twinkling dust (3-7s)
    const effectiveSpeed = Math.max(0.04, this.currentSpeed);
    const baseInterval = 8000 / Math.sqrt(effectiveSpeed);
    const delayMs = Math.max(2800, baseInterval + (Math.random() - 0.5) * 3500);

    this.generativeTimer = window.setTimeout(() => {
      this.playGenerativeCelestialTone();
      this.scheduleNextGenerativeTone();
    }, delayMs);
  }

  private playGenerativeCelestialTone() {
    if (this.isMuted || !this.ctx || !this.masterGain || this.ctx.state !== 'running') return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      // Golden overtone intervals above the current cosmic fundamental
      const harmonics = [4, 5, 6, 7.5, 8, 10, 12];
      const harmonic = harmonics[Math.floor(Math.random() * harmonics.length)];
      const targetFreq = this.currentBaseFreq * harmonic;

      osc.type = "sine";
      osc.frequency.setValueAtTime(targetFreq, now);

      // Very soft, ambient swell and natural envelope
      const duration = 2.4 + Math.random() * 2.2;
      const attack = duration * 0.35;
      const peakGain = 0.015 + Math.random() * 0.018;

      gain.gain.setValueAtTime(0.00001, now);
      gain.gain.linearRampToValueAtTime(peakGain, now + attack);
      gain.gain.exponentialRampToValueAtTime(0.00001, now + duration);

      // Stereo field positioning if supported
      if (this.ctx.createStereoPanner) {
        const panner = this.ctx.createStereoPanner();
        panner.pan.setValueAtTime((Math.random() - 0.5) * 1.5, now);
        osc.connect(gain);
        gain.connect(panner);
        panner.connect(this.masterGain);
      } else {
        osc.connect(gain);
        gain.connect(this.masterGain);
      }

      osc.start(now);
      osc.stop(now + duration + 0.1);
    } catch (e) {}
  }

  public playSparkIgnite(freqMultiplier: number = 1) {
    if (this.isMuted || !this.ctx || !this.masterGain) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      // Pentatonic celestial harmonics
      const baseFreqs = [440, 523.25, 659.25, 783.99, 880, 1046.5];
      const randomFreq = baseFreqs[Math.floor(Math.random() * baseFreqs.length)] * freqMultiplier;

      osc.type = "sine";
      osc.frequency.setValueAtTime(randomFreq, now);

      // Gentle attack and long, serene harmonic decay
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.linearRampToValueAtTime(0.06, now + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.65);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 0.65);
    } catch (e) {}
  }

  public playChargeElectric() {
    if (this.isMuted || !this.ctx || !this.masterGain) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(180, now);
      osc.frequency.linearRampToValueAtTime(540, now + 0.2);

      gain.gain.setValueAtTime(0.06, now);
      gain.gain.linearRampToValueAtTime(0.0001, now + 0.25);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 0.25);
    } catch (e) {}
  }

  public playDrain() {
    if (this.isMuted || !this.ctx || !this.masterGain) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(70, now + 0.35);

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 0.35);
    } catch (e) {}
  }

  public playWishWind() {
    if (this.isMuted || !this.ctx || !this.masterGain) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.2);
      osc.frequency.exponentialRampToValueAtTime(659, now + 0.45);

      gain.gain.setValueAtTime(0.01, now);
      gain.gain.linearRampToValueAtTime(0.07, now + 0.15);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.5);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 0.5);
    } catch (e) {}
  }

  public playRecognition() {
    if (this.isMuted || !this.ctx || !this.masterGain) return;
    try {
      const now = this.ctx.currentTime;
      const freqs = [528, 792, 1056]; // Solfeggio / celestial overtone chord
      freqs.forEach((f, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(f, now + idx * 0.06);

        gain.gain.setValueAtTime(0.08, now + idx * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);

        osc.connect(gain);
        gain.connect(this.masterGain!);

        osc.start(now + idx * 0.06);
        osc.stop(now + 1.2);
      });
    } catch (e) {}
  }

  public playSupernova() {
    if (this.isMuted || !this.ctx || !this.masterGain) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "triangle";
      osc.frequency.setValueAtTime(120, now);
      osc.frequency.exponentialRampToValueAtTime(30, now + 0.6);

      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.7);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 0.7);
    } catch (e) {}
  }

  /**
   * Subtle, high-frequency harmonic swells triggered when an idea reaches
   * a 'sentience' threshold of 90 or above.
   * Creates an ethereal, celestial glass overtone chord that rings through the void.
   */
  public playSentienceHarmonicSwell(ideaName?: string) {
    if (this.isMuted || !this.ctx || !this.masterGain) return;
    try {
      const now = this.ctx.currentTime;
      // High-frequency harmonic overtones: A6 (1760 Hz), C#7 (2217 Hz), E7 (2637 Hz), A7 (3520 Hz)
      const harmonics = [1760, 2217.46, 2637.02, 3520];

      harmonics.forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        const filter = this.ctx!.createBiquadFilter();

        // High frequency sine with gentle shimmer
        osc.type = "sine";
        // Slight organic detune per harmonic
        const detuneOffset = (idx % 2 === 0 ? 1 : -1) * (1.5 + idx * 0.8);
        osc.frequency.setValueAtTime(freq + detuneOffset, now + idx * 0.08);

        // Smooth bandpass around the overtone
        filter.type = "bandpass";
        filter.frequency.setValueAtTime(freq, now + idx * 0.08);
        filter.Q.setValueAtTime(1.5, now + idx * 0.08);

        // Subtle swell envelope: soft, luminous attack ramping up, then crystalline decay
        const startTime = now + idx * 0.08;
        const attackDuration = 0.45;
        const totalDuration = 2.4;
        const peakGain = 0.028 / (idx * 0.5 + 1); // Subtle and gentle

        gain.gain.setValueAtTime(0.00001, startTime);
        gain.gain.linearRampToValueAtTime(peakGain, startTime + attackDuration);
        gain.gain.exponentialRampToValueAtTime(0.00001, startTime + totalDuration);

        // Spatial stereo distribution if supported
        if (typeof (this.ctx as any).createStereoPanner === 'function') {
          const panner = this.ctx!.createStereoPanner();
          const pan = (idx - 1.5) * 0.4; // Distributed across stereo field
          panner.pan.setValueAtTime(pan, startTime);
          osc.connect(filter);
          filter.connect(gain);
          gain.connect(panner);
          panner.connect(this.masterGain!);
        } else {
          osc.connect(filter);
          filter.connect(gain);
          gain.connect(this.masterGain!);
        }

        osc.start(startTime);
        osc.stop(startTime + totalDuration + 0.1);
      });
    } catch (e) {
      console.warn("Sentience harmonic swell audio error:", e);
    }
  }

  /**
   * Subtle, crystalline chime when the void naturally replenishes fresh sparks
   * after an entropy dissolution cycle.
   */
  public playReplenishmentSwell() {
    if (this.isMuted || !this.ctx || !this.masterGain) return;
    try {
      const now = this.ctx.currentTime;
      const pitches = [587.33, 880.0, 1174.66]; // D5, A5, D6 harmonic ascension
      pitches.forEach((f, i) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();

        osc.type = "sine";
        osc.frequency.setValueAtTime(f, now + i * 0.09);

        const startTime = now + i * 0.09;
        gain.gain.setValueAtTime(0.00001, startTime);
        gain.gain.linearRampToValueAtTime(0.035, startTime + 0.12);
        gain.gain.exponentialRampToValueAtTime(0.00001, startTime + 1.1);

        osc.connect(gain);
        gain.connect(this.masterGain!);

        osc.start(startTime);
        osc.stop(startTime + 1.2);
      });
    } catch (e) {}
  }
}

export const cosmicAudio = new CosmicAudioEngine();
