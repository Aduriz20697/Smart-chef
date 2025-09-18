
import React, { useState, useRef, useCallback } from 'react';
import { CameraIcon, PlusIcon, SparklesIcon, XMarkIcon } from './IconComponents';

interface IngredientInputProps {
  ingredients: string[];
  setIngredients: React.Dispatch<React.SetStateAction<string[]>>;
  onImageScan: (imageData: string) => void;
  leftovers: string;
  setLeftovers: React.Dispatch<React.SetStateAction<string>>;
}

type ActiveTab = 'scan' | 'manual' | 'leftovers';

export const IngredientInput: React.FC<IngredientInputProps> = ({ ingredients, setIngredients, onImageScan, leftovers, setLeftovers }) => {
  const [inputValue, setInputValue] = useState('');
  const [activeTab, setActiveTab] = useState<ActiveTab>('manual');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAddIngredient = useCallback(() => {
    if (inputValue.trim() && !ingredients.includes(inputValue.trim().toLowerCase())) {
      setIngredients(prev => [...prev, inputValue.trim().toLowerCase()]);
      setInputValue('');
    }
  }, [inputValue, ingredients, setIngredients]);

  const handleRemoveIngredient = useCallback((ingredientToRemove: string) => {
    setIngredients(prev => prev.filter(ing => ing !== ingredientToRemove));
  }, [setIngredients]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onImageScan(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const TabButton = ({ tab, label, icon }: { tab: ActiveTab; label: string; icon: JSX.Element; }) => (
    <button
      onClick={() => setActiveTab(tab)}
      className={`flex items-center space-x-2 px-4 py-2 text-sm font-medium rounded-full transition-colors duration-200 ${
        activeTab === tab ? 'bg-green-600 text-white' : 'text-gray-600 hover:bg-gray-100'
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );

  return (
    <div>
        <div className="flex justify-center space-x-2 mb-4 border-b pb-4">
            <TabButton tab="manual" label="Add Manually" icon={<PlusIcon className="h-5 w-5"/>} />
            <TabButton tab="scan" label="Scan Fridge" icon={<CameraIcon className="h-5 w-5"/>} />
            <TabButton tab="leftovers" label="Use Leftovers" icon={<SparklesIcon className="h-5 w-5"/>} />
        </div>

        {activeTab === 'manual' && (
            <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-2">
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddIngredient()}
                    placeholder="e.g., chicken breast, tomatoes"
                    className="w-full px-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
                />
                <button
                    onClick={handleAddIngredient}
                    className="w-full sm:w-auto bg-gray-800 text-white px-6 py-2 rounded-full font-semibold hover:bg-gray-700 transition"
                >
                    Add
                </button>
            </div>
        )}
        {activeTab === 'scan' && (
             <div className="text-center">
                <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-full flex items-center justify-center space-x-2 transition-transform transform hover:scale-105"
                >
                    <CameraIcon className="h-6 w-6"/>
                    <span>Scan with Camera</span>
                </button>
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    capture="environment"
                    className="hidden"
                />
                 <p className="text-xs text-gray-500 mt-2">Use your phone's camera to snap a pic of your ingredients!</p>
            </div>
        )}
        {activeTab === 'leftovers' && (
             <div>
                <textarea
                    value={leftovers}
                    onChange={(e) => setLeftovers(e.target.value)}
                    placeholder="e.g., last night's roasted chicken, leftover rice..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
                    rows={2}
                />
                <p className="text-xs text-gray-500 mt-1">Describe your leftovers to get creative 'remix' recipes.</p>
            </div>
        )}

      <div className="mt-4 flex flex-wrap gap-2">
        {ingredients.map(ing => (
          <span key={ing} className="flex items-center bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full">
            {ing}
            <button onClick={() => handleRemoveIngredient(ing)} className="ml-2 text-green-600 hover:text-green-800">
              <XMarkIcon className="h-4 w-4" />
            </button>
          </span>
        ))}
      </div>
    </div>
  );
};
