import { Message } from "discord.js";
import { Command } from "../entities/Command";
import { Channels } from "../utils/enums/Channels";
import Scope from "../utils/enums/Scope";
import { getUserLogString } from "../helpers/getUserLogString";
import logger from "../utils/logger";
import * as jobs from "../jobs";

const ALLOWED_CHANNELS = [
    ...Object.values(Channels.Kitchen) as string[],
    ...Object.values(Channels.Cookie) as string[],
];

const runJob = async (message: Message, args: string[]) => {
    if (args.length === 0) {
        await message.reply("Insuffcient Arguments! Missing `JOB_NAME`");
        return;
    }

    const job = args[0];

    if (!ALLOWED_CHANNELS.includes(message.channel.id)) {
        logger.info(`[Job] User : ${getUserLogString(message.author)} tried running '${job}' outside allowed channels`);
        return;
    }

    // only keep job related args in list
    args.shift()

    if (Object.keys(jobs).includes(job)) {
        logger.info(`[Job] '${job}' ran by User : ${getUserLogString(message.author)}`);
        try {
            console.log(job);
            const msg = await message.channel.send(`Running Job: \`${job}\``);
            await (jobs[job] as Command).run(message, args);
            msg.deletable && msg.delete();
            await message.reply(`Job \`${job}\` - Complete`);
            logger.info(`[Job] '${job}' ran successfully`);
        } catch (err) {
            await message.reply(`Job \`${job}\` - Failed`)
            logger.error(`[Job] Error while running '${job}' : ${err}`);
        }
    } else {
        await message.reply(`Job \`${job}\` - Not Found`)
        logger.info(`[Job] '${job}' not found`);
    }
}


export const job = new Command({
    name: "job",
    desc: "Handle Server Jobs",
    scope: [Scope.STAFF],
    fn: runJob
})