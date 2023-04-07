import Repository from "../entities/Repository";

export const inventoryRepo = new Repository("inventory");
export const profileRepo = new Repository("profile");
export const shopRepo = new Repository("shop");
export const assetsRepo = new Repository("assets");

// TODO: Uncomment when events
// export const eventsRepo = new Repository("events");
// export const halloweenRepo = new Repository("event_HALLOWEEN_2022");