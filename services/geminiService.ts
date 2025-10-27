
import { GoogleGenAI, Type } from "@google/genai";
import type { DietaryFilter, Recipe } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const fileToGenerativePart = async (file: File) => {
  const base64EncodedDataPromise = new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
    reader.readAsDataURL(file);
  });
  return {
    inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
  };
};

export const identifyIngredients = async (imageFile: File): Promise<string[]> => {
  const imagePart = await fileToGenerativePart(imageFile);
  const result = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: {
      parts: [
        imagePart,
        { text: "Analyze this image of a refrigerator's contents. Identify all visible food ingredients. Return a JSON array of strings representing the ingredients. Example: [\"eggs\", \"milk\", \"lettuce\"]" }
      ],
    },
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.STRING
        }
      }
    }
  });

  try {
    const jsonString = result.text;
    const ingredients = JSON.parse(jsonString);
    return Array.isArray(ingredients) ? ingredients : [];
  } catch (error) {
    console.error("Error parsing ingredients JSON:", error);
    return [];
  }
};

export const generateRecipes = async (ingredients: string[], filters: DietaryFilter[]): Promise<Recipe[]> => {
    const filterText = filters.length > 0 ? `It must adhere to the following dietary restrictions: ${filters.join(', ')}.` : '';
  
    const prompt = `
      Given the following ingredients: ${ingredients.join(', ')}. 
      ${filterText}
      Suggest 3 delicious recipes. For each recipe, provide the title, difficulty ('Easy', 'Medium', or 'Hard'), estimated preparation time in minutes, approximate calorie count, a list of all required ingredients (with names and quantities), and step-by-step cooking instructions.
      Return the response as a JSON array of recipe objects.
    `;
  
    const result = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              difficulty: { type: Type.STRING, enum: ['Easy', 'Medium', 'Hard'] },
              prepTimeMinutes: { type: Type.NUMBER },
              calories: { type: Type.NUMBER },
              ingredients: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING },
                    quantity: { type: Type.STRING }
                  },
                  required: ['name', 'quantity']
                }
              },
              instructions: {
                type: Type.ARRAY,
                items: {
                  type: Type.STRING
                }
              }
            },
            required: ['title', 'difficulty', 'prepTimeMinutes', 'calories', 'ingredients', 'instructions']
          }
        }
      }
    });
  
    try {
      const jsonString = result.text;
      const recipes = JSON.parse(jsonString);
      return Array.isArray(recipes) ? recipes : [];
    } catch (error) {
      console.error("Error parsing recipes JSON:", error);
      return [];
    }
  };
