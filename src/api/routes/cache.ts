import { Request, Response, Router } from "express";
import { assetsRepo, inventoryRepo, profileRepo, shopRepo } from "../../common/repos";

export const cache = Router();

cache.get('/assets', (req: Request, res: Response) => {
    res.send(Object.fromEntries(assetsRepo.data));
})

cache.get('/shop', (req: Request, res: Response) => {
    res.send(Object.fromEntries(shopRepo.data));
})

cache.get('/inventory', (req: Request, res: Response) => {
    res.send(Object.fromEntries(inventoryRepo.data));
})

cache.get('/profile', (req: Request, res: Response) => {
    res.send(Object.fromEntries(profileRepo.data));
})