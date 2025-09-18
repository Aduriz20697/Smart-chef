
import React from 'react';
import type { GamificationStats } from '../types';
import { ChefHatIcon, StarIcon, FireIcon, BookmarkIcon } from './IconComponents';

type ActiveView = 'generate' | 'saved';

interface HeaderProps {
    stats: GamificationStats;
    activeView: ActiveView;
    onViewChange: (view: ActiveView) => void;
}

export const Header: React.FC<HeaderProps> = ({ stats, activeView, onViewChange }) => {
    return (
        <header className="bg-white shadow-sm sticky top-0 z-40">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center py-4">
                    <div className="flex items-center space-x-2 cursor-pointer" onClick={() => onViewChange('generate')}>
                        <ChefHatIcon className="h-8 w-8 text-green-600" />
                        <span className="text-2xl font-bold text-gray-800">SmartChef</span>
                    </div>
                    <div className="flex items-center space-x-4 md:space-x-6 text-sm">
                        <button
                            onClick={() => onViewChange('saved')}
                            className={`flex items-center space-x-2 px-3 py-2 rounded-full transition-colors ${
                                activeView === 'saved' ? 'bg-green-100 text-green-700' : 'text-gray-600 hover:bg-gray-100'
                            }`}
                        >
                            <BookmarkIcon className="h-5 w-5" />
                            <span className="font-semibold hidden sm:inline">Saved Recipes</span>
                        </button>
                        <div className="flex items-center space-x-1 text-yellow-500" title={`${stats.points} points`}>
                             <StarIcon className="h-5 w-5" />
                            <span className="font-semibold">{stats.points}</span>
                            <span className="hidden md:inline">Points</span>
                        </div>
                        <div className="flex items-center space-x-1 text-orange-500" title={`${stats.streak} day streak`}>
                             <FireIcon className="h-5 w-5" />
                            <span className="font-semibold">{stats.streak}</span>
                            <span className="hidden md:inline">Streak</span>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};
