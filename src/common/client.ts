import { Client } from "discord.js";
import { intents } from "./intents";
import { partials } from "./partials";
import { TOKEN, isDevEnv } from "./constants/common";

const client = new Client({ intents: intents, partials: partials });
client.login(TOKEN);

export default client;