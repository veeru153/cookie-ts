import { DocumentData } from "../../entities/DocumentData";

export interface UserProfile extends DocumentData {
    level: number;
    xp: number;
    bg: string;
    badge1: string;
    badge2: string;
}