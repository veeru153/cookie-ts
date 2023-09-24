import * as events from "./events";

export const triggerEvents = async () => {
    Object.values(events).map(async event => await event.trigger());
}