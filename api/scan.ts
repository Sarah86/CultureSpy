import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenAI } from '@google/genai';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { lat, lng, lang } = req.body as { lat: number; lng: number; lang: string };

  if (!lat || !lng) return res.status(400).json({ error: 'Missing coordinates' });

  const langLabel = lang === 'PT' ? 'Português do Brasil' : lang;
  const prompt = (process.env.AI_PROMPT_SCAN || '')
    .replace(/\${lat}/g, lat.toString())
    .replace(/\${lng}/g, lng.toString())
    .replace(/\${langLabel}/g, langLabel);

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        tools: [{ googleMaps: {} }],
        toolConfig: { retrievalConfig: { latLng: { latitude: lat, longitude: lng } } }
      }
    });

    const jsonMatch = response.text?.match(/\[[\s\S]*\]/);
    if (!jsonMatch) return res.status(500).json({ error: 'No results found' });

    res.json({ targets: JSON.parse(jsonMatch[0]) });
  } catch (err: any) {
    const is404 = err.message?.includes('404') || err.message?.includes('Requested entity was not found');
    res.status(is404 ? 404 : 500).json({ error: err.message });
  }
}
