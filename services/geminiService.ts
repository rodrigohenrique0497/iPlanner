
import { GoogleGenAI, Type } from "@google/genai";
import { AIPlanResponse, Priority } from "../types";

// Always use the process.env.API_KEY directly for client initialization
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateSmartPlan = async (prompt: string, context?: any): Promise<AIPlanResponse> => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `User goal: "${prompt}". Context: ${JSON.stringify(context)}. Analyze goals, detect potential burnout, and create a human-centric action plan.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          tasks: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                description: { type: Type.STRING },
                priority: { type: Type.STRING, enum: [Priority.LOW, Priority.MEDIUM, Priority.HIGH] },
                category: { type: Type.STRING },
                estimatedDuration: { type: Type.STRING }
              },
              required: ["title", "description", "priority", "category"]
            }
          },
          summary: { type: Type.STRING },
          insight: { type: Type.STRING, description: "A mindful productivity insight based on the user's workload." }
        },
        required: ["tasks", "summary", "insight"]
      },
      systemInstruction: "You are iPlanner AI, a world-class productivity coach. You focus on 'Conscious Productivity'. If the user asks for too much, suggest cutting down to focus on what matters. Use a supportive, calm tone."
    }
  });

  const text = response.text;
  if (!text) throw new Error("No response from AI");
  return JSON.parse(text) as AIPlanResponse;
};
