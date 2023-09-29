import { DocumentData } from "../../entities/DocumentData";

export interface HalloweenInventory extends DocumentData {
    candies: number;
    coins: number;
    points: number;
}

const DEFAULT_INVENTORY = {
    candies: 0,
    coins: 0,
    points: 0
}

export const getDefaultHalloweenInventoryForId = (id: string): HalloweenInventory => {
    return {
        id: id,
        ...DEFAULT_INVENTORY
    }
}