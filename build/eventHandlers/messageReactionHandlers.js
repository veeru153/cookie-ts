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
exports.messageReactionRemoveHandler = exports.messageReactionAddHandler = void 0;
const logger_1 = __importDefault(require("../util/logger"));
const reactionRoleManager_1 = require("../helper/reactionRoleManager");
const messageReactionAddHandler = (reaction, user) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (reaction.partial)
            reaction = yield reaction.fetch();
        yield (0, reactionRoleManager_1.reactionRoleHandler)(reaction, user, reactionRoleManager_1.ADD_ROLE);
    }
    catch (err) {
        logger_1.default.error(`[MessageReactionAddHandler] ${err}`);
    }
});
exports.messageReactionAddHandler = messageReactionAddHandler;
const messageReactionRemoveHandler = (reaction, user) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (reaction.partial)
            reaction = yield reaction.fetch();
        yield (0, reactionRoleManager_1.reactionRoleHandler)(reaction, user, reactionRoleManager_1.REMOVE_ROLE);
    }
    catch (err) {
        logger_1.default.error(`[MessageReactionRemoveHandler] ${err}`);
    }
});
exports.messageReactionRemoveHandler = messageReactionRemoveHandler;
//# sourceMappingURL=messageReactionHandlers.js.map