// Command codes for each button
// Format: { buttonId: { upCode: number, downCode?: number } }

export interface CommandCodes {
    upCode: number;
    downCode?: number;
}

export const BUTTON_COMMANDS: Record<string, CommandCodes> = {
    // Height - btn1
    'btn1': {
        upCode: 0x01,    // Height Up
        downCode: 0x02,  // Height Down
    },
    // Trendelenburg - btn2
    'btn2': {
        upCode: 0x03,    // Trendelenburg
        downCode: 0x04,  // Reverse Trendelenburg
    },
    // Back - btn3
    'btn3': {
        upCode: 0x05,    // Back Up
        downCode: 0x06,  // Back Down
    },
    // Side Tilt - btn4
    'btn4': {
        upCode: 0x07,    // Tilt Left
        downCode: 0x08,  // Tilt Right
    },
    // Lock - btn5 (TODO: Add codes when available)
    'btn5': {
        upCode: 0x00,    // Lock - TBD
        downCode: 0x00,  // Unlock - TBD
    },
    // Gyro Zero - btn6 (single button)
    'btn6': {
        upCode: 0x19,    // Zero
    },
    // Reverse Orientation - btn7 (TODO: Add code when available)
    'btn7': {
        upCode: 0x00,    // Reverse - TBD
    },
    // Slide - btn8
    'btn8': {
        upCode: 0x09,    // Slide
        downCode: 0x10,  // Reverse Slide
    },
    // Flex - btn9
    'btn9': {
        upCode: 0x11,    // Flex Up
        downCode: 0x12,  // Flex Down
    },
    // Floor Lock - btn10
    'btn10': {
        upCode: 0x13,    // Floor Lock
        downCode: 0x14,  // Floor Unlock
    },
};

// Stop command
export const STOP_COMMAND = 0x00;

// Helper function to get command code
export const getCommandCode = (buttonId: string, isUp: boolean): number => {
    const commands = BUTTON_COMMANDS[buttonId];
    if (!commands) {
        console.warn(`No command mapping for button: ${buttonId}`);
        return STOP_COMMAND;
    }
    return isUp ? commands.upCode : (commands.downCode ?? STOP_COMMAND);
};