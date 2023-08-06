import { isDevEnv } from "../../utils/constants/common";
import { cache } from "./cache";
import { shop } from "./shop";
import { test } from "./test";
import { user } from "./user";

let routes = [
    { url: '/shop', router: shop },
    { url: '/test', router: test },
    { url: '/user', router: user },
]

const devRoutes = [
    { url: '/cache', router: cache }
]

if (isDevEnv) {
    routes = [...routes, ...devRoutes]
}

export default routes;