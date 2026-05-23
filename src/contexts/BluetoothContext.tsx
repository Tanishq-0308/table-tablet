import React, {
    createContext,
    useContext,
    useRef,
    useState,
    useEffect,
    useCallback,
    useMemo
} from 'react';
import {
    Platform,
    PermissionsAndroid,
    NativeModules,
    NativeEventEmitter,
    Alert
} from 'react-native';
import Snackbar from 'react-native-snackbar';

// ✅ Use Native Module
const { BluetoothNative } = NativeModules;
const bluetoothEmitter = new NativeEventEmitter(BluetoothNative);

// ✅ Interface for all angles
export interface TableAngles {
    sideTiltLeft: number;
    sideTiltRight: number;
    backUp: number;
    backDown: number;
    trendelenburg: number;
    revTrendelenburg: number;
}

interface BluetoothStats {
    dataRate: number;
    lastUpdateTime: string;
    isReceivingData: boolean;
}

interface BluetoothContextType {
    // Connection state
    isConnected: boolean;
    isReceivingData: boolean;
    isBluetoothEnabled: boolean;

    // Angle data
    angles: TableAngles;

    // Stats
    stats: BluetoothStats;

    // Methods
    checkBluetoothState: () => Promise<boolean>;
    enableBluetooth: () => Promise<void>;
    connectToHC05: () => Promise<void>;
    disconnect: () => Promise<void>;
    sendCommand: (code: number) => Promise<void>;
    sendRawCommand: (bytes: number[]) => Promise<void>;

    // Helper methods for repeated commands
    startRepeatedCommand: (code: number, intervalMs?: number) => void;
    stopRepeatedCommand: () => void;
    sendSingleCommand: (code: number, duration?: number) => void;
    startRepeatedRawCommand: (bytes: number[], intervalMs?: number) => void;
}

const BluetoothContext = createContext<BluetoothContextType | undefined>(undefined);

export const BluetoothProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    // Connection state
    const [isConnected, setIsConnected] = useState<boolean>(false);
    const [isReceivingData, setIsReceivingData] = useState<boolean>(false);
    const [isBluetoothEnabled, setIsBluetoothEnabled] = useState<boolean>(false);

    // ✅ Separate state for angles to prevent unnecessary re-renders in components that only need connection state
    const [angles, setAngles] = useState<TableAngles>({
        sideTiltLeft: 0,
        sideTiltRight: 0,
        backUp: 0,
        backDown: 0,
        trendelenburg: 0,
        revTrendelenburg: 0,
    });

    // Stats state
    const [stats, setStats] = useState<BluetoothStats>({
        dataRate: 0,
        lastUpdateTime: '',
        isReceivingData: false
    });

    // Refs for intervals and data tracking
    const intervalRef = useRef<number | null>(null);
    const intervalReconnectRef = useRef<number | null>(null);
    const packetCount = useRef<number>(0);
    const lastRateUpdate = useRef<number>(Date.now());
    const isReconnecting = useRef<boolean>(false);

    // ✅ Check Bluetooth state
    const checkBluetoothState = useCallback(async (): Promise<boolean> => {
        try {
            const enabled = await BluetoothNative.isBluetoothEnabled();
            setIsBluetoothEnabled(enabled);
            console.log(`📶 Bluetooth is ${enabled ? 'enabled' : 'disabled'}`);
            return enabled;
        } catch (error) {
            console.error('Error checking Bluetooth state:', error);
            setIsBluetoothEnabled(false);
            return false;
        }
    }, []);

    // ✅ Enable Bluetooth (prompts user)
    const enableBluetooth = useCallback(async () => {
        try {
            await BluetoothNative.enableBluetooth();
            console.log('🔵 Bluetooth enable request sent');
            
            Snackbar.show({
                text: "Please enable Bluetooth",
                duration: Snackbar.LENGTH_SHORT,
                backgroundColor: '#2196F3',
                textColor: 'white'
            });
            
            // Check state after a delay
            setTimeout(async () => {
                const enabled = await checkBluetoothState();
                if (enabled) {
                    Snackbar.show({
                        text: "Bluetooth enabled",
                        duration: Snackbar.LENGTH_SHORT,
                        backgroundColor: '#4CAF50',
                        textColor: 'white'
                    });
                }
            }, 2000);
        } catch (error: any) {
            console.error('Failed to enable Bluetooth:', error);
            Alert.alert(
                'Bluetooth Error',
                'Failed to enable Bluetooth. Please enable it manually in Settings.',
                [{ text: 'OK' }]
            );
        }
    }, [checkBluetoothState]);

    // ✅ Request Bluetooth permissions
    const requestBluetoothPermissions = useCallback(async (): Promise<boolean> => {
        if (Platform.OS === 'android') {
            try {
                const granted = await PermissionsAndroid.requestMultiple([
                    PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
                    PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
                    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                    PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
                ]);

                const allGranted = Object.values(granted).every(
                    status => status === PermissionsAndroid.RESULTS.GRANTED
                );

                if (!allGranted) {
                    console.log('❌ Some Bluetooth permissions denied');
                    return false;
                } else {
                    console.log('✅ All Bluetooth permissions granted');
                    return true;
                }
            } catch (err) {
                console.warn('Permission error:', err);
                return false;
            }
        }
        return true; // iOS or other platforms
    }, []);

    // ✅ Connect to HC-05
    const connectToHC05 = useCallback(async () => {
        try {
            // Check permissions first
            const hasPermissions = await requestBluetoothPermissions();
            if (!hasPermissions) {
                Snackbar.show({
                    text: "Bluetooth permissions required",
                    duration: Snackbar.LENGTH_SHORT,
                    backgroundColor: '#FF9800',
                    textColor: 'white'
                });
                return;
            }
        
            // ✅ Check if Bluetooth is enabled
            const bluetoothEnabled = await checkBluetoothState();
            if (!bluetoothEnabled) {
                Alert.alert(
                    'Bluetooth Disabled',
                    'Bluetooth is turned off. Would you like to enable it?',
                    [
                        {
                            text: 'Cancel',
                            style: 'cancel'
                        },
                        {
                            text: 'Enable',
                            onPress: async () => {
                                await enableBluetooth();
                                // Try connecting again after a delay
                                setTimeout(() => connectToHC05(), 3000);
                            }
                        }
                    ]
                );
                return;
            }

            // Clear any existing reconnect interval
            if (intervalReconnectRef.current !== null) {
                clearInterval(intervalReconnectRef.current);
                intervalReconnectRef.current = null;
            }

            isReconnecting.current = false;

            // ✅ Connect using native module
            await BluetoothNative.connectToHC05();

            console.log("✅ Connected to HC-05 via Native Module");
            setIsConnected(true);

            Snackbar.show({
                text: "Connected to HC-05",
                duration: Snackbar.LENGTH_SHORT,
                backgroundColor: '#46d134ff',
                textColor: 'white'
            });

        } catch (error: any) {
            console.error("❌ Connection failed:", error);
            setIsConnected(false);
            setIsReceivingData(false);
            
            // ✅ Handle different error types
            if (error.code === 'BLUETOOTH_DISABLED') {
                Alert.alert(
                    'Bluetooth Disabled',
                    'Please enable Bluetooth and try again.',
                    [
                        {
                            text: 'Cancel',
                            style: 'cancel'
                        },
                        {
                            text: 'Enable',
                            onPress: () => enableBluetooth()
                        }
                    ]
                );
            } else if (error.code === 'DEVICE_NOT_FOUND') {
                Snackbar.show({
                    text: "HC-05 not found. Please pair the device first.",
                    duration: Snackbar.LENGTH_LONG,
                    backgroundColor: '#FF9800',
                    textColor: 'white'
                });
            } else {
                Snackbar.show({
                    text: "Failed to connect to HC-05",
                    duration: Snackbar.LENGTH_SHORT,
                    backgroundColor: '#cf0a0aff',
                    textColor: 'white'
                });
            }

            // Auto-reconnect every 5 seconds (only if not already reconnecting)
            if (!isReconnecting.current) {
                isReconnecting.current = true;
                intervalReconnectRef.current = setInterval(() => {
                    console.log("🔄 Attempting to reconnect...");
                    connectToHC05();
                }, 5000);
            }
        }
    }, [requestBluetoothPermissions, checkBluetoothState, enableBluetooth]);


    const disconnect = useCallback(async () => {
        try {
            // Clear reconnect interval
            if (intervalReconnectRef.current !== null) {
                clearInterval(intervalReconnectRef.current);
                intervalReconnectRef.current = null;
            }

            isReconnecting.current = false;

            await BluetoothNative.disconnect();
            setIsConnected(false);
            setIsReceivingData(false);

            console.log("✅ Disconnected from HC-05");
        } catch (error) {
            console.error("Disconnect error:", error);
        }
    }, []);

    const sendCommand = useCallback(async (code: number) => {
        try {
            const command = [
                0x43, 0x47, 0xFE, code,
                0x00, 0x00, 0x00, 0x01,
                0x00, 0x95, 0xA5, 0xB5,
                0xC5, 0xD5, 0x00, 0x4E,
            ];

            await BluetoothNative.sendCommand(command);
        } catch (error) {
            console.error("Send command failed:", error);
        }
    }, []);

    // Send an arbitrary 16-byte command frame. Used for packets that don't fit
    // the standard sendCommand shape (e.g. memory set/recall, which carry a
    // non-zero byte 14).
    const sendRawCommand = useCallback(async (bytes: number[]) => {
        try {
            await BluetoothNative.sendCommand(bytes);
        } catch (error) {
            console.error("Send raw command failed:", error);
        }
    }, []);

    // ✅ Start repeated command (for press and hold)
    const startRepeatedCommand = useCallback((code: number, intervalMs: number = 200) => {
        // Clear any existing interval
        if (intervalRef.current !== null) {
            clearInterval(intervalRef.current);
        }

        // Start new interval
        intervalRef.current = setInterval(() => {
            sendCommand(code);
        }, intervalMs);
    }, [sendCommand]);

    // Start repeated raw command (press-and-hold for packets that don't fit
    // the standard sendCommand shape, e.g. memory set/recall).
    const startRepeatedRawCommand = useCallback((bytes: number[], intervalMs: number = 200) => {
        if (intervalRef.current !== null) {
            clearInterval(intervalRef.current);
        }
        // Fire immediately so a quick tap still sends one packet
        sendRawCommand(bytes);
        intervalRef.current = setInterval(() => {
            sendRawCommand(bytes);
        }, intervalMs);
    }, [sendRawCommand]);

    // ✅ Stop repeated command
    const stopRepeatedCommand = useCallback(() => {
        if (intervalRef.current !== null) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
        // Send stop command
        sendCommand(0x00);
    }, [sendCommand]);

    // ✅ Send single command with auto-stop
    const sendSingleCommand = useCallback((code: number, duration: number = 200) => {
        sendCommand(code);
        setTimeout(() => {
            sendCommand(0x00);
        }, duration);
    }, [sendCommand]);

    useEffect(() => {
        console.log("🚀 Initializing Bluetooth Context");
        
        // Check Bluetooth state on mount
        checkBluetoothState();
        // Auto-connect on mount
        connectToHC05();

        // ✅ Listen for angle updates from native module
        const angleSubscription = bluetoothEmitter.addListener(
            'onAnglesReceived',
            (data: TableAngles & { timestamp: number }) => {
                // console.log("helloo+++++++++++++++++++++++++++++++++++");
                
                // ✅ Batch state updates to minimize re-renders
                console.log(data.backDown, data.backUp, data.revTrendelenburg, data.sideTiltLeft, data.sideTiltRight, data.trendelenburg, data.timestamp);
                
                setAngles({
                    sideTiltLeft: data.sideTiltLeft,
                    sideTiltRight: data.sideTiltRight,
                    backUp: data.backUp,
                    backDown: data.backDown,
                    trendelenburg: data.trendelenburg,
                    revTrendelenburg: data.revTrendelenburg,
                });

                setIsReceivingData(true);

                // Calculate data rate
                packetCount.current++;
                const now = Date.now();

                // ✅ Update stats only once per second to reduce re-renders
                if (now - lastRateUpdate.current >= 1000) {
                    const rate = packetCount.current;
                    const updateTime = new Date().toLocaleTimeString();

                    setStats({
                        dataRate: rate,
                        lastUpdateTime: updateTime,
                        isReceivingData: true
                    });

                    console.log(`📊 Receiving ${rate} packets/sec via Native`);

                    packetCount.current = 0;
                    lastRateUpdate.current = now;
                }
            }
        );

        // ✅ Listen for connection status changes
        const connectionSubscription = bluetoothEmitter.addListener(
            'onConnectionChanged',
            (data: { connected: boolean }) => {
                console.log(`📡 Connection status: ${data.connected ? 'Connected' : 'Disconnected'}`);

                setIsConnected(data.connected);
                setIsReceivingData(data.connected);

                if (!data.connected && !isReconnecting.current) {
                    // Try to reconnect after 2 seconds
                    setTimeout(() => {
                        if (!isReconnecting.current) {
                            connectToHC05();
                        }
                    }, 2000);
                }
            }
        );

        // Cleanup on unmount
        return () => {
            console.log("🧹 Cleaning up Bluetooth Context");

            angleSubscription.remove();
            connectionSubscription.remove();

            if (intervalRef.current !== null) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }

            if (intervalReconnectRef.current !== null) {
                clearInterval(intervalReconnectRef.current);
                intervalReconnectRef.current = null;
            }

            // Disconnect Bluetooth
            BluetoothNative.disconnect().catch((e: any) =>
                console.log("Disconnect error:", e)
            );
        };
    }, [connectToHC05]);

    // Memoize context value to prevent unnecessary re-renders
    const contextValue = useMemo<BluetoothContextType>(() => ({
        isConnected,
        isReceivingData,
        isBluetoothEnabled,
        angles,
        stats,
        checkBluetoothState,
        enableBluetooth,
        connectToHC05,
        disconnect,
        sendCommand,
        sendRawCommand,
        startRepeatedCommand,
        stopRepeatedCommand,
        sendSingleCommand,
        startRepeatedRawCommand,
    }), [
        isConnected,
        isReceivingData,
        isBluetoothEnabled,
        angles,
        stats,
        checkBluetoothState,
        enableBluetooth,
        connectToHC05,
        disconnect,
        sendCommand,
        sendRawCommand,
        startRepeatedCommand,
        stopRepeatedCommand,
        sendSingleCommand,
        startRepeatedRawCommand,
    ]);

    return (
        <BluetoothContext.Provider value={contextValue}>
            {children}
        </BluetoothContext.Provider>
    )
}

export const useBluetooth = () => {
    const context = useContext(BluetoothContext);
    if (context === undefined) {
        throw new Error('useBluetooth must be used within a BluetoothProvider');
    }
    return context;
}

export const useBluetoothAngles = () => {
    const { angles } = useBluetooth();
    return angles;
};


export const useBluetoothConnection = ()=>{
    const { isConnected, isReceivingData, isBluetoothEnabled, connectToHC05, disconnect, enableBluetooth, checkBluetoothState } = useBluetooth();
    return { isConnected, isReceivingData, isBluetoothEnabled, connectToHC05, disconnect, enableBluetooth, checkBluetoothState };
};

export const useBluetoothStats = () =>{
    const { stats } = useBluetooth();
    return stats;
}