import { Client, Message } from "discord.js";
import isDevEnv from "./isDevEnv";
import log from "./log";

const handleError = (client: Client, err: Error) => {
    isDevEnv() && log(client, {
        title: "ERROR",
        desc: err.message
    })
}

export default handleError;