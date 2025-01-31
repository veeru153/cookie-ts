import express, { NextFunction, Request, Response } from "express";
import routes from "./api/routes";
import { log } from "./common/logger";
import path from "path";
import cors from "cors";

const app = express();

const allowedOrigins = [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'https://veeru153.github.io'
];

app.use(cors({ origin: allowedOrigins }))

app.use((req: Request, res: Response, next: NextFunction) => {
    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
        res.header("Access-Control-Allow-Origin", origin);
    }
    next();
})

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

const PORT = process.env.PORT || 3001;
export const server = () => {
    app.listen(PORT, () => {
        log.info(`Server is ready! Listening on PORT: ${PORT}`);
    })
}