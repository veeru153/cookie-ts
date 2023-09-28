import { Channels } from "../../common/enums/Channels"
import client from "../../common/client"
import { getOneRandomlyFromArray, getRandomNumberBetween } from "../../utils/randomUtils"
import { Guild, Message, TextChannel, User } from "discord.js"
import { Guilds } from "../../common/enums/Guilds"
import { log } from "../../common/logger"
import { CookieException } from "../../common/CookieException"
import { PREFIX, isDevEnv } from "../../common/constants/common"
import { getUserLogString } from "../../utils/getUserLogString"
import { halloweenRepo } from "../../common/repos"
import { HalloweenInventory, getDefaultHalloweenInventoryForId } from "../../common/schemas/HalloweenInventory"
import { sendToLogChannel } from "../../utils/sendToLogChannel"
import { EventDetail } from "../../common/types/EventDetail"

const START_DATE = new Date("2023-10-01T00:00:00.000+09:00");
const END_DATE = new Date("2023-10-31T23:59:59.000+09:00");

const DROP_INTERVAL_MS_MIN = isDevEnv ? 20 * 1000 : 2 * 60 * 1000;
const DROP_INTERVAL_MS_MAX = isDevEnv ? 25 * 1000 : 4 * 60 * 1000;
const SUMMON_INTERVAL_MS_MIN = isDevEnv ? 55 * 1000 : 5 * 60 * 1000;
const SUMMON_INTERVAL_MS_MAX = isDevEnv ? 60 * 1000 : 10 * 60 * 1000;

const CANDY_EMOTES = ["🍬", "🍭", "🍫"];
const DROP_DURATION_MS_MIN = isDevEnv ? 24 * 1000 : 15 * 1000;
const DROP_DURATION_MS_MAX = isDevEnv ? 25 * 1000 : 20 * 1000;
const CANDY_DROP_MIN = 6;
const CANDY_DROP_MAX = 10;

const SPIRIT_EMOTES = ["👻", "🧟", "🧛", "👺", "👹"];
const SUMMON_DURATION_MS_MIN = isDevEnv ? 24 * 1000 : 15 * 1000;
const SUMMON_DURATION_MS_MAX = isDevEnv ? 25 * 1000 : 20 * 1000;
const CANDY_REQUEST_MIN = 1;
const CANDY_REQUEST_MAX = 25;

let TRIGGER_INTERVAL: NodeJS.Timeout = null;
let DROP_INTERVAL_LIST: NodeJS.Timeout[] = [];
let SUMMON_INTERVAL_LIST: NodeJS.Timeout[] = [];
let IS_LIVE = false;

export const halloween2023: EventDetail = {
    id: "halloween2023",
    name: "Halloween 2023",
    trigger: async () => await triggerHalloween(),
    start: async () => await startHalloween(),
    end: () => endHalloween()
}

const triggerHalloween = async () => {
    if (TRIGGER_INTERVAL != null || IS_LIVE) {
        log.info("[Halloween 2023] Trigger Interval already present or event is already live.");
        return;
    }

    TRIGGER_INTERVAL = setInterval(async () => {
        const currDate = Date.now();
        if (currDate >= START_DATE.getTime() && currDate <= END_DATE.getTime()) {
            log.info(sendToLogChannel("[Halloween 2023] Triggering event..."));
            clearInterval(TRIGGER_INTERVAL);
            await startHalloween();
        }
    })
}

const startHalloween = async () => {
    const currDate = Date.now();
    if (!isDevEnv && (currDate < START_DATE.getTime() || currDate > END_DATE.getTime())) {
        log.info("[Halloween 2023] Event has not started or has already ended.");
        return "[Halloween 2023] Event has not started or has already ended.";
    }

    if (IS_LIVE) {
        log.info("[Halloween 2023] Event is already live.");
        return "[Halloween 2023] Event is already live.";
    }

    IS_LIVE = true;

    const guildId = Guilds.YUQICORD;
    const guild: Guild = await client.guilds.fetch(guildId);
    const channelId = isDevEnv ? Channels.Kitchen.HALLOWEEN_TEST : Channels.Events.HALLOWEEN;
    const guildChannel = await guild.channels.fetch(channelId);

    if (!guildChannel.isTextBased()) {
        log.error("[Halloween 2023] Channel is not a text channel");
        throw new CookieException("Channel is not a text channel");
    }
    const channel = guildChannel as TextChannel;

    log.info(sendToLogChannel("[Halloween 2023] Starting event..."));

    const dropTs = getRandomNumberBetween(DROP_INTERVAL_MS_MIN, DROP_INTERVAL_MS_MAX);
    log.info(`[Halloween 2023] Next candy drop in ${Math.round(dropTs / 1000)} seconds.`);
    DROP_INTERVAL_LIST.push(setTimeout(async () => await dropCandiesWrapper(channel), dropTs));

    const summonTs = getRandomNumberBetween(SUMMON_INTERVAL_MS_MIN, SUMMON_INTERVAL_MS_MAX);
    log.info(`[Halloween 2023] Next spirit summon in ${Math.round(summonTs / 1000)} seconds.`);
    SUMMON_INTERVAL_LIST.push(setTimeout(async () => await summonSpiritWrapper(channel), summonTs));

    return "[Halloween 2023] Event started!";
}

const endHalloween = () => {
    if (!IS_LIVE) {
        return "[Halloween 2023] Event is not live!"
    }

    if (TRIGGER_INTERVAL != null) {
        clearTimeout(TRIGGER_INTERVAL);
        TRIGGER_INTERVAL = null;
    }

    if (DROP_INTERVAL_LIST.length > 0) {
        DROP_INTERVAL_LIST.map(drop => clearTimeout(drop));
        DROP_INTERVAL_LIST = [];
    }

    if (SUMMON_INTERVAL_LIST.length > 0) {
        SUMMON_INTERVAL_LIST.map(summon => clearTimeout(summon));
        SUMMON_INTERVAL_LIST = [];
    }

    log.info(sendToLogChannel("[Halloween 2023] Event has ended"));
    return "[Halloween 2023] Event ended!";
}

const dropCandiesWrapper = async (channel: TextChannel) => {
    DROP_INTERVAL_LIST.shift();
    await dropCandies(channel);
    const nextDropTs = getRandomNumberBetween(DROP_INTERVAL_MS_MIN, DROP_INTERVAL_MS_MAX);
    log.info(`[Halloween 2023] Next candy drop in ${Math.round(nextDropTs / 1000)} seconds.`);
    const nextDrop = setTimeout(async () => await dropCandiesWrapper(channel), nextDropTs);
    DROP_INTERVAL_LIST.push(nextDrop);
}

const summonSpiritWrapper = async (channel: TextChannel) => {
    SUMMON_INTERVAL_LIST.shift();
    await summonSpirit(channel);
    const nextSummonTs = getRandomNumberBetween(SUMMON_INTERVAL_MS_MIN, SUMMON_INTERVAL_MS_MAX);
    log.info(`[Halloween 2023] Next spirit summon in ${Math.round(nextSummonTs / 1000)} seconds.`);
    const nextSummon = setTimeout(async () => await summonSpiritWrapper(channel), nextSummonTs);
    SUMMON_INTERVAL_LIST.push(nextSummon);
}

const dropCandies = async (channel: TextChannel) => {
    const emote = getOneRandomlyFromArray(CANDY_EMOTES);
    const dropDurationMs = getRandomNumberBetween(DROP_DURATION_MS_MIN, DROP_DURATION_MS_MAX);
    const dropMessage = await channel.send(`${emote} **A mysterious bag of candies has appeared!**`);

    let alreadyCollectedUserIdList = [];
    const collectCommands = ["pick", "collect"];
    const filter = (message: Message) => collectCommands.includes(message.content.substring(PREFIX.length));

    const collector = channel.createMessageCollector({ filter, time: dropDurationMs });
    collector.on('collect', async (message: Message) => {
        await handleCandyCollection(message, alreadyCollectedUserIdList);
    })

    collector.on('end', async () => {
        if (alreadyCollectedUserIdList.length > 0) {
            dropMessage.editable && await dropMessage.edit("**This bag has been emptied!**");
            alreadyCollectedUserIdList = [];
        } else {
            dropMessage.deletable && await dropMessage.delete();
        }
    })
}

const handleCandyCollection = async (message: Message, alreadyCollectedUserIdList: string[]) => {
    const user = message.author;
    const userId = user.id;

    try {
        if (alreadyCollectedUserIdList.includes(userId)) {
            await message.reply("You have already collected candies from this bag!");
            return;
        }

        alreadyCollectedUserIdList.push(userId);

        const userHalloweenInventory = await getUserHalloweenInventory(user);
        const prevCandies = userHalloweenInventory.candies;
        const candyCount = getRandomNumberBetween(CANDY_DROP_MIN, CANDY_DROP_MAX);
        const totalCandies = prevCandies + candyCount;

        userHalloweenInventory.candies = totalCandies;
        halloweenRepo.set(userId, userHalloweenInventory);

        await message.reply(`You collected ${candyCount} candies.\nTotal Candies: ${totalCandies}`);
        log.info(`[Halloween 2023] ${getUserLogString(user)} collected ${candyCount}. Total Candies: ${totalCandies}`);
    } catch (err) {
        log.error(err, sendToLogChannel(`[Halloween 2023] ${getUserLogString(user)} could not collect candies.`));
        await message.reply("An error occurred!");
    }
}

const summonSpirit = async (channel: TextChannel) => {
    const emote = getOneRandomlyFromArray(SPIRIT_EMOTES);
    const summonDurationMs = getRandomNumberBetween(SUMMON_DURATION_MS_MIN, SUMMON_DURATION_MS_MAX);
    const candiesRequested = getRandomNumberBetween(CANDY_REQUEST_MIN, CANDY_REQUEST_MAX);
    const summonMessage = await channel.send(`${emote} **A mysterious spirit has appeared!**\nThey want **${candiesRequested}** candies.`);

    let alreadyInteractedUserIdList = [];
    const spiritCommands = ["trick", "treat"];
    const filter = (message: Message) => spiritCommands.includes(message.content.substring(PREFIX.length));

    const collector = channel.createMessageCollector({ filter, time: summonDurationMs });
    collector.on('collect', async (message: Message) => {
        await handleSpiritInteraction(message, candiesRequested, alreadyInteractedUserIdList);
    })

    collector.on('end', async () => {
        if (alreadyInteractedUserIdList.length > 0) {
            summonMessage.editable && await summonMessage.edit("The spirit has left.");
            alreadyInteractedUserIdList = [];
        } else {
            summonMessage.deletable && await summonMessage.delete();
        }
    })
}

const handleSpiritInteraction = async (message: Message, candiesRequested: number, alreadyInteractedUserIdList: string[]) => {
    const user = message.author;
    const userId = user.id;
    const action = message.content.substring(PREFIX.length);

    try {
        if (alreadyInteractedUserIdList.includes(userId)) {
            await message.reply("You already interacted with the spirit!");
            return;
        }

        const userHalloweenInventory = await getUserHalloweenInventory(user);

        if (action === "trick") {
            await handleTrick(message, candiesRequested, userHalloweenInventory);
            alreadyInteractedUserIdList.push(userId);
            log.info(`[Halloween 2023] ${getUserLogString(user)} tricked spirit. Latest inventory: ${JSON.stringify(userHalloweenInventory)}`);
        } else if (action === "treat") {
            const userTreated = await handleTreat(message, candiesRequested, userHalloweenInventory);
            userTreated && alreadyInteractedUserIdList.push(userId);
            log.info(`[Halloween 2023] ${getUserLogString(user)} treated spirit. Latest inventory: ${JSON.stringify(userHalloweenInventory)}`);
        }

        await halloweenRepo.set(userId, userHalloweenInventory);
    } catch (err) {
        log.error(err, sendToLogChannel(`[Halloween 2023] ${getUserLogString(user)} could not ${action} spirits.`));
        await message.reply("An error occurred!");
    }
}

const handleTrick = async (message: Message, candiesRequested: number, userHalloweenInventory: HalloweenInventory) => {
    const appreciation = getRandomNumberBetween(-2, 3);
    let trickResponse: string = null;

    if (appreciation > 0) {
        trickResponse = `👏 The spirit was amused and has given you **${appreciation}** 🪙!`;
        const coinsReceived = 2 * Math.ceil(candiesRequested / 5);
        userHalloweenInventory.coins += coinsReceived;
        userHalloweenInventory.points += coinsReceived;
    } else {
        trickResponse = "😒 The spirit was not amused...";
        const currCandies = userHalloweenInventory.candies;
        userHalloweenInventory.candies = Math.max(0, currCandies - (2 * candiesRequested));
    }

    await message.reply(trickResponse);
}

const handleTreat = async (message: Message, candiesRequested: number, userHalloweenInventory: HalloweenInventory) => {
    const userCandies = userHalloweenInventory.candies;
    const userCoins = userHalloweenInventory.coins;

    if (userCandies < candiesRequested) {
        const sadEmotes = ["😭", "😖", "😦", "😢"];
        const emote = sadEmotes[Math.floor(Math.random() * sadEmotes.length)];
        await message.reply(`${emote} You don't have enough candies...`);
        return false;
    }

    const coinsReceived = Math.ceil(candiesRequested / 5);

    userHalloweenInventory.candies -= candiesRequested;
    userHalloweenInventory.coins += coinsReceived;
    userHalloweenInventory.points += 1;

    const treatResponse = `You exchanged ${candiesRequested} candies with the spirit for ${coinsReceived} 🪙.\n`
        + `Total Candies: ${userCandies - candiesRequested}\n`
        + `Total Coins: ${userCoins + 1} 🪙`;
    await message.reply(treatResponse);
    return true;
}

const getUserHalloweenInventory = async (user: User) => {
    const inventory = await halloweenRepo.get(user.id);
    if (inventory != null) {
        return inventory;
    }

    log.info(`[Halloween 2023] ${getUserLogString(user)} does not have Halloween inventory. Providing and setting default.`);
    return getDefaultHalloweenInventoryForId(user.id);
}