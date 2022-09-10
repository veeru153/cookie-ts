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
const messageHandlers_1 = require("./eventHandlers/messageHandlers");
const emojiHandlers_1 = require("./eventHandlers/emojiHandlers");
const guildMemberHandler_1 = require("./eventHandlers/guildMemberHandler");
const messageReactionHandlers_1 = require("./eventHandlers/messageReactionHandlers");
const isDevEnv_1 = __importDefault(require("./util/isDevEnv"));
const client_1 = __importDefault(require("./util/client"));
client_1.default.on("ready", () => {
    const env = process.env.NODE_ENV == "dev" ? "Development" : "Production";
    const identity = process.env.NODE_ENV == "dev" ? "Cookie Dough" : "Cookie";
    console.log(`READY! Logged in as ${identity}.`);
    console.log(`- Environment: ${env}`);
});
(0, isDevEnv_1.default)() && client_1.default.on("error", console.log);
(0, isDevEnv_1.default)() && client_1.default.on("debug", console.log);
client_1.default.on("messageCreate", (message) => __awaiter(void 0, void 0, void 0, function* () { (0, messageHandlers_1.messageCreate)(message); }));
client_1.default.on("messageDelete", (message) => __awaiter(void 0, void 0, void 0, function* () { (0, messageHandlers_1.messageDelete)(message); }));
client_1.default.on("messageUpdate", (message) => __awaiter(void 0, void 0, void 0, function* () { (0, messageHandlers_1.messageUpdate)(message); }));
client_1.default.on("emojiCreate", (emoji) => __awaiter(void 0, void 0, void 0, function* () { (0, emojiHandlers_1.emojiHandler)(emoji, emojiHandlers_1.Action.ADD); }));
client_1.default.on("emojiDelete", (emoji) => __awaiter(void 0, void 0, void 0, function* () { (0, emojiHandlers_1.emojiHandler)(emoji, emojiHandlers_1.Action.REMOVE); }));
client_1.default.on("emojiUpdate", (_, newEmoji) => __awaiter(void 0, void 0, void 0, function* () {
    (0, emojiHandlers_1.emojiHandler)(newEmoji, emojiHandlers_1.Action.UPDATE);
}));
client_1.default.on("guildMemberAdd", (member) => __awaiter(void 0, void 0, void 0, function* () { (0, guildMemberHandler_1.guildMemberAddHandler)(member); }));
client_1.default.on("messageReactionAdd", (reaction, user) => __awaiter(void 0, void 0, void 0, function* () {
    (0, messageReactionHandlers_1.messageReactionAddHandler)(reaction, user);
}));
client_1.default.on("messageReactionRemove", (reaction, user) => __awaiter(void 0, void 0, void 0, function* () {
    (0, messageReactionHandlers_1.messageReactionRemoveHandler)(reaction, user);
}));
//# sourceMappingURL=index.js.map