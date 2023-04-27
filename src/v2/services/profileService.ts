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

export const customizeProfile = async (id: string, key: ShopItemType, value: string) => {
    if (![ShopItemType.BACKGROUND, ShopItemType.BADGE].includes(key))
        throw new CookieException('Invalid Key');

    const userInventory = inventoryRepo.get(id) as UserInventory;
    const itemTypeList = getItemTypeList(userInventory, key);
    console.log(itemTypeList);
    if (!itemTypeList.includes(value))
        throw new CookieException('Could not find this item in inventory.');

    const userProfile = profileRepo.get(id) as UserProfile;
    equipItem(userProfile, key, value);
    await profileRepo.set(id, userProfile);
}

const getItemTypeList = (userInventory: UserInventory, key: ShopItemType) => {
    if (key === ShopItemType.BACKGROUND)
        return userInventory.backgrounds;
}

const equipItem = (userProfile: UserProfile, key: ShopItemType, value: string) => {
    if (key === ShopItemType.BACKGROUND)
        return userProfile.bg = value;
}

export const getProfileCard = async (message: Message) => {
    log.info(`[ProfileService] Generating Card for User : ${getUserLogString(message.author)}`)
    const { id, username, discriminator } = message.author;
    const avatar = message.author.displayAvatarURL({ extension: 'png', size: 128, forceStatic: true })
    const userProfile = profileRepo.get(id) as UserProfile;
    const { bg, xp, level } = userProfile;
    const background = assetsRepo.get(bg) as Asset;

    const payload = {
        name: username,
        discriminator: discriminator,
        avatar: avatar,
        background: background.src,
        xp: xp,
        level: level
    }

    const buffer = await generateCard(payload);
    log.info(`[ProfileService] Card Generated for User : ${getUserLogString(message.author)}`)
    return buffer;
}