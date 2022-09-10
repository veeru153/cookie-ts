import express, { Request, Response } from "express";

const server = express();

server.all('/', (req: Request, res: Response) => {
    res.send("Ready! Cookie Bot is online!");
})

const PORT = 3000;
export const keepAlive = () => {
    server.listen(PORT, () => {
        console.log("Server is ready!");
    })
}