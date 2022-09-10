"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.INVENTORY = exports.RANKS = void 0;
const firebase_1 = require("./firebase");
exports.RANKS = firebase_1.db.collection("ranks");
exports.INVENTORY = firebase_1.db.collection("inventory");
exports.default = {
    RANKS: exports.RANKS,
    INVENTORY: exports.INVENTORY
};
//# sourceMappingURL=collections.js.map