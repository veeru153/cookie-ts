import { Command } from "../entities/Command";
import Scope from "../utils/enums/Scope";
import { updateEmotes as updateEmotesFn } from "../services/guildService";

export const updateEmotes = new Command({
    name: "updateEmotes",
    desc: "Force Update Emotes in #emotes",
    scope: [Scope.STAFF],
    fn: updateEmotesFn
})