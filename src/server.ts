import express, { Request, Response } from "express";
import routes from "./api/routes";
import { log } from "./utils/logger";
import { sendToLogChannel } from "./helpers/sendToLogChannel";
import path from "path";

const app = express();
app.use(express.static(path.join(__dirname, 'api', 'public')));
for (const route of routes) {
    app.use(route.url, route.router);
}

app.all('/', (req: Request, res: Response) => {
    res.send("Ready! Cookie Bot is online!");
})

app.all('/v2', (req: Request, res: Response) => {
    res.send("V2");
})

const PORT = process.env.PORT || 3000;
export const server = () => {
    app.listen(PORT, () => {
        log.info(`Server is ready! Listening on PORT: ${PORT}`);
    })
}