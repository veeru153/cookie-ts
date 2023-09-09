import { getCatalogue } from "../../../services/shopService";
import { ShopItemType } from "../../../utils/schemas/ShopItem";
import { Request, Response, Router } from "express";
import path from "path";

export const shop = Router();

shop.all('/', async (req: Request, res: Response) => {
    const catalogue = await getCatalogue(false);
    const filteredCatalogue = catalogue.filter(item => item.type === ShopItemType.BACKGROUND).sort((a, b) => b.ts - a.ts);
    res.render(path.join(__dirname, '..', '..', 'views', 'v2', 'shop.ejs'), { backgrounds: filteredCatalogue });
})