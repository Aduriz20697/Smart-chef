import React, { useState, useEffect, useMemo, useCallback } from 'react';
import type { Recipe } from '../types';
import { useSpeechSynthesis } from '../hooks/useSpeechSynthesis';
import { XMarkIcon, ChevronLeftIcon, ChevronRightIcon, SpeakerWaveIcon, SpeakerXMarkIcon, ClockIcon, PlayIcon, PauseIcon } from './IconComponents';

interface CookingModeProps {
  recipe: Recipe;
  onExit: () => void;
}

// Helper function to parse time from a string (e.g., "10 minutes") into seconds
const parseTimeFromInstruction = (text: string): number | null => {
    const minutesMatch = text.match(/(\d+)\s+minute(s)?/i);
    if (minutesMatch) {
        return parseInt(minutesMatch[1], 10) * 60;
    }
    const secondsMatch = text.match(/(\d+)\s+second(s)?/i);
    if (secondsMatch) {
        return parseInt(secondsMatch[1], 10);
    }
    return null;
};

// Helper to format seconds into MM:SS format
const formatTime = (totalSeconds: number): string => {
    const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
    const seconds = (totalSeconds % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
};

// Helper to play a sound using Web Audio API
const playAlarm = () => {
    try {
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(440, audioContext.currentTime); // A4 note
        oscillator.frequency.setValueAtTime(880, audioContext.currentTime + 0.2);

        gainNode.gain.setValueAtTime(0.5, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + 1);

        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 1);
    } catch(e) {
        console.error("Could not play timer alarm", e);
    }
};

export const CookingMode: React.FC<CookingModeProps> = ({ recipe, onExit }) => {
    const [currentStep, setCurrentStep] = useState(0);
    const { speak, cancel, isSpeaking } = useSpeechSynthesis();
    const [isMuted, setIsMuted] = useState(false);
    
    const [timerSeconds, setTimerSeconds] = useState<number | null>(null);
    const [isTimerRunning, setIsTimerRunning] = useState(false);
    
    const instructions = recipe.instructions;
    const detectedTime = useMemo(() => parseTimeFromInstruction(instructions[currentStep]), [currentStep, instructions]);

    const cancelTimer = useCallback(() => {
        setIsTimerRunning(false);
        setTimerSeconds(null);
    }, []);

    // Effect for voice guidance
    useEffect(() => {
        if (!isMuted) {
            speak(instructions[currentStep]);
        } else {
            cancel();
        }
        // When step changes, reset any active timer
        cancelTimer();
    }, [currentStep, instructions, speak, isMuted, cancel, cancelTimer]);

    // Effect for timer countdown
    useEffect(() => {
        if (!isTimerRunning || timerSeconds === null || timerSeconds <= 0) {
            if(timerSeconds === 0) {
                playAlarm();
                setIsTimerRunning(false);
            }
            return;
        }

        const interval = setInterval(() => {
            setTimerSeconds(prev => (prev !== null ? prev - 1 : null));
        }, 1000);

        return () => clearInterval(interval);
    }, [isTimerRunning, timerSeconds]);
    
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
    };

    const handleSetTimer = () => {
        if (detectedTime) {
            setTimerSeconds(detectedTime);
            setIsTimerRunning(true);
        }
    };
    
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
                 
                 <div className="mt-8 h-24">
                    {timerSeconds === null && detectedTime && (
                         <button 
                            onClick={handleSetTimer}
                            className="flex items-center space-x-2 bg-gray-700 hover:bg-gray-600 px-6 py-3 rounded-full transition-colors"
                         >
                            <ClockIcon className="h-6 w-6"/>
                            <span className="font-semibold">Set Timer ({formatTime(detectedTime)})</span>
                         </button>
                    )}

                    {timerSeconds !== null && (
                        <div className="flex flex-col items-center space-y-4">
                            <p className={`text-6xl font-mono ${timerSeconds === 0 ? 'animate-pulse text-green-400' : ''}`}>
                                {formatTime(timerSeconds)}
                            </p>
                            <div className="flex items-center space-x-4">
                                <button 
                                    onClick={() => setIsTimerRunning(p => !p)}
                                    disabled={timerSeconds === 0}
                                    className="p-2 bg-gray-700 rounded-full hover:bg-gray-600 disabled:opacity-50"
                                >
                                    {isTimerRunning ? <PauseIcon className="h-6 w-6"/> : <PlayIcon className="h-6 w-6"/>}
                                </button>
                                 <button onClick={cancelTimer} className="p-2 bg-gray-700 rounded-full hover:bg-gray-600">
                                    <XMarkIcon className="h-6 w-6"/>
                                </button>
                            </div>
                        </div>
                    )}
                 </div>
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