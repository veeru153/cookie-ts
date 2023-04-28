import { DocumentData } from "../../entities/DocumentData";

export interface UserProfile extends DocumentData {
    level: number;
    xp: number;
    bg: string;
    background: string;
    badge1: string;
    badge2: string;
}

export const DEFAULT_PROFILE = {
    level: 0,
    xp: 0,
    bg: "I_AM_YUQI",
    background: "I_AM_YUQI",
    badge1: "SIGN_YUQI",
    badge2: "IDLE_BLOB",
}

export const getDefaultProfileForId = (id: string) => {
    return {
        id: id,
        ...DEFAULT_PROFILE
    }
}