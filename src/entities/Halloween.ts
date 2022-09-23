import { CollectorFilter, Message, TextChannel } from "discord.js";
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

    constructor() {
        this.START_DATE_MS = new Date('2022-10-01T00:00:00.000+09:00'); 
        this.END_DATE_MS = new Date('2022-10-31T23:59:59.000Z');
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
            const userInventory = collections.INVENTORY.doc(message.author.id);
            const userInventoryData = await userInventory.get();

            const prevCandies = userInventoryData.data().eventTokens ?? 0;
            await userInventory.update({
                eventTokens: prevCandies + CANDY_COUNT,
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
        const CHANNEL_ID = isDevEnv() ? Channels.Cookie.TESTING : Channels.Cookieland.GENERAL;
        const SUMMON_START_MSG = "**A mysterious spirit has appeared!**";
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
            if(choice == "trick") this.__trick();
            if(choice == "treat") this.__treat();
        });
    }

    __trick = () => {
        
    }

    __treat = () => {

    }
}

const Halloween = new _Halloween();
export default Halloween;