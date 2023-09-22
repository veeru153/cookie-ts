import { isDevEnv } from "../../common/constants/common";
import { cache } from "./cache";
import { user } from "./user";

import { home } from "./home";
import { shop } from "./shop";
import { info } from "./info";
import { health } from "./health";

let routes = [
    { url: '/', router: home },
    { url: '/shop', router: shop },
    { url: '/info', router: info },
    { url: '/user', router: user },
    { url: '/health', router: health },
]

const devRoutes = [
    { url: '/cache', router: cache }
]

if (isDevEnv) {
    routes = [...routes, ...devRoutes];
}

export default routes;