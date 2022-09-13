import express, { Request, Response } from "express";

const app = express();

app.all('/', (req: Request, res: Response) => {
    res.send("Ready! Cookie Bot is online!");
})

const PORT = process.env.PORT || 3000;
export const server = () => {
    app.listen(PORT, () => {
        console.log("Server is ready!");
    })
}