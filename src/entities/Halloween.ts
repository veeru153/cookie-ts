import { Message, TextChannel } from "discord.js";
import client from "../util/client";
import Channels from "../util/channels";
import isDevEnv from "../util/isDevEnv";
import { getUserLogString, randomNumIn } from "../helpers";
import { PREFIX } from "../util/config";
import logger from "../util/logger";
import { EVENTS } from "../util/collections_legacy";

class _Halloween {
    status: boolean;
    START_DATE_MS: Date;
    END_DATE_MS: Date;
    eventCollection: FirebaseFirestore.CollectionReference;
    eventDataRef: FirebaseFirestore.DocumentReference;
    eventData: FirebaseFirestore.DocumentData;

    constructor() {
        this.START_DATE_MS = new Date('2022-10-01T00:00:00.000+09:00'); 
        this.END_DATE_MS = new Date('2022-10-31T23:59:59.000+09:00');

        EVENTS.doc("HALLOWEEN_2022").get().then((snapshot) => {
            this.eventDataRef = snapshot.ref;
            this.eventData = snapshot.data();
        })
    }

    __eventIsLive = (status?: boolean) => {
        this.status = Date.now() >= this.START_DATE_MS.getTime() && Date.now() <= this.END_DATE_MS.getTime();

        if(status != null) this.status = status;
        return this.status;
    }

    __initUser = async (id: string) => {
        if(this.eventData[id]) return;
        await this.eventDataRef.update({
            [`${id}`]: {
                candies: 0,
                coins: 0,
                points: 0
            }
        })

        this.eventData = (await this.eventDataRef.get()).data();
    }

    dropCandies = async () => {
        const candyEmotes = ["🍬","🍭","🍫"];
        const emote = candyEmotes[Math.floor(Math.random() * candyEmotes.length)];
        const CHANNEL_ID = isDevEnv() ? Channels.Cookie.TESTING : Channels.Cookieland.GENERAL;
        const DROP_START_MSG = `${emote} **A mysterious bag of candies has appeared!**`;
        const DROP_TIMEOUT_MS = randomNumIn(15, 20) * 1000;
        const COLLECT_CMDS = ['pick', 'collect'].map(c => PREFIX + c);

        const channel = await client.channels.fetch(CHANNEL_ID) as TextChannel;
        const dropStartMsg = await channel.send(DROP_START_MSG);

        const FILTER = (m: Message) => COLLECT_CMDS.includes(m.content);
        const collector = channel.createMessageCollector({ filter: FILTER, time: DROP_TIMEOUT_MS });
        setTimeout(async () => {
            await dropStartMsg.delete();
        }, DROP_TIMEOUT_MS);

        const alreadyInteracted = [];

        collector.on('collect', async (message: Message) => {
            await this.__initUser(message.author.id);
            if(alreadyInteracted.includes(message.author.id)) {
                const replyMsg = await message.reply("You have already collected candies from this bag!");
                setTimeout(async () => {
                    if(replyMsg && replyMsg.deletable) await replyMsg.delete();
                    if(message && message.deletable) await message.delete();
                }, 5000)
                return;
            }
            alreadyInteracted.push(message.author.id);
            await this.__handleCandyCollection(message);
        });

        collector.on('end', async () => {
            alreadyInteracted.length = 0;
        })
    }

    __handleCandyCollection = async (message: Message) => {        
        try {
            const CANDY_COUNT = randomNumIn(5, 10);
            const userData = this.eventData[message.author.id];
            const prevCandies = userData.candies;

            userData.candies = prevCandies + CANDY_COUNT;


            await this.eventDataRef.update({
                [`${message.author.id}.candies`]: prevCandies + CANDY_COUNT
            })

            const replyMsg = await message.reply(`You collected ${CANDY_COUNT} candies.\n**Total Candies : ${prevCandies + CANDY_COUNT}**`);
            logger.info(`[Halloween Event] User : ${getUserLogString(message.author)} collected ${CANDY_COUNT} candies. Total Candies : ${prevCandies + CANDY_COUNT}`);

            setTimeout(async () => {
                if(replyMsg && replyMsg.deletable) await replyMsg.delete();
                if(message && message.deletable) await message.delete();
            }, 5000);

        } catch (err) {
            logger.error(`[Halloween] User : ${getUserLogString(message.author)} could not collect candies - ${err}`);
        }
    }

    summon = async () => {
        const candiesRequested = randomNumIn(2, 6);
        const spiritEmotes = ["👻","🧟","🧛","👺","👹"];
        const emote = spiritEmotes[Math.floor(Math.random() * spiritEmotes.length)];

        const CHANNEL_ID = isDevEnv() ? Channels.Cookie.TESTING : Channels.Cookieland.GENERAL;
        const SUMMON_START_MSG = `${emote} **A mysterious spirit has appeared!** They want **${candiesRequested}** candies.`;
        const SUMMON_TIMEOUT_MS = randomNumIn(15, 20) * 1000;
        const SUMMON_CMDS = ['trick', 'treat'].map(c => PREFIX + c);

        const channel = await client.channels.fetch(CHANNEL_ID) as TextChannel;
        const summonStartMsg = await channel.send(SUMMON_START_MSG);

        const FILTER = (m: Message) => SUMMON_CMDS.includes(m.content);
        const collector = channel.createMessageCollector({ filter: FILTER, time: SUMMON_TIMEOUT_MS });
        setTimeout(async () => {
            await summonStartMsg.delete();
        }, SUMMON_TIMEOUT_MS);

        const alreadyInteracted = [];

        collector.on('collect', async (message: Message) => {
            await this.__initUser(message.author.id);
            if(alreadyInteracted.includes(message.author.id)) {
                const replyMsg = await message.reply("You already interacted with the spirit!");
                setTimeout(async () => {
                    if(replyMsg && replyMsg.deletable) await replyMsg.delete();
                    if(message && message.deletable) await message.delete();
                }, 5000);
                return;
            } 

            alreadyInteracted.push(message.author.id);
            const choice = message.content.slice(PREFIX.length);
            if(choice == "trick") await this.__trick(message);
            if(choice == "treat") await this.__treat(message, candiesRequested);
        });

        collector.on('end', async () => {
            alreadyInteracted.length = 0;
        })
    }

    __trick = async (message: Message) => {
        try {
            const RNG_POINTS = randomNumIn(-2, 3);
            const REPLY_MSGS = {
                NEGATIVE: `😒 The spirit was not amused.`,
                POSITIVE: `👏 The spirit was amused and has given you **${RNG_POINTS}** coins.`,
            }
    
            const userData = this.eventData[message.author.id];
            const { coins: prevCoins, points: prevPoints } = userData;
            let replyMsg: Message;
    
            await this.eventDataRef.update({
                [`${message.author.id}.points`]: prevPoints + RNG_POINTS,
                [`${message.author.id}.coins`]: prevCoins + Math.max(0, RNG_POINTS)
            })
    
            if(RNG_POINTS <= 0) 
                replyMsg = await message.reply(REPLY_MSGS.NEGATIVE);
            else
                replyMsg = await message.reply(REPLY_MSGS.POSITIVE);
    
            setTimeout(async () => replyMsg.delete(), 7500);
        } catch (err) {
            logger.error(`[Halloween] User : ${getUserLogString(message.author)} could not trick spirit - ${err}`);
        }
    }

    __treat = async (message: Message, candiesRequested: number) => {
        try {
            const userData = this.eventData[message.author.id];
            const { candies: prevCandies, coins: prevCoins, points: prevPoints } = userData;
            const userHasEnoughCandies = prevCandies >= candiesRequested;
    
            if(userHasEnoughCandies) {
                await this.eventDataRef.update({
                    [`${message.author.id}.candies`]: prevCandies - candiesRequested,
                    [`${message.author.id}.coins`]: prevCoins + 1,
                    [`${message.author.id}.points`]: prevPoints + 1,
                })
    
                const replyMsg = await message.reply(`You exchanged ${candiesRequested} candies with the spirit for 1 coin.\nTotal Candies: ${prevCandies - candiesRequested}\nTotal Coins: ${prevCoins + 1}`);
    
                setTimeout(async () => {
                    if(replyMsg && replyMsg.deletable) await replyMsg.delete()
                }, 7500);
                return;
            }
    
            const sadEmotes = ["😭","😖","😦","😢"];
            const emote = sadEmotes[Math.floor(Math.random() * sadEmotes.length)];
            const replyMsg = await message.reply(`${emote} You don't have enough candies...`);
            setTimeout(async () => {
                if(replyMsg && replyMsg.deletable) await replyMsg.delete();
                if(message && message.deletable) await message.delete();
            }, 7500);
        } catch (err) {
            logger.error(`[Halloween] User : ${getUserLogString(message.author)} could not treat spirit - ${err}`);

        }
    }
}

const Halloween = new _Halloween();
export default Halloween;