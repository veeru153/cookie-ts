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
exports.emojiHandler = exports.Action = void 0;
const updateEmotes_1 = require("../jobs/updateEmotes");
const logger_1 = __importDefault(require("../util/logger"));
var Action;
(function (Action) {
    Action["ADD"] = "added";
    Action["REMOVE"] = "removed";
    Action["UPDATE"] = "updated";
})(Action = exports.Action || (exports.Action = {}));
const emojiHandler = (emoji, action) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, discriminator, id } = emoji.author;
    logger_1.default.info(`[Emoji] ${emoji.name} (${emoji.id}) ${action} by User: ${username}#${discriminator} (${id})`);
    try {
        updateEmotes_1.updateEmotes.run(null, null);
    }
    catch (err) {
        logger_1.default.error(`[Emoji] ${emoji.id} : ${err}`);
    }
});
exports.emojiHandler = emojiHandler;
//# sourceMappingURL=emojiHandlers.js.map