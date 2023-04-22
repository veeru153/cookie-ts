import { DocumentData } from "../../entities/DocumentData";

export interface UserInventory extends DocumentData {
    backgrounds: string[];
    badges: string[];
    coins: number;
    cookies: number;
    lastBaked: number;
}