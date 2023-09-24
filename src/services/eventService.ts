import { halloween2023 } from "./events/halloween2023"

export const triggerEvents = async () => {
    await halloween2023.trigger();
}