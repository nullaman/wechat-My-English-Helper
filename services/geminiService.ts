import { GoogleGenAI, Type } from "@google/genai";
import { WordData } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateWord = async (): Promise<Omit<WordData, 'id'> | null> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: "Generate a single interesting, useful English word for a language learner. Include its English definition, Chinese definition, an English example sentence, and a Chinese example sentence.",
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            word: { type: Type.STRING, description: "The English word." },
            definition_en: { type: Type.STRING, description: "Definition in English." },
            definition_cn: { type: Type.STRING, description: "Definition in Chinese." },
            example_sentence_en: { type: Type.STRING, description: "Example sentence in English." },
            example_sentence_cn: { type: Type.STRING, description: "Example sentence in Chinese." },
          },
          required: ["word", "definition_en", "definition_cn", "example_sentence_en", "example_sentence_cn"],
        },
      },
    });

    const text = response.text;
    if (!text) return null;

    return JSON.parse(text) as Omit<WordData, 'id'>;
  } catch (error) {
    console.error("Error generating word:", error);
    throw error;
  }
};