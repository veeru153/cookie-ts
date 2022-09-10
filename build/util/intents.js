"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const intents = new discord_js_1.IntentsBitField();
intents.add(discord_js_1.IntentsBitField.Flags.Guilds, discord_js_1.IntentsBitField.Flags.GuildMembers, discord_js_1.IntentsBitField.Flags.GuildBans, discord_js_1.IntentsBitField.Flags.GuildEmojisAndStickers, discord_js_1.IntentsBitField.Flags.GuildWebhooks, discord_js_1.IntentsBitField.Flags.GuildMessages, discord_js_1.IntentsBitField.Flags.GuildMessageReactions, discord_js_1.IntentsBitField.Flags.DirectMessages, discord_js_1.IntentsBitField.Flags.DirectMessageReactions, discord_js_1.IntentsBitField.Flags.MessageContent);
exports.default = intents;
//# sourceMappingURL=intents.js.map