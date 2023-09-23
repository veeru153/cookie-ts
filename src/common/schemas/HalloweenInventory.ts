import { DocumentData } from "../../entities/DocumentData";

export interface HalloweenInventory extends DocumentData {
    candies: number;
    coins: number;
    points: number;
}