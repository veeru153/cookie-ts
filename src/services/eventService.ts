import { log } from "../common/logger";
import * as events from "./events";

export const triggerEvents = async () => {
    log.info("[Event Service] Attempting to set event triggers if any...")
    Object.values(events).map(async event => event.id != "dummy" && await event.trigger());
}