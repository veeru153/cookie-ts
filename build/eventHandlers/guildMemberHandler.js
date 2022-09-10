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
exports.guildMemberAddHandler = void 0;
const client_1 = __importDefault(require("../util/client"));
const channels_1 = __importDefault(require("../util/channels"));
const helper_1 = require("../helper");
const isDevEnv_1 = __importDefault(require("../util/isDevEnv"));
const guildMemberAddHandler = (member) => __awaiter(void 0, void 0, void 0, function* () {
    const greeting = `**Welcome to Yuqi's Cookie House :cookie: ${member.toString()}!**\nRules and other information is available in ${(0, helper_1.mentionChannelWithId)(channels_1.default.Reception.INFO)}.\nGrab your roles from ${(0, helper_1.mentionChannelWithId)(channels_1.default.Reception.ROLES)} and ask staff if you need anything!`;
    const channelId = (0, isDevEnv_1.default)() ? channels_1.default.Cookie.TESTING : channels_1.default.Cookieland.GENERAL;
    const channel = yield client_1.default.channels.fetch(channelId);
    channel.send(greeting);
});
exports.guildMemberAddHandler = guildMemberAddHandler;
//# sourceMappingURL=guildMemberHandler.js.map