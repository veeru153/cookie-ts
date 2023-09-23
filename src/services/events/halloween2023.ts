import { Channels } from "../../common/enums/Channels"
import client from "../../common/client"
import { getOneRandomlyFromArray, getRandomNumberBetween } from "../../utils/randomUtils"
import { Guild, Message, TextChannel } from "discord.js"
import { Guilds } from "../../common/enums/Guilds"
import { log } from "../../common/logger"
import { CookieException } from "../../common/CookieException"
import { PREFIX } from "../../common/constants/common"
import { getUserLogString } from "../../utils/getUserLogString"

export const halloween2023 = () => {

}

const dropCandies = async () => {
    const guildId = Guilds.YUQICORD;
    const guild: Guild = await client.guilds.fetch(guildId);
    const channelId = Channels.Cookieland.GENERAL;
    const guildChannel = await guild.channels.fetch(channelId);

    if (!guildChannel.isTextBased()) {
        log.error("[Halloween 2023] Channel is not a text channel");
        throw new CookieException("Channel is not a text channel");
    }
    const channel = guildChannel as TextChannel;

    const candyEmotes = ["🍬", "🍭", "🍫"];
    const emote = candyEmotes[getOneRandomlyFromArray(candyEmotes)];
    const dropDurationMs = getRandomNumberBetween(15, 20) * 1000;
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

    if (alreadyCollectedUserIdList.includes(userId)) {
        const reply = await message.reply("You have already collected candies from this bag!");
        reply.deletable && await reply.delete();
        message.deletable && await message.delete();
        return;
    }

    alreadyCollectedUserIdList.push(userId);

    const candyCount = getRandomNumberBetween(5, 10);
    // const prevCandies = ...;
    const totalCandies = 0; // prevCandies + candyCount;

    // add random number of candies to user's event inventory after repo set up
    // reply to message with number of candies

    await message.reply(`You collected ${candyCount} candies.\n**Total Candies: ${totalCandies}**`);
    log.info(`[Halloween 2023] ${getUserLogString(user)} collected ${candyCount}. Total Candies: ${totalCandies}`);
}