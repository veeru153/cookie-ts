import { Request, Response, Router } from "express";
import path from "path";
import { getCatalogue } from "../../services/shopService";

export const shop = Router();

shop.all('/', (req: Request, res: Response) => {
    const catalogue = getCatalogue(false);
    res.render(path.join(__dirname, '..', 'views', 'shop.ejs'), { catalogue });
});