import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { Vibration } from "react-native";
import Sound from "react-native-sound";

type Mode = 'none' | 'vibration' | 'sound';

type Ctx = {
    mode: Mode;
    setMode: (m: Mode) => void;
    doFeedback: () => void;
}

const STORAGE_KEY = 'feedback_mode';
const FeedbackCtx = createContext<Ctx | null>(null);

export const FeedbackProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [mode, setModeState] = useState<Mode>('vibration');
    const soundRef = useRef<Sound | null>(null);

    // Load from storage on start
    useEffect(() => {
        (async () => {
            try {
                const saved = await AsyncStorage.getItem(STORAGE_KEY);
                if (saved === 'vibration' || saved === 'sound') {
                    setModeState(saved);
                }
            } catch (e) {
                console.warn('Failed to lead mode:', e);
            }
        })();
    }, []);

    // save on change
    const setMode = useCallback(async (m: Mode) => {
        setModeState(m);
        try {
            if (m === 'none') await AsyncStorage.removeItem(STORAGE_KEY);
            else await AsyncStorage.setItem(STORAGE_KEY, m);
        } catch (e) {
            console.warn('Failed to save mode:', e);
        }
    }, []);


    // sound logic
    // 🔧 Promise-based loader that resolves only after the sound is really loaded
    const loadSound = useCallback((): Promise<Sound> => {
        return new Promise((resolve, reject) => {
            if (soundRef.current && soundRef.current.isLoaded()) {
                return resolve(soundRef.current);
            }

            // NOTE: On Android the file must be in android/app/src/main/res/raw/beep.mp3 (lowercase)
            // and you must rebuild the app after adding it.
            const s = new Sound('beep.mp3', Sound.MAIN_BUNDLE, (error) => {
                if (error) {
                    console.warn('Sound load error:', error);
                    return reject(error);
                }
                soundRef.current = s;
                resolve(s);
            });
        });
    }, []);

    const playBeep = useCallback(async () => {
        try {
            const s = await loadSound();     // ✅ wait until it's loaded
            s.setVolume(1.0);                // ensure audible volume
            s.setCurrentTime(0);             // start from beginning
            s.play((ok) => {
                if (!ok) console.warn('Beep playback failed');
            });
        } catch (e) {
            console.warn('Beep error:', e);
        }
    }, [loadSound]);

    // Clean up
    useEffect(() => {
        return () => {
            if (soundRef.current) {
                soundRef.current.release();
                soundRef.current = null;
            }
        };
    }, []);

    // vibration / sound feedback
    const doFeedback = useCallback(() => {
        console.log("feedack");
        console.log(mode);

        if (mode === 'vibration') Vibration.vibrate(120);
        else if (mode === 'sound') playBeep();
    }, [mode, playBeep]);

    return (
        <FeedbackCtx.Provider value={{ mode, setMode, doFeedback }}>
            {children}
        </FeedbackCtx.Provider>
    );
};

export const useFeedback = () => {
    const ctx = useContext(FeedbackCtx);
    if (!ctx) throw new Error('useFeedback must be used within FeedbackProvider');
    return ctx;
};