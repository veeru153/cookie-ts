import { Message, TextChannel } from "discord.js";
import client from "../util/client";
import Channels from "../util/channels";
import isDevEnv from "../util/isDevEnv";
import { getUserLogString, randomNumIn } from "../helpers";
import { PREFIX } from "../util/config";
import logger from "../util/logger";
import collections from "../util/collections";

class _Halloween {
    status: boolean;
    START_DATE_MS: Date;
    END_DATE_MS: Date;
    eventCollection: FirebaseFirestore.CollectionReference;
    eventDataRef: FirebaseFirestore.DocumentReference;
    eventData: FirebaseFirestore.DocumentData;

    constructor() {
        this.START_DATE_MS = new Date('2022-10-01T00:00:00.000+09:00'); 
        this.END_DATE_MS = new Date('2022-10-31T23:59:59.000Z');

        collections.EVENTS.doc("HALLOWEEN_2022").onSnapshot(async (snapshot) => {
            this.eventDataRef = snapshot.ref;
            this.eventData = snapshot;
        })
    }

    __eventIsLive = (status?: boolean) => {
        this.status = Date.now() >= this.START_DATE_MS.getTime() && Date.now() <= this.END_DATE_MS.getTime();

        if(status != null) this.status = status;
        return this.status;
    }

    dropCandies = async () => {
        const CHANNEL_ID = isDevEnv() ? Channels.Cookie.TESTING : Channels.Cookieland.GENERAL;
        const DROP_START_MSG = "**A mysterious bag of candies has appeared!**";
        const DROP_TIMEOUT_MS = randomNumIn(15, 20) * 1000;
        const COLLECT_CMDS = ['pick', 'collect'].map(c => PREFIX + c);

        const channel = await client.channels.fetch(CHANNEL_ID) as TextChannel;
        const dropStartMsg = await channel.send(DROP_START_MSG);

        const FILTER = (m: Message) => COLLECT_CMDS.includes(m.content);
        const collector = channel.createMessageCollector({ filter: FILTER, time: DROP_TIMEOUT_MS });
        setTimeout(async () => {
            await dropStartMsg.delete();
        }, DROP_TIMEOUT_MS);

        collector.on('collect', async (message: Message) => {
            this.__handleCandyCollection(message);
        });
    }

    __handleCandyCollection = async (message: Message) => {
        const CANDY_COUNT = randomNumIn(5, 10);

        try {
            const userData = this.eventData[message.author.id];
            const prevCandies = userData.candies;

            userData.candies = prevCandies + CANDY_COUNT;


            await this.eventDataRef.update({
                [`${message.author.id}.candies`]: prevCandies + CANDY_COUNT
            })

            const replyMsg = await message.reply(`You collected ${CANDY_COUNT} candies.\n**Total Candies : ${prevCandies + CANDY_COUNT}`);
            logger.info(`[Halloween Event] User : ${getUserLogString(message.author)} collected ${CANDY_COUNT} candies. Total Candies : ${prevCandies + CANDY_COUNT}`);

            setTimeout(async () => {
                await replyMsg.delete();
                await message.delete();
            }, 5000);

        } catch (err) {
            logger.error(`[Halloween] User : ${getUserLogString(message.author)} could not collect candies. Check console.`);
        }
    }

    summon = async () => {
        const candiesRequested = randomNumIn(2, 6);

        const CHANNEL_ID = isDevEnv() ? Channels.Cookie.TESTING : Channels.Cookieland.GENERAL;
        const SUMMON_START_MSG = `**A mysterious spirit has appeared!** They want **${candiesRequested}** candies.`;
        const SUMMON_TIMEOUT_MS = randomNumIn(15, 20) * 1000;
        const SUMMON_CMDS = ['trick', 'treat'].map(c => PREFIX + c);

        const channel = await client.channels.fetch(CHANNEL_ID) as TextChannel;
        const summonStartMsg = await channel.send(SUMMON_START_MSG);

        const FILTER = (m: Message) => SUMMON_CMDS.includes(m.content);
        const collector = channel.createMessageCollector({ filter: FILTER, time: SUMMON_TIMEOUT_MS });
        setTimeout(async () => {
            await summonStartMsg.delete();
        }, SUMMON_TIMEOUT_MS);

        collector.on('collect', async (message: Message) => {
            const choice = message.content.slice(PREFIX.length);
            if(choice == "trick") await this.__trick(message);
            if(choice == "treat") await this.__treat(message, candiesRequested);
        });
    }

    __trick = async (message: Message) => {
        const rngPoints = randomNumIn(-2, 3);

        const REPLY_MSGS = {
            NEGATIVE: `😒 The spirit was not amused.`,
            POSITIVE: `👏 The spirit was amused and has given you ${rngPoints} coins.`,
        }

        const userData = this.eventData[message.author.id];
        const { coins: prevCoins, points: prevPoints } = userData;
        let replyMsg: Message;

        await this.eventDataRef.update({
            [`${message.author.id}.points`]: prevPoints + rngPoints,
            [`${message.author.id}.coins`]: prevCoins + Math.max(0, rngPoints)
        })

        if(rngPoints <= 0) 
            replyMsg = await message.reply(REPLY_MSGS.NEGATIVE);
        else
            replyMsg = await message.reply(REPLY_MSGS.POSITIVE);

        setTimeout(() => replyMsg.delete(), 7500);
    }

    __treat = async (message: Message, candiesRequested: number) => {
        const userData = this.eventData[message.author.id];
        const { candies: prevCandies, coins: prevCoins, points: prevPoints } = userData;
        const userHasEnoughCandies = prevCandies >= candiesRequested;

        if(userHasEnoughCandies) {
            await this.eventDataRef.update({
                [`${message.author.id}.candies`]: prevCandies - candiesRequested,
                [`${message.author.id}.coins`]: prevCoins + 1,
                [`${message.author.id}.points`]: prevPoints + 1,
            })

            const replyMsg = await message.reply(`**Treat!**\nYou exchanged ${candiesRequested} candies with the spirit for 1 coin.\nTotal Candies: ${prevCandies - candiesRequested}\nTotal Coins: ${prevCoins + 1}`);

            setTimeout(() => replyMsg.delete(), 7500);
            return;
        }

        const replyMsg = await message.reply("You don't have enough candies T-T");
        setTimeout(() => replyMsg.delete(), 7500);
    }
}

const Halloween = new _Halloween();
export default Halloween;