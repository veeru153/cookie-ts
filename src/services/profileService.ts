import { ShopItem, ShopItemType } from "../utils/schemas/ShopItem";
import { assetsRepo, inventoryRepo, profileRepo, shopRepo } from "../utils/repos";
import { UserInventory } from "../utils/schemas/UserInventory";
import { UserProfile } from "../utils/schemas/UserProfile";
import { GuildMember, Message } from "discord.js";
import { generateCard } from "./profileCardService";
import { CookieException } from "../utils/CookieException";
import { log } from "../utils/logger";
import { getUserLogString } from "../helpers/getUserLogString";
import { validateAndPatchInventory } from "../helpers/validateAndPatchInventory";
import { validateAndPatchProfile } from "../helpers/validateAndPatchProfile";
import { ProfilePayload } from "../utils/types/ProfilePayload";
import { sendToLogChannel } from "../helpers/sendToLogChannel";

export const customizeProfile = async (userId: string, key: ShopItemType, value: string) => {
    if (![ShopItemType.BACKGROUND, ShopItemType.BADGE].includes(key))
        throw new CookieException('Invalid Key');

    let userInventory = await inventoryRepo.get(userId);
    userInventory = await validateAndPatchInventory(userId, userInventory);

    const shopItem = await shopRepo.get(value);
    if (shopItem == null) {
        throw new CookieException(`Item with id: \`${value}\` not found`);
    }

    const itemTypeList = getItemTypeList(userInventory, key);
    if (!itemTypeList.includes(value))
        throw new CookieException('Could not find this item in inventory.');

    let userProfile = await profileRepo.get(userId);
    userProfile = await validateAndPatchProfile(userId, userProfile);
    equipItem(userProfile, key, value);
    await profileRepo.set(userId, userProfile);
}

export const customizeProfileV2 = async (userId: string, itemId: string) => {
    let userInventory = await inventoryRepo.get(userId);
    userInventory = await validateAndPatchInventory(userId, userInventory);

    const item = await shopRepo.get(itemId);
    if (item == null) {
        throw new CookieException(`Item with id: \`${itemId}\` not found`);
    }

    const itemTypeInventoryList = getItemTypeListFromInventory(userInventory, item);
    if (!itemTypeInventoryList.includes(item.id))
        throw new CookieException('Could not find this item in inventory.');

    let userProfile = await profileRepo.get(userId);
    userProfile = await validateAndPatchProfile(userId, userProfile);
    equipItemV2(userProfile, item);
    await profileRepo.set(userId, userProfile);
}

const getItemTypeListFromInventory = (userInventory: UserInventory, item: ShopItem) => {
    const { id, type } = item;
    if (type === ShopItemType.BACKGROUND)
        return userInventory.backgrounds;

    log.error(sendToLogChannel(`Item: ${id} has type: ${type} which has no mapping.`));
    throw new CookieException("An error occurred");
}

const getItemTypeList = (userInventory: UserInventory, key: ShopItemType) => {
    if (key === ShopItemType.BACKGROUND)
        return userInventory.backgrounds;
}

const equipItem = (userProfile: UserProfile, key: ShopItemType, value: string) => {
    if (key === ShopItemType.BACKGROUND)
        userProfile.background = value;
}

const equipItemV2 = (userProfile: UserProfile, item: ShopItem) => {
    const { id, type } = item;
    if (type === ShopItemType.BACKGROUND)
        return userProfile.background = id;

    log.error(sendToLogChannel(`Item: ${id} has type: ${type} which has no mapping.`));
    throw new CookieException("An error occurred");
}

export const getProfileCard = async (member: GuildMember) => {
    const { user } = member;
    log.info(`[ProfileService] Generating Card for User : ${getUserLogString(user)}`)
    const { id, username, discriminator } = user;
    const { displayName } = member;
    const avatar = user.displayAvatarURL({ extension: 'png', size: 128, forceStatic: true })
    let userProfile = await profileRepo.get(id);
    userProfile = await validateAndPatchProfile(member.id, userProfile);
    const { background, xp, level } = userProfile;
    const backgroundAsset = await assetsRepo.get(background);
    if (!backgroundAsset || !backgroundAsset.src) {
        log.error(`[ProfileService] Background asset : ${background} not found in assets`);
        throw new CookieException("Could not generate profile");
    }

    const payload: ProfilePayload = {
        name: username,
        displayName: displayName,
        username: username,
        discriminator: discriminator,
        avatar: avatar,
        background: backgroundAsset.src,
        xp: xp,
        level: level
    }

    const buffer = await generateCard(payload);
    log.info(`[ProfileService] Card Generated for User : ${getUserLogString(user)}`)
    return buffer;
}