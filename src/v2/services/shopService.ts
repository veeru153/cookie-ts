import { GuildMember } from "discord.js";
import { ShopItemType, ShopItem } from "../utils/schemas/ShopItem"
import { assetsRepo, profileRepo, shopRepo } from "../utils/repos";
import { ShopError } from "../utils/enums/Errors";
import { UserProfile } from "../utils/schemas/UserProfile";
import { inventoryRepo } from "../utils/repos";
import { UserInventory } from "../utils/schemas/UserInventory";
import logger from "../utils/logger";
import { Asset } from "../utils/schemas/Asset";
import { CatalogueItem } from "../utils/types/CatalogueItem";

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

export const getCatalogue = (getUnlistsed: boolean) => {
  const list: CatalogueItem[] = [];
  shopRepo.data.forEach((item: ShopItem, key) => {
    if (!getUnlistsed && !item.listed) return;

    const asset = assetsRepo.get(item.id) as Asset;

    if (!asset) {
      logger.info(`[ShopService.getCatalogue] Could not find asset for item.id : ${item.id}`);
    } else {
      const shopItem = {
        id: item.id,
        name: item.name,
        cost: item.cost,
        src: asset.src,
        type: item.type
      }
      list.push(shopItem);
    }
  })
  return list;
}

// Validate and add item to member's inventory
export const buyShopItem = async (member: GuildMember, itemId: string) => {
  const item = shopRepo.get(itemId) as ShopItem;
  const userInventory = inventoryRepo.get(member.id) as UserInventory;
  validatePurchase(member, item, userInventory);
  await completePurchaseAndDeductFunds(item, userInventory);
  await inventoryRepo.set(member.id, userInventory);
  return {
    name: item.name,
    cost: item.cost
  };
}

const validatePurchase = (member: GuildMember, item: ShopItem, userInventory: UserInventory) => {
  if (!item)
    throw new Error(ShopError.ITEM_NOT_FOUND);

  if (!item.listed)
    throw new Error(ShopError.ITEM_UNLISTED)

  const { level: userLevel } = profileRepo.get(member.id) as UserProfile;
  const { level, joinedBeforeTs, memberAgeTs } = item.eligibility;

  if (userLevel < level)
    throw new Error(ShopError.USER_LEVEL_LOW);

  if (joinedBeforeTs != -1 && member.joinedTimestamp > joinedBeforeTs)
    throw new Error(ShopError.ITEM_TIME_LIMITED);

  if (memberAgeTs != -1 && (Date.now() - member.joinedTimestamp < memberAgeTs))
    throw new Error(ShopError.MEMBERSHIP_TIME_TOO_LOW);

  if (userInventory.coins < item.cost)
    throw new Error(ShopError.NOT_ENOUGH_COINS);

  if (item.stock == 0)
    throw new Error(ShopError.ITEM_OUT_OF_STOCK);
}

const completePurchaseAndDeductFunds = async (item: ShopItem, userInventory: UserInventory) => {
  let ownedInventory = getSubInventory(item, userInventory);
  if (ownedInventory === null) {
    logger.error(`[shopService.completePurchase()] No user inventory exists for this item type. Item : ${item}`);
    throw new Error(ShopError.UNEXPECTED_ERROR);
  }

  let ownedSet: Set<string> = new Set(ownedInventory);
  if (ownedSet.has(item.id))
    throw new Error(ShopError.USER_HAS_ITEM);
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