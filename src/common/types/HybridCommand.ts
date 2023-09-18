import { RESTPostAPIChatInputApplicationCommandsJSONBody } from "discord.js";
import Scope from "../enums/Scope"

export interface HybridCommand {
    info: RESTPostAPIChatInputApplicationCommandsJSONBody;
    legacy: Function,
    slash: Function;
    scope?: Scope[];
}