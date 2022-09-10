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
exports.reactionRoleHandler = exports.REMOVE_ROLE = exports.ADD_ROLE = void 0;
const logger_1 = __importDefault(require("../util/logger"));
const constants_1 = require("../util/constants");
exports.ADD_ROLE = "ADD_ROLE";
exports.REMOVE_ROLE = "REMOVE_ROLE";
const RoleMsgIds = [constants_1.BiasEmbeds.MAIN, constants_1.BiasEmbeds.SUB];
const reactionRoleHandler = (reaction, user, action) => __awaiter(void 0, void 0, void 0, function* () {
    if (!RoleMsgIds.includes(reaction.message.id))
        return;
    const message = yield reaction.message.fetch();
    const { username, discriminator, id } = user;
    const actionStr = action == exports.ADD_ROLE ? "reacted" : "unreacted";
    logger_1.default.info(`[Reaction Role Manager] ${username}#${discriminator} (${id}) ${actionStr} '${reaction.emoji.name}' on Message : ${message.id}`);
    if (!Object.values(constants_1.BiasEmbeds).includes(message.id))
        return;
    const currUser = yield reaction.message.guild.members.fetch(user);
    const emoji = reaction.emoji.name;
    let biasRole;
    if (message.id === constants_1.BiasEmbeds.MAIN)
        biasRole = Object.values(constants_1.BiasRoles.Main).filter(r => r.emoji === emoji)[0];
    else if (message.id === constants_1.BiasEmbeds.SUB)
        biasRole = Object.values(constants_1.BiasRoles.Sub).filter(r => r.emoji === emoji)[0];
    const role = yield reaction.message.guild.roles.fetch(biasRole.id);
    let res;
    switch (action) {
        case exports.ADD_ROLE:
            currUser.roles.add(role);
            res = yield reaction.message.channel.send(`${user.toString()} Role Added: \`${biasRole.name}\``);
            setTimeout(() => { res.delete(); }, 5000);
            break;
        case exports.REMOVE_ROLE:
            currUser.roles.remove(role);
            res = yield reaction.message.channel.send(`${user.toString()} Role Removed: \`${biasRole.name}\``);
            setTimeout(() => { res.delete(); }, 5000);
            break;
        default:
            logger_1.default.error(`[Reaction Role Manager] ${constants_1.Errors.ROLE_REACTION_UNKNOWN_ACTION}`);
    }
});
exports.reactionRoleHandler = reactionRoleHandler;
//# sourceMappingURL=reactionRoleManager.js.map