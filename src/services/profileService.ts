import { createCanvas, loadImage, CanvasRenderingContext2D, Canvas, Image } from "canvas";

class _ProfileService {
    canvas: Canvas;
    ctx: CanvasRenderingContext2D;
    WIDTH: number = 480;
    HEIGHT: number = 332;
    PADDING: number = 20;
    MARGIN: number = 12;
    data: any;

    getProfileCard = async () => {
        this.data = {
            name: "Veeru",
            discriminator: 6884,
            xpRatio: 432/500,
            level: 24,
            cookies: 122343,
            coins: 1231,
            biases: [
                "https://cdn.discordapp.com/attachments/786583150947991592/1024685150744879224/unknown.png",
                // "https://cdn.discordapp.com/attachments/786583150947991592/1024685150203809852/unknown.png",
                "https://cdn.discordapp.com/emojis/691006062446379080.png?quality=lossless"
            ]
        }

        this.canvas = createCanvas(this.WIDTH, this.HEIGHT);
        this.ctx = this.canvas.getContext('2d');
        await this.__constructCanvas();
        return this.canvas.toBuffer('image/png');

    }

    __constructCanvas = async () => {
        // Background
        this.ctx.save();
        const bgImgUrl = "https://i.picsum.photos/id/12/480/332.jpg?hmac=DpH3gLh68cZRmxbBnDtVH1Vxi3hXuJhI1sgCzUNN_6Q";
        const bgImg = await loadImage(bgImgUrl);
        this.ctx.drawImage(bgImg, 0, 0, this.WIDTH, this.HEIGHT);
        this.ctx.restore();


        // Gradient / Tint
        this.ctx.save();
        const tint = this.ctx.createLinearGradient(this.WIDTH / 2, this.HEIGHT * 0.1, this.WIDTH / 2, this.HEIGHT);
        tint.addColorStop(0, 'rgba(0,0,0,0.24)');
        tint.addColorStop(1, 'rgba(0,0,0,0.84)');
        this.ctx.fillStyle = tint;
        this.ctx.fillRect(0, 0, this.WIDTH, this.HEIGHT);
        this.ctx.restore();


        // XP
        this.ctx.save();
        const xpBarW = (this.WIDTH + this.PADDING) * 0.54;
        const xpBarH = 26;
        const xpBarX = this.PADDING;
        const xpBarY = this.HEIGHT * 0.70 - xpBarH / 2;
        const xpCornerOffset = 10;
        const xpCornerR = 6.4;
        this.__makeXpBar(xpBarX, xpBarY, xpBarW, xpBarH, xpCornerOffset, xpCornerR, this.data.xpRatio);
        this.ctx.restore();


        // Profile Picture
        this.ctx.save();
        const dpUrl = "https://i.picsum.photos/id/8/78/78.jpg?hmac=DOIU-OGFD_JkHMefjT1g2pDrmG_lMbJln-XflK8OYoE";
        const dpImg = await loadImage(dpUrl);
        const dpSide = 78;
        const dpX = this.PADDING;
        const dpY = this.HEIGHT * 0.70 - xpBarH / 2 - this.MARGIN - dpSide;
        const dpCornerOffset = 10;
        const dpCornerR = 16;
        this.__makeProfilePic(dpX, dpY, dpSide, dpCornerOffset, dpCornerR, dpImg);
        this.ctx.restore();


        // Filler - Level
        this.ctx.save();
        const fillerX = this.PADDING + xpBarW + this.MARGIN;
        const fillerY = xpBarY;
        const fillerW = this.WIDTH - xpBarW - 2 * this.PADDING - this.MARGIN;
        const fillerH = xpBarH;
        const fillerCornerOffset = 10;
        const fillerCornerR = 6.4;
        const fillerCol = "#2e2e2e"
        const fillerText = "Level 24";
        const fillerTextX = fillerX + fillerW / 2;
        const fillerTextY = fillerY + fillerH / 2 + 6;
        this.__makeFiller(fillerX, fillerY, fillerW, fillerH, fillerCornerOffset, fillerCornerR, fillerCol, fillerText, fillerTextX, fillerTextY);
        this.ctx.restore();


        // Name
        this.ctx.save();
        const nameText = (str: string) => str.length > 20 ? str.substring(0, 19) + "..." : str;
        const nameX = dpX + dpSide + this.MARGIN;
        const nameY = dpY + (dpSide / 2) + 9;
        this.ctx.shadowColor = "rgba(0,0,0,0.8)";
        this.ctx.shadowBlur = 4;
        this.ctx.font = "20px Helvetica";
        this.ctx.fillStyle = "white";
        this.ctx.fillText(nameText(this.data.name), nameX, nameY);
        this.ctx.restore();


        // Discriminator
        this.ctx.save();
        const disNumX = dpX + dpSide + this.MARGIN;
        const disNumY = nameY + 2 * this.MARGIN + 1;
        this.ctx.font = "18px Helvetica";
        this.ctx.fillStyle = "white";
        this.ctx.fillText(`#${this.data.discriminator}`, disNumX, disNumY);
        this.ctx.restore();


        // Cookie
        this.ctx.save();
        const cookieUrl = "https://cdn.discordapp.com/attachments/786583150947991592/1024675257887494164/cookie.png";
        const cookieImg = await loadImage(cookieUrl);
        const cookieX = xpBarX;
        const cookieY = xpBarY + xpBarH + this.MARGIN;
        const cookieSide = 24;
        this.ctx.shadowColor = "rgba(0,0,0,0.8)";
        this.ctx.shadowBlur = 4;
        this.ctx.drawImage(cookieImg, cookieX, cookieY, cookieSide, cookieSide);

        const cookieCountX = cookieX + 34;
        const cookieCountY = cookieY + 20;
        this.ctx.font = "18px Helvetica";
        this.ctx.fillStyle = "white";
        this.ctx.fillText(this.data.cookies, cookieCountX, cookieCountY);
        this.ctx.restore();


        // Coin
        this.ctx.save();
        const coinUrl = "https://cdn.discordapp.com/attachments/786583150947991592/1024675257518407720/coin.png";
        const coinImg = await loadImage(coinUrl);
        const coinX = cookieX;
        const coinY = cookieY + 22 + this.MARGIN;
        const coinSide = 24;
        this.ctx.shadowColor = "rgba(0,0,0,0.8)";
        this.ctx.shadowBlur = 4;
        this.ctx.drawImage(coinImg, coinX, coinY, coinSide, coinSide);

        const coinCountX = coinX + 34;
        const coinCountY = coinY + 20;
        this.ctx.font = "18px Helvetica";
        this.ctx.fillStyle = "white";
        this.ctx.fillText(this.data.coins, coinCountX, coinCountY);
        this.ctx.restore();


        // Old Level
        // this.ctx.save();
        // const levelX = this.PADDING + 2;
        // const levelY = 1.78 * this.PADDING;
        // // this.ctx.fillText("lvl 00", levelX, levelY);
        // this.ctx.restore();


        // // Join Number
        // this.ctx.save();
        // const joinNum = "#0000000";
        // const joinNumX = this.WIDTH - this.PADDING;
        // const joinNumY = coinCountY;
        // this.ctx.textAlign = "end"
        // this.ctx.fillText(joinNum, joinNumX, joinNumY);
        // this.ctx.restore();


        // Bias Roles
        this.ctx.save();
        const biasImgs = [
            await loadImage(this.data.biases[0]),
            await loadImage(this.data.biases[1]),
        ]
        const biasX = fillerX;
        const biasY = fillerY + fillerH + this.MARGIN;
        const biasW = fillerW;
        const biasH = 56;
        const biasCornerOffset = 10;
        const biasCornerR = 6.4;
        this.__biasSigns(biasX, biasY, biasW, biasH, biasCornerOffset, biasCornerR, biasImgs);
        this.ctx.restore();

    }

    __makeXpBar = (xpBarX: number, xpBarY: number, xpBarW: number, xpBarH: number, xpCornerOffset: number, xpCornerR: number, xpRatio: number) => {
        this.ctx.beginPath();
        this.ctx.moveTo(xpBarX + xpCornerOffset, xpBarY);
        this.ctx.lineTo(xpBarX + xpBarW - xpCornerOffset, xpBarY);
        this.ctx.arcTo(xpBarX + xpBarW, xpBarY, xpBarX + xpBarW, xpBarY + xpCornerOffset, xpCornerR);
        this.ctx.lineTo(xpBarX + xpBarW, xpBarY + xpBarH - xpCornerOffset);
        this.ctx.arcTo(xpBarX + xpBarW, xpBarY + xpBarH, xpBarX + xpBarW - xpCornerOffset, xpBarY + xpBarH, xpCornerR);
        this.ctx.lineTo(xpBarX + xpCornerOffset, xpBarY + xpBarH);
        this.ctx.arcTo(xpBarX, xpBarY + xpBarH, xpBarX, xpBarY + xpBarH - xpCornerOffset, xpCornerR);
        this.ctx.lineTo(xpBarX, xpBarY + xpCornerOffset);
        this.ctx.arcTo(xpBarX, xpBarY, xpBarX + xpCornerOffset, xpBarY, xpCornerR);
        this.ctx.closePath();
        this.ctx.clip();

        this.ctx.fillStyle = "rgba(255,255,255,0.36)";
        this.ctx.fillRect(xpBarX, xpBarY, xpBarW, xpBarH);

        this.ctx.fillStyle = "rgba(255,255,255,0.58)";
        this.ctx.fillRect(xpBarX, xpBarY, xpBarW * xpRatio, xpBarH);

        const xpLabelX = this.PADDING + this.MARGIN;
        const xpLabelY = xpBarY + (xpBarH / 2) + 4.5;
        this.ctx.fillStyle = "white";
        this.ctx.shadowColor = "black";
        this.ctx.shadowBlur = 4;
        this.ctx.textAlign = "start";
        this.ctx.font = "bold 16px Helvetica";
        this.ctx.fillText("xp", xpLabelX, xpLabelY);
    }

    __makeProfilePic = (dpX: number, dpY: number, dpSide: number, dpCornerOffset: number, dpCornerR: number, dpImg: Image) => {
        this.ctx.beginPath();
        this.ctx.moveTo(dpX + dpCornerOffset, dpY);
        this.ctx.lineTo(dpX + dpSide - dpCornerOffset, dpY);
        this.ctx.arcTo(dpX + dpSide, dpY, dpX + dpSide, dpY + dpCornerOffset, dpCornerR);
        this.ctx.lineTo(dpX + dpSide, dpY + dpSide - dpCornerOffset);
        this.ctx.arcTo(dpX + dpSide, dpY + dpSide, dpX + dpSide - dpCornerOffset, dpY + dpSide, dpCornerR);
        this.ctx.lineTo(dpX + dpCornerOffset, dpY + dpSide);
        this.ctx.arcTo(dpX, dpY + dpSide, dpX, dpY + dpSide - dpCornerOffset, dpCornerR);
        this.ctx.lineTo(dpX, dpY + + dpCornerOffset);
        this.ctx.arcTo(dpX, dpY, dpX + dpCornerOffset, dpY, dpCornerR);
        this.ctx.closePath();
        this.ctx.clip();

        this.ctx.shadowColor = "rgba(0,0,0,0.8)";
        this.ctx.shadowBlur = 8;
        this.ctx.drawImage(dpImg, dpX, dpY, dpSide, dpSide);
    }

    __makeFiller = (fillerX: number, fillerY: number, fillerW: number, fillerH: number, fillerCornerOffset: number, fillerCornerR: number, fillerCol: string, fillerText: string, fillerTextX: number, fillerTextY: number) => {
        this.ctx.moveTo(fillerX + fillerCornerOffset, fillerY);
        this.ctx.lineTo(fillerX + fillerW - fillerCornerOffset, fillerY);
        this.ctx.arcTo(fillerX + fillerW, fillerY, fillerX + fillerW, fillerY + fillerCornerOffset, fillerCornerR);
        this.ctx.lineTo(fillerX + fillerW, fillerY + fillerH - fillerCornerOffset);
        this.ctx.arcTo(fillerX + fillerW, fillerY + fillerH, fillerX + fillerW - fillerCornerOffset, fillerY + fillerH, fillerCornerR)
        this.ctx.lineTo(fillerX + fillerCornerOffset, fillerY + fillerH);
        this.ctx.arcTo(fillerX, fillerY + fillerH, fillerX, fillerY + fillerH - fillerCornerOffset, fillerCornerR);
        this.ctx.lineTo(fillerX, fillerY + fillerCornerOffset);
        this.ctx.arcTo(fillerX, fillerY, fillerX + fillerCornerOffset, fillerY, fillerCornerR);
        this.ctx.closePath();
        this.ctx.clip();

        this.ctx.fillStyle = fillerCol + this.__alphaToHex(0.48);
        this.ctx.fillRect(fillerX, fillerY, fillerW, fillerH);

        this.ctx.shadowColor = "black";
        this.ctx.shadowBlur = 4;
        this.ctx.fillStyle = "white";
        this.ctx.textAlign = "center";
        this.ctx.font = "normal 16px Helvetica";
        this.ctx.fillText(fillerText, fillerTextX, fillerTextY);
    }

    __biasSigns = (biasX: number, biasY: number, biasW: number, biasH: number, biasCornerOffset: number, biasCornerR: number, biasImgs: Image[]) => {
        this.ctx.moveTo(biasX + biasCornerOffset, biasY);
        this.ctx.lineTo(biasX + biasW - biasCornerOffset, biasY);
        this.ctx.arcTo(biasX + biasW, biasY, biasX + biasW, biasY + biasCornerOffset, biasCornerR);
        this.ctx.lineTo(biasX + biasW, biasY + biasH - biasCornerOffset);
        this.ctx.arcTo(biasX + biasW, biasY + biasH, biasX + biasW - biasCornerOffset, biasY + biasH, biasCornerR);
        this.ctx.lineTo(biasX + biasCornerOffset, biasY + biasH);
        this.ctx.arcTo(biasX, biasY + biasH, biasX, biasY + biasH - biasCornerOffset, biasCornerR);
        this.ctx.lineTo(biasX, biasY + biasCornerOffset);
        this.ctx.arcTo(biasX, biasY, biasX + biasCornerOffset, biasY, biasCornerR);
        this.ctx.closePath();
        this.ctx.clip();

        this.ctx.fillStyle = "rgba(255,255,255,0.36)";
        this.ctx.fillRect(biasX, biasW, biasX, biasY);

        const biasImgSide = 42;
        const bias0X = biasX + biasW*0.30 - biasImgSide/2;
        const bias1X = biasX + biasW*0.70 - biasImgSide/2;
        const biasImgY = biasY + (biasH/2 - biasImgSide/2);
        this.ctx.drawImage(biasImgs[0], bias0X, biasImgY, biasImgSide, biasImgSide);
        this.ctx.drawImage(biasImgs[1], bias1X, biasImgY, biasImgSide, biasImgSide);
    }

    __alphaToHex = (a: number) => {
        const alpha = Math.max(0, Math.min(1, a));
        const intVal = Math.round(alpha * 255);
        const hexVal = intVal.toString(16);
        return hexVal.padStart(2, "0");
    }
}

const ProfileService = new _ProfileService();
export default ProfileService; 