import { GuildEmoji } from "discord.js";
import { updateEmotesJob } from "../jobs/updateEmotes";
import logger from "../utils/logger";
import { getUserLogString } from "../helpers/getUserLogString";

enum Action {
    ADD = "added",
    REMOVE = "removed",
    UPDATE = "updated",
}

const emojiHandler = async (emoji: GuildEmoji, action: Action) => {
    logger.info(`[Emoji] ${emoji.name} (${emoji.id}) ${action} by User: ${getUserLogString(emoji.author)}`);
    try {
        updateEmotesJob();
    } catch (err) {
        logger.error(`[Emoji] ${emoji.id} : ${err}`);
    }
}

export const emojiAddHandler = async (emoji: GuildEmoji) => { emojiHandler(emoji, Action.ADD) }
export const emojiRemoveHandler = async (emoji: GuildEmoji) => { emojiHandler(emoji, Action.REMOVE) }
export const emojiUpdateHandler = async (emoji: GuildEmoji) => { emojiHandler(emoji, Action.UPDATE) }