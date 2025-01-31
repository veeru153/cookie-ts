import { Request, Response, Router } from "express";
import path from "path";

export const home = Router();

// home.get('/', (req: Request, res: Response) => {
//     res.render(path.join(__dirname, '..', 'views', 'home.ejs'));
// })