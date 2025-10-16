import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";

type ButtonStates = {
    btn6: boolean;
    btn7: boolean;
    btn8: boolean;
    btn9: boolean;
    btn10: boolean;
}

type FeatureStates ={
    memory: boolean;
    rts: boolean;
    rtp: boolean;
    gyro: boolean;
    battery: boolean;
    antiCollision: boolean;
}

type ButtonSettingsContextType = {
    buttonStates: ButtonStates;
    featureStates: FeatureStates;
    toggleButton: (buttonId: keyof ButtonStates) => void;
    toggleFeature: (featureId: keyof FeatureStates) => void;
}

const ButtonSettingsContext = createContext<ButtonSettingsContextType | undefined>(undefined);

const STORAGE_KEY = '@button_settings';
const FEATURE_KEY = '@featuere_settings';

export const ButtonSettingsProvider =({children}:{children: ReactNode}) => {
    const [buttonStates, setButtonStates] = useState({
        btn6: true,
        btn7: true,
        btn8: true,
        btn9: true,
        btn10: false,
    });

    const [featureStates, setFeatureStates] = useState({
        memory:true,
        rts: true,
        rtp: true,
        gyro: true,
        battery: true,
        antiCollision: true,
    });

    useEffect(()=>{
        loadButtonStates();
    },[]);

    const loadButtonStates = async() => {
        try {
            const [savedStates, savedFeatures] = await Promise.all([
                AsyncStorage.getItem(STORAGE_KEY),
                AsyncStorage.getItem(FEATURE_KEY)
            ])
            if (savedStates) {
                setButtonStates(JSON.parse(savedStates));
            }
            if (savedFeatures) {
                setFeatureStates(JSON.parse(savedFeatures));
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

    const saveFeatureStates = async (newStates: FeatureStates) => {
        try {
            await AsyncStorage.setItem(FEATURE_KEY, JSON.stringify(newStates));
        } catch (error) {
            console.error('Failed to save button states:', error);
        }
    }

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

    const toggleFeature =(featureId: keyof FeatureStates) => {
        setFeatureStates((prev) => {
            const newStates ={
                ...prev,
                [featureId]: !prev[featureId]
            }
            saveFeatureStates(newStates);
            return newStates;
        })
    }
    return (
        <ButtonSettingsContext.Provider value={{buttonStates, toggleButton, featureStates, toggleFeature }}>
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