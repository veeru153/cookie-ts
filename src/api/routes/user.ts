import { Request, Response, Router } from "express";
import path from "path";
import { getMemberFromId } from "../../services/memberService";
import { getUserInventoryForPanel } from "../../services/inventoryService";

export const user = Router();

user.get('/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
    const member = await getMemberFromId(id);

    if (!member) {
        res.render(path.join(__dirname, '..', 'views', 'error.ejs'));
        return;
    }

    const username = member.user.username;
    const displayName = member.displayName;
    const user = { id, username, displayName }
    const inventory = await getUserInventoryForPanel(id);
    res.render(path.join(__dirname, '..', 'views', 'user.ejs'), { user, inventory });
})