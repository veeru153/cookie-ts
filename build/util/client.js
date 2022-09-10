"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const intents_1 = __importDefault(require("./intents"));
const partials_1 = __importDefault(require("./partials"));
const client = new discord_js_1.Client({ intents: intents_1.default, partials: partials_1.default });
const TOKEN = process.env.NODE_ENV == "dev" ? process.env.DEV_TOKEN : process.env.TOKEN;
client.login(TOKEN);
exports.default = client;
//# sourceMappingURL=client.js.map