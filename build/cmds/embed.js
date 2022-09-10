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
exports.embed = void 0;
const logger_1 = __importDefault(require("../util/logger"));
const scope_1 = __importDefault(require("../util/scope"));
const _Command_1 = __importDefault(require("./_Command"));
exports.embed = new _Command_1.default({
    name: "embed",
    desc: "Draws an embed",
    scope: [scope_1.default.STAFF]
});
exports.embed.run = (message, args) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const isDiffChannel = ["-c", "--channel"].includes(args[0]);
        let channel = null;
        if (isDiffChannel) {
            channel = message.mentions.channels.first();
            args.splice(0, 2);
        }
        else {
            channel = message.channel;
        }
        const isEdit = ["-e", "--edit"].includes(args[0]);
        let msg = null;
        if (isEdit) {
            const msgId = args[1];
            msg = yield channel.messages.fetch(msgId);
            args.splice(0, 2);
        }
        const content = JSON.parse(args.join(" "));
        if (isEdit) {
            msg.edit({ embeds: [content] });
            logger_1.default.info(`[Embed] Updated (${msg.id}) in Channel : ${channel.name} (${channel.id})`);
            return;
        }
        channel.send({ embeds: [content] });
        logger_1.default.info(`[Embed] Sent to Channel : ${channel.name} (${channel.id})`);
    }
    catch (err) {
        logger_1.default.error(`[Embed] ${err}`);
    }
});
//# sourceMappingURL=embed.js.map