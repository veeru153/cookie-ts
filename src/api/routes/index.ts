import { isDevEnv } from "../../utils/constants/common";
import { cache } from "./cache";
import { shop } from "./shop";
import { test } from "./test";
import { user } from "./user";

import { home } from "./v2/home";

let routes = [
    // { url: '/shop', router: shop },
    // { url: '/test', router: test },
    // { url: '/user', router: user },
]

let routesV2 = [
    { url: '/v2/home', router: home }
]

const devRoutes = [
    // { url: '/cache', router: cache }
]

if (isDevEnv) {
    routes = [...routes, ...devRoutes, ...routesV2]
}

export default routes;