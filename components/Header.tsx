
import React from 'react';
import type { GamificationStats } from '../types';
import { ChefHatIcon, StarIcon, FireIcon } from './IconComponents';

interface HeaderProps {
    stats: GamificationStats;
}

export const Header: React.FC<HeaderProps> = ({ stats }) => {
    return (
        <header className="bg-white shadow-sm">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center py-4">
                    <div className="flex items-center space-x-2">
                        <ChefHatIcon className="h-8 w-8 text-green-600" />
                        <span className="text-2xl font-bold text-gray-800">SmartChef</span>
                    </div>
                    <div className="flex items-center space-x-4 md:space-x-6 text-sm">
                        <div className="flex items-center space-x-1 text-yellow-500">
                             <StarIcon className="h-5 w-5" />
                            <span className="font-semibold">{stats.points}</span>
                            <span className="hidden md:inline">Points</span>
                        </div>
                        <div className="flex items-center space-x-1 text-orange-500">
                             <FireIcon className="h-5 w-5" />
                            <span className="font-semibold">{stats.streak}</span>
                            <span className="hidden md:inline">Day Streak</span>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};
