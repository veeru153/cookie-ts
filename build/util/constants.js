"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Errors = exports.BiasRoles = exports.BiasEmbeds = exports.Guilds = void 0;
const ReactionRole_1 = __importDefault(require("../entities/ReactionRole"));
var Guilds;
(function (Guilds) {
    Guilds["YUQICORD"] = "426340011802099712";
})(Guilds = exports.Guilds || (exports.Guilds = {}));
var BiasEmbeds;
(function (BiasEmbeds) {
    BiasEmbeds["MAIN"] = "691340747378655272";
    BiasEmbeds["SUB"] = "691340818224644096";
})(BiasEmbeds = exports.BiasEmbeds || (exports.BiasEmbeds = {}));
const Main = {
    YUQI: new ReactionRole_1.default("426340286076157952", "Yuqi", "🍪"),
    SOYEON: new ReactionRole_1.default("426340586572873728", "Soyeon", "☠️"),
    SHUHUA: new ReactionRole_1.default("426340512719437824", "Shuhua", "📚"),
    SOOJIN: new ReactionRole_1.default("426340562090721281", "Soojin", "🥞"),
    MINNIE: new ReactionRole_1.default("442985807490449409", "Minnie", "🎹"),
    MIYEON: new ReactionRole_1.default("426340623478423553", "Miyeon", "🍜"),
    OT6: new ReactionRole_1.default("684031710756995078", "OT6", "idleblob"),
};
const Sub = {
    _YUQI: new ReactionRole_1.default("684027789531545636", ".Yuqi", "🍪"),
    _SOYEON: new ReactionRole_1.default("684027841595310111", ".Soyeon", "☠️"),
    _SHUHUA: new ReactionRole_1.default("684027970293071914", ".Shuhua", "📚"),
    _SOOJIN: new ReactionRole_1.default("684028021744861269", ".Soojin", "🥞"),
    _MINNIE: new ReactionRole_1.default("684027934767317002", ".Minnie", "🎹"),
    _MIYEON: new ReactionRole_1.default("684028050639159317", ".Miyeon", "🍜"),
    _GGOMO: new ReactionRole_1.default("691290092714852363", ".Ggomo", "🐱")
};
exports.BiasRoles = { Main, Sub };
var Errors;
(function (Errors) {
    Errors["CHANNEL_TYPE_NOT_TEXT"] = "Channel is not a TextChannel";
    Errors["ROLE_REACTION_UNKNOWN_ACTION"] = "Action was not ADD_ROLE or REMOVE_ROLE";
    // Scopes and Permissions
    Errors["MISSING_SCOPE"] = "Scope Null or Empty";
    Errors["MISSING_PERMS"] = "Missing Permissions";
})(Errors = exports.Errors || (exports.Errors = {}));
//# sourceMappingURL=constants.js.map