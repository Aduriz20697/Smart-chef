
import React from 'react';
import type { Recipe } from '../types';
import { BookmarkIcon, BookmarkSolidIcon, ClockIcon, ChartBarIcon } from './IconComponents';

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
      className="bg-white rounded-2xl shadow-md overflow-hidden cursor-pointer transform hover:-translate-y-2 transition-transform duration-300 ease-in-out group relative flex flex-col"
    >
      <div className="relative">
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
      </div>
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-green-600 transition-colors">{recipe.recipeName}</h3>
        <p className="text-gray-600 text-sm line-clamp-2 flex-grow">{recipe.description}</p>
         <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100 text-gray-500">
            <div className="flex items-center space-x-1 text-sm">
                <ClockIcon className="h-4 w-4" />
                <span>{recipe.cookingTime}</span>
            </div>
            <div className={`flex items-center space-x-1 text-sm font-medium px-2 py-1 rounded-full ${
                recipe.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
                recipe.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
            }`}>
                <ChartBarIcon className="h-4 w-4" />
                <span>{recipe.difficulty}</span>
            </div>
        </div>
      </div>
    </div>
  );
};