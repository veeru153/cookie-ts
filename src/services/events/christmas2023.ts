import { END_DATE, START_DATE } from "../../common/constants/christmas2023";
import { KST, isDevEnv } from "../../common/constants/common";
import { log } from "../../common/logger";
import { EventDetail } from "../../common/types/EventDetail";
import { sendToLogChannel } from "../../utils/sendToLogChannel";
import { DateTime, Settings } from "luxon";

let TRIGGER_INTERVAL: NodeJS.Timeout = null;
let END_TRIGGER_INTERVAL: NodeJS.Timeout = null;
let IS_LIVE = false;

export const christmas2023: EventDetail = {
    id: "christmas2023",
    name: "Christmas 2023",
    trigger: async () => await triggerChristmas(),
    start: async () => await startChristmas(),
    end: () => endChristmas()
}

const triggerChristmas = async () => {
    if (nowKst() > END_DATE) {
        log.info("[Christmas 2023] Not setting Trigger - Event has already ended");
        return;
    }

    if (TRIGGER_INTERVAL != null || IS_LIVE) {
        log.info("[Christmas 2023] Not setting Trigger - Trigger Interval already present or event is already live");
        return;
    }

    log.info("[Christmas 2023] Trigger set for %s", START_DATE.toString())
    TRIGGER_INTERVAL = setInterval(async () => {
        const currDate = nowKst();
        if (currDate >= START_DATE && currDate <= END_DATE) {
            log.info(sendToLogChannel("[Christmas 2023] Triggering event..."));
            clearInterval(TRIGGER_INTERVAL);
            END_TRIGGER_INTERVAL = setInterval(endTriggerWrapper, 1000);
            await startChristmas();
        }
    }, 1000)
}

const startChristmas = async () => {
    const currDate = nowKst();
    if (!isDevEnv && (currDate < START_DATE || currDate > END_DATE)) {
        log.info("[Christmas 2023] Event has not started or has already ended.");
        return "[Christmas 2023] Event has not started or has already ended.";
    }

    if (IS_LIVE) {
        log.info("[Christmas 2023] Event is already live.");
        return "[Christmas 2023] Event is already live.";
    }

    IS_LIVE = true;
}

const endTriggerWrapper = () => {
    if (nowKst() <= END_DATE) {
        return;
    }

    log.info("[Christmas 2023] Ending event...");
    endChristmas();
    clearInterval(END_TRIGGER_INTERVAL);
    END_TRIGGER_INTERVAL = null;
}

const endChristmas = () => {
    if (!IS_LIVE) {
        return "[Christmas 2023] Event is not live!"
    }

    if (TRIGGER_INTERVAL != null) {
        clearTimeout(TRIGGER_INTERVAL);
        TRIGGER_INTERVAL = null;
    }

    log.info(sendToLogChannel("[Christmas 2023] Event has ended"));
    return "[Christmas 2023] Event ended!";
}

const nowKst = () => DateTime.now().setZone(KST);