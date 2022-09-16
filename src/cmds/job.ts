import { Message } from "discord.js";
import Scope from "../util/scope";
import Command from "./_Command";
import * as jobs from "../jobs";
import logger from "../util/logger";
import Channels from "../util/channels";
import { getUserLogString } from "../helpers";

export const job = new Command({
    name: "job",
    desc: "Handle Server Jobs",
    scope: [ Scope.STAFF ]
})

const ALLOWED_CHANNELS = Object.values(Channels.Kitchen) as string[];

job.run = async (message: Message, args: string[]) => {
    const job = args[0];

    if(!ALLOWED_CHANNELS.includes(message.channel.id)) {
        logger.info(`[Job] User : ${getUserLogString(message.author)} tried running '${job}' outside allowed channels`);
        return;
    }

    args.shift();
    if(Object.keys(jobs).includes(job)) {
        logger.info(`[Job] '${job}' ran by User : ${getUserLogString(message.author)}`);

        try {
            message.reply(`Running Job: \`${job}\``);
            await (jobs[job])._invoke(message, args);
            logger.info(`[Job] '${job}' ran successfully`);
        } catch (err) {
            logger.error(`[Job] Error while running '${job}' : ${err}`);
        } 
    }
}
