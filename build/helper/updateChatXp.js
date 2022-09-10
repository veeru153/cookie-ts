"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = __importDefault(require("../util/logger"));
const channels_1 = __importDefault(require("../util/channels"));
const collections_1 = __importDefault(require("../util/collections"));
const MULTIPLIER = 5;
const GUARANTEE = 1 / MULTIPLIER;
const LEVEL_LIMIT = 20;
const IGNORED_CHANNELS = [
    channels_1.default.Kitchen.STAFF_BOT,
    channels_1.default.Cookieland.BOTLAND,
    channels_1.default.Cookie.TESTING,
    channels_1.default.Cookie.LOGS,
    channels_1.default.Cookie.EMOTES,
];
const updateChatXp = (message) => __awaiter(void 0, void 0, void 0, function* () {
    if (IGNORED_CHANNELS.includes(message.channel.id))
        return;
    const { username, discriminator, id } = message.author;
    try {
        const userRank = collections_1.default.RANKS.doc(id);
        // TODO: Work on chat xp formula
        if (!(yield userRank.get()).exists) {
            userRank.set({
                xp: Math.floor((Math.random() + GUARANTEE) * MULTIPLIER),
                level: 0,
            });
            return;
        }
        let userLevel = (yield userRank.get()).data().level;
        let userXp = (yield userRank.get()).data().xp;
        // TODO: chat xp formula
        let updatedXp = Math.floor((Math.random() + GUARANTEE) * MULTIPLIER) + userXp;
        if (updatedXp >= (userLevel + 1) * LEVEL_LIMIT) {
            updatedXp -= (userLevel - 1) * LEVEL_LIMIT;
            userLevel++;
            logger_1.default.info(`[Chat XP] ${username}#${discriminator} (${id}) advanced to Level ${userLevel}`);
            const msg = yield message.channel.send(`${message.author.toString()} **Level Up!**\nYou just advanced to Level ${userLevel}`);
        }
        userRank.update({
            xp: updatedXp,
            level: userLevel,
        });
    }
    catch (err) {
        logger_1.default.error(`[Chat XP] ${err}`);
    }
});
exports.default = updateChatXp;
//# sourceMappingURL=updateChatXp.js.map