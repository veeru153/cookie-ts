"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
const firebase_admin_1 = __importDefault(require("firebase-admin"));
const cookie_yuqicord_firebase_adminsdk_7v8yo_921f6b9665_json_1 = __importDefault(require("../cookie-yuqicord-firebase-adminsdk-7v8yo-921f6b9665.json"));
firebase_admin_1.default.initializeApp({
    credential: firebase_admin_1.default.credential.cert(cookie_yuqicord_firebase_adminsdk_7v8yo_921f6b9665_json_1.default)
});
exports.db = firebase_admin_1.default.firestore();
//# sourceMappingURL=firebase.js.map