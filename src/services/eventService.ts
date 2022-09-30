import { msToTime, randomNumIn } from "../helpers";
import Halloween from "../entities/Halloween";
import logger from "../util/logger";
import isDevEnv from "../util/isDevEnv";

// Update for events
class _EventService {
    isTriggerActive = false;
    isForceStarted = false;
    isLive = false;
    eventInterval = null;
    eventTimeouts = new Map<string, NodeJS.Timeout>();

    triggerEvent = () => {
        if(this.isTriggerActive) {
            logger.info("[Event Service] Trigger is already active");
            return;
        }

        if(this.isLive) {
            logger.info("[Event Service] Event already started");
            return;
        }

        logger.info("[Event Service] Triggering event...");
        this.eventInterval = setInterval(this.__triggerEvent, 5000);
        logger.info("[Event Service] Event trigger active")
    }

    __triggerEvent = () => {
        if(!this.isForceStarted && Date.now() < Halloween.START_DATE_MS.getTime()) {
            // Event has not started yet. Keep triggering.
            return;
        }

        if(!this.isForceStarted && Date.now() > Halloween.END_DATE_MS.getTime()) {
            // Event has ended. Removing trigger.
            clearInterval(this.eventInterval);
            return;
        }

        if(this.isForceStarted || Halloween.__eventIsLive()) {
            this.isTriggerActive = false;
            this.isLive = true;
            clearInterval(this.eventInterval);
        }
        
        logger.info("[Event/Halloween_2022] Starting event...")

        const dropTimeout = "DROP_TIMEOUT";
        const candyIntervalDev = 15 * 1000;
        const candyIntervalMin = 10 * 60000;
        const candyIntervalMax = 20 * 60000;
        let CANDY_DROP_INTERVAL = isDevEnv() ? candyIntervalDev : randomNumIn(candyIntervalMin, candyIntervalMax);
        const _dropCandies = () => {
            if(!this.isLive) return;
            Halloween.dropCandies();
            CANDY_DROP_INTERVAL = isDevEnv() ? candyIntervalDev : randomNumIn(10 * 60000, 20 * 60000);
            logger.info(`[Event/Halloween_2022] Next Candy Drop in ${msToTime(CANDY_DROP_INTERVAL)}`);
            this.eventTimeouts.set(dropTimeout, setTimeout(_dropCandies, CANDY_DROP_INTERVAL))
        }
        this.eventTimeouts.set(dropTimeout, setTimeout(_dropCandies, CANDY_DROP_INTERVAL));
        logger.info(`[Event/Halloween_2022] Next Candy Drop in ${msToTime(CANDY_DROP_INTERVAL)}`);
        
        const summonTimeout = "SUMMON_TIMEOUT";
        const summonIntervalDev = 24 * 1000;
        const summonIntervalMin = 45 * 60000;
        const summonIntervalMax = 70 * 60000;
        let SUMMON_INTERVAL = isDevEnv() ? summonIntervalDev : randomNumIn(summonIntervalMin, summonIntervalMax);
        const _summonSpirit = () => {
            if(!this.isLive) return;
            Halloween.summon();
            SUMMON_INTERVAL = isDevEnv() ? summonIntervalDev : randomNumIn(summonIntervalMin, summonIntervalMax);
            this.eventTimeouts.set(summonTimeout, setTimeout(_summonSpirit, SUMMON_INTERVAL));
            logger.info(`[Event/Halloween_2022] Next Spirit Summon in ${msToTime(SUMMON_INTERVAL)}`);
        }        
        this.eventTimeouts.set(summonTimeout, setTimeout(_summonSpirit, SUMMON_INTERVAL));
        logger.info(`[Event/Halloween_2022] Next Spirit Summon in ${msToTime(SUMMON_INTERVAL)}`);
    }

    triggerEventForce = () => {
        this.isForceStarted = true;
        this.__triggerEvent();
    }

    endEvent = () => {
        this.isTriggerActive = false;
        this.isForceStarted = false;
        logger.info("[Event Service] Ending event...");
        clearInterval(this.eventInterval);
        for(let timeouts of Object.entries(this.eventTimeouts)) {
            clearTimeout(timeouts[1]);
            this.eventTimeouts.delete(timeouts[0]);
        }
        this.isLive = false;
        logger.info("[Event Service] Event ended")
    }
}

const EventService = new _EventService();
export default EventService;