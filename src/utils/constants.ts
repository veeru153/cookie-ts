export const isDevEnv = process.env.NODE_ENV == "dev";
export const env = isDevEnv ? "Development" : "Production";
export const identity = isDevEnv ? "Cookie Dough" : "Cookie";

export const PREFIX = isDevEnv ? "+" : "-";

export const BASE_URL = "https://cookie-pw1t.onrender.com";
export const SHOP_URL = BASE_URL + "/shop";
export const USER_URL = BASE_URL + "/user";

export const BOOSTER_ROLE = "799045188156260413";
export const BOOSTER_MULTIPLIER = 1.25;