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
    eventTimeouts = [];

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
        this.eventInterval = setInterval(this.__triggerEvent, 2500);
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
        let CANDY_DROP_INTERVAL = randomNumIn(20 * 60000, 30 * 60000);
        isDevEnv() && (CANDY_DROP_INTERVAL = 25 * 1000);
        const _dropCandies = () => {
            if(!this.isLive) return;
            Halloween.dropCandies();
            CANDY_DROP_INTERVAL = randomNumIn(20 * 60000, 30 * 60000);
            isDevEnv() && (CANDY_DROP_INTERVAL = 25 * 1000);
            this.eventTimeouts.push(setTimeout(_dropCandies, CANDY_DROP_INTERVAL));
            logger.info(`[Event/Halloween_2022] Next Candy Drop in ${msToTime(CANDY_DROP_INTERVAL)}`);
        }
        this.eventTimeouts.push(setTimeout(_dropCandies, CANDY_DROP_INTERVAL));
        logger.info(`[Event/Halloween_2022] Next Candy Drop in ${msToTime(CANDY_DROP_INTERVAL)}`);
        
        let SUMMON_INTERVAL = randomNumIn(90 * 60000, 120 * 60000);
        isDevEnv() && (SUMMON_INTERVAL = 40 * 1000);
        const _summonSpirit = () => {
            Halloween.summon();
            SUMMON_INTERVAL = randomNumIn(90 * 60000, 120 * 60000);
            isDevEnv() && (SUMMON_INTERVAL = 40 * 1000);
            this.eventTimeouts.push(setTimeout(_summonSpirit, SUMMON_INTERVAL));
            logger.info(`[Event/Halloween_2022] Next Spirit Summon in ${msToTime(SUMMON_INTERVAL)}`);
        }        
        this.eventTimeouts.push(setTimeout(_summonSpirit, SUMMON_INTERVAL));
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
        for(let timeouts of this.eventTimeouts) {
            clearTimeout(timeouts);
        }
        this.isLive = false;
        logger.info("[Event Service] Event ended")
    }
}

const EventService = new _EventService();
export default EventService;