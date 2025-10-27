
import React from 'react';
import type { Recipe } from '../types';
import { RecipeCard } from './RecipeCard';

interface RecipeListProps {
  recipes: Recipe[];
  onSelectRecipe: (recipe: Recipe) => void;
  ownedIngredients: string[];
  onAddToShoppingList: (ingredientName: string) => void;
}

export const RecipeList: React.FC<RecipeListProps> = ({ recipes, onSelectRecipe, ownedIngredients, onAddToShoppingList }) => {
  return (
    <main className="flex-1">
        {recipes.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-8">
                {recipes.map((recipe) => (
                    <RecipeCard 
                        key={recipe.title} 
                        recipe={recipe} 
                        onSelect={() => onSelectRecipe(recipe)}
                        ownedIngredients={ownedIngredients}
                        onAddToShoppingList={onAddToShoppingList}
                    />
                ))}
            </div>
        ) : (
            <div className="flex flex-col items-center justify-center h-full bg-white rounded-2xl shadow-lg p-8">
                <p className="text-2xl font-semibold text-gray-500">No recipes found.</p>
                <p className="text-gray-400 mt-2">Try adjusting your filters or uploading a new photo.</p>
            </div>
        )}
    </main>
  );
};
