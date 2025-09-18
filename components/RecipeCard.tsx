
import React from 'react';
import type { Recipe } from '../types';
import { BookmarkIcon, BookmarkSolidIcon } from './IconComponents';

interface RecipeCardProps {
  recipe: Recipe;
  onSelect: () => void;
  onSaveToggle: (recipe: Recipe) => void;
  isSaved: boolean;
}

export const RecipeCard: React.FC<RecipeCardProps> = ({ recipe, onSelect, onSaveToggle, isSaved }) => {
  return (
    <div
      onClick={onSelect}
      className="bg-white rounded-2xl shadow-md overflow-hidden cursor-pointer transform hover:-translate-y-2 transition-transform duration-300 ease-in-out group relative"
    >
      <button
          onClick={(e) => {
            e.stopPropagation();
            onSaveToggle(recipe);
          }}
          className="absolute top-3 right-3 bg-white/70 backdrop-blur-sm p-2 rounded-full text-gray-700 hover:text-green-600 hover:bg-white transition z-10"
          aria-label={isSaved ? 'Unsave Recipe' : 'Save Recipe'}
        >
          {isSaved ? <BookmarkSolidIcon className="h-6 w-6 text-green-600" /> : <BookmarkIcon className="h-6 w-6" />}
        </button>
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
