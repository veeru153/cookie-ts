import { Message } from "discord.js";
import { Command } from "../entities/Command";
import Scope from "../utils/enums/Scope";
import { assetsRepo } from "../utils/repos";
import { shopRepo } from "../utils/repos";

const links = [
    {
        id: "I_AM_YUQI",
        name: "I am - Yuqi",
        src: "https://cdn.discordapp.com/attachments/1101090386954424350/1101091146765180978/7f7ed93e572abd2e945caea7ed921d0e.png",
        cost: 0,
        tags: ["yuqi"],
        ts: 20180411203500
    },
    {
        id: "I_AM_IDLE",
        name: "I am - (G)I-DLE",
        src: "https://cdn.discordapp.com/attachments/1101090386954424350/1101091147159457873/285c1a94d8b6bc86ae67facab7feafea.png",
        cost: 0,
        tags: ["idle"],
        ts: 20180411204700
    },
    {
        id: "I_MADE_IDLE",
        name: "I made - (G)I-DLE",
        src: "https://cdn.discordapp.com/attachments/1101090386954424350/1101091147935391784/de9b4530228b88e1503d91899c37c778.png",
        cost: 0,
        tags: ["idle"],
        ts: 20190125131600
    },
    {
        id: "I_MADE_2_IDLE",
        name: "I made - (G)I-DLE",
        src: "https://media.discordapp.net/attachments/1101090386954424350/1101091148598104115/6471a32a7e74185391ef604c625dcc9d.png",
        cost: 0,
        tags: ["idle"],
        ts: 20190125131600
    },
    {
        id: "UHOH_IDLE",
        name: "Uh-Oh - (G)I-DLE",
        src: "https://cdn.discordapp.com/attachments/1101090386954424350/1101091149432750090/4c63d5e6d80dd13a68aff073d49021ea.png",
        cost: 0,
        tags: ["idle"],
        ts: 20190504151900
    },
    {
        id: "I_TRUST_TRUE_IDLE",
        name: "I trust (True) - (G)I-DLE",
        src: "https://cdn.discordapp.com/attachments/1101090386954424350/1101091150380683325/60cb5e6e2ffc7472b4697e44c0ca79cd.png",
        cost: 0,
        tags: ["idle"],
        ts: 20200213115100
    },
    {
        id: "I_TRUST_LIE_YUQI",
        name: "I trust (Lie) - Yuqi",
        src: "https://cdn.discordapp.com/attachments/1101090386954424350/1101091151106285618/ca8bb052e2b88a72070a1bc1769a2ce8.png",
        cost: 0,
        tags: ["yuqi"],
        ts: 20200213115101
    },
    {
        id: "I_TRUST_TRUE_YUQI",
        name: "I trust (True) - Yuqi",
        src: "https://cdn.discordapp.com/attachments/1101090386954424350/1101091151643148348/158b5cf4bc695e81a60eabb0b2113806.png",
        cost: 0,
        tags: ["yuqi"],
        ts: 20200213115102
    },
    {
        id: "DUMDI_IDLE",
        name: "DUMDi DUMDi - (G)I-DLE",
        src: "https://cdn.discordapp.com/attachments/1101090386954424350/1101091152477822997/865f1af7da1ac6a410737d57968fbb80.png",
        cost: 0,
        tags: ["idle"],
        ts: 20200606195500
    },
    {
        id: "HWAA_IDLE",
        name: "Hwaa - (G)I-DLE",
        src: "https://cdn.discordapp.com/attachments/1101090386954424350/1101091153421533254/34e122e4985117b2cbd3187c44ae9503.png",
        cost: 0,
        tags: ["idle"],
        ts: 20201129213200
    },
    {
        id: "I_NEVER_DIE_YUQI",
        name: "I NEVER DIE - Yuqi",
        src: "https://cdn.discordapp.com/attachments/1101090386954424350/1101091485539115048/9e19c8b1150ace27a348cddff7230090.png",
        cost: 0,
        tags: ["yuqi"],
        ts: 20210521103900
    },
    {
        id: "I_NEVER_DIE_IDLE",
        name: "I NEVER DIE - (G)I-DLE",
        src: "https://cdn.discordapp.com/attachments/1101090386954424350/1101091486285709362/a8783c481ad779831d4791860b748092.png",
        cost: 0,
        tags: ["idle"],
        ts: 20210521103901
    },
    {
        id: "I_NEVER_DIE_2_IDLE",
        name: "I NEVER DIE - (G)I-DLE",
        src: "https://cdn.discordapp.com/attachments/1101090386954424350/1101091487015522314/c3c2e66b85d179e28e35914d9555238e.png",
        cost: 0,
        tags: ["idle"],
        ts: 20180411000000
    },
    {
        id: "I_LOVE_IDLE",
        name: "I love - (G)I-DLE",
        src: "https://cdn.discordapp.com/attachments/1101090386954424350/1101091487514632313/d244eacdb54d61d34208b7b1917e54bb.png",
        cost: 0,
        tags: ["idle"],
        ts: 20221017000000
    },
    {
        id: "I_LOVE_2_IDLE",
        name: "I love - (G)I-DLE",
        src: "https://cdn.discordapp.com/attachments/1101090386954424350/1101091487875350588/701ea29c4a6bbb198d47e423e8fc4587.png",
        cost: 0,
        tags: ["idle"],
        ts: 20221017000001
    },
]

const tempAddBgLinksFn = async (message: Message) => {
    links.map(async link => {
        await assetsRepo.collection.doc(link.id).set({
            name: link.name,
            src: link.src,
            tags: link.tags,
            ts: link.ts
        })

        await shopRepo.collection.doc(link.id).set({
            cost: link.cost,
            eligibility: {},
            listed: true,
            name: link.name,
            type: "background",
            stock: -1,
        })

        await message.channel.send(`Added ${link.id}`);
    })
}

export const tempAddBgLinks = new Command({
    name: "tempAddBgLinks",
    desc: "Temp",
    scope: [Scope.ADMIN],
    fn: tempAddBgLinksFn
})