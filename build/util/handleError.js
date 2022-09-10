"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const isDevEnv_1 = __importDefault(require("./isDevEnv"));
const log_1 = __importDefault(require("./log"));
const handleError = (client, err) => {
    if ((0, isDevEnv_1.default)()) {
        (0, log_1.default)(client, {
            title: "ERROR",
            desc: err.message
        });
    }
    else {
        console.log(`[ERROR] ${err.message}`);
    }
};
exports.default = handleError;
//# sourceMappingURL=handleError.js.map