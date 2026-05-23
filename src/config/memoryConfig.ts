// Memory set/recall packets for 5 position slots.
// Packet shape (16 bytes): 43 47 FE 26 <slotByte> 00 00 01 00 95 A5 B5 C5 D5 12 4E
// where slotByte = (slot << 4) | action, action 1 = set, action 2 = recall.

export type MemoryAction = 'set' | 'recall';

const SLOT_BYTE: Record<number, { set: number; recall: number }> = {
    1: { set: 0x11, recall: 0x12 },
    2: { set: 0x21, recall: 0x22 },
    3: { set: 0x31, recall: 0x32 },
    4: { set: 0x41, recall: 0x42 },
    5: { set: 0x51, recall: 0x52 },
};

export const MEMORY_SLOTS = [1, 2, 3, 4, 5] as const;
export type MemorySlot = (typeof MEMORY_SLOTS)[number];

export const getMemoryPacket = (slot: MemorySlot, action: MemoryAction): number[] => {
    const slotByte = SLOT_BYTE[slot][action];
    return [
        0x43, 0x47, 0xFE, 0x26,
        slotByte, 0x00, 0x00, 0x01,
        0x00, 0x95, 0xA5, 0xB5,
        0xC5, 0xD5, 0x12, 0x4E,
    ];
};
