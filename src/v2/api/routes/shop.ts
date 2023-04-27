import { Request, Response, Router } from "express";
import path from "path";
import { getCatalogue } from "../../services/shopService";
import { ShopItemType } from "../../utils/schemas/ShopItem";

export const shop = Router();

shop.get('/backgrounds', (req: Request, res: Response) => {
    const catalogue = getCatalogue(false);
    const filteredCatalogue = catalogue.filter(item => item.type === ShopItemType.BACKGROUND);
    res.render(path.join(__dirname, '..', 'views', 'shop', 'backgrounds.ejs'), { backgrounds: filteredCatalogue });
})

shop.get('/badges', (req: Request, res: Response) => {
    const catalogue = getCatalogue(false);
    const filteredCatalogue = catalogue.filter(item => item.type === ShopItemType.BADGE);
    res.render(path.join(__dirname, '..', 'views', 'shop', 'badges.ejs'), { badges: filteredCatalogue });
})

shop.all('/', (req: Request, res: Response) => {
    // const catalogue = getCatalogue(false);
    // res.render(path.join(__dirname, '..', 'views', 'shop.ejs'), { catalogue });
    res.render(path.join(__dirname, '..', 'views', 'shop', 'main.ejs'));
});