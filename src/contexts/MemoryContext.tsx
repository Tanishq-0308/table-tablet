import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, ReactNode, useCallback, useContext, useEffect, useState } from 'react';
import { MEMORY_SLOTS, MemorySlot } from '../config/memoryConfig';

export type SlotStatus = 'unset' | 'set' | 'recalled';

type StatusMap = Record<MemorySlot, SlotStatus>;

type MemoryContextType = {
    status: StatusMap;
    markSet: (slot: MemorySlot) => void;
    markRecalled: (slot: MemorySlot) => void;
};

const STORAGE_KEY = '@memory_slot_status';

const defaultStatus: StatusMap = MEMORY_SLOTS.reduce((acc, slot) => {
    acc[slot] = 'unset';
    return acc;
}, {} as StatusMap);

const MemoryContext = createContext<MemoryContextType | undefined>(undefined);

const isValidStatus = (v: unknown): v is SlotStatus =>
    v === 'unset' || v === 'set' || v === 'recalled';

export const MemoryProvider = ({ children }: { children: ReactNode }) => {
    const [status, setStatus] = useState<StatusMap>(defaultStatus);

    useEffect(() => {
        (async () => {
            try {
                const saved = await AsyncStorage.getItem(STORAGE_KEY);
                if (!saved) return;
                const parsed = JSON.parse(saved);
                const next: StatusMap = { ...defaultStatus };
                for (const slot of MEMORY_SLOTS) {
                    const v = parsed?.[slot];
                    if (isValidStatus(v)) next[slot] = v;
                }
                setStatus(next);
            } catch (e) {
                console.warn('Failed to load memory status:', e);
            }
        })();
    }, []);

    const persist = useCallback(async (next: StatusMap) => {
        try {
            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        } catch (e) {
            console.warn('Failed to save memory status:', e);
        }
    }, []);

    const update = useCallback((slot: MemorySlot, value: SlotStatus) => {
        setStatus(prev => {
            if (prev[slot] === value) return prev;
            const next = { ...prev, [slot]: value };
            persist(next);
            return next;
        });
    }, [persist]);

    const markSet = useCallback((slot: MemorySlot) => update(slot, 'set'), [update]);
    const markRecalled = useCallback((slot: MemorySlot) => update(slot, 'recalled'), [update]);

    return (
        <MemoryContext.Provider value={{ status, markSet, markRecalled }}>
            {children}
        </MemoryContext.Provider>
    );
};

export const useMemorySlots = () => {
    const ctx = useContext(MemoryContext);
    if (!ctx) throw new Error('useMemorySlots must be used within MemoryProvider');
    return ctx;
};
