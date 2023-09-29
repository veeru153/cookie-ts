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
import { getUserHalloweenInventory } from "../../utils/getUserHalloweenInventory"

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

const MAX_MESSAGES_COLLECTED = 1;

let TRIGGER_INTERVAL: NodeJS.Timeout = null;
let END_TRIGGER_INTERVAL: NodeJS.Timeout = null;
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
    if (Date.now() > END_DATE.getTime()) {
        log.info("[Halloween 2023] Not setting Trigger - Event has already ended");
        return;
    }

    if (TRIGGER_INTERVAL != null || IS_LIVE) {
        log.info("[Halloween 2023] Not setting Trigger - Trigger Interval already present or event is already live");
        return;
    }

    log.info("[Halloween 2023] Trigger set for %s", START_DATE.toTimeString())
    TRIGGER_INTERVAL = setInterval(async () => {
        const currDate = Date.now();
        if (currDate >= START_DATE.getTime() && currDate <= END_DATE.getTime()) {
            log.info(sendToLogChannel("[Halloween 2023] Triggering event..."));
            clearInterval(TRIGGER_INTERVAL);
            END_TRIGGER_INTERVAL = setInterval(endTriggerWrapper, 1000);
            await startHalloween();
        }
    }, 1000)
}

const endTriggerWrapper = () => {
    if (Date.now() <= END_DATE.getTime()) {
        return;
    }

    log.info("[Halloween 2023] Ending event...");
    endHalloween();
    clearInterval(END_TRIGGER_INTERVAL);
    END_TRIGGER_INTERVAL = null;
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
    const channelId = isDevEnv ? Channels.Kitchen.HALLOWEEN_TEST : Channels.Cookieland.GENERAL;
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
    const dropMessageString = `${emote} **A mysterious bag of candies has appeared!**\n`
        + "Use `-pick` or `-collect` to collect candies from this bag.";
    const dropMessage = await channel.send(dropMessageString);

    let alreadyCollectedUserIdList = [];
    const collectCommands = ["pick", "collect"];
    const filter = (message: Message) => collectCommands.includes(message.content.substring(PREFIX.length));

    const collector = channel.createMessageCollector({ filter, time: dropDurationMs, max: MAX_MESSAGES_COLLECTED });
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

        await message.reply(`**You collected ${candyCount} candies.**\nTotal Candies: ${totalCandies}`);
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
    const summonMessageString = `${emote} **A mysterious spirit has appeared!**\n`
        + `They want **${candiesRequested}** candies.\n`
        + "Use `-trick` to trick the spirit. You much have sufficient candies to trick.\n"
        + "User `-treat` to treat the spirit.";
    const summonMessage = await channel.send(summonMessageString);

    let alreadyInteractedUserIdList = [];
    const spiritCommands = ["trick", "treat"];
    const filter = (message: Message) => spiritCommands.includes(message.content.substring(PREFIX.length));

    const collector = channel.createMessageCollector({ filter, time: summonDurationMs, max: MAX_MESSAGES_COLLECTED });
    collector.on('collect', async (message: Message) => {
        await handleSpiritInteraction(message, candiesRequested, alreadyInteractedUserIdList);
    })

    collector.on('end', async () => {
        if (alreadyInteractedUserIdList.length > 0) {
            summonMessage.editable && await summonMessage.edit("**The spirit has left.**");
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

        alreadyInteractedUserIdList.push(userId);
        const userHalloweenInventory = await getUserHalloweenInventory(user);

        if (action === "trick") {
            await handleTrick(message, candiesRequested, userHalloweenInventory);
            log.info(`[Halloween 2023] ${getUserLogString(user)} tricked spirit. Latest inventory: ${JSON.stringify(userHalloweenInventory)}`);
        } else if (action === "treat") {
            await handleTreat(message, candiesRequested, userHalloweenInventory);
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

    const candyThresholdForTrick = Math.ceil(candiesRequested / 5) * 10;
    if (userHalloweenInventory.candies < candyThresholdForTrick) {
        trickResponse = "**😜 The spirit does not interact with the less sweet...**";
    } else if (appreciation > 0) {
        const coinsReceived = 2 * Math.ceil(candiesRequested / 5);
        trickResponse = `**👏 The spirit was amused and has given you ${coinsReceived} 🪙!**`;
        userHalloweenInventory.coins += coinsReceived;
        userHalloweenInventory.points += coinsReceived;
    } else {
        trickResponse = "**😒 The spirit was not amused...**";
        const currCandies = userHalloweenInventory.candies;
        userHalloweenInventory.candies = Math.max(0, currCandies - (2 * candiesRequested));
    }

    trickResponse += `\nTotal Candies: ${userHalloweenInventory.candies}`;
    trickResponse += `\nTotal Coins: ${userHalloweenInventory.coins} 🪙`;
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
    userHalloweenInventory.points += coinsReceived;

    const treatResponse = `**You exchanged ${candiesRequested} candies with the spirit for ${coinsReceived} 🪙.**\n`
        + `Total Candies: ${userCandies - candiesRequested}\n`
        + `Total Coins: ${userCoins + coinsReceived} 🪙`;
    await message.reply(treatResponse);
    return true;
}