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
exports.updateEmotes = void 0;
const client_1 = __importDefault(require("../util/client"));
const scope_1 = __importDefault(require("../util/scope"));
const _Command_1 = __importDefault(require("../cmds/_Command"));
const channels_1 = __importDefault(require("../util/channels"));
const constants_1 = require("../util/constants");
const log_1 = __importDefault(require("../util/log"));
exports.updateEmotes = new _Command_1.default({
    name: "updateEmotes",
    desc: "Force Update Emotes in #emotes",
    scope: [scope_1.default.STAFF]
});
exports.updateEmotes.run = (message, args) => __awaiter(void 0, void 0, void 0, function* () {
    // TODO: Update channel reference when channel is public
    let channel = yield client_1.default.channels.resolve(channels_1.default.Cookie.EMOTES).fetch();
    if (!channel.isTextBased())
        throw new Error(constants_1.Errors.CHANNEL_TYPE_NOT_TEXT);
    channel = channel;
    yield clearChannel(channel);
    const emotes = yield getEmotes();
    sendEmotes(channel, emotes);
    const animatedEmotes = yield getEmotes(true);
    sendEmotes(channel, animatedEmotes);
    (0, log_1.default)(client_1.default, {
        title: "[Job] Update Emotes",
        user: message ? message.author : client_1.default.user
    });
});
const clearChannel = (channel) => __awaiter(void 0, void 0, void 0, function* () {
    const msgs = yield channel.messages.fetch();
    yield channel.bulkDelete(msgs);
});
const getEmotes = (animated = false) => __awaiter(void 0, void 0, void 0, function* () {
    const emotes = [];
    const guild = client_1.default.guilds.cache.get(constants_1.Guilds.YUQICORD);
    guild.emojis.cache.forEach((e) => {
        if (animated)
            return e.animated && emotes.push(e.toString());
        return !e.animated && emotes.push(e.toString());
    });
    return emotes;
});
const sendEmotes = (channel, emoteArr) => {
    const threshold = 6;
    while (emoteArr.length > 0) {
        const end = Math.min(emoteArr.length, threshold);
        const consumed = emoteArr.splice(0, end);
        channel.send(consumed.join("  "));
    }
};
//# sourceMappingURL=updateEmotes.js.map