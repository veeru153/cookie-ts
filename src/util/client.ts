import { Client } from "discord.js";

import intents from "./intents";
import partials from "./partials";

const client = new Client({ intents: intents, partials: partials });

const TOKEN = process.env.NODE_ENV == "dev" ? process.env.DEV_TOKEN : process.env.TOKEN;
client.login(TOKEN);

export default client;