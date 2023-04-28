import { GuildMember } from "discord.js";
import { inventoryRepo, profileRepo } from "../utils/repos";
import { DEFAULT_PROFILE } from "../utils/schemas/UserProfile";
import { DEFAULT_INVENTORY } from "../utils/schemas/UserInventory";

export const initializeMemberCollections = async (member: GuildMember) => {
    !profileRepo.get(member.id) && await profileRepo.set(member.id, DEFAULT_PROFILE);
    !inventoryRepo.get(member.id) && await inventoryRepo.set(member.id, DEFAULT_INVENTORY);
}