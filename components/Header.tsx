
import React from 'react';
import type { View } from '../types';

interface HeaderProps {
    currentView: View;
    onNavigate: (view: View) => void;
    hasRecipes: boolean;
}

const NavButton: React.FC<{
    isActive: boolean;
    onClick: () => void;
    children: React.ReactNode;
    disabled?: boolean;
}> = ({ isActive, onClick, children, disabled }) => (
    <button
        onClick={onClick}
        disabled={disabled}
        className={`px-4 py-2 font-semibold rounded-md transition-colors text-sm md:text-base
            ${isActive
                ? 'bg-green-600 text-white'
                : 'text-gray-500 hover:bg-gray-200'
            }
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
    >
        {children}
    </button>
);

export const Header: React.FC<HeaderProps> = ({ currentView, onNavigate, hasRecipes }) => {
    return (
        <header className="sticky top-0 bg-white/80 backdrop-blur-md shadow-sm z-40">
            <nav className="container mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
                <div className="flex items-center gap-2" onClick={() => onNavigate('upload')} role="button">
                    <span className="text-2xl font-serif font-bold text-green-700">Culinary Vision AI</span>
                </div>
                <div className="flex items-center space-x-2 md:space-x-4">
                    <NavButton
                        isActive={currentView === 'recipes'}
                        onClick={() => onNavigate('recipes')}
                        disabled={!hasRecipes}
                    >
                        Recipes
                    </NavButton>
                    <NavButton
                        isActive={currentView === 'shopping'}
                        onClick={() => onNavigate('shopping')}
                    >
                        Shopping List
                    </NavButton>
                </div>
            </nav>
        </header>
    );
}
