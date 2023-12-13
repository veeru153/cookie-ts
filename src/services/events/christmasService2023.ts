import { GuildMember } from "discord.js";
import { DateTime } from "luxon";
import { CookieException } from "../../common/CookieException";
import { christmasRepo } from "../../common/repos";
import { ChristmasInventory, getDefaultChristmasInventoryForId } from "../../common/schemas/ChristmasInventory";
import { DAILY_GIFT_LIMIT, RATES, WALL, FLOOR, ROOF, WINDOW, DOOR, REQUIRED_WALLS, REQUIRED_FLOORS, REQUIRED_ROOFS, REQUIRED_WINDOWS, REQUIRED_DOORS } from "../../common/constants/christmas2023";

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
    const housePart = updateReceiverInventoryAndGetHousePartString(gift, receiverInventory);

    senderInventory.lastGiftTs = DateTime.now().toMillis();
    senderInventory.usersGiftedToday.push(receiver.id);

    await christmasRepo.set(receiver.id, receiverInventory);
    await christmasRepo.set(sender.id, senderInventory);
    return `You gifted ${receiver.toString()} a ${housePart}.`;
}

const getRandomHousePart = () => {
    const luck = Math.random();
    let i = 0;
    while (luck > RATES[i]) {
        i++;
    }

    return i;
}

const updateReceiverInventoryAndGetHousePartString = (gift: number, receiverInventory: ChristmasInventory) => {
    if (gift === WALL) {
        receiverInventory.walls = receiverInventory.walls + 1;
        return "wall";
    } else if (gift === FLOOR) {
        receiverInventory.floors = receiverInventory.floors + 1;
        return "floor";
    } else if (gift === ROOF) {
        receiverInventory.roofs = receiverInventory.roofs + 1;
        return "roof";
    } else if (gift === WINDOW) {
        receiverInventory.windows = receiverInventory.windows + 1;
        return "window";
    } else if (gift === DOOR) {
        receiverInventory.doors = receiverInventory.doors + 1;
        return "door";
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

export const getHouseProgress = async (member: GuildMember) => {
    if (member == null) {
        throw new CookieException("Invalid member");
    }

    let christmasInventory = await christmasRepo.get(member.id);
    if (christmasInventory == null) {
        christmasInventory = getDefaultChristmasInventoryForId(member.id);
    }

    const { walls, floors, roofs, windows, doors } = christmasInventory;

    let res = `Gingerbread House progress:`
        + `Walls: ${walls}/${REQUIRED_WALLS}`
        + `Floors: ${floors}/${REQUIRED_FLOORS}`
        + `Roofs: ${roofs}/${REQUIRED_ROOFS}`
        + `Windows: ${windows}/${REQUIRED_WINDOWS}`
        + `Doors: ${doors}/${REQUIRED_DOORS}`;

    return res;
}

// export const canClaimRewards = () => {
//     // verify if member has all parts and return true or false
// }