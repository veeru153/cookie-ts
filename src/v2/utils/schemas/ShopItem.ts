import { DocumentData } from "../../entities/DocumentData";

export interface ShopItem extends DocumentData {
    cost: number;
    eligibility: Eligibility;
    listed: boolean;
    name: string;
    originalCost: number;
    type: ShopItemType | string;
    stock: number;
    limited: string;
}

interface Eligibility {
    joinedBeforeTs: number;
    level: number;
    memberAgeTs: number;
}

export enum ShopItemType {
    BADGE = "badge",
    BACKGROUND = "background"
}