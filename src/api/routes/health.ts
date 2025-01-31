import { Request, Response, Router } from "express";

export const health = Router();

health.get('/', (req: Request, res: Response) => {
    res.json({
        status: 200,
        message: "OK!",
        data: {
            timestamp: new Date(Date.now()).toISOString(),
            version: process.env.npm_package_version
        }
    })
})