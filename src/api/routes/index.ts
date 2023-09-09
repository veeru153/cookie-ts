import { isDevEnv } from "../../utils/constants/common";
import { cache } from "./cache";
import { shop } from "./shop";
import { test } from "./test";
import { user } from "./user";

import { home } from "./v2/home";
import { info } from "./v2/info";
import { shop as shopV2 } from "./v2/shop";

let routes = [
    { url: '/shop', router: shop },
    // { url: '/test', router: test },
    // { url: '/user', router: user },
]

let routesV2 = [
    { url: '/v2/home', router: home },
    { url: '/v2/shop', router: shopV2 },
    { url: '/v2/info', router: info },
]

const devRoutes = [
    { url: '/cache', router: cache }
]

if (isDevEnv) {
    routes = [...routes, ...devRoutes, ...routesV2]
}

export default routes;