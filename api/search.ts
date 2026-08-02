import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenAI } from '@google/genai';

// Google Maps grounding sometimes leaves inline citation markers like "[1]"
// or "[2, 3]" in the generated text — strip them before they reach the UI.
const stripCitations = (text: string): string => text.replace(/\s?\[\d+(?:,\s*\d+)*\]/g, '').trim();

const sanitizeTarget = (target: any) => ({
  ...target,
  name: typeof target.name === 'string' ? stripCitations(target.name) : target.name,
  description: typeof target.description === 'string' ? stripCitations(target.description) : target.description,
  address: typeof target.address === 'string' ? stripCitations(target.address) : target.address
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { query, lang, latLng } = req.body as {
    query: string;
    lang: string;
    latLng?: { latitude: number; longitude: number };
  };

  if (!query) return res.status(400).json({ error: 'Missing query' });

  const langLabel = lang === 'PT' ? 'Português do Brasil' : lang;
  const orderHint = latLng
    ? `Order the results from nearest to farthest walking distance from the origin point (${latLng.latitude}, ${latLng.longitude}) — this is critical, do not list far-away places first. `
    : '';
  const prompt = (process.env.AI_PROMPT_SEARCH || '')
    .replace(/\${query}/g, query)
    .replace(/\${langLabel}/g, langLabel)
    + `\n\n${orderHint}For each result, also include: a numeric "lat" and "lng" field with that exact place's real coordinates as known from Google Maps (never estimate or guess — omit the fields instead of guessing if you are not sure), and an "address" field with its full street address.`;

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      config: {
        thinkingConfig: { thinkingBudget: 0 },
        tools: [{ googleMaps: {} }] as any,
        toolConfig: { retrievalConfig: { latLng } } as any
      }
    });

    const text = response.text;
    const jsonMatch = text?.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      console.error('DEBUG: No JSON array found in search response:', text);
      return res.status(500).json({ error: 'No results found' });
    }

    const targets = JSON.parse(jsonMatch[0]);
    if (!Array.isArray(targets) || targets.length === 0) {
      return res.status(500).json({ error: 'No results found' });
    }

    res.json({ targets: targets.map(sanitizeTarget) });
  } catch (err: any) {
    console.error('DEBUG: Search Error:', err);
    
    const is404 = err.message?.includes('404') || err.message?.includes('Requested entity was not found');
    const is429 = err.message?.includes('429') || err.message?.includes('RESOURCE_EXHAUSTED') || err.message?.includes('quota');
    const status = is404 ? 404 : (is429 ? 429 : 500);
    
    res.status(status).json({ error: err.message });
  }
}
