import { DocumentData } from "../../entities/DocumentData";

export interface ChristmasInventory extends DocumentData {
    walls: number;
    floors: number;
    roofs: number;
    windows: number;
    doors: number;
    lastGiftTs: number;
    usersGiftedToday: string[];
}

const DEFAULT_INVENTORY = {
    walls: 0,
    floors: 0,
    roofs: 0,
    windows: 0,
    doors: 0,
    lastGiftTs: 1,
    usersGiftedToday: []
}

export const getDefaultChristmasInventoryForId = (id: string): ChristmasInventory => {
    return {
        id: id,
        ...DEFAULT_INVENTORY
    }
}