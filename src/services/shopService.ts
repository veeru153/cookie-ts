import { GuildMember } from "discord.js";
import { eventsRepo, inventoryRepo, profileRepo, shopRepo } from "../util/collections";
import { ShopItem, UserInventory, UserProfile } from "../util/collectionTypes";
import { Errors } from "../util/constants";

class _ShopService {
    add = async (itemId: string, itemData: ShopItem) => {
        // Add to list
        if(shopRepo.data[itemId]) 
            throw new Error(`[ShopService] Item with id : \`${itemData}\` already exists`);
        
        await shopRepo.set(itemId, itemData);
    }

    unlist = async (itemId: string) => {
        // Mark as unlisted, keep in list
        if(!shopRepo.get(itemId))
            throw new Error(`Item with id : \`${itemId}\` does not exist`);

        await shopRepo.set(itemId, { listed: false });
    }

    list = async () => {
        let list = "**[BETA] Shop Catalogue:**\nName [Type] - Cost\n";
        let counter = 0;
        let event = "";

        shopRepo.data.forEach((item, key) => {
            if(!item.listed) return;
            if(item.limited == "HALLOWEEN_2022") event = " 🎃"
            counter++;
            const { name, cost, type } = item;
            list += `${counter}. \`${key}\` - ${name} [${type.charAt(0).toUpperCase() + type.slice(1)}] - ${cost} 🪙${event}\n`;
            event = "";
        });

        if(list == "**Catalogue:**\nName [Type] - Cost\n") {
            // Skipping unlisted items or if no new items are added.
            list += `Catalogue is Empty`;
        }

        return list;
    }    
    
    buy = async (member: GuildMember, itemId: string) => {
        // Users buy stuff
        const item = shopRepo.get(itemId) as ShopItem;

        if(!item)
            throw new Error(Errors.SHOP_ITEM_NOT_FOUND);

        if(!item.listed)
            throw new Error(Errors.SHOP_ITEM_UNLISTED)

        const { level: userLevel } = profileRepo.get(member.id) as UserProfile;
        const { level, joinedBeforeTs, memberAgeTs } = item.eligibility;

        if(userLevel < level)
            throw new Error(Errors.SHOP_USER_LEVEL_LOW);

        if(joinedBeforeTs != -1 && member.joinedTimestamp > joinedBeforeTs) 
            throw new Error(Errors.SHOP_ITEM_TIME_LIMITED);

        if(memberAgeTs != -1 && (Date.now() - member.joinedTimestamp < memberAgeTs))
            throw new Error(Errors.SHOP_MEMBERSHIP_TIME_TOO_LOW);

        const userInv = inventoryRepo.get(member.id) as UserInventory;

        if(userInv.coins < item.cost)
            throw new Error(Errors.SHOP_NOT_ENOUGH_COINS);

        if(item.stock == 0)
            throw new Error(Errors.SHOP_ITEM_OUT_OF_STOCK);
        
        if(item.stock != -1) {
            shopRepo.set(itemId, {
                stock: item.stock - 1
            })
        }

        if(item.type == "badge") {
            const badgesSet = new Set(userInv.badges);
            if(badgesSet.has(itemId))
                throw new Error(Errors.SHOP_USER_HAS_ITEM);
            badgesSet.add(itemId);
            userInv.badges = Array.from(badgesSet);
        }

        if(item.type == "background") {
            const bgSet = new Set(userInv.backgrounds);
            if(bgSet.has(itemId))
                throw new Error(Errors.SHOP_USER_HAS_ITEM);
            bgSet.add(itemId);
            userInv.backgrounds = Array.from(bgSet);
        }

        // TODO: Handle events
        const event = "HALLOWEEN_2022";
        if(item.limited == event) {
            const eventData = eventsRepo.get(event);
            const eventUserData = eventData[member.id];

            if(eventUserData.coins < item.cost)
                throw new Error(Errors.SHOP_NOT_ENOUGH_COINS);

            eventUserData.coins = eventUserData.coins - item.cost;
            eventData[member.id] = eventUserData;
            await eventsRepo.set(event, eventData);
        } else {
            userInv.coins = userInv.coins - item.cost;
        }

        await inventoryRepo.set(member.id, userInv);
        return item;
    }
}

const ShopService = new _ShopService();
export default ShopService;