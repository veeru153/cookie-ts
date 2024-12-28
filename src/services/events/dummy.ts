import { EventDetail } from "../../common/types/EventDetail";

export const dummy: EventDetail = {
    id: "dummy",
    name: "Dummy",
    trigger: async () => { },
    start: async () => { },
    end: () => { }
}