import { getCatalogue } from "../../services/shopService";
import { ShopItemType } from "../../common/schemas/ShopItem";
import { Request, Response, Router } from "express";
import path from "path";
import { shopRepo } from "../../common/repos";

export const shop = Router();

// shop.get('/', async (req: Request, res: Response) => {
//     const catalogue = await getCatalogue(false);
//     const filteredCatalogue = catalogue.filter(item => item.type === ShopItemType.BACKGROUND).sort((a, b) => b.ts - a.ts);
//     res.render(path.join(__dirname, '..', 'views', 'shop.ejs'), { backgrounds: filteredCatalogue });
// })

shop.get('/', async (req: Request, res: Response) => {
    const catalogue = await getCatalogue(false);
    const filteredCatalogue = catalogue.filter(item => item.type === ShopItemType.BACKGROUND).sort((a, b) => b.ts - a.ts);
    res.json({
        status: 200,
        message: "OK!",
        data: filteredCatalogue
    });
})