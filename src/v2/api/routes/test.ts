import { Request, Response, Router } from "express";

export const test = Router();

test.all('/', (req: Request, res: Response) => {
    res.send("Test");
})