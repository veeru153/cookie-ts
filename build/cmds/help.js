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
exports.help = void 0;
const scope_1 = __importDefault(require("../util/scope"));
const _Command_1 = __importDefault(require("./_Command"));
const cmds = __importStar(require("./index"));
const config_1 = require("../util/config");
exports.help = new _Command_1.default({
    name: "help",
    desc: "Returns info on every command.",
    scope: [scope_1.default.ALL]
});
exports.help.run = (message, args) => __awaiter(void 0, void 0, void 0, function* () {
    const cmdList = Object.values(cmds);
    let res = "__**Commands:**__";
    for (let cmd of cmdList) {
        try {
            const userCanRunCmd = cmd._canUserInvokeCmd(message.member);
            userCanRunCmd && (res += `\n\`${config_1.PREFIX}${cmd.name}\`\t-\t${cmd.desc}`);
        }
        catch (err) {
            continue;
        }
    }
    message.author.send(res);
});
//# sourceMappingURL=help.js.map