
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { identifyIngredients, generateRecipes } from './services/geminiService';
import type { Recipe, View, DietaryFilter } from './types';
import { ImageUploader } from './components/ImageUploader';
import { Sidebar } from './components/Sidebar';
import { RecipeList } from './components/RecipeList';
import { CookingModeView } from './components/CookingModeView';
import { ShoppingListView } from './components/ShoppingListView';
import { Header } from './components/Header';
import { SpinnerIcon } from './components/icons';

const App: React.FC = () => {
    const [view, setView] = useState<View>('upload');
    const [isLoading, setIsLoading] = useState(false);
    const [loadingText, setLoadingText] = useState('');
    const [error, setError] = useState<string | null>(null);

    const [ownedIngredients, setOwnedIngredients] = useState<string[]>([]);
    const [allRecipes, setAllRecipes] = useState<Recipe[]>([]);
    const [activeFilters, setActiveFilters] = useState<DietaryFilter[]>([]);
    const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
    const [shoppingList, setShoppingList] = useState<string[]>([]);

    const handleImageUpload = async (file: File) => {
        setIsLoading(true);
        setError(null);
        setLoadingText('Analyzing your ingredients...');
        try {
            const ingredients = await identifyIngredients(file);
            setOwnedIngredients(ingredients);

            if (ingredients.length > 0) {
                setLoadingText('Generating delicious recipes...');
                const recipes = await generateRecipes(ingredients, activeFilters);
                setAllRecipes(recipes);
                setView('recipes');
            } else {
                setError("Could not identify any ingredients. Please try another photo.");
                setView('upload');
            }
        } catch (err) {
            console.error(err);
            setError('An error occurred. Please try again.');
            setView('upload');
        } finally {
            setIsLoading(false);
            setLoadingText('');
        }
    };

    const handleFilterChange = (filter: DietaryFilter) => {
        setActiveFilters(prev =>
            prev.includes(filter)
                ? prev.filter(f => f !== filter)
                : [...prev, filter]
        );
    };

    const refetchRecipes = useCallback(async () => {
        if (ownedIngredients.length === 0) return;
        setIsLoading(true);
        setError(null);
        setLoadingText('Updating recipes with new filters...');
        try {
            const recipes = await generateRecipes(ownedIngredients, activeFilters);
            setAllRecipes(recipes);
        } catch (err) {
            console.error(err);
            setError('Failed to update recipes. Please try again.');
        } finally {
            setIsLoading(false);
            setLoadingText('');
        }
    }, [ownedIngredients, activeFilters]);

    useEffect(() => {
        if (view === 'recipes' && ownedIngredients.length > 0) {
            refetchRecipes();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeFilters, view]);


    const handleSelectRecipe = (recipe: Recipe) => {
        setSelectedRecipe(recipe);
        setView('cooking');
    };

    const handleAddToShoppingList = (item: string) => {
        setShoppingList(prev => {
            const lowerCaseItem = item.toLowerCase();
            if (prev.some(i => i.toLowerCase() === lowerCaseItem)) return prev;
            return [...prev, item];
        });
    };

    const handleRemoveFromShoppingList = (itemToRemove: string) => {
        setShoppingList(prev => prev.filter(item => item !== itemToRemove));
    };

    const handleClearShoppingList = () => {
        setShoppingList([]);
    };
    
    const handleNavigation = (targetView: View) => {
        if (targetView === 'upload') {
            setAllRecipes([]);
            setOwnedIngredients([]);
            setActiveFilters([]);
        }
        setView(targetView);
    }

    const renderContent = () => {
        switch (view) {
            case 'upload':
                return <ImageUploader onImageUpload={handleImageUpload} isLoading={isLoading} loadingText={loadingText} />;
            
            case 'recipes':
                return (
                    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
                        <div className="flex flex-col md:flex-row gap-8">
                            <Sidebar 
                                activeFilters={activeFilters} 
                                onFilterChange={handleFilterChange} 
                                ownedIngredients={ownedIngredients} 
                            />
                            {isLoading ? (
                                <div className="flex-1 flex items-center justify-center bg-white rounded-2xl shadow-lg">
                                    <div className="text-center text-green-600">
                                        <SpinnerIcon className="animate-spin h-12 w-12 mx-auto mb-4" />
                                        <p className="font-medium">{loadingText}</p>
                                    </div>
                                </div>
                            ) : (
                                <RecipeList 
                                    recipes={allRecipes} 
                                    onSelectRecipe={handleSelectRecipe} 
                                    ownedIngredients={ownedIngredients}
                                    onAddToShoppingList={handleAddToShoppingList}
                                />
                            )}
                        </div>
                    </div>
                );

            case 'cooking':
                return selectedRecipe && <CookingModeView recipe={selectedRecipe} onExit={() => setView('recipes')} />;
            
            case 'shopping':
                return <ShoppingListView 
                            shoppingList={shoppingList} 
                            onRemoveItem={handleRemoveFromShoppingList}
                            onClearList={handleClearShoppingList}
                        />;
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            {view !== 'upload' && <Header currentView={view} onNavigate={handleNavigation} hasRecipes={allRecipes.length > 0} />}
            <main>
                {error && (
                    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 m-4" role="alert">
                        <p>{error}</p>
                    </div>
                )}
                {renderContent()}
            </main>
        </div>
    );
};

export default App;
