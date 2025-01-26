export const isDevEnv = process.env.NODE_ENV == "dev";
export const TOKEN = isDevEnv ? process.env.DEV_TOKEN : process.env.TOKEN;
export const CLIENT_ID = isDevEnv ? process.env.DEV_CLIENT_ID : process.env.CLIENT_ID;

export const env = isDevEnv ? "Development" : "Production";
export const identity = isDevEnv ? "Cookie Dough" : "Cookie";
export const DEV_ENV_WHITELIST_IDS = [
    "252748033287127041",
    "325332841212674048",
    "356505334673571841",
    "312275376422387723",
]

export const PREFIX = isDevEnv ? "+" : "-";

export const BASE_URL = "https://veeru153.github.io/cookie-web/#";
export const SHOP_URL = BASE_URL + "/shop";
export const USER_URL = BASE_URL + "/user";

export const BOOSTER_ROLE = "799045188156260413";

export const HOUR_IN_MS = 60 * 60 * 1000;
export const MINUTE_IN_MS = 60 * 1000;
export const SECOND_IN_MS = 1000;