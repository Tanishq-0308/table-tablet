import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, ReactNode, useCallback, useContext, useEffect, useState } from 'react';

export type AngleOffsetKey =
  | 'tiltLeft'
  | 'tiltRight'
  | 'trendUp'
  | 'trendDown'
  | 'backUp'
  | 'backDown';

export type NumericOffsetKey =
  | 'groundToSensorMin'
  | 'slideMinusOffset'
  | 'heightPlusOffset';

export type OffsetKey = AngleOffsetKey | NumericOffsetKey;

export const ANGLE_OFFSET_MIN = 0;
export const ANGLE_OFFSET_MAX = 50;
export const ANGLE_OFFSET_STEP = 1;

// Per-key spec for the wider-range numeric offsets.
export const NUMERIC_OFFSET_SPEC: Record<NumericOffsetKey, { min: number; max: number; step: number }> = {
    groundToSensorMin: { min: 0, max: 2000, step: 10 },
    slideMinusOffset: { min: 0, max: 2000, step: 10 },
    heightPlusOffset: { min: 0, max: 250, step: 10 },
};

export type Offsets = Record<OffsetKey, number>;

const ALL_KEYS: OffsetKey[] = [
    'tiltLeft', 'tiltRight', 'trendUp', 'trendDown', 'backUp', 'backDown',
    'groundToSensorMin', 'slideMinusOffset', 'heightPlusOffset',
];

const DEFAULT_OFFSETS: Offsets = ALL_KEYS.reduce((acc, k) => {
    acc[k] = 0;
    return acc;
}, {} as Offsets);

const isAngleKey = (k: string): k is AngleOffsetKey =>
    k === 'tiltLeft' || k === 'tiltRight' || k === 'trendUp' ||
    k === 'trendDown' || k === 'backUp' || k === 'backDown';

const isNumericKey = (k: string): k is NumericOffsetKey =>
    k === 'groundToSensorMin' || k === 'slideMinusOffset' || k === 'heightPlusOffset';

const isOffsetKey = (k: string): k is OffsetKey => isAngleKey(k) || isNumericKey(k);

const getRange = (key: OffsetKey): { min: number; max: number; step: number } => {
    if (isNumericKey(key)) return NUMERIC_OFFSET_SPEC[key];
    return { min: ANGLE_OFFSET_MIN, max: ANGLE_OFFSET_MAX, step: ANGLE_OFFSET_STEP };
};

const clampKey = (key: OffsetKey, value: number): number => {
    const { min, max } = getRange(key);
    return Math.max(min, Math.min(max, value));
};

type OffsetContextType = {
    offsets: Offsets;
    setOffset: (key: OffsetKey, value: number) => void;
    incOffset: (key: OffsetKey) => void;
    decOffset: (key: OffsetKey) => void;
    getRange: (key: OffsetKey) => { min: number; max: number; step: number };
};

const STORAGE_KEY = '@angle_offsets';

const OffsetContext = createContext<OffsetContextType | undefined>(undefined);

export const OffsetProvider = ({ children }: { children: ReactNode }) => {
    const [offsets, setOffsets] = useState<Offsets>(DEFAULT_OFFSETS);

    useEffect(() => {
        (async () => {
            try {
                const saved = await AsyncStorage.getItem(STORAGE_KEY);
                if (!saved) return;
                const parsed = JSON.parse(saved);
                const next: Offsets = { ...DEFAULT_OFFSETS };
                for (const k of Object.keys(parsed)) {
                    if (isOffsetKey(k) && typeof parsed[k] === 'number') {
                        next[k] = clampKey(k, parsed[k]);
                    }
                }
                setOffsets(next);
            } catch (e) {
                console.warn('Failed to load offsets:', e);
            }
        })();
    }, []);

    const persist = useCallback(async (next: Offsets) => {
        try {
            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        } catch (e) {
            console.warn('Failed to save offsets:', e);
        }
    }, []);

    const setOffset = useCallback((key: OffsetKey, value: number) => {
        setOffsets(prev => {
            const clamped = clampKey(key, value);
            if (prev[key] === clamped) return prev;
            const next = { ...prev, [key]: clamped };
            persist(next);
            return next;
        });
    }, [persist]);

    const incOffset = useCallback((key: OffsetKey) => {
        setOffsets(prev => {
            const { max, step } = getRange(key);
            if (prev[key] >= max) return prev;
            const next = { ...prev, [key]: Math.min(max, prev[key] + step) };
            persist(next);
            return next;
        });
    }, [persist]);

    const decOffset = useCallback((key: OffsetKey) => {
        setOffsets(prev => {
            const { min, step } = getRange(key);
            if (prev[key] <= min) return prev;
            const next = { ...prev, [key]: Math.max(min, prev[key] - step) };
            persist(next);
            return next;
        });
    }, [persist]);

    return (
        <OffsetContext.Provider value={{ offsets, setOffset, incOffset, decOffset, getRange }}>
            {children}
        </OffsetContext.Provider>
    );
};

export const useOffsets = () => {
    const ctx = useContext(OffsetContext);
    if (!ctx) throw new Error('useOffsets must be used within OffsetProvider');
    return ctx;
};
