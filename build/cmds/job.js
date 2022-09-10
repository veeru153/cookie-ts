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
exports.job = void 0;
const scope_1 = __importDefault(require("../util/scope"));
const _Command_1 = __importDefault(require("./_Command"));
const jobs = __importStar(require("../jobs"));
const logger_1 = __importDefault(require("../util/logger"));
const channels_1 = __importDefault(require("../util/channels"));
exports.job = new _Command_1.default({
    name: "job",
    desc: "Handle Server Jobs",
    scope: [scope_1.default.STAFF]
});
const ALLOWED_CHANNELS = Object.values(channels_1.default.Kitchen);
exports.job.run = (message, args) => __awaiter(void 0, void 0, void 0, function* () {
    const job = args[0];
    const { username, discriminator, id } = message.author;
    if (!ALLOWED_CHANNELS.includes(message.channel.id)) {
        logger_1.default.info(`[Job] User : ${username}#${discriminator} (${id}) tried running '${job}' outside allowed channels`);
        return;
    }
    args.shift();
    if (Object.keys(jobs).includes(job)) {
        logger_1.default.info(`[Job] '${job}' ran by User : ${username}#${discriminator} (${id})`);
        try {
            message.reply(`Running Job: \`${job}\``);
            yield (jobs[job])._invoke(message, args);
            logger_1.default.info(`[Job] '${job}' ran successfully`);
        }
        catch (err) {
            logger_1.default.error(`[Job] Error while running '${job}' : ${err}`);
        }
    }
});
//# sourceMappingURL=job.js.map