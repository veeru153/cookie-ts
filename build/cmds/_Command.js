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
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../util/constants");
class Command {
    constructor({ name, desc, scope }) {
        this.run = (message, args) => __awaiter(this, void 0, void 0, function* () { });
        this._canUserInvokeCmd = (member) => {
            if (this.scope == undefined || this.scope == null || this.scope.length == 0)
                throw new Error(constants_1.Errors.MISSING_SCOPE);
            for (let role of this.scope) {
                if (!member.roles.cache.has(role))
                    throw new Error(constants_1.Errors.MISSING_PERMS);
            }
            return true;
        };
        this._invoke = (message, args) => __awaiter(this, void 0, void 0, function* () {
            try {
                this._canUserInvokeCmd(message.member);
                yield this.run(message, args);
            }
            catch (err) {
                throw err;
            }
        });
        this.name = name;
        this.desc = desc;
        this.scope = scope;
    }
}
exports.default = Command;
//# sourceMappingURL=_Command.js.map