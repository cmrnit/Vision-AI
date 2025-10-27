
import React, { useState, useEffect, useCallback } from 'react';
import type { Recipe } from '../types';
import { ArrowLeftIcon, ArrowRightIcon, VolumeUpIcon } from './icons';

interface CookingModeViewProps {
  recipe: Recipe;
  onExit: () => void;
}

export const CookingModeView: React.FC<CookingModeViewProps> = ({ recipe, onExit }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const readAloud = useCallback((text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(utterance);
    } else {
      alert('Sorry, your browser does not support text-to-speech.');
    }
  }, []);

  useEffect(() => {
    // Stop speech synthesis when component unmounts
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const handleNextStep = () => {
    setCurrentStep((prev) => Math.min(prev + 1, recipe.instructions.length - 1));
  };

  const handlePrevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };
  
  const currentInstruction = recipe.instructions[currentStep];

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-white w-full max-w-4xl h-full max-h-[90vh] rounded-2xl shadow-2xl flex flex-col p-6 md:p-10">
        <div className="flex items-start justify-between mb-4">
            <div>
                <h2 className="text-3xl md:text-4xl font-serif text-gray-800">{recipe.title}</h2>
                <p className="text-gray-500 mt-1 font-medium">
                    Step {currentStep + 1} of {recipe.instructions.length}
                </p>
            </div>
            <button onClick={onExit} className="text-gray-400 hover:text-gray-600 font-bold text-2xl">&times;</button>
        </div>
        
        <div className="flex-grow flex items-center justify-center my-6">
            <p className="text-2xl md:text-4xl lg:text-5xl font-sans text-center leading-relaxed text-gray-700">
                {currentInstruction}
            </p>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <button 
            onClick={handlePrevStep} 
            disabled={currentStep === 0}
            className="flex items-center justify-center gap-2 w-full md:w-auto px-6 py-3 bg-gray-200 text-gray-700 font-bold rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ArrowLeftIcon className="w-5 h-5"/>
            Previous
          </button>
          <button 
            onClick={() => readAloud(currentInstruction)} 
            className="flex items-center justify-center w-full md:w-auto px-8 py-4 bg-green-600 text-white font-bold rounded-full hover:bg-green-700 transition-colors text-lg"
          >
            <VolumeUpIcon className="w-6 h-6 mr-3"/>
            Read Aloud
          </button>
          <button 
            onClick={handleNextStep} 
            disabled={currentStep === recipe.instructions.length - 1}
            className="flex items-center justify-center gap-2 w-full md:w-auto px-6 py-3 bg-gray-200 text-gray-700 font-bold rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Next
            <ArrowRightIcon className="w-5 h-5"/>
          </button>
        </div>
      </div>
    </div>
  );
};
