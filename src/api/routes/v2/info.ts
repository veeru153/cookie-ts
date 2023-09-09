import { Request, Response, Router } from "express";
import path from "path";

export const info = Router();

info.all('/', (req: Request, res: Response) => {
    res.render(path.join(__dirname, '..', '..', 'views', 'v2', 'info.ejs'));
})