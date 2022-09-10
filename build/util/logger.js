"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pino_1 = __importDefault(require("pino"));
const channels_1 = __importDefault(require("./channels"));
const client_1 = __importDefault(require("./client"));
const isDevEnv_1 = __importDefault(require("./isDevEnv"));
const sendToLogChannel = (log) => {
    const channelId = (0, isDevEnv_1.default)() ? channels_1.default.Cookie.DEV_LOGS : channels_1.default.Cookie.LOGS;
    client_1.default.channels.fetch(channelId).then((channel) => {
        channel.send(log);
    });
};
class Logger {
    constructor() {
        this._logger = (0, pino_1.default)();
    }
    info(log) {
        sendToLogChannel(log);
        this._logger.info(log);
    }
    error(log) {
        sendToLogChannel("**[ERROR]** " + log);
        this._logger.error(log);
    }
}
const logger = new Logger();
exports.default = logger;
//# sourceMappingURL=logger.js.map