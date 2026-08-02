import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenAI, Type } from '@google/genai';

interface TranslatableTask {
  prompt: string;
  curiosity?: string;
}

interface TranslatableMission {
  title: string;
  description: string;
  tasks: TranslatableTask[];
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { mission, targetLang } = req.body as { mission: TranslatableMission; targetLang: string };

  if (!mission || !targetLang) return res.status(400).json({ error: 'Missing mission or targetLang' });

  const langLabel = targetLang === 'PT' ? 'Português do Brasil' : targetLang;
  const prompt = `Translate the text values in this JSON into ${langLabel}. This is content for a kids' spy-themed scavenger hunt game — keep the playful tone and meaning, just translate it. Keep the exact same JSON structure and number of tasks, only translate the string values.\n\n${JSON.stringify(mission)}`;

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      config: {
        thinkingConfig: { thinkingBudget: 0 },
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            description: { type: Type.STRING },
            tasks: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  prompt: { type: Type.STRING },
                  curiosity: { type: Type.STRING }
                },
                required: ['prompt']
              }
            }
          },
          required: ['title', 'description', 'tasks']
        }
      }
    });

    res.json(JSON.parse(response.text!));
  } catch (err: any) {
    console.error('DEBUG: Translate Error:', err);

    const is404 = err.message?.includes('404') || err.message?.includes('Requested entity was not found');
    const is429 = err.message?.includes('429') || err.message?.includes('RESOURCE_EXHAUSTED') || err.message?.includes('quota');
    const status = is404 ? 404 : (is429 ? 429 : 500);

    res.status(status).json({ error: err.message });
  }
}
