import { Repository } from "../entities/Repository";
import { Asset } from "./schemas/Asset";
import { ShopItem } from "./schemas/ShopItem";
import { UserInventory } from "./schemas/UserInventory";
import { UserProfile } from "./schemas/UserProfile";

export const assetsRepo = new Repository<Asset>("assets").prepopulate();
export const shopRepo = new Repository<ShopItem>("shop").prepopulate();
export const inventoryRepo = new Repository<UserInventory>("inventory");
export const profileRepo = new Repository<UserProfile>("profile");

// TODO: Uncomment when events
// export const eventsRepo = new Repository("events");
// export const halloweenRepo = new Repository("event_HALLOWEEN_2022");