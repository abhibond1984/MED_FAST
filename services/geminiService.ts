
import { GoogleGenAI } from "@google/genai";
import { Medicine, CartItem } from "../types";

let genAI: GoogleGenAI | null = null;

const getClient = () => {
  if (!genAI && process.env.API_KEY) {
    genAI = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }
  return genAI;
};

export const initializeGemini = () => {
  getClient();
};

export const chatWithPharmaBot = async (
  userMessage: string,
  history: { role: 'user' | 'model'; text: string }[],
  cartContext: CartItem[] = []
): Promise<string> => {
  const ai = getClient();
  if (!ai) return "AI Service Unavailable. Check API Key.";

  try {
    const chatHistory = history.map(msg => ({
      role: msg.role,
      parts: [{ text: msg.text }]
    }));

    const cartSummary = cartContext.length > 0 
      ? `User currently has these items in cart: ${cartContext.map(i => i.name).join(', ')}.`
      : "User cart is empty.";

    const systemInstruction = `You are the AI Pharmacist for MED-FAST.
    Context: ${cartSummary}
    
    Rules:
    1. Clarify you are an AI, not a doctor.
    2. Be concise (max 2 sentences).
    3. Emphasize 30-min delivery.
    4. If the user asks about their cart items, provide specific advice (e.g., take after food).
    5. Suggest complementary products if relevant (e.g., ORS with Diarrhea meds).
    `;

    const chat = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: { systemInstruction },
      history: chatHistory
    });

    const result = await chat.sendMessage({ message: userMessage });
    return result.text || "I couldn't generate a response.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I'm having trouble processing your request right now.";
  }
};

// Feature 1: AI Prescription Analyzer (Multimodal)
export const analyzePrescriptionImage = async (base64Image: string, availableMedicines: Medicine[]): Promise<{ 
  medicinesFound: string[], 
  matchedProductIds: string[],
  summary: string 
}> => {
  const ai = getClient();
  if (!ai) throw new Error("AI unavailable");

  try {
    // Clean base64 string if it contains data URI prefix
    const cleanBase64 = base64Image.split(',')[1] || base64Image;

    const inventoryContext = availableMedicines.map(m => `${m.id}: ${m.name}`).join('\n');

    const prompt = `
      You are an expert pharmacist AI. 
      Analyze this medical prescription image carefully.
      
      Task:
      1. Read the list of medicines demanded by the customer/doctor in the image.
      2. If dosage is mentioned (e.g. 500mg), include it in the name.
      3. Compare the found medicines against my inventory list provided below.
      4. Return a JSON object with:
         - "medicinesFound": A list of all medicine names/dosages clearly visible in the image.
         - "matchedProductIds": A list of IDs from my inventory that strictly match the found medicines.
         - "summary": A professional summary of the prescription (e.g., "Prescription for bacterial infection and fever management").

      My Inventory:
      ${inventoryContext}
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          { inlineData: { mimeType: 'image/jpeg', data: cleanBase64 } },
          { text: prompt }
        ]
      },
      config: {
        responseMimeType: "application/json"
      }
    });

    const text = response.text || "{}";
    return JSON.parse(text);

  } catch (error) {
    console.error("Analysis Error:", error);
    return { medicinesFound: [], matchedProductIds: [], summary: "Could not read prescription details." };
  }
};

// Feature 2: Smart Symptom Search
export const getSmartSuggestions = async (query: string, availableMedicines: Medicine[]): Promise<string[]> => {
  const ai = getClient();
  if (!ai) return [];

  try {
    const inventoryContext = availableMedicines.map(m => ({ id: m.id, name: m.name, description: m.description, category: m.category }));
    
    const prompt = `
      User Query: "${query}"
      
      Task: Identify which medicines from the inventory below best match the user's query or symptoms.
      Return ONLY a JSON array of the matching IDs (e.g. ["m1", "m3"]). If nothing matches, return empty array [].
      
      Inventory:
      ${JSON.stringify(inventoryContext)}
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: { responseMimeType: "application/json" }
    });

    const text = response.text || "[]";
    return JSON.parse(text);

  } catch (error) {
    console.error("Smart Search Error:", error);
    return [];
  }
};

// Feature 3: Shop Insights
export const getShopInsights = async (): Promise<string> => {
  const ai = getClient();
  if (!ai) return "Market trends unavailable.";

  const prompt = `Generate 3 short, bulleted business insights for a pharmacy owner in Mumbai. Focus on seasonal trends (e.g., monsoon diseases, heatwave) and inventory tips.`;
  
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt
  });

  return response.text || "No insights available.";
};
