import { GoogleGenAI, Type } from "@google/genai";
import { PlayerStats, Scenario, Track } from '../types';

const getAiClient = () => {
  if (!process.env.API_KEY) {
    console.warn("API Key is missing. Using fallback mode.");
    return null;
  }
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const generateScenario = async (
  track: Track, 
  stats: PlayerStats, 
  month: number
): Promise<Scenario | null> => {
  const ai = getAiClient();
  if (!ai) return null;

  const prompt = `
    Generate a short, culturally relevant financial scenario for a "${track}" in India (Bharat context).
    Current Month: ${month}.
    User Stats: Savings ₹${stats.savings}, Happiness ${stats.happiness}%, Resilience ${stats.financialResilience}%.
    
    Topics (pick one relevant to stats): 
    - Savings & budgeting (e.g., unexpected expense, sale)
    - Credit & debt (e.g., EMI options, loan from friend)
    - Digital fraud (e.g., fake UPI link, lottery scam)
    - Investments (e.g., gold scheme, FD)

    Structure the response strictly as JSON.
    The scenario should challenge the user. If stats are low, give a tough situation.
    Include an 'imagePrompt' field with a visual description of the scene for image generation (no text in image, photorealistic style).

    Options should represent: 
    1. Impulsive/High Risk 
    2. Balanced/Moderate 
    3. Safe/Conservative/Frugal
    
    Ensure "consequences" values are integers.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        maxOutputTokens: 1000,
        thinkingConfig: { thinkingBudget: 0 }, 
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            type: { type: Type.STRING, enum: ['decision', 'event', 'scam'] },
            title: { type: Type.STRING },
            description: { type: Type.STRING },
            imagePrompt: { type: Type.STRING },
            options: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  text: { type: Type.STRING },
                  feedback: { type: Type.STRING },
                  consequences: {
                    type: Type.OBJECT,
                    properties: {
                      savings: { type: Type.INTEGER },
                      happiness: { type: Type.INTEGER },
                      financialResilience: { type: Type.INTEGER },
                      knowledge: { type: Type.INTEGER },
                    }
                  }
                },
                required: ['id', 'text', 'feedback', 'consequences']
              }
            }
          },
          required: ['id', 'type', 'title', 'description', 'options', 'imagePrompt']
        }
      }
    });

    const text = response.text;
    if (!text) return null;
    return JSON.parse(text) as Scenario;

  } catch (error) {
    console.error("Gemini generation failed. Falling back to offline mode.");
    return null;
  }
};

export const generateImageFromPrompt = async (prompt: string): Promise<string | null> => {
  const ai = getAiClient();
  if (!ai) return null;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: { parts: [{ text: prompt }] },
      config: {
        imageConfig: { aspectRatio: "16:9" }
      }
    });

    const candidate = response.candidates?.[0];
    if (candidate?.content?.parts) {
      for (const part of candidate.content.parts) {
        if (part.inlineData) {
          return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
        }
      }
    }
    return null;
  } catch (e) {
    console.error("Image gen error:", e);
    return null;
  }
};

export const generateReflection = async (history: any[]): Promise<string> => {
  const ai = getAiClient();
  if (!ai) return "You've made some interesting choices. Keep learning!";

  const prompt = `
    Analyze the following financial game history for an Indian user. 
    Provide a "Future You" message (max 50 words) describing their long-term outcome based on these choices.
    Be encouraging but realistic about consequences.
    History: ${JSON.stringify(history)}
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
          maxOutputTokens: 200,
          thinkingConfig: { thinkingBudget: 0 }
      }
    });
    return response.text || "Keep analyzing your spending habits!";
  } catch (e) {
    return "Great effort! Review your choices to see how you can improve.";
  }
};