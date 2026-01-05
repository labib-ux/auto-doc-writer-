
import { GoogleGenAI } from "@google/genai";

// Initialization using the environment variable as per guidelines
// Fix: Use process.env.API_KEY directly for initialization to strictly follow guidelines
const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateDocumentation = async (code: string, format: 'simple' | 'research' | 'latex') => {
  const ai = getAI();
  
  const prompts = {
    simple: `Explain this code in plain English for a junior developer. Focus on intent and logic: \n\n${code}`,
    research: `Analyze this code from an architectural and computer science perspective. Write a formal technical paragraph about its implementation patterns: \n\n${code}`,
    latex: `Convert the logic and mathematical parts of this code into a professional LaTeX document section. Use environment symbols and clear formatting: \n\n${code}`
  };

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompts[format],
      config: {
        temperature: 0.7,
        topP: 0.95,
        topK: 40,
        thinkingConfig: { thinkingBudget: 0 } // Standard generation
      },
    });

    return response.text || "Failed to generate documentation.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return `Error: ${error instanceof Error ? error.message : "Internal AI Error"}`;
  }
};

export const explainCodeSnippet = async (snippet: string) => {
    const ai = getAI();
    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Briefly explain what this specific line or block of code does in 1 sentence: \n\n${snippet}`,
    });
    return response.text;
};
