import Repository from "./Repository";

export const inventoryRepo = new Repository("inventory");
export const profileRepo = new Repository("profile");
export const shopRepo = new Repository("shop");
export const assetsRepo = new Repository("assets");

// TODO: Migrate events to use repo instead. Keeping for Halloween 2022
export const eventsRepo = new Repository("events");
