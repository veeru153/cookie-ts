import { Message } from "discord.js";
import client from "./utils/client";
import { env, identity, isDevEnv } from "./utils/constants";
import logger from "./utils/logger";
import * as repos from "./utils/repos";

client.on("ready", () => {
    console.log(`READY! Logged in as ${identity}.`);
    console.log(`- Environment: ${env}`);
    logger.info(`${identity} is online!`);
    // TODO: Event Service
    // EventService.triggerEvent();
    for (let repo of Object.values(repos)) {
        repo.initialize();
    }
})

isDevEnv && client.on("error", console.log);
isDevEnv && client.on("debug", console.log);

client.on("messageCreate", async (message: Message) => { messageCreate(message) });