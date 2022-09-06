import { Client } from "discord.js";
import intents from "./util/intents";
import partials from "./util/partials";
import { messageCreate } from "./eventHandlers/messageHandlers";
import * as cmds from "./cmds";

const client = new Client({ intents: intents, partials: partials });

client.on("ready", () => {
    const env = process.env.NODE_ENV == "dev" ? "Development" : "Production";
    const identity = process.env.NODE_ENV == "dev" ? "Cookie Dough" : "Cookie Bot";
    console.log(`READY! Logged in as ${identity}.`);
    console.log(`- Environment: ${env}`);
    // console.log(Object.entries(cmds))
})

client.on("error", console.log);
client.on("messageCreate", async (message) => { messageCreate(client, message) });

const TOKEN = process.env.NODE_ENV == "dev" ? process.env.DEV_TOKEN : process.env.TOKEN;
client.login(TOKEN);