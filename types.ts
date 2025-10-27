
export interface Ingredient {
  name: string;
  quantity: string;
}

export interface Recipe {
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  prepTimeMinutes: number;
  calories: number;
  ingredients: Ingredient[];
  instructions: string[];
}

export type View = 'upload' | 'recipes' | 'cooking' | 'shopping';

export const DIETARY_FILTERS = ['Vegetarian', 'Vegan', 'Gluten-Free', 'Keto', 'Paleo'] as const;

export type DietaryFilter = typeof DIETARY_FILTERS[number];
