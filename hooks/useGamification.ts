
import { useState, useCallback, useEffect } from 'react';
import type { GamificationStats } from '../types';

const isSameDay = (date1: Date, date2: Date) => {
    return date1.getFullYear() === date2.getFullYear() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getDate() === date2.getDate();
}

const isYesterday = (date1: Date, date2: Date) => {
    const yesterday = new Date(date2);
    yesterday.setDate(yesterday.getDate() - 1);
    return isSameDay(date1, yesterday);
}


export const useGamification = () => {
    const [stats, setStats] = useState<GamificationStats>({
        points: 0,
        streak: 0,
        lastUsed: null,
    });

    useEffect(() => {
        try {
            const savedStats = localStorage.getItem('smartchef_gamification');
            if (savedStats) {
                const parsedStats: GamificationStats = JSON.parse(savedStats);
                const today = new Date();
                const lastUsedDate = parsedStats.lastUsed ? new Date(parsedStats.lastUsed) : null;

                if(lastUsedDate && !isSameDay(lastUsedDate, today) && !isYesterday(lastUsedDate, today)) {
                    // Streak is broken if it's not today or yesterday
                    parsedStats.streak = 0;
                }
                setStats(parsedStats);
            }
        } catch (error) {
            console.error('Could not load gamification stats from localStorage', error);
        }
    }, []);

    const saveStats = useCallback((newStats: GamificationStats) => {
        try {
            localStorage.setItem('smartchef_gamification', JSON.stringify(newStats));
            setStats(newStats);
        } catch (error) {
            console.error('Could not save gamification stats to localStorage', error);
        }
    }, []);
    
    const addPoints = useCallback((pointsToAdd: number) => {
        setStats(prevStats => {
            const newStats = { ...prevStats, points: prevStats.points + pointsToAdd };
            saveStats(newStats);
            return newStats;
        });
    }, [saveStats]);

    const incrementStreak = useCallback(() => {
        setStats(prevStats => {
            const today = new Date();
            const lastUsedDate = prevStats.lastUsed ? new Date(prevStats.lastUsed) : null;
            let newStreak = prevStats.streak;

            if (!lastUsedDate || !isSameDay(lastUsedDate, today)) {
                if (lastUsedDate && isYesterday(lastUsedDate, today)) {
                    newStreak += 1; // Continue streak
                } else {
                    newStreak = 1; // Start new streak
                }
            }
            
            const newStats = { ...prevStats, streak: newStreak, lastUsed: today.toISOString() };
            saveStats(newStats);
            return newStats;
        });
    }, [saveStats]);

    return { stats, addPoints, incrementStreak };
};
