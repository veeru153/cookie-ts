import { Message } from "discord.js";
import { Command } from "../entities/Command";
import Scope from "../utils/enums/Scope";
import { syncCommands } from "../services/interactionService";

const syncFn = async (message: Message) => {
    await syncCommands();
    message.reply("Commands synchronized!");
}

export const sync = new Command({
    name: "sync",
    desc: "Synchronize Slash Commands",
    scope: [Scope.ADMIN],
    fn: async (message: Message) => await syncFn(message)
});