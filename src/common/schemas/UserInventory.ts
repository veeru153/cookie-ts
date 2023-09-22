import { DocumentData } from "../../entities/DocumentData";

export interface UserInventory extends DocumentData {
    backgrounds: string[];
    badges: string[];
    coins: number;
    cookies: number;
    lastBaked: number;
    bakePity: number[];
}

export const DEFAULT_INVENTORY = {
    backgrounds: ["I_AM_YUQI"],
    badges: ["SIGN_YUQI", "IDLE_BLOB"],
    coins: 0,
    cookies: 0,
    lastBaked: -1,
    bakePity: [0, 0, 0, 0],
}

export const getDefaultInventoryForId = (id: string) => {
    return {
        id: id,
        ...DEFAULT_INVENTORY
    }
}