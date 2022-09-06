import { Message } from "discord.js/typings";
import isDevEnv from "./isDevEnv";

const handleError = (message: Message, err: Error) => {
    isDevEnv() && message.channel.send(`Error: ${err.message}`);
    console.error(`Error: ${err.message}`);
}

export default handleError;