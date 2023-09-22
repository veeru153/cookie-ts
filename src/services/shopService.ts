import { GuildMember } from "discord.js";
import { ShopItemType, ShopItem } from "../common/schemas/ShopItem"
import { assetsRepo, profileRepo, shopRepo } from "../common/repos";
import { ShopError } from "../common/enums/Errors";
import { inventoryRepo } from "../common/repos";
import { UserInventory } from "../common/schemas/UserInventory";
import { CatalogueItem } from "../common/types/CatalogueItem";
import { CookieException } from "../common/CookieException";
import { log } from "../common/logger";
import { validateAndPatchProfile } from "../utils/validateAndPatchProfile";
import { validateAndPatchInventory } from "../utils/validateAndPatchInventory";

// Add to list
export const addItem = async (itemId: string, itemData: ShopItem) => {
  if (shopRepo.data[itemId]) {
    throw new CookieException(`[ShopService] Item with id : \`${itemData}\` already exists`);
  }
  await shopRepo.set(itemId, itemData);
}

// Mark as unlisted, keep in list
export const unlistItem = async (itemId: string) => {
  const item = await shopRepo.get(itemId);
  if (!item) {
    throw new CookieException(`Item with id : \`${itemId}\` does not exist`);
  }
  item.listed = false;
  await shopRepo.set(itemId, item);
}

// Get all listed shop items
export const getFormattedCatalogue = (): string => {
  const header = ["**[BETA] Shop Catalogue:**", "Name [Type] - Cost"];
  const list = [];
  let counter = 0;

  shopRepo.data.forEach((item: ShopItem, key) => {
    if (!item.listed) return;
    counter++;
    const { name, cost, type, stock } = item;
    const row = `${counter}. \`${key}\` - ${name} [${type.charAt(0).toUpperCase() + type.slice(1)}] - ${cost} 🍪`
    if (stock === 0)
      list.push(`~~${row}~~`);
    else
      list.push(row);
  });

  if (list.length === 0) {
    list.push("Catalogue is Empty");
  }

  return [...header, ...list].join('\n');
}

export const getCatalogue = async (getUnlistsed: boolean) => {
  const list: CatalogueItem[] = [];
  shopRepo.data.forEach(async (item: ShopItem, key) => {
    if (!getUnlistsed && !item.listed) return;
    const asset = await assetsRepo.get(item.id);
    if (!asset) {
      log.info(`[ShopService.getCatalogue] Could not find asset for item.id : ${item.id}`);
    } else {
      const shopItem = {
        id: item.id,
        name: item.name,
        cost: item.cost,
        src: asset.src,
        type: item.type,
        ts: asset.ts ?? Number.MAX_VALUE
      }
      list.push(shopItem);
    }
  })
  return list;
}

// Validate and add item to member's inventory
export const buyShopItem = async (member: GuildMember, itemId: string) => {
  const item = await shopRepo.get(itemId);
  let userInventory = await inventoryRepo.get(member.id);
  userInventory = await validateAndPatchInventory(member.user.id, userInventory);
  await validatePurchase(member, item, userInventory);
  await completePurchaseAndDeductFunds(item, userInventory);
  await inventoryRepo.set(member.id, userInventory);
  return {
    name: item.name,
    cost: item.cost
  };
}

const validatePurchase = async (member: GuildMember, item: ShopItem, userInventory: UserInventory) => {
  if (!item)
    throw new CookieException(ShopError.ITEM_NOT_FOUND);

  if (!item.listed)
    throw new CookieException(ShopError.ITEM_UNLISTED)

  let userProfile = await profileRepo.get(member.id);
  userProfile = await validateAndPatchProfile(member.id, userProfile);
  const { level: userLevel } = userProfile;

  let level = item.eligibility.level ?? -1;
  let joinedBeforeTs = item.eligibility.joinedBeforeTs ?? -1;
  let memberAgeTs = item.eligibility.memberAgeTs ?? -1;

  if (userLevel < level)
    throw new CookieException(ShopError.USER_LEVEL_LOW);

  if (joinedBeforeTs != -1 && member.joinedTimestamp > joinedBeforeTs)
    throw new CookieException(ShopError.ITEM_TIME_LIMITED);

  if (memberAgeTs != -1 && (Date.now() - member.joinedTimestamp < memberAgeTs))
    throw new CookieException(ShopError.MEMBERSHIP_TIME_TOO_LOW);

  if (userInventory.cookies < item.cost)
    throw new CookieException(ShopError.NOT_ENOUGH_COOKIES);

  if (item.stock == 0)
    throw new CookieException(ShopError.ITEM_OUT_OF_STOCK);
}

const completePurchaseAndDeductFunds = async (item: ShopItem, userInventory: UserInventory) => {
  let ownedInventory = getSubInventory(item, userInventory);
  if (ownedInventory === null) {
    log.error(`[shopService.completePurchase()] No user inventory exists for this item type. Item : ${item}`);
    throw new CookieException(ShopError.UNEXPECTED_ERROR);
  }

  let ownedSet: Set<string> = new Set(ownedInventory);
  if (ownedSet.has(item.id))
    throw new CookieException(ShopError.USER_HAS_ITEM);
  ownedSet.add(item.id);
  ownedInventory = Array.from(ownedSet);

  if (item.stock != -1) {
    item.stock = item.stock - 1;
    await shopRepo.set(item.id, item);
  }

  userInventory.cookies = userInventory.cookies - item.cost;
  updateSubInventory(item.type as ShopItemType, userInventory, ownedInventory);
}

const updateSubInventory = (type: ShopItemType, userInventory: UserInventory, ownedInventory: string[]) => {
  if (type === ShopItemType.BACKGROUND)
    return userInventory.backgrounds = ownedInventory;
  if (type === ShopItemType.BADGE)
    return userInventory.badges = ownedInventory;
}

const getSubInventory = (item: ShopItem, userInventory: UserInventory): string[] => {
  const typeToSubInventoryMap: Map<string, string[]> = new Map();
  typeToSubInventoryMap.set(ShopItemType.BACKGROUND, userInventory.backgrounds);
  typeToSubInventoryMap.set(ShopItemType.BADGE, userInventory.badges);

  return typeToSubInventoryMap.get(item.type) ?? null;
}