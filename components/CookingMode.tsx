
import React, { useState, useEffect } from 'react';
import type { Recipe } from '../types';
import { useSpeechSynthesis } from '../hooks/useSpeechSynthesis';
import { XMarkIcon, ChevronLeftIcon, ChevronRightIcon, SpeakerWaveIcon, SpeakerXMarkIcon } from './IconComponents';

interface CookingModeProps {
  recipe: Recipe;
  onExit: () => void;
}

export const CookingMode: React.FC<CookingModeProps> = ({ recipe, onExit }) => {
    const [currentStep, setCurrentStep] = useState(0);
    const { speak, cancel, isSpeaking } = useSpeechSynthesis();
    const [isMuted, setIsMuted] = useState(false);
    
    const instructions = recipe.instructions;

    useEffect(() => {
        if (!isMuted) {
            speak(instructions[currentStep]);
        } else {
            cancel();
        }
    }, [currentStep, instructions, speak, isMuted, cancel]);
    
    const nextStep = () => {
        if (currentStep < instructions.length - 1) {
            setCurrentStep(prev => prev + 1);
        }
    };

    const prevStep = () => {
        if (currentStep > 0) {
            setCurrentStep(prev => prev - 1);
        }
    };
    
    const toggleMute = () => {
        setIsMuted(prev => !prev);
    }
    
    return (
        <div className="fixed inset-0 bg-gray-900 text-white flex flex-col z-50 p-4 md:p-8">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl md:text-2xl font-bold truncate">{recipe.recipeName}</h2>
                <div className="flex items-center space-x-4">
                    <button onClick={toggleMute} className="text-gray-300 hover:text-white">
                        {isMuted || !isSpeaking ? <SpeakerXMarkIcon className="h-7 w-7" /> : <SpeakerWaveIcon className="h-7 w-7" />}
                    </button>
                    <button onClick={onExit} className="text-gray-300 hover:text-white">
                        <XMarkIcon className="h-8 w-8" />
                    </button>
                </div>
            </div>

            <div className="flex-grow flex flex-col justify-center items-center text-center">
                 <p className="text-gray-400 font-semibold mb-4">Step {currentStep + 1} of {instructions.length}</p>
                 <p className="text-3xl md:text-5xl lg:text-6xl font-light leading-tight max-w-4xl">
                    {instructions[currentStep]}
                 </p>
            </div>
            
            <div className="flex justify-center items-center space-x-8">
                <button
                    onClick={prevStep}
                    disabled={currentStep === 0}
                    className="p-4 bg-gray-700 rounded-full disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600 transition"
                >
                    <ChevronLeftIcon className="h-8 w-8"/>
                </button>
                 <button
                    onClick={nextStep}
                    disabled={currentStep === instructions.length - 1}
                    className="p-4 bg-green-600 rounded-full disabled:opacity-50 disabled:cursor-not-allowed hover:bg-green-500 transition"
                >
                    <ChevronRightIcon className="h-8 w-8"/>
                </button>
            </div>
        </div>
    );
};
