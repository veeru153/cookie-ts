export const isDevEnv = process.env.NODE_ENV == "dev";
export const env = isDevEnv ? "Development" : "Production";
export const identity = isDevEnv ? "Cookie Dough" : "Cookie";