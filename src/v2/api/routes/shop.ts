import { Request, Response, Router } from "express";
import path from "path";
import { getCatalogue } from "../../services/shopService";
import { ShopItemType } from "../../utils/schemas/ShopItem";

export const shop = Router();

shop.get('/backgrounds', async (req: Request, res: Response) => {
    const catalogue = await getCatalogue(false);
    const filteredCatalogue = catalogue.filter(item => item.type === ShopItemType.BACKGROUND).sort((a, b) => b.ts - a.ts);
    res.render(path.join(__dirname, '..', 'views', 'shop', 'backgrounds.ejs'), { backgrounds: filteredCatalogue });
})

shop.get('/badges', async (req: Request, res: Response) => {
    const catalogue = await getCatalogue(false);
    const filteredCatalogue = catalogue.filter(item => item.type === ShopItemType.BADGE);
    res.render(path.join(__dirname, '..', 'views', 'shop', 'badges.ejs'), { badges: filteredCatalogue });
})

shop.all('/', (req: Request, res: Response) => {
    res.render(path.join(__dirname, '..', 'views', 'shop', 'index.ejs'));
});