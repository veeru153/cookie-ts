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

const CANDY_EMOTES = ["🍬", "🍭", "🍫"];
const DROP_DURATION_SECONDS_MIN = 15;
const DROP_DURATION_SECONDS_MAX = 20;
const CANDY_DROP_MIN = 5;
const CANDY_DROP_MAX = 10;

const SPIRIT_EMOTES = ["👻", "🧟", "🧛", "👺", "👹"];
const SUMMON_DURATION_SECONDS_MIN = 15;
const SUMMON_DURATION_SECONDS_MAX = 20;
const CANDY_REQUEST_MIN = 2;
const CANDY_REQUEST_MAX = 6;

export const halloween = async () => {
    const guildId = Guilds.YUQICORD;
    const guild: Guild = await client.guilds.fetch(guildId);
    const channelId = isDevEnv ? Channels.Cookie.TESTING : Channels.Cookieland.GENERAL;
    const guildChannel = await guild.channels.fetch(channelId);

    if (!guildChannel.isTextBased()) {
        log.error("[Halloween 2023] Channel is not a text channel");
        throw new CookieException("Channel is not a text channel");
    }

    const channel = guildChannel as TextChannel;
}

const dropCandies = async () => {
    const guildId = Guilds.YUQICORD;
    const guild: Guild = await client.guilds.fetch(guildId);
    const channelId = isDevEnv ? Channels.Cookie.TESTING : Channels.Cookieland.GENERAL;
    const guildChannel = await guild.channels.fetch(channelId);

    if (!guildChannel.isTextBased()) {
        log.error("[Halloween 2023] Channel is not a text channel");
        throw new CookieException("Channel is not a text channel");
    }
    const channel = guildChannel as TextChannel;

    const emote = CANDY_EMOTES[getOneRandomlyFromArray(CANDY_EMOTES)];
    const dropDurationMs = getRandomNumberBetween(DROP_DURATION_SECONDS_MIN, DROP_DURATION_SECONDS_MAX) * 1000;
    const dropMessage = await channel.send(`${emote} **A mysterious bag of candies has appeared!**`);

    let alreadyCollectedUserIdList = [];
    const collectCommands = ["pick", "collect"];
    const filter = (message: Message) => collectCommands.includes(PREFIX + message.content);

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
            const reply = await message.reply("You have already collected candies from this bag!");
            reply.deletable && await reply.delete();
            message.deletable && await message.delete();
            return;
        }

        alreadyCollectedUserIdList.push(userId);

        const userHalloweenInventory = await getUserHalloweenInventory(user);
        const prevCandies = userHalloweenInventory.candies;
        const candyCount = getRandomNumberBetween(CANDY_DROP_MIN, CANDY_DROP_MAX);
        const totalCandies = prevCandies + candyCount;

        userHalloweenInventory.candies = totalCandies;
        await halloweenRepo.set(userId, userHalloweenInventory);

        await message.reply(`You collected ${candyCount} candies.\n**Total Candies: ${totalCandies}**`);
        log.info(`[Halloween 2023] ${getUserLogString(user)} collected ${candyCount}. Total Candies: ${totalCandies}`);
    } catch (err) {
        log.error(sendToLogChannel(`[Halloween 2023] ${getUserLogString(user)} could not collect candies.`));
        await message.reply("An error occurred!");
    }
}

const summonSpirit = async () => {
    const channel: TextChannel = null;

    const emote = SPIRIT_EMOTES[Math.floor(Math.random() * SPIRIT_EMOTES.length)];
    const summonDurationMs = getRandomNumberBetween(SUMMON_DURATION_SECONDS_MIN, SUMMON_DURATION_SECONDS_MAX) * 1000;
    const candiesRequested = getRandomNumberBetween(CANDY_REQUEST_MIN, CANDY_REQUEST_MAX);
    const summonMessage = await channel.send(`${emote} **A mysterious spirit has appeared!** They want **${candiesRequested}** candies.`);

    let alreadyInteractedUserIdList = [];
    const spiritCommands = ["trick", "treat"];
    const filter = (message: Message) => spiritCommands.includes(PREFIX + message.content);

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
            await handleTrick(message, userHalloweenInventory);
            log.info(`[Halloween 2023] ${getUserLogString(user)} tricked spirit. Latest inventory: ${userHalloweenInventory}`);
        } else if (action === "treat") {
            await handleTreat(message, candiesRequested, userHalloweenInventory);
            log.info(`[Halloween 2023] ${getUserLogString(user)} treated spirit. Latest inventory: ${userHalloweenInventory}`);
        }

        await halloweenRepo.set(userId, userHalloweenInventory);
    } catch (err) {
        log.error(sendToLogChannel(`[Halloween 2023] ${getUserLogString(user)} could not ${action} spirits.`));
        await message.reply("An error occurred!");
    }
}

const handleTrick = async (message: Message, userHalloweenInventory: HalloweenInventory) => {
    const appreciation = getRandomNumberBetween(-2, 3);
    let trickResponse = "😒 The spirit was not amused...";
    if (appreciation > 0) {
        trickResponse = `👏 The spirit was amused and has given you **${appreciation}** 🪙!`;
    }

    userHalloweenInventory.points += appreciation;
    userHalloweenInventory.coins += Math.max(0, appreciation);

    await message.reply(trickResponse);
}

const handleTreat = async (message: Message, candiesRequested: number, userHalloweenInventory: HalloweenInventory) => {
    const userCandies = userHalloweenInventory.candies;
    const userCoins = userHalloweenInventory.coins;

    if (userCandies < candiesRequested) {
        const sadEmotes = ["😭", "😖", "😦", "😢"];
        const emote = sadEmotes[Math.floor(Math.random() * sadEmotes.length)];
        await message.reply(`${emote} You don't have enough candies...`);
        return;
    }

    userHalloweenInventory.candies -= candiesRequested;
    userHalloweenInventory.coins += 1;
    userHalloweenInventory.points += 1;

    const treatResponse = `You exchanged ${candiesRequested} candies with the spirit for 1 🪙.\n`
        + `Total Candies: ${userCandies - candiesRequested}`
        + `Total Coins: ${userCoins + 1} 🪙`;
    await message.reply(treatResponse);
}

const getUserHalloweenInventory = async (user: User) => {
    const inventory = await halloweenRepo.get(user.id);
    if (inventory != null) {
        return inventory;
    }

    log.info(`[Halloween 2023] ${getUserLogString(user)} does not have Halloween inventory. Providing and setting default.`);
    return getDefaultHalloweenInventoryForId(user.id);
}