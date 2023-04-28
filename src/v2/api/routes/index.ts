import { shop } from "./shop";
import { test } from "./test";
import { user } from "./user";

export const routes = [
    { url: '/shop', router: shop },
    { url: '/test', router: test },
    { url: '/user', router: user },
]