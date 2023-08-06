export const isDevEnv = process.env.NODE_ENV == "dev";
export const env = isDevEnv ? "Development" : "Production";
export const identity = isDevEnv ? "Cookie Dough" : "Cookie";
export const devIdList = ["252748033287127041"];

export const PREFIX = isDevEnv ? "+" : "-";

export const BASE_URL = "https://cookie-pw1t.onrender.com";
export const SHOP_URL = BASE_URL + "/shop/backgrounds";
export const USER_URL = BASE_URL + "/user";

export const BOOSTER_ROLE = "799045188156260413";

export const HOUR_IN_MS = 60 * 60 * 1000;
export const MINUTE_IN_MS = 60 * 1000;
export const SECOND_IN_MS = 1000;