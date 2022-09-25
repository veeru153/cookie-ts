import { Message } from "discord.js";
import Scope from "../util/scope";
import Command from "../cmds/_Command";
import EventService from "../services/eventService";
import Halloween from "../entities/Halloween";

export const triggerEvent = new Command({
    name: "triggerEvent",
    desc: "Starts an event trigger",
    scope: [ Scope.ADMIN ]
})

triggerEvent.run = async (message: Message, args: string[]) => {
    EventService.triggerEvent()
}

export const triggerEventForce = new Command({
    name: "triggerEventForce",
    desc: "Forcefully start an event",
    scope: [ Scope.ADMIN ]
})

triggerEventForce.run = async (message: Message, args: string[]) => {
    EventService.triggerEventForce();
}

export const endEvent = new Command({
    name: "endEvent",
    desc: "End current event",
    scope: [ Scope.ADMIN ]
})

endEvent.run = async (message: Message, args: string[]) => {
    EventService.endEvent();
}