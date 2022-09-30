export interface Asset {
    name: string;
    src: string;
}

export interface ShopItem {
    cost: number;
    eligibility: {
        joinedBeforeTs: number,
        level: number,
        memberAgeTs: number
    };
    listed: boolean;
    name: string;
    originalCost: number;
    type: string;
    stock: number;
    limited: string;
}

export interface UserProfile {
    level: number;
    xp: number;
    bg: string;
    badge1: string;
    badge2: string;
}

export interface UserInventory {
    backgrounds: string[];
    badges: string[];
    coins: number;
    cookies: number;
    lastBaked: number;
}