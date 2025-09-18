
import React from 'react';

const FILTERS = ['Vegan', 'Vegetarian', 'Gluten-Free', 'Keto', 'Low-Carb', 'High-Protein', 'Dairy-Free'];

interface DietaryFiltersProps {
  selectedFilters: string[];
  setSelectedFilters: React.Dispatch<React.SetStateAction<string[]>>;
}

export const DietaryFilters: React.FC<DietaryFiltersProps> = ({ selectedFilters, setSelectedFilters }) => {
  const handleToggleFilter = (filter: string) => {
    setSelectedFilters(prev =>
      prev.includes(filter) ? prev.filter(f => f !== filter) : [...prev, filter]
    );
  };

  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold text-gray-700 mb-3 text-center">Dietary Options</h3>
      <div className="flex flex-wrap justify-center gap-2">
        {FILTERS.map(filter => (
          <button
            key={filter}
            onClick={() => handleToggleFilter(filter)}
            className={`px-4 py-2 border rounded-full text-sm font-medium transition-colors duration-200 ${
              selectedFilters.includes(filter)
                ? 'bg-green-600 text-white border-green-600'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
            }`}
          >
            {filter}
          </button>
        ))}
      </div>
    </div>
  );
};
