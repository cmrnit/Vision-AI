
import React from 'react';
import type { DietaryFilter } from '../types';
import { DIETARY_FILTERS } from '../types';

interface SidebarProps {
  activeFilters: DietaryFilter[];
  onFilterChange: (filter: DietaryFilter) => void;
  ownedIngredients: string[];
}

export const Sidebar: React.FC<SidebarProps> = ({ activeFilters, onFilterChange, ownedIngredients }) => {
  return (
    <aside className="w-full md:w-72 lg:w-80 flex-shrink-0 p-6 bg-white rounded-2xl shadow-lg">
      <div className="mb-8">
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Your Ingredients</h3>
        <div className="flex flex-wrap gap-2">
            {ownedIngredients.map(ing => (
                <span key={ing} className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">{ing}</span>
            ))}
        </div>
      </div>
      <div>
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Dietary Filters</h3>
        <div className="space-y-3">
          {DIETARY_FILTERS.map((filter) => (
            <label key={filter} className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                className="h-5 w-5 rounded border-gray-300 text-green-600 focus:ring-green-500"
                checked={activeFilters.includes(filter)}
                onChange={() => onFilterChange(filter)}
              />
              <span className="text-gray-700 font-medium">{filter}</span>
            </label>
          ))}
        </div>
      </div>
    </aside>
  );
};
