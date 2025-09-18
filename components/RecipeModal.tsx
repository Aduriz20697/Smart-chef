
import React, { useState } from 'react';
import type { Recipe } from '../types';
import { CookingMode } from './CookingMode';
import { XMarkIcon, CheckCircleIcon, ShoppingCartIcon, SparklesIcon } from './IconComponents';

interface RecipeModalProps {
  recipe: Recipe;
  onClose: () => void;
}

export const RecipeModal: React.FC<RecipeModalProps> = ({ recipe, onClose }) => {
    const [isCookingMode, setIsCookingMode] = useState(false);

    if (isCookingMode) {
        return <CookingMode recipe={recipe} onExit={() => setIsCookingMode(false)} />;
    }
  
    return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col animate-fade-in-up">
        <div className="flex justify-between items-center p-5 border-b">
          <h2 className="text-2xl font-bold text-gray-800">{recipe.recipeName}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
            <XMarkIcon className="h-7 w-7" />
          </button>
        </div>

        <div className="overflow-y-auto p-6 space-y-6">
            <p className="text-gray-600">{recipe.description}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <h3 className="text-lg font-semibold flex items-center mb-2"><CheckCircleIcon className="h-5 w-5 text-green-500 mr-2"/>Ingredients You Have</h3>
                    <ul className="list-disc list-inside text-gray-700 space-y-1">
                        {recipe.usedIngredients.map((item, i) => <li key={i}>{item}</li>)}
                    </ul>
                </div>
                 <div>
                    <h3 className="text-lg font-semibold flex items-center mb-2"><ShoppingCartIcon className="h-5 w-5 text-blue-500 mr-2"/>Shopping List</h3>
                    <ul className="list-disc list-inside text-gray-700 space-y-1">
                        {recipe.neededIngredients.length > 0 ? recipe.neededIngredients.map((item, i) => <li key={i}>{item}</li>) : <li>Nothing! You're all set.</li>}
                    </ul>
                </div>
            </div>

            <div>
                 <h3 className="text-lg font-semibold mb-2">Instructions</h3>
                 <ol className="list-decimal list-inside space-y-3 text-gray-800">
                    {recipe.instructions.map((step, i) => <li key={i}>{step}</li>)}
                 </ol>
            </div>
        </div>
        
        <div className="p-5 border-t mt-auto">
            <button
                onClick={() => setIsCookingMode(true)}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-full flex items-center justify-center space-x-2 transition-transform transform hover:scale-105"
            >
                <SparklesIcon className="h-6 w-6"/>
                <span>Start Cooking Mode</span>
            </button>
        </div>

      </div>
    </div>
  );
};
