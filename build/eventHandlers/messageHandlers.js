"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.messageUpdate = exports.messageDelete = exports.messageCreate = void 0;
const config_1 = require("../util/config");
const cmds = __importStar(require("../cmds"));
const updateServerAge_1 = __importDefault(require("../helper/updateServerAge"));
const updateChatXp_1 = __importDefault(require("../helper/updateChatXp"));
const logger_1 = __importDefault(require("../util/logger"));
const messageCreate = (message) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, updateServerAge_1.default)();
    if (message.author.bot)
        return;
    yield (0, updateChatXp_1.default)(message);
    if (!message.content.startsWith(config_1.PREFIX))
        return;
    let msg = message.content.slice(config_1.PREFIX.length).split(" ");
    let cmd = msg.shift();
    let args = [...msg];
    if (Object.keys(cmds).includes(cmd)) {
        const { username, discriminator, id } = message.author;
        logger_1.default.info(`[Command] '${cmd}' ran by User : ${username}#${discriminator} (${id})`);
        try {
            (cmds[cmd])._invoke(message, args);
        }
        catch (err) {
            logger_1.default.error(`[Command] ${cmd} - ${err}`);
        }
    }
});
exports.messageCreate = messageCreate;
const messageDelete = (message) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, updateServerAge_1.default)();
});
exports.messageDelete = messageDelete;
const messageUpdate = (message) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, updateServerAge_1.default)();
});
exports.messageUpdate = messageUpdate;
//# sourceMappingURL=messageHandlers.js.map