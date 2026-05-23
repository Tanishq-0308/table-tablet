import React, { createContext, ReactNode, useCallback, useContext, useState } from 'react';

type ReverseOrientContextType = {
    isReverseActive: boolean;
    toggleReverse: () => void;
};

const ReverseOrientContext = createContext<ReverseOrientContextType | undefined>(undefined);

export const ReverseOrientProvider = ({ children }: { children: ReactNode }) => {
    const [isReverseActive, setIsReverseActive] = useState(false);

    const toggleReverse = useCallback(() => {
        setIsReverseActive(prev => !prev);
    }, []);

    return (
        <ReverseOrientContext.Provider value={{ isReverseActive, toggleReverse }}>
            {children}
        </ReverseOrientContext.Provider>
    );
};

export const useReverseOrient = () => {
    const ctx = useContext(ReverseOrientContext);
    if (!ctx) throw new Error('useReverseOrient must be used within ReverseOrientProvider');
    return ctx;
};
