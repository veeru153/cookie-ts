import { GuildMember } from "discord.js";
import { DateTime } from "luxon";
import { CookieException } from "../../common/CookieException";
import { christmasRepo } from "../../common/repos";
import { ChristmasInventory, getDefaultChristmasInventoryForId } from "../../common/schemas/ChristmasInventory";

const DAILY_GIFT_LIMIT = 5;
const WALL = 0;
const FLOOR = 1;
const ROOF = 2;
const WINDOW = 3;
const DOOR = 4;
const RATES = [0.2667, 0.5334, 0.7556, 0.8889, 1];

export const giftMember = async (sender: GuildMember, receiver: GuildMember) => {
    if (sender == null) {
        throw new CookieException("Invalid Sender");
    }
    if (receiver == null) {
        throw new CookieException("Could not find receiver. Please try again.");
    }

    let senderInventory = await christmasRepo.get(sender.id);
    if (senderInventory == null) {
        senderInventory = getDefaultChristmasInventoryForId(sender.id);
    }

    const { lastGiftTs, usersGiftedToday } = senderInventory;
    const lastGiftTime = DateTime.fromMillis(lastGiftTs);
    const prevResetTime = DateTime.now().startOf('day');

    if (lastGiftTime < prevResetTime) {
        // Daily Reset
        usersGiftedToday.length = 0;
    } else {
        // Same day
        if (usersGiftedToday.length >= DAILY_GIFT_LIMIT) {
            throw new CookieException(`You have exceeded the daily gift limit. You can gift more in ${getNextResetTimeString()}`);
        }
    }

    if (usersGiftedToday.includes(receiver.id)) {
        throw new CookieException("You have already gifted this member today. Try gifting someone else.");
    }

    let receiverInventory = await christmasRepo.get(receiver.id);
    if (receiverInventory == null) {
        receiverInventory = getDefaultChristmasInventoryForId(receiver.id);
    }

    const gift = getRandomHousePart();
    updateReceiverInventory(gift, receiverInventory);

    senderInventory.lastGiftTs = DateTime.now().toMillis();
    senderInventory.usersGiftedToday.push(receiver.id);

    await christmasRepo.set(receiver.id, receiverInventory);
    await christmasRepo.set(sender.id, senderInventory);

}

const getRandomHousePart = () => {
    const luck = Math.random();
    let i = 0;
    while (luck > RATES[i]) {
        i++;
    }

    return i;
}

const updateReceiverInventory = (gift: number, receiverInventory: ChristmasInventory) => {
    if (gift === WALL) {
        receiverInventory.walls = receiverInventory.walls + 1;
    } else if (gift === FLOOR) {
        receiverInventory.floors = receiverInventory.floors + 1;
    } else if (gift === ROOF) {
        receiverInventory.roofs = receiverInventory.roofs + 1;
    } else if (gift === WINDOW) {
        receiverInventory.windows = receiverInventory.windows + 1;
    } else if (gift === DOOR) {
        receiverInventory.doors = receiverInventory.doors + 1;
    } else {
        throw new CookieException("Unknown gift detected. This is an issue in Santa's factory.");
    }
}

const getNextResetTimeString = () => {
    const nextResetTime = DateTime.now().plus({ day: 1 }).startOf('day');
    const diff = nextResetTime.diffNow(['hour', 'minute']);

    let res = "";
    if (diff.hours !== 0) {
        if (diff.hours === 1) {
            res += "01 hour";
        } else {
            res += `${diff.hours.toFixed(2)} hours`;
        }
    }

    if (diff.minutes !== 0) {
        if (diff.minutes === 1) {
            res += "01 minute";
        } else {
            res += `${diff.minutes.toFixed(2)} minutes`;
        }
    }

    return res;
}

// export const canClaimRewards = () => {
//     // verify if member has all parts and return true or false
// }