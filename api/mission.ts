import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenAI, Type } from '@google/genai';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { targetName, agentName, agentAge, lang } = req.body as {
    targetName: string;
    agentName: string;
    agentAge: number;
    lang: string;
  };

  if (!targetName) return res.status(400).json({ error: 'Missing targetName' });

  const langLabel = lang === 'PT' ? 'Português do Brasil' : lang;
  const prompt = (process.env.AI_PROMPT_MISSION || '')
    .replace(/\${targetName}/g, targetName)
    .replace(/\${agentName}/g, agentName)
    .replace(/\${agentAge}/g, agentAge.toString())
    .replace(/\${langLabel}/g, langLabel);

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            codeName: { type: Type.STRING },
            title: { type: Type.STRING },
            description: { type: Type.STRING },
            tasks: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  prompt: { type: Type.STRING },
                  curiosity: { type: Type.STRING, description: 'A funny/interesting secret fact related to the task.' },
                  sensoryType: { type: Type.STRING, enum: ['sight', 'sound', 'touch', 'smell', 'vibe'] },
                  type: { type: Type.STRING, enum: ['observation', 'deduction', 'sketch', 'audio'] }
                },
                required: ['prompt', 'curiosity', 'sensoryType', 'type']
              }
            }
          },
          required: ['codeName', 'title', 'description', 'tasks']
        }
      }
    });

    res.json(JSON.parse(response.text!));
  } catch (err: any) {
    console.error('DEBUG: Mission Error:', err);
    
    const is404 = err.message?.includes('404') || err.message?.includes('Requested entity was not found');
    const is429 = err.message?.includes('429') || err.message?.includes('RESOURCE_EXHAUSTED') || err.message?.includes('quota');
    const status = is404 ? 404 : (is429 ? 429 : 500);
    
    res.status(status).json({ error: err.message });
  }
}
