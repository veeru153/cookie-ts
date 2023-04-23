import express, { Request, Response } from "express";
import { routes } from "./api/routes";

const app = express();

for (const route of routes) {
    app.use(route.url, route.router);
}

app.all('/', (req: Request, res: Response) => {
    res.send("Ready! Cookie Bot is online!");
})

const PORT = process.env.PORT || 3000;
export const server = () => {
    app.listen(PORT, () => {
        console.log(`Server is ready! Listening on PORT: ${PORT}`);
    })
}