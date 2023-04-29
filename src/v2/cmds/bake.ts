import { Message } from "discord.js";
import { Command } from "../entities/Command";
import Scope from "../utils/enums/Scope";
import { bakeCookies } from "../services/bakeService";

const bakeFn = async (message: Message) => await bakeCookies(message);

export const bake = new Command({
    name: "bake",
    desc: "Bake Cookies 🍪",
    scope: [Scope.ALL],
    fn: bakeFn
})