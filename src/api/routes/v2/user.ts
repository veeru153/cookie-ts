import { Request, Response, Router } from "express";
import path from "path";
import { getMemberFromId } from "../../../services/memberService";
import { getUserInventoryForPanel } from "../../../services/inventoryService";

export const user = Router();

user.get('/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
    const member = await getMemberFromId(id);
    const username = member.user.username;
    const displayName = member.displayName;

    // if (!displayName) {
    //     res.render(path.join(__dirname, '..', 'views', 'user', 'error.ejs'));
    //     return;
    // }

    const user = { id, username, displayName }
    const inventory = await getUserInventoryForPanel(id);
    console.log(user);
    res.render(path.join(__dirname, '..', '..', 'views', 'v2', 'user.ejs'), { user, inventory });
})