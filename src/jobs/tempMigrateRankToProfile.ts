import Scope from "../util/scope";
import Command from "../cmds/_Command";
import { Message } from "discord.js";
import { profileRepo, ranksRepo } from "../util/collections";
import logger from "../util/logger";


export const tempMigrateRanksToProfile = new Command({
    name: "tempMigrateRanksToProfile",
    desc: "Migrates current rank repo to profile",
    scope: [ Scope.OWNER ]
})

tempMigrateRanksToProfile.run = async (message: Message, args: string[]) => {
    try {
        const rankData = ranksRepo.data;
        for(let record of rankData) {
            record[1] = {
                ...record[1],
                bg: "I_LOVE_SPOILER",
                badge1: "SIGN_YUQI",
                badge2: "IDLE_BLOB",
            }
            await profileRepo.set(record[0], record[1]);
        }

        // await profileRepo.set("252748033287127041", data);
    
        message.reply("Migrated successfully!");
    } catch (err) {
        logger.error(err);
    }
}