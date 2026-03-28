import { GoogleGenAI } from "@google/genai";
import * as dotenv from "dotenv";
dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.VITE_GEMINI_API_KEY });

async function run() {
  try {
    const response = await ai.models.generateImages({
      model: 'imagen-3.0-generate-001',
      prompt: 'A realistic portrait of a marketing director, 8k',
      config: {
        numberOfImages: 1,
        outputMimeType: 'image/jpeg'
      }
    });
    console.log("SUCCESS. Image bytes length:", response.generatedImages[0].image.imageBytes.length);
  } catch (e) {
    console.error("FAILED:", e.message);
  }
}

run();
