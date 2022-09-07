import { Client, GuildEmoji, Message } from "discord.js";
import intents from "./util/intents";
import partials from "./util/partials";
import { messageCreate, messageDelete, messageUpdate } from "./eventHandlers/messageHandlers";
import * as cmds from "./cmds";
import { emojiHandler } from "./eventHandlers/emojiHandlers";

const client = new Client({ intents: intents, partials: partials });

client.on("ready", () => {
    const env = process.env.NODE_ENV == "dev" ? "Development" : "Production";
    const identity = process.env.NODE_ENV == "dev" ? "Cookie Dough" : "Cookie";
    console.log(`READY! Logged in as ${identity}.`);
    console.log(`- Environment: ${env}`);
    // console.log(Object.entries(cmds))
})

client.on("error", console.log);
client.on("debug", console.log);
client.on("messageCreate", async (message: Message) => { messageCreate(client, message) });
client.on("messageDelete", async (message: Message) => { messageDelete(client, message) });
client.on("messageUpdate", async (message: Message) => { messageUpdate(client, message) });
client.on("emojiCreate", async (emoji: GuildEmoji) => { emojiHandler(client, emoji) });
client.on("emojiDelete", async (emoji: GuildEmoji) => { emojiHandler(client, emoji) });
client.on("emojiUpdate", async (_: GuildEmoji, newEmoji: GuildEmoji) => { emojiHandler(client, newEmoji) });

const TOKEN = process.env.NODE_ENV == "dev" ? process.env.DEV_TOKEN : process.env.TOKEN;
client.login(TOKEN);