import { Client, Message } from "discord.js";
import isDevEnv from "./isDevEnv";
import log from "./log";

const handleError = (client: Client, err: Error) => {
    if(isDevEnv()) {
        log(client, {
            title: "ERROR",
            desc: err.message
        })
    } else {
        console.log(`[ERROR] ${err.message}`);
    }
}

export default handleError;