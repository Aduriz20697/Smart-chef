
import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { IngredientInput } from './components/IngredientInput';
import { DietaryFilters } from './components/DietaryFilters';
import { RecipeCard } from './components/RecipeCard';
import { RecipeModal } from './components/RecipeModal';
import { Spinner } from './components/Spinner';
import { identifyIngredientsFromImage, generateRecipes } from './services/geminiService';
import type { Recipe } from './types';
import { useGamification } from './hooks/useGamification';
import { useSavedRecipes } from './hooks/useSavedRecipes';
import { BookmarkIcon } from './components/IconComponents';

type ActiveView = 'generate' | 'saved';

const App: React.FC = () => {
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [dietaryFilters, setDietaryFilters] = useState<string[]>([]);
  const [leftovers, setLeftovers] = useState<string>('');
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const { stats, addPoints, incrementStreak } = useGamification();
  const { savedRecipes, saveRecipe, unsaveRecipe, isRecipeSaved } = useSavedRecipes();
  const [activeView, setActiveView] = useState<ActiveView>('generate');

  const handleImageScan = async (imageData: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const identified = await identifyIngredientsFromImage(imageData);
      setIngredients(prev => [...new Set([...prev, ...identified])]);
    } catch (err) {
      setError('Could not identify ingredients from image. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateRecipes = useCallback(async () => {
    if (ingredients.length === 0 && !leftovers) {
      setError('Please add some ingredients or leftovers first!');
      return;
    }
    setIsLoading(true);
    setError(null);
    setRecipes([]);
    setActiveView('generate');
    try {
      const result = await generateRecipes(ingredients, dietaryFilters, leftovers);
      setRecipes(result);
      if (result.length > 0) {
        addPoints(ingredients.length * 10);
        incrementStreak();
      }
    } catch (err) {
      setError('Failed to generate recipes. The AI might be busy. Please try again later.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [ingredients, dietaryFilters, leftovers, addPoints, incrementStreak]);

  const handleSelectRecipe = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
  };

  const handleCloseModal = () => {
    setSelectedRecipe(null);
  };

  const handleSaveToggle = (recipe: Recipe) => {
    if (isRecipeSaved(recipe.recipeName)) {
      unsaveRecipe(recipe.recipeName);
    } else {
      saveRecipe(recipe);
    }
  };
  
  const recipesToShow = activeView === 'generate' ? recipes : savedRecipes;

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800">
      <Header stats={stats} activeView={activeView} onViewChange={setActiveView} />
      <main className="container mx-auto p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          {activeView === 'generate' ? (
            <>
              <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">Waste Less, Cook More</h1>
                <p className="text-lg text-gray-600">Tell us what you have, and we'll whip up recipe ideas in seconds.</p>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-lg mb-8">
                <IngredientInput
                  ingredients={ingredients}
                  setIngredients={setIngredients}
                  onImageScan={handleImageScan}
                  leftovers={leftovers}
                  setLeftovers={setLeftovers}
                />
                <DietaryFilters selectedFilters={dietaryFilters} setSelectedFilters={setDietaryFilters} />
                <div className="mt-6 text-center">
                  <button
                    onClick={handleGenerateRecipes}
                    disabled={isLoading}
                    className="w-full md:w-auto bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-bold py-3 px-8 rounded-full transition-transform transform hover:scale-105 duration-300 ease-in-out shadow-md disabled:shadow-none"
                  >
                    {isLoading ? 'Crafting Recipes...' : 'Generate Recipes'}
                  </button>
                </div>
              </div>
            </>
          ) : (
             <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">Your Saved Recipes</h1>
                <p className="text-lg text-gray-600">Your collection of culinary inspiration.</p>
              </div>
          )}

          {error && <p className="text-center text-red-500 bg-red-100 p-3 rounded-lg">{error}</p>}
          
          {isLoading && recipesToShow.length === 0 && <Spinner />}

          {recipesToShow.length > 0 ? (
            <div className="mt-12">
              <h2 className="text-3xl font-bold text-center mb-8">
                {activeView === 'generate' ? 'Your Custom Recipes' : `You have ${savedRecipes.length} saved recipes`}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {recipesToShow.map((recipe, index) => (
                  <RecipeCard 
                    key={index} 
                    recipe={recipe} 
                    onSelect={() => handleSelectRecipe(recipe)}
                    onSaveToggle={handleSaveToggle}
                    isSaved={isRecipeSaved(recipe.recipeName)}
                  />
                ))}
              </div>
            </div>
          ) : (
            !isLoading && activeView === 'saved' && (
                <div className="text-center mt-12 py-12 bg-white rounded-2xl shadow-lg">
                    <BookmarkIcon className="h-16 w-16 mx-auto text-gray-300" />
                    <h3 className="mt-4 text-2xl font-semibold text-gray-800">No Saved Recipes Yet</h3>
                    <p className="mt-2 text-gray-500">Find a recipe you like and click the bookmark icon to save it here!</p>
                </div>
            )
          )}
        </div>
      </main>
      {selectedRecipe && (
        <RecipeModal 
            recipe={selectedRecipe} 
            onClose={handleCloseModal}
            onSaveToggle={handleSaveToggle}
            isSaved={isRecipeSaved(selectedRecipe.recipeName)}
        />
      )}
    </div>
  );
};

export default App;
