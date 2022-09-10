"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const canMemberRun = (cmd, member) => {
    if (cmd.scope == undefined || cmd.scope == null || cmd.scope.length == 0)
        return true;
    for (let role in cmd.scope) {
        if (!member.roles.cache.has(role))
            return false;
    }
    return true;
};
//# sourceMappingURL=canMemberRunCmd.js.map