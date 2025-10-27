
import React from 'react';
import { TrashIcon } from './icons';

interface ShoppingListViewProps {
  shoppingList: string[];
  onRemoveItem: (item: string) => void;
  onClearList: () => void;
}

export const ShoppingListView: React.FC<ShoppingListViewProps> = ({ shoppingList, onRemoveItem, onClearList }) => {
  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-serif text-gray-800">Shopping List</h1>
        {shoppingList.length > 0 && (
          <button 
            onClick={onClearList}
            className="px-4 py-2 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition-colors"
          >
            Clear All
          </button>
        )}
      </div>

      {shoppingList.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl shadow-lg">
          <p className="text-xl text-gray-500">Your shopping list is empty.</p>
          <p className="text-gray-400 mt-2">Add missing ingredients from recipes to see them here.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <ul className="divide-y divide-gray-200">
            {shoppingList.map((item) => (
              <li key={item} className="py-4 flex items-center justify-between">
                <span className="text-lg text-gray-700">{item}</span>
                <button onClick={() => onRemoveItem(item)} className="text-gray-400 hover:text-red-500">
                  <TrashIcon className="w-6 h-6" />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
