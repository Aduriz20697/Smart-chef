
export interface Recipe {
  recipeName: string;
  description: string;
  neededIngredients: string[];
  usedIngredients: string[];
  instructions: string[];
}

export interface GamificationStats {
  points: number;
  streak: number;
  lastUsed: string | null;
}
