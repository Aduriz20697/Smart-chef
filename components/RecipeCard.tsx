
import React from 'react';
import type { Recipe } from '../types';

interface RecipeCardProps {
  recipe: Recipe;
  onSelect: () => void;
}

export const RecipeCard: React.FC<RecipeCardProps> = ({ recipe, onSelect }) => {
  return (
    <div
      onClick={onSelect}
      className="bg-white rounded-2xl shadow-md overflow-hidden cursor-pointer transform hover:-translate-y-2 transition-transform duration-300 ease-in-out group"
    >
      <img
        src={`https://picsum.photos/seed/${recipe.recipeName.replace(/\s/g, '')}/400/300`}
        alt={recipe.recipeName}
        className="w-full h-48 object-cover"
      />
      <div className="p-5">
        <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-green-600 transition-colors">{recipe.recipeName}</h3>
        <p className="text-gray-600 text-sm line-clamp-2">{recipe.description}</p>
      </div>
    </div>
  );
};
