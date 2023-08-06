import { isDevEnv } from ".";

export const COOLDOWN_HR = isDevEnv ? 0.00111111 : 4;
export const COOLDOWN_MS = COOLDOWN_HR * 60 * 60 * 1000;

export const BOOSTER_MULTIPLIER = 0.1;
export const PROMOTIONAL_MULTIPLIER = 0;
export const EVENT_MULTIPLIER = 0;

export const COOKIE_TIER_RANGE = {
    T0_MIN: 1,
    T0_MAX: 3,
    T1_MIN: 7,
    T1_MAX: 11,
    T2_MIN: 14,
    T2_MAX: 18,
    T3_MIN: 21,
    T3_MAX: 25,
}

export const BATCH_BAKE_COUNT_MIN = 1;
export const BATCH_BAKE_COUNT_MAX = 10;