import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";

type ButtonStates = {
    btn6: boolean;
    btn7: boolean;
    btn8: boolean;
    btn9: boolean;
}

type ButtonSettingsContextType = {
    buttonStates: ButtonStates;
    toggleButton: (buttonId: keyof ButtonStates) => void;
}

const ButtonSettingsContext = createContext<ButtonSettingsContextType | undefined>(undefined);

const STORAGE_KEY = '@button_settings';

export const ButtonSettingsProvider =({children}:{children: ReactNode}) => {
    const [buttonStates, setButtonStates] = useState({
        btn6: true,
        btn7: true,
        btn8: true,
        btn9: true,
    });

    useEffect(()=>{
        loadButtonStates();
    },[]);

    const loadButtonStates = async() => {
        try {
            const savedStates = await AsyncStorage.getItem(STORAGE_KEY);
            if (savedStates) {
                setButtonStates(JSON.parse(savedStates));
            }
        } catch (error) {
            console.error('Failed to load button states:', error);
        }
    };

    const saveButtonStates = async (newStates: ButtonStates) => {
        try {
            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newStates));
        } catch (error) {
            console.error('Failed to save button states:', error);
        }
    };

    const toggleButton = (buttonId: keyof ButtonStates) =>{
        setButtonStates((prev) => {
            const newStates ={
                ...prev,
                [buttonId]: !prev[buttonId]
            };
            saveButtonStates(newStates);
            return newStates;
        })
    }
    return (
        <ButtonSettingsContext.Provider value={{buttonStates, toggleButton}}>
            {children}
        </ButtonSettingsContext.Provider>
    )
}

export const useButtonSettings = () => {
    const context = useContext(ButtonSettingsContext);
    if(!context) {
        throw new Error('useButtonSettings must be used within ButtonSettingProvider');
    }
    return context;
}