import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenAI } from '@google/genai';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { lat, lng, lang } = req.body as { lat: number; lng: number; lang: string };

  if (!lat || !lng) return res.status(400).json({ error: 'Missing coordinates' });

  const langLabel = lang === 'PT' ? 'Português do Brasil' : lang;
  const rawPrompt = process.env.AI_PROMPT_SCAN || '';
  const prompt = rawPrompt
    .replace(/\${lat}/g, lat.toString())
    .replace(/\${lng}/g, lng.toString())
    .replace(/\${langLabel}/g, langLabel);

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      config: {
        tools: [{ googleMaps: {} }] as any,
        toolConfig: { retrievalConfig: { latLng: { latitude: lat, longitude: lng } } } as any
      }
    });
    console.log('DEBUG: AI Response received');

    const text = response.text;
    const jsonMatch = text?.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      console.error('DEBUG: No JSON array found in response:', text);
      return res.status(500).json({ error: 'No results found' });
    }

    res.json({ targets: JSON.parse(jsonMatch[0]) });
  } catch (err: any) {
    console.error('DEBUG: Scan Error:', err);
    
    const is404 = err.message?.includes('404') || err.message?.includes('Requested entity was not found');
    const is429 = err.message?.includes('429') || err.message?.includes('RESOURCE_EXHAUSTED') || err.message?.includes('quota');
    const status = is404 ? 404 : (is429 ? 429 : 500);
    
    res.status(status).json({ error: err.message });
  }
}
