import { Request, Response, Router } from "express";
import path from "path";

export const info = Router();

info.get('/', (req: Request, res: Response) => {
    res.render(path.join(__dirname, '..', 'views', 'info.ejs'));
})