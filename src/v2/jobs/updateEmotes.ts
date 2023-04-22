import { Command } from "../entities/Command";
import Scope from "../utils/enums/Scope";
import { updateEmotes } from "../services/guildService";

const updateEmotesFn = async () => updateEmotes()

export const updateEmotesJob = new Command({
    name: "updateEmotes",
    desc: "Force Update Emotes in #emotes",
    scope: [Scope.STAFF],
    fn: updateEmotesFn
})