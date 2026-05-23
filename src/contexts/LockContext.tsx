import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, ReactNode, useCallback, useContext, useEffect, useState } from 'react';

type LockContextType = {
    isLocked: boolean;
    lock: () => void;
    unlock: () => void;
};

const STORAGE_KEY = '@app_lock_state';

const LockContext = createContext<LockContextType | undefined>(undefined);

export const LockProvider = ({ children }: { children: ReactNode }) => {
    const [isLocked, setIsLocked] = useState(false);

    useEffect(() => {
        (async () => {
            try {
                const saved = await AsyncStorage.getItem(STORAGE_KEY);
                if (saved === 'true') setIsLocked(true);
            } catch (e) {
                console.warn('Failed to load lock state:', e);
            }
        })();
    }, []);

    const persist = useCallback(async (value: boolean) => {
        try {
            await AsyncStorage.setItem(STORAGE_KEY, value ? 'true' : 'false');
        } catch (e) {
            console.warn('Failed to save lock state:', e);
        }
    }, []);

    const lock = useCallback(() => {
        setIsLocked(true);
        persist(true);
    }, [persist]);

    const unlock = useCallback(() => {
        setIsLocked(false);
        persist(false);
    }, [persist]);

    return (
        <LockContext.Provider value={{ isLocked, lock, unlock }}>
            {children}
        </LockContext.Provider>
    );
};

export const useLock = () => {
    const ctx = useContext(LockContext);
    if (!ctx) throw new Error('useLock must be used within LockProvider');
    return ctx;
};
