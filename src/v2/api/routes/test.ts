import { Request, Response, Router } from "express";
import path from "path";
import { getCatalogue } from "../../services/shopService";

export const test = Router();

test.all('/', (req: Request, res: Response) => {
    res.send("Test");
})