
import { useState, useEffect, useCallback } from 'react';

export const useSpeechSynthesis = () => {
    const [isSpeaking, setIsSpeaking] = useState(false);
    const synth = window.speechSynthesis;

    const speak = useCallback((text: string) => {
        if (synth.speaking) {
            synth.cancel();
        }
        if (text !== '') {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.onstart = () => setIsSpeaking(true);
            utterance.onend = () => setIsSpeaking(false);
            utterance.onerror = () => setIsSpeaking(false);
            synth.speak(utterance);
        }
    }, [synth]);

    const cancel = useCallback(() => {
        synth.cancel();
        setIsSpeaking(false);
    }, [synth]);

    useEffect(() => {
        return () => {
            // Cleanup on unmount
            if (synth) {
                synth.cancel();
            }
        };
    }, [synth]);

    return { speak, cancel, isSpeaking };
};
