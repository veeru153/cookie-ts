import { ApplicationCommandOptionType, ChatInputCommandInteraction, Message } from "discord.js"
import { HybridCommand } from "../common/types/HybridCommand"
import * as events from "../services/events";
import Scope from "../common/enums/Scope";
import { EventDetail } from "../common/types/EventDetail";

const enum EventAction {
    START = "start",
    END = "end"
}

const startEvent = async (eventId: string) => {
    const event: EventDetail = events[eventId];
    if (event == null) {
        return `Event: ${event.name} not found`;
    }

    if (event.status) {
        return `Event: ${event.name} is already live`
    }

    await event.start();
    return `Starting event: ${event.name}`;
}

const endEvent = async (eventId: string) => {
    const event: EventDetail = events[eventId];
    if (event == null) {
        return `Event: ${event.name} not found`;
    }

    if (!event.status) {
        return `Event: ${event.name} is not live`
    }

    await event.end();
    return `Ending event: ${event.name}`;
}

const legacy = async (message: Message, args: string[]) => {
    if (args == null || args.length !== 2) {
        await message.reply("Invalid arguments. Syntax: `action` `event_id`");
        return;
    }

    let res = "Invalid action. Action must be one of `start | end`";
    const action = args[0];
    const eventId = args[1];
    if (action === EventAction.START) {
        res = await startEvent(eventId);
    } else if (action === EventAction.END) {
        res = await endEvent(eventId);
    }

    await message.reply(res);
}

const slash = async (interaction: ChatInputCommandInteraction) => {
    await interaction.deferReply();
    const action = interaction.options.getString("action");
    const eventId = interaction.options.getString("event_id");

    let res = "Invalid action. Action must be one of `start | end`";
    if (action === EventAction.START) {
        res = await startEvent(eventId);
    } else if (action === EventAction.END) {
        res = await endEvent(eventId);
    }

    await interaction.editReply(res);
}

export const event: HybridCommand = {
    info: {
        name: "event",
        description: "Trigger Events",
        options: [
            {
                name: "action",
                description: "Action for the event",
                required: true,
                type: ApplicationCommandOptionType.String,
                choices: [
                    {
                        name: "Start",
                        value: EventAction.START
                    },
                    {
                        name: "End",
                        value: EventAction.END
                    }
                ]
            },
            {
                name: "event_id",
                description: "Event Id",
                required: true,
                type: ApplicationCommandOptionType.String,
                choices: Object.values(events).map(event => ({
                    name: event.name,
                    value: event.id,
                }))
            }
        ]
    },
    legacy: async (message: Message, args: string[]) => await legacy(message, args),
    slash: async (interaction: ChatInputCommandInteraction) => await slash(interaction),
    scope: [Scope.ADMIN]
}