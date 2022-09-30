import Scope from "../util/scope";
import Command from "../cmds/_Command";
import { Message } from "discord.js";
import * as jobs from "./index";
import { PREFIX } from "../util/config";

export const tmpMigrateEventToCollection = new Command({
    name: "help",
    desc: "Returns info on every job.",
    scope: [ Scope.STAFF ]
})

tmpMigrateEventToCollection.run = async (message: Message, args: string[]) => {
    
}