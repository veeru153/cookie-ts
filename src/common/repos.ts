import { Repository } from "../entities/Repository";
import { Asset } from "./schemas/Asset";
import { HalloweenInventory } from "./schemas/HalloweenInventory";
import { ShopItem } from "./schemas/ShopItem";
import { UserInventory } from "./schemas/UserInventory";
import { UserProfile } from "./schemas/UserProfile";

export const assetsRepo = new Repository<Asset>("assets").prepopulate();
export const shopRepo = new Repository<ShopItem>("shop").prepopulate();
export const inventoryRepo = new Repository<UserInventory>("inventory");
export const profileRepo = new Repository<UserProfile>("profile");

// TODO: Use actual collection once ready on firebase
// export const halloweenRepo = new Repository<HalloweenInventory>("event_halloween_2023");
export const halloweenRepo: Repository<HalloweenInventory> = null;