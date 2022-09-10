"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const channels_1 = __importDefault(require("./channels"));
const log = (client, { title, user, desc }) => {
    const embed = new discord_js_1.EmbedBuilder();
    embed.setTitle(title);
    user && embed.setAuthor({ name: user.username, iconURL: user.avatarURL() });
    desc && embed.setDescription(desc);
    // TODO: Replace with actual logging system
    console.log(`LOG - [${user ? user.username : "Cookie"}] ${desc !== null && desc !== void 0 ? desc : ""}`);
    client.channels.fetch(channels_1.default.Cookie.LOGS)
        .then((channel) => channel.send({ embeds: [embed] }))
        .catch((err) => { throw new Error(err); });
};
exports.default = log;
//# sourceMappingURL=log.js.map