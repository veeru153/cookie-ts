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
exports.echo = void 0;
const _Command_1 = __importDefault(require("./_Command"));
const scope_1 = __importDefault(require("../util/scope"));
exports.echo = new _Command_1.default({
    name: "echo",
    desc: "Echoes/reposts a message.",
    scope: [scope_1.default.STAFF]
});
exports.echo.run = (message, args) => __awaiter(void 0, void 0, void 0, function* () {
    const isDiffChannel = ["-c", "--channel"].includes(args[0]);
    let channel = null;
    if (isDiffChannel) {
        channel = message.mentions.channels.first();
        args.splice(0, 2);
    }
    else {
        channel = message.channel;
    }
    const isAnon = ["-a", "--anon"].includes(args[0]);
    let prefix = `**${message.author.tag}** said:`;
    if (isAnon) {
        args.shift();
        prefix = "";
    }
    const msg = args.join(" ");
    channel.send(`${prefix} ${msg}`);
});
//# sourceMappingURL=echo.js.map