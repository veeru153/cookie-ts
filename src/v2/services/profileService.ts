import { ShopItemType } from "../utils/schemas/ShopItem";
import { assetsRepo, inventoryRepo, profileRepo } from "../utils/repos";
import { UserInventory } from "../utils/schemas/UserInventory";
import { UserProfile } from "../utils/schemas/UserProfile";
import { Message } from "discord.js";
import { Asset } from "../utils/schemas/Asset";
import { generateCard } from "./profileCardService";
import { CookieException } from "../utils/CookieException";
import { log } from "../utils/logger";
import { getUserLogString } from "../helpers/getUserLogString";
import { validateAndPatchInventory } from "../helpers/validateAndPatchInventory";
import { validateAndPatchProfile } from "../helpers/validateAndPatchProfile";

export const customizeProfile = async (id: string, key: ShopItemType, value: string) => {
    if (![ShopItemType.BACKGROUND, ShopItemType.BADGE].includes(key))
        throw new CookieException('Invalid Key');

    let userInventory = inventoryRepo.get(id) as UserInventory;
    userInventory = await validateAndPatchInventory(id, userInventory);
    const itemTypeList = getItemTypeList(userInventory, key);
    if (!itemTypeList.includes(value))
        throw new CookieException('Could not find this item in inventory.');

    let userProfile = profileRepo.get(id) as UserProfile;
    userProfile = await validateAndPatchProfile(id, userProfile);
    equipItem(userProfile, key, value);
    await profileRepo.set(id, userProfile);
}

const getItemTypeList = (userInventory: UserInventory, key: ShopItemType) => {
    if (key === ShopItemType.BACKGROUND)
        return userInventory.backgrounds;
}

const equipItem = (userProfile: UserProfile, key: ShopItemType, value: string) => {
    if (key === ShopItemType.BACKGROUND) {
        userProfile.background = value;
        userProfile.bg = value;
    }
}

export const getProfileCard = async (message: Message) => {
    log.info(`[ProfileService] Generating Card for User : ${getUserLogString(message.author)}`)
    const { id, username, discriminator } = message.author;
    const avatar = message.author.displayAvatarURL({ extension: 'png', size: 128, forceStatic: true })
    let userProfile = profileRepo.get(id) as UserProfile;
    userProfile = await validateAndPatchProfile(message.author.id, userProfile);
    const { background, xp, level } = userProfile;
    const backgroundAsset = assetsRepo.get(background) as Asset;
    if (!backgroundAsset) {
        log.error(`[ProfileService] Background asset : ${background} not found in assets`);
        throw new CookieException("Could not generate profile");
    }

    const payload = {
        name: username,
        discriminator: discriminator,
        avatar: avatar,
        background: backgroundAsset.src,
        xp: xp,
        level: level
    }

    const buffer = await generateCard(payload);
    log.info(`[ProfileService] Card Generated for User : ${getUserLogString(message.author)}`)
    return buffer;
}