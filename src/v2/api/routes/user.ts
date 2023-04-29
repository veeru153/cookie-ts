import { Request, Response, Router } from "express";
import path from "path";
import { getMemberFromId } from "../../services/memberService";
import { getUserInventoryForPanel } from "../../services/inventoryService";

export const user = Router();

user.get('/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
    const tag = await getMemberFromId(id);

    if (!tag) {
        res.render(path.join(__dirname, '..', 'views', 'user', 'error.ejs'));
        return;
    }
    const user = { id, tag }
    const inventory = await getUserInventoryForPanel(id);
    res.render(path.join(__dirname, '..', 'views', 'user', 'profile.ejs'), { user, inventory });
})

user.all('/', (req: Request, res: Response) => {
    res.render(path.join(__dirname, '..', 'views', 'user', 'index.ejs'));
});