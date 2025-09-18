
import { useState, useEffect, useCallback } from 'react';
import type { Recipe } from '../types';

const STORAGE_KEY = 'smartchef_saved_recipes';

export const useSavedRecipes = () => {
    const [savedRecipes, setSavedRecipes] = useState<Recipe[]>([]);

    useEffect(() => {
        try {
            const savedItems = localStorage.getItem(STORAGE_KEY);
            if (savedItems) {
                setSavedRecipes(JSON.parse(savedItems));
            }
        } catch (error) {
            console.error('Failed to load saved recipes from localStorage', error);
        }
    }, []);

    const updateStorage = useCallback((recipes: Recipe[]) => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(recipes));
        } catch (error) {
            console.error('Failed to save recipes to localStorage', error);
        }
    }, []);

    const saveRecipe = useCallback((recipe: Recipe) => {
        setSavedRecipes(prev => {
            if (prev.some(r => r.recipeName === recipe.recipeName)) {
                return prev; // Avoid duplicates
            }
            const newRecipes = [...prev, recipe];
            updateStorage(newRecipes);
            return newRecipes;
        });
    }, [updateStorage]);

    const unsaveRecipe = useCallback((recipeName: string) => {
        setSavedRecipes(prev => {
            const newRecipes = prev.filter(r => r.recipeName !== recipeName);
            updateStorage(newRecipes);
            return newRecipes;
        });
    }, [updateStorage]);

    const isRecipeSaved = useCallback((recipeName: string) => {
        return savedRecipes.some(r => r.recipeName === recipeName);
    }, [savedRecipes]);

    return { savedRecipes, saveRecipe, unsaveRecipe, isRecipeSaved };
};
