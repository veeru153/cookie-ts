import { GuildMember } from "discord.js";
import { inventoryRepo, profileRepo } from "../utils/repos";

export const initializeMemberCollections = async (member: GuildMember) => {
    !profileRepo.get(member.id) && await profileRepo.set(member.id, {
        level: 0,
        xp: 0,
        badge1: "SIGN_YUQI",
        badge2: "IDLE_BLOB",
        bg: "YUQI_REVEAL"
    })

    inventoryRepo.get(member.id) && await inventoryRepo.set(member.id, {
        cookies: 0,
        lastBaked: -1,
        coins: 0,
        backgrounds: ["YUQI_REVEAL"],
        badges: ["SIGN_YUQI", "IDLE_BLOB"],
    });
}