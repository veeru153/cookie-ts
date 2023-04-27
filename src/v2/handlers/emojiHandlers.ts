import { GuildEmoji } from "discord.js";
import { updateEmotesJob } from "../jobs/updateEmotes";
import { getUserLogString } from "../helpers/getUserLogString";
import { updateEmotes } from "../services/guildService";
import { log } from "../utils/logger";
import { sendToLogChannel } from "../helpers/sendToLogChannel";

enum Action {
    ADD = "added",
    REMOVE = "removed",
    UPDATE = "updated",
}

const emojiHandler = async (emoji: GuildEmoji, action: Action) => {
    log.info(`[EmojiHandler] ${emoji.name} (${emoji.id}) ${action} by User: ${getUserLogString(emoji.author)}`);
    try {
        updateEmotes();
    } catch (err) {
        log.error(sendToLogChannel(`[EmojiHandler] Error : ${emoji.id} ${action} by User: ${getUserLogString(emoji.author)} : ${err}`));
    }
}

export const emojiAddHandler = async (emoji: GuildEmoji) => { emojiHandler(emoji, Action.ADD) }
export const emojiRemoveHandler = async (emoji: GuildEmoji) => { emojiHandler(emoji, Action.REMOVE) }
export const emojiUpdateHandler = async (emoji: GuildEmoji) => { emojiHandler(emoji, Action.UPDATE) }