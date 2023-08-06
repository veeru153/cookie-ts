import { Client } from "discord.js";
import { intents } from "./intents";
import { partials } from "./partials";
import { isDevEnv } from "./constants/common";

const client = new Client({ intents: intents, partials: partials });

const TOKEN = isDevEnv ? process.env.DEV_TOKEN : process.env.TOKEN;
client.login(TOKEN);

export default client;