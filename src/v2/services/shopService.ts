import { GuildMember } from "discord.js";
import { ShopItemType, ShopItem } from "../utils/collectionSchemas/ShopItem"
import { profileRepo, shopRepo } from "../utils/repos";
import { Errors, ShopErrors } from "../utils/enums/Errors";
import { UserProfile } from "../utils/collectionSchemas/UserProfile";
import { inventoryRepo } from "../utils/repos";
import { UserInventory } from "../utils/collectionSchemas/UserInventory";
import logger from "../utils/logger";

// Add to list
export const addItem = async (itemId: string, itemData: ShopItem) => {
  if (shopRepo.data[itemId]) {
    throw new Error(`[ShopService] Item with id : \`${itemData}\` already exists`);
  }
  await shopRepo.set(itemId, itemData);
}

// Mark as unlisted, keep in list
export const unlistItem = async (itemId: string) => {
  if (!shopRepo.get(itemId)) {
    throw new Error(`Item with id : \`${itemId}\` does not exist`);
  }
  await shopRepo.set(itemId, { listed: false });
}

// Get all listed shop items
export const getCatalogue = (): string => {
  const header = ["**[BETA] Shop Catalogue:**", "Name [Type] - Stock Remaining - Cost"];
  const list = [];
  let counter = 0;

  shopRepo.data.forEach((item: ShopItem, key) => {
    if (!item.listed) return;
    counter++;
    const { name, cost, type, stock } = item;
    list.push(`${counter}. \`${key}\` - ${name} [${type.charAt(0).toUpperCase() + type.slice(1)}] - ${stock} - ${cost} 🪙`);
  });

  if (list.length === 0) {
    list.push("Catalogue is Empty");
  }

  return [...header, ...list].join('\n');
}

// Validate and add item to member's inventory
export const buyItem = async (member: GuildMember, itemId: string) => {
  const item = shopRepo.get(itemId) as ShopItem;
  const userInventory = inventoryRepo.get(member.id) as UserInventory;
  validatePurchase(member, item, userInventory);
  await completePurchaseAndDeductFunds(item, userInventory);
  await inventoryRepo.set(member.id, userInventory);
}

const validatePurchase = (member: GuildMember, item: ShopItem, userInventory: UserInventory) => {
  if (!item)
    throw new Error(ShopErrors.ITEM_NOT_FOUND);

  if (!item.listed)
    throw new Error(ShopErrors.ITEM_UNLISTED)

  const { level: userLevel } = profileRepo.get(member.id) as UserProfile;
  const { level, joinedBeforeTs, memberAgeTs } = item.eligibility;

  if (userLevel < level)
    throw new Error(ShopErrors.USER_LEVEL_LOW);

  if (joinedBeforeTs != -1 && member.joinedTimestamp > joinedBeforeTs)
    throw new Error(ShopErrors.ITEM_TIME_LIMITED);

  if (memberAgeTs != -1 && (Date.now() - member.joinedTimestamp < memberAgeTs))
    throw new Error(ShopErrors.MEMBERSHIP_TIME_TOO_LOW);

  if (userInventory.coins < item.cost)
    throw new Error(ShopErrors.NOT_ENOUGH_COINS);

  if (item.stock == 0)
    throw new Error(ShopErrors.ITEM_OUT_OF_STOCK);
}

const completePurchaseAndDeductFunds = async (item: ShopItem, userInventory: UserInventory) => {
  let ownedInventory = getSubInventory(item, userInventory);
  if (ownedInventory === null) {
    logger.error(`[shopService.completePurchase()] No user inventory exists for this item type. Item : ${item}`);
    throw new Error(ShopErrors.UNEXPECTED_ERROR);
  }

  let ownedSet: Set<string> = new Set(ownedInventory);
  if (ownedSet.has(item.id))
    throw new Error(ShopErrors.USER_HAS_ITEM);
  ownedSet.add(item.id);
  ownedInventory = Array.from(ownedSet);

  if (item.stock != -1)
    await shopRepo.set(item.id, { stock: item.stock - 1 })
  userInventory.coins = - item.cost;
}

const getSubInventory = (item: ShopItem, userInventory: UserInventory): string[] => {
  const typeToSubInventoryMap: Map<string, string[]> = new Map();
  typeToSubInventoryMap.set(ShopItemType.BACKGROUND, userInventory.backgrounds);
  typeToSubInventoryMap.set(ShopItemType.BADGE, userInventory.badges);

  return typeToSubInventoryMap.get(item.type) ?? null;
}