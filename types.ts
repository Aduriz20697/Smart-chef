
export interface Recipe {
  recipeName: string;
  description: string;
  cookingTime: string; // e.g., "30 minutes"
  difficulty: 'Easy' | 'Medium' | 'Hard';
  neededIngredients: string[];
  usedIngredients: string[];
  instructions: string[];
}

export interface GamificationStats {
  points: number;
  streak: number;
  lastUsed: string | null;
}