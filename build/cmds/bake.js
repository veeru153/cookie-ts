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
exports.bake = void 0;
const logger_1 = __importDefault(require("../util/logger"));
const collections_1 = __importDefault(require("../util/collections"));
const scope_1 = __importDefault(require("../util/scope"));
const _Command_1 = __importDefault(require("./_Command"));
exports.bake = new _Command_1.default({
    name: "bake",
    desc: "Bake Cookies 🍪",
    scope: [scope_1.default.ALL]
});
const HALF_DAY_IN_MS = 43200000;
const HOUR_IN_MS = 3600000;
const MINUTE_IN_MS = 60000;
const SECOND_IN_MS = 1000;
const MULTIPLIER = 1.5;
const GUARANTEE = 1;
exports.bake.run = (message, args) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = message.author.id;
        const userRank = collections_1.default.RANKS.doc(userId);
        const userInventory = collections_1.default.INVENTORY.doc(userId);
        const currTime = Date.now();
        if (!(yield userInventory.get()).exists) {
            const freshCookies = Math.floor((Math.random() + GUARANTEE) * MULTIPLIER);
            userInventory.set({
                cookies: freshCookies,
                lastBaked: currTime,
            });
            yield sendBakeSuccessMsg(message, freshCookies, freshCookies);
            return;
        }
        const cookies = (yield userInventory.get()).data().cookies;
        const lastBaked = (yield userInventory.get()).data().lastBaked;
        const timeDiff = currTime - lastBaked;
        if (timeDiff < HALF_DAY_IN_MS) {
            yield sendCooldownMsg(message, timeDiff, cookies);
            return;
        }
        const userLevel = (yield userRank.get()).data().level;
        const skew = Math.floor(Math.random() * (0.13 - 0.03 + 1) + 0.03);
        const bias = Math.min(0, Math.random() - skew);
        const freshCookies = Math.floor(((bias * userLevel) + GUARANTEE) * MULTIPLIER);
        userInventory.update({
            cookies: cookies + freshCookies,
            lastBaked: currTime,
        });
        yield sendBakeSuccessMsg(message, freshCookies, cookies + freshCookies);
    }
    catch (err) {
        logger_1.default.error(`[Bake] ${err}`);
    }
});
const sendBakeSuccessMsg = (message, freshCookies, cookies) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, discriminator, id } = message.author;
    logger_1.default.info(`[Bake] ${username}#${discriminator} (${id}) baked ${freshCookies} cookies. Total Cookies : ${cookies}`);
    const cookieStr = freshCookies == 1 ? "cookie" : "cookies";
    const msg = `**Cookies Baked!**\nYou baked ${freshCookies} ${cookieStr}.\n**🍪 Total Cookies: ${cookies}**`;
    message.reply(msg);
});
const sendCooldownMsg = (message, timeDiff, cookies) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, discriminator, id } = message.author;
    logger_1.default.info(`[Bake] User : ${username}#${discriminator} (${id}) is on cooldown`);
    const remainingMs = HALF_DAY_IN_MS - timeDiff;
    if (remainingMs < MINUTE_IN_MS) {
        const seconds = Math.floor((remainingMs / SECOND_IN_MS) % 60).toString().padStart(2, "0");
        const msg = `**Oven needs to cool down!**\nYou can bake more cookies in ${seconds} seconds.\n**🍪 Total Cookies: ${cookies}**`;
        message.reply(msg);
        return;
    }
    const hours = Math.floor(remainingMs / HOUR_IN_MS).toString().padStart(2, "0");
    const minutes = Math.floor((remainingMs % HOUR_IN_MS) / MINUTE_IN_MS).toString().padStart(2, "0");
    const msg = `**Oven needs to cool down!**\nYou can bake more 🍪 in ${hours} hours ${minutes} minutes.\n**🍪 Total Cookies: ${cookies}**`;
    message.reply(msg);
});
//# sourceMappingURL=bake.js.map