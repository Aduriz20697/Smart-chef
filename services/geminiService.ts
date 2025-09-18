
import { GoogleGenAI, Type } from "@google/genai";
import type { Recipe } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

function base64ToGenerativePart(base64: string, mimeType: string) {
  return {
    inlineData: {
      data: base64,
      mimeType,
    },
  };
}

export async function identifyIngredientsFromImage(imageDataUrl: string): Promise<string[]> {
  const base64Data = imageDataUrl.split(',')[1];
  const mimeType = imageDataUrl.split(',')[0].split(':')[1].split(';')[0];

  const imagePart = base64ToGenerativePart(base64Data, mimeType);
  
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: {
        parts: [
            imagePart,
            { text: "Analyze this image of a refrigerator or pantry. Identify all the edible food items and ingredients visible. List them as a simple, comma-separated string. For example: 'eggs, milk, carrots, leftover chicken, cheddar cheese'. Only list the ingredients. If no ingredients are found, return an empty string." }
        ]
    }
  });

  const text = response.text.trim();
  if (!text) {
    return [];
  }
  return text.split(',').map(item => item.trim()).filter(Boolean);
}

const recipeSchema = {
    type: Type.ARRAY,
    items: {
        type: Type.OBJECT,
        properties: {
            recipeName: { type: Type.STRING, description: "Creative name of the recipe." },
            description: { type: Type.STRING, description: "A brief, enticing 1-2 sentence description of the dish." },
            cookingTime: { type: Type.STRING, description: "Estimated total cooking time, e.g., '30 minutes'." },
            difficulty: { type: Type.STRING, description: "Difficulty level, must be one of: 'Easy', 'Medium', or 'Hard'." },
            neededIngredients: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "List of ingredients required for the recipe that are NOT in the user's available list."
            },
            usedIngredients: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "List of ingredients from the user's available list that are used in this recipe."
            },
            instructions: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "Step-by-step cooking instructions."
            },
        },
        required: ["recipeName", "description", "cookingTime", "difficulty", "neededIngredients", "usedIngredients", "instructions"]
    }
};

export async function generateRecipes(ingredients: string[], filters: string[], leftovers: string): Promise<Recipe[]> {
    const prompt = `
        Generate 3 distinct recipe ideas based on these details:
        Available ingredients: ${ingredients.join(', ')}
        Dietary preferences: ${filters.join(', ') || 'None'}
        ${leftovers ? `Leftovers to incorporate: "${leftovers}"` : ''}

        For each recipe, provide the required information in the specified JSON format. This includes a creative name, a brief description, an estimated cooking time (e.g., "30 minutes"), and a difficulty level ('Easy', 'Medium', or 'Hard'). Ensure the instructions are clear and sequential.
    `;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: recipeSchema,
        },
    });
    
    try {
        const jsonText = response.text.trim();
        const parsedRecipes: Recipe[] = JSON.parse(jsonText);
        return parsedRecipes;
    } catch (e) {
        console.error("Failed to parse Gemini response:", response.text);
        throw new Error("The AI returned an unexpected format. Please try modifying your ingredients or filters.");
    }
}