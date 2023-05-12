import { sendToLogChannel } from "../helpers/sendToLogChannel";

export class CookieException extends Error {
    constructor(message?: string, err?: any) {
        super(message);
        err && sendToLogChannel(err);
    }
}