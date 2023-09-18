import express, { Request, Response } from "express";
import routes from "./api/routes";
import { log } from "./common/logger";
import path from "path";

const app = express();
app.use(express.static(path.join(__dirname, 'api', 'public')));
for (const route of routes) {
    app.use(route.url, route.router);
}

app.get('/', (req: Request, res: Response) => {
    res.render(path.join(__dirname, 'api', 'views', 'home.ejs'));
})

app.get('*', (req: Request, res: Response) => {
    res.status(404).render(path.join(__dirname, 'api', 'views', 'error.ejs'));
})

app.all('*', (req: Request, res: Response) => {
    res.status(404).json({
        status: 404,
        message: "Not Found"
    })
})

const PORT = process.env.PORT || 3000;
export const server = () => {
    app.listen(PORT, () => {
        log.info(`Server is ready! Listening on PORT: ${PORT}`);
    })
}