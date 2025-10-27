
import React from 'react';
import type { Recipe } from '../types';
import { ClockIcon, FireIcon, BarChartIcon, PlusIcon } from './icons';

interface RecipeCardProps {
  recipe: Recipe;
  onSelect: () => void;
  ownedIngredients: string[];
  onAddToShoppingList: (ingredientName: string) => void;
}

const InfoChip: React.FC<{ icon: React.ReactNode, text: string }> = ({ icon, text }) => (
    <div className="flex items-center text-sm text-gray-500 bg-gray-100 px-3 py-1.5 rounded-full">
        {icon}
        <span className="ml-2 font-medium">{text}</span>
    </div>
);

export const RecipeCard: React.FC<RecipeCardProps> = ({ recipe, onSelect, ownedIngredients, onAddToShoppingList }) => {
  const ownedIngredientsSet = new Set(ownedIngredients.map(i => i.toLowerCase()));
  const missingIngredients = recipe.ingredients.filter(ing => !ownedIngredientsSet.has(ing.name.toLowerCase()));

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden transition-transform duration-300 hover:scale-105 hover:shadow-2xl flex flex-col">
      <div style={{ backgroundImage: `url(https://picsum.photos/seed/${recipe.title}/600/400)`, backgroundSize: 'cover', backgroundPosition: 'center' }} className="h-48 w-full" />
      <div className="p-6 flex-grow flex flex-col">
        <h3 className="text-2xl font-serif text-gray-800 mb-3">{recipe.title}</h3>
        <div className="flex flex-wrap gap-3 mb-4">
            <InfoChip icon={<BarChartIcon className="w-4 h-4 text-green-600"/>} text={recipe.difficulty} />
            <InfoChip icon={<ClockIcon className="w-4 h-4 text-blue-600"/>} text={`${recipe.prepTimeMinutes} min`} />
            <InfoChip icon={<FireIcon className="w-4 h-4 text-red-600"/>} text={`${recipe.calories} kcal`} />
        </div>
        
        <div className="mb-4 flex-grow">
            <h4 className="font-semibold text-gray-600 mb-2">Missing Ingredients:</h4>
            {missingIngredients.length > 0 ? (
                <ul className="space-y-1.5">
                    {missingIngredients.map(ing => (
                        <li key={ing.name} className="flex items-center justify-between text-sm text-gray-600">
                            <span>{ing.name} ({ing.quantity})</span>
                            <button onClick={() => onAddToShoppingList(ing.name)} className="text-green-500 hover:text-green-700" title={`Add ${ing.name} to shopping list`}>
                                <PlusIcon className="w-5 h-5" />
                            </button>
                        </li>
                    ))}
                </ul>
            ) : <p className="text-sm text-green-600">You have everything you need!</p>}
        </div>

        <button 
            onClick={onSelect} 
            className="mt-auto w-full bg-green-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
        >
            Start Cooking
        </button>
      </div>
    </div>
  );
};
