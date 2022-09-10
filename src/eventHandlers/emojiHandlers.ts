import { Client, GuildEmoji } from "discord.js";
import handleError from "../util/handleError";
import { updateEmotes } from "../jobs/updateEmotes";

export const emojiHandler = async (client: Client, emoji: GuildEmoji) => {
    try {
        updateEmotes.run(client, null, null);
    } catch (err) {
        handleError(client, err);
    }
}