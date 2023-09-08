import { Request, Response, Router } from "express";
import path from "path";

export const home = Router();

home.all('/', (req: Request, res: Response) => {
    res.render(path.join(__dirname, '..', '..', 'views', 'v2', 'home.ejs'));
})