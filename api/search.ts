import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenAI } from '@google/genai';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { query, lang, latLng } = req.body as {
    query: string;
    lang: string;
    latLng?: { latitude: number; longitude: number };
  };

  if (!query) return res.status(400).json({ error: 'Missing query' });

  const langLabel = lang === 'PT' ? 'Português do Brasil' : lang;
  const prompt = (process.env.AI_PROMPT_SEARCH || '')
    .replace(/\${query}/g, query)
    .replace(/\${langLabel}/g, langLabel);

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      config: {
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

    res.json({ targets });
  } catch (err: any) {
    console.error('DEBUG: Search Error:', err);
    const is404 = err.message?.includes('404') || err.message?.includes('Requested entity was not found');
    res.status(is404 ? 404 : 500).json({ error: err.message });
  }
}
