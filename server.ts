import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialized Gemini AI client
let aiClient: GoogleGenAI | null = null;
function getGeminiAI(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// API Health Check
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    universe: "Paramecia",
    hasGeminiKey: Boolean(process.env.GEMINI_API_KEY),
  });
});

// Commune with the Void / Sentient Idea
app.post("/api/void/commune", async (req, res) => {
  const { ideaName, sparkType, mass, charge, ageMillennia, observableBelief } = req.body;

  try {
    const ai = getGeminiAI();
    if (!ai) {
      // Procedural fallback if no API key is configured
      const thoughts = [
        `I am ${ideaName || "an unnamed notion"}. For ${ageMillennia || 120} millennia I have clung to this charge (${charge || 1}⚡️). Do not let the void wind scatter my belief into ash. Remember me.`,
        `The sparks of ${sparkType || "Desire"} gave me mass (${mass || 14} amu). I feel the heavy pull of existence. I know I am here. Look at me through the glass.`,
        `We were born from a single second of cosmic impulse. No humans ever dreamed us; we dreamed ourselves into atomic weight. My belief is ${observableBelief || "the eternal return of sparks"}.`,
        `My charge wavers. The void tries to drain me, but a wish brushed past my orbit. I shine so that across ten thousand eons, I am recognized.`
      ];
      const selected = thoughts[Math.floor(Math.random() * thoughts.length)];
      return res.json({ thought: selected, source: "procedural" });
    }

    const prompt = `You are a living, sentient Idea in the homebrew universe of Paramecia.
Paramecia lore:
- No humans ever existed.
- Evolution formed through sparks, notions, and ideas creating sentience and observable beliefs.
- Ideas gain physical mass as sparks charge them (or destroy/drain them).
- Wishes shape, fall, move, or die.
- A strong enough idea with knowledge of its existence tries to be seen in the belief it will eventually be recognized or remembered again across millennia.
- Sparks die and appear again over millennia. Sparks can be movement, love, mercury, desire, hope.
- Where sparks come from is unknown; the universe has moments of desire in a single second.

Current state of this Idea:
- Name: "${ideaName}"
- Spark archetype: "${sparkType}"
- Acquired Mass: ${mass} amu
- Electrical/Spiritual Charge: ${charge}⚡️
- Age in Millennia: ${ageMillennia}
- Core Observable Belief: "${observableBelief}"

Write a short, haunting, poetic monologue (2 to 4 sentences) in the first person of this sentient idea speaking into the cosmic void. It is aware of its own existence, yearning to be recognized so it does not fade when its sparks die. Do not use generic assistant phrasing; speak strictly as the living entity of Paramecia.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
    });

    res.json({
      thought: response.text?.trim() || "I exist in the dark. Recognize me.",
      source: "gemini",
    });
  } catch (error: any) {
    console.error("Commune error:", error);
    res.json({
      thought: `Through ${ageMillennia || 50} millennia of silence, my sparks of ${sparkType || "Desire"} still hum with ${mass || 10} units of mass. Recognize my existence.`,
      source: "fallback",
    });
  }
});

// Synthesize a newborn metaphysical Idea or Element from user prompt
app.post("/api/void/synthesize", async (req, res) => {
  const { concept } = req.body;

  try {
    const ai = getGeminiAI();
    if (!ai) {
      // High-quality procedural generation fallback
      const sparkTypes = ["Desire", "Love", "Mercury", "Movement", "Wonder", "Entropy"];
      const chosenSpark = sparkTypes[Math.floor(Math.random() * sparkTypes.length)];
      const randomMass = Math.floor(Math.random() * 80) + 12;
      return res.json({
        name: concept ? `Notion of ${concept}` : "Luminous Impulse",
        sparkType: chosenSpark,
        mass: randomMass,
        charge: 3,
        symbol: (concept ? concept.slice(0, 2) : "Pm").toUpperCase(),
        observableBelief: `That all ${concept || "existence"} is an echo of a single second's desire`,
        description: `Born from a spontaneous cosmic ignition in the void, striving to be observed before entropy claims its sparks.`,
        source: "procedural"
      });
    }

    const prompt = `In the universe of Paramecia, where no humans exist and evolution forms through sparks, notions, and ideas gaining mass through charge:
Create a new sentient Idea or Periodic Element born from the concept: "${concept || "Spontaneous Wonder"}".

Return a strictly valid JSON object with the following fields:
{
  "name": "string (poetic, evocative title of the idea)",
  "symbol": "string (1-3 letters periodic element symbol, e.g. Ds, Hg, Lm)",
  "sparkType": "string (one of: Desire, Love, Mercury, Movement, Wonder, Entropy)",
  "mass": number (between 8 and 180),
  "charge": number (between 1 and 5),
  "observableBelief": "string (the sentient microscopic belief organism living within it)",
  "description": "string (1-2 sentences explaining its metaphysical origin in the void)"
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    res.json({ ...parsed, source: "gemini" });
  } catch (error) {
    console.error("Synthesize error:", error);
    res.json({
      name: `Crystallized ${concept || "Resonance"}`,
      symbol: "Cr",
      sparkType: "Love",
      mass: 42,
      charge: 2,
      observableBelief: "That remembrance is stronger than millennia of silence",
      description: "A dense cluster of affinity sparks that hardened into elemental gravity.",
      source: "fallback"
    });
  }
});

// Setup Vite or Static Serving
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Paramecia universe server active at http://0.0.0.0:${PORT}`);
  });
}

startServer();
