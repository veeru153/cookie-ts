import { randomNumIn } from "../helpers";
import Halloween from "../entities/Halloween";
import logger from "../util/logger";

// Update for events
class _EventService {
    isTriggerActive = false;
    isLive = false;
    eventInterval = null;

    triggerEvent = () => {
        if(this.isTriggerActive) {
            logger.info("[Event Service] Trigger is already active");
        }

        if(this.isLive) {
            logger.info("[Event Service] Event already started");
            return;
        }

        logger.info("[Event Service] Triggering event...");
        this.eventInterval = setInterval(this.__triggerEvent, 1000);
    }

    __triggerEvent = () => {
        if(Date.now() < Halloween.START_DATE_MS.getTime()) {
            // Event has not started yet. Keep triggering.
            return;
        }

        if(Date.now() > Halloween.END_DATE_MS.getTime()) {
            // Event has ended. Removing trigger.
            clearInterval(this.eventInterval);
            return;
        }

        if(Halloween.__eventIsLive()) this.isLive = true;

        let SUMMON_INTERVAL = randomNumIn(90, 120) * 60 * 1000;
        
        let CANDY_DROP_INTERVAL = randomNumIn(20, 30) * 60 * 1000;
        const _dropCandies = () => {
            Halloween.dropCandies();
            CANDY_DROP_INTERVAL = randomNumIn(20, 30) * 60 * 1000;
            setTimeout(_dropCandies, CANDY_DROP_INTERVAL);
        }
        setTimeout(_dropCandies, CANDY_DROP_INTERVAL);

    }

    endEvent = () => {
        this.isTriggerActive = false;
        logger.info("[Event Service] Ending event...");
        clearInterval(this.eventInterval);
        this.isLive = false;
        logger.info("[Event Service] Event ended")
    }
}

const EventService = new _EventService();
export default EventService;