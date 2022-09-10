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
const client_1 = __importDefault(require("../util/client"));
const isDevEnv_1 = __importDefault(require("../util/isDevEnv"));
const channels_1 = __importDefault(require("../util/channels"));
const constants_1 = require("../util/constants");
const updateServerAge = () => __awaiter(void 0, void 0, void 0, function* () {
    const guild = yield client_1.default.guilds.fetch(constants_1.Guilds.YUQICORD);
    const ageMs = Date.now() - guild.createdTimestamp;
    const MS_IN_DAY = 86400000;
    const age = Math.floor(ageMs / MS_IN_DAY);
    const channelId = (0, isDevEnv_1.default)() ? channels_1.default.Cookie.TESTING : channels_1.default.Reception.INFO;
    const channel = yield client_1.default.channels.fetch(channelId);
    channel.setTopic(`:calendar_spiral: Server Age: ${age} Days`);
});
exports.default = updateServerAge;
//# sourceMappingURL=updateServerAge.js.map