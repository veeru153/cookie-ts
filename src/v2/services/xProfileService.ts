import { createCanvas, loadImage, CanvasRenderingContext2D, Canvas, Image } from "canvas";
import logger from "../utils/logger";

class _ProfileService {
    canvas: Canvas;
    ctx: CanvasRenderingContext2D;
    WIDTH: number = 480;
    HEIGHT: number = 332;
    PADDING: number = 20;
    MARGIN: number = 12;
    RADIUS: number = 16;
    data: any;

    getProfileCard = async (payload) => {
        this.data = payload;
        this.canvas = createCanvas(this.WIDTH, this.HEIGHT);
        this.ctx = this.canvas.getContext('2d');
        await this.__constructCanvas();
        logger.info("[ProfileService] Profile card ready");
        return this.canvas.toBuffer('image/png');
    }

    __constructCanvas = async () => {
        // Rounded Edges Clip
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.moveTo(0 + this.MARGIN, 0);
        this.ctx.lineTo(this.WIDTH - this.MARGIN, 0);
        this.ctx.arcTo(this.WIDTH, 0, this.WIDTH, 0 + this.MARGIN, this.RADIUS);
        this.ctx.lineTo(this.WIDTH, this.HEIGHT - this.MARGIN);
        this.ctx.arcTo(this.WIDTH, this.HEIGHT, this.WIDTH - this.MARGIN, this.HEIGHT, this.RADIUS);
        this.ctx.lineTo(0 + this.MARGIN, this.HEIGHT);
        this.ctx.arcTo(0, this.HEIGHT, 0, this.HEIGHT - this.MARGIN, this.RADIUS);
        this.ctx.lineTo(0, 0 + this.MARGIN);
        this.ctx.arcTo(0, 0, 0 + this.MARGIN, 0, this.RADIUS);
        this.ctx.closePath();
        this.ctx.clip();


        // Background
        this.ctx.save();
        const bgImg = await loadImage(this.data.bg);
        this.ctx.drawImage(bgImg, 0, 0, this.WIDTH, this.HEIGHT);
        this.ctx.restore();
        logger.info("[ProfileService] Background added");


        // Gradient / Tint
        this.ctx.save();
        const tint = this.ctx.createLinearGradient(this.WIDTH / 2, this.HEIGHT * 0.1, this.WIDTH / 2, this.HEIGHT);
        tint.addColorStop(0, 'rgba(0,0,0,0.24)');
        tint.addColorStop(1, 'rgba(0,0,0,0.84)');
        this.ctx.fillStyle = tint;
        this.ctx.fillRect(0, 0, this.WIDTH, this.HEIGHT);
        this.ctx.restore();
        logger.info("[ProfileService] Tint added");


        // XP
        this.ctx.save();
        const xpVal = this.data.xp / ((this.data.level + 1) * 20);
        const xpBarW = (this.WIDTH + this.PADDING) * 0.54;
        const xpBarH = 26;
        const xpBarX = this.PADDING;
        const xpBarY = this.HEIGHT * 0.70 - xpBarH / 2;
        const xpCornerOffset = 10;
        const xpCornerR = 6.4;
        this.__makeXpBar(xpBarX, xpBarY, xpBarW, xpBarH, xpCornerOffset, xpCornerR, xpVal);
        this.ctx.restore();
        logger.info("[ProfileService] XP added");


        // Profile Picture
        this.ctx.save();
        const avatarImg = await loadImage(this.data.avatar);
        const avatarSide = 78;
        const avatarX = this.PADDING;
        const avatarY = this.HEIGHT * 0.70 - xpBarH / 2 - this.MARGIN - avatarSide;
        const avatarCornerOffset = 10;
        const avatarCornerR = 16;
        this.__makeAvatar(avatarX, avatarY, avatarSide, avatarCornerOffset, avatarCornerR, avatarImg);
        this.ctx.restore();
        logger.info("[ProfileService] Avatar added");


        // Filler - Level
        this.ctx.save();
        const fillerX = this.PADDING + xpBarW + this.MARGIN;
        const fillerY = xpBarY;
        const fillerW = this.WIDTH - xpBarW - 2 * this.PADDING - this.MARGIN;
        const fillerH = xpBarH;
        const fillerCornerOffset = 10;
        const fillerCornerR = 6.4;
        const fillerCol = "#2e2e2e"
        const fillerText = `Level ${this.data.level}`;
        const fillerTextX = fillerX + fillerW / 2;
        const fillerTextY = fillerY + fillerH / 2 + 6;
        this.__makeFiller(fillerX, fillerY, fillerW, fillerH, fillerCornerOffset, fillerCornerR, fillerCol, fillerText, fillerTextX, fillerTextY);
        this.ctx.restore();
        logger.info("[ProfileService] Level added");


        // Name
        this.ctx.save();
        const nameText = (str: string) => str.length > 20 ? str.substring(0, 19) + "..." : str;
        const nameX = avatarX + avatarSide + this.MARGIN;
        const nameY = avatarY + (avatarSide / 2) + 9;
        this.ctx.shadowColor = "rgba(0,0,0,0.8)";
        this.ctx.shadowBlur = 4;
        this.ctx.font = "20px Helvetica";
        this.ctx.fillStyle = "white";
        this.ctx.fillText(nameText(this.data.name), nameX, nameY);
        this.ctx.restore();
        logger.info("[ProfileService] Name added");


        // Discriminator
        this.ctx.save();
        const disNumX = avatarX + avatarSide + this.MARGIN;
        const disNumY = nameY + 2 * this.MARGIN + 1;
        this.ctx.shadowColor = "rgba(0,0,0,0.8)";
        this.ctx.shadowBlur = 4;
        this.ctx.font = "18px Helvetica";
        this.ctx.fillStyle = "white";
        this.ctx.fillText(`#${this.data.discriminator}`, disNumX, disNumY);
        this.ctx.restore();
        logger.info("[ProfileService] Discriminator added");


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
        this.ctx.fillText(this.data.cookies.toLocaleString('en-US'), cookieCountX, cookieCountY);
        this.ctx.restore();
        logger.info("[ProfileService] Cookies added");


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
        this.ctx.fillText(this.data.coins.toLocaleString('en-US'), coinCountX, coinCountY);
        this.ctx.restore();
        logger.info("[ProfileService] Coins added");


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


        // Badges
        this.ctx.save();
        const badges = [
            await loadImage(this.data.badge1),
            await loadImage(this.data.badge2),
        ]
        const badgesX = fillerX;
        const badgesY = fillerY + fillerH + this.MARGIN;
        const badgesW = fillerW;
        const badgesH = 56;
        const badgesCornerOffset = 10;
        const badgesCornerR = 6.4;
        this.__makeBadges(badgesX, badgesY, badgesW, badgesH, badgesCornerOffset, badgesCornerR, badges);
        this.ctx.restore();
        logger.info("[ProfileService] Badges added");


        // Beta
        this.ctx.save();
        const betaW = 48;
        const betaH = 20;
        const betaX = this.WIDTH - this.PADDING - betaW;
        const betaY = this.PADDING + 2;
        const betaCornerOffset = 12;
        const betaCornerR = 12;
        this.__makeBetaLogo(betaX, betaY, betaW, betaH, betaCornerOffset, betaCornerR);
        this.ctx.restore();
        logger.info("[ProfileService] Beta Logo added");
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

    __makeAvatar = (avatarX: number, avatarY: number, avatarSide: number, avatarCornerOffset: number, avatarCornerR: number, avatarImg: Image) => {
        this.ctx.beginPath();
        this.ctx.moveTo(avatarX + avatarCornerOffset, avatarY);
        this.ctx.lineTo(avatarX + avatarSide - avatarCornerOffset, avatarY);
        this.ctx.arcTo(avatarX + avatarSide, avatarY, avatarX + avatarSide, avatarY + avatarCornerOffset, avatarCornerR);
        this.ctx.lineTo(avatarX + avatarSide, avatarY + avatarSide - avatarCornerOffset);
        this.ctx.arcTo(avatarX + avatarSide, avatarY + avatarSide, avatarX + avatarSide - avatarCornerOffset, avatarY + avatarSide, avatarCornerR);
        this.ctx.lineTo(avatarX + avatarCornerOffset, avatarY + avatarSide);
        this.ctx.arcTo(avatarX, avatarY + avatarSide, avatarX, avatarY + avatarSide - avatarCornerOffset, avatarCornerR);
        this.ctx.lineTo(avatarX, avatarY + + avatarCornerOffset);
        this.ctx.arcTo(avatarX, avatarY, avatarX + avatarCornerOffset, avatarY, avatarCornerR);
        this.ctx.closePath();
        this.ctx.clip();

        this.ctx.shadowColor = "rgba(0,0,0,0.8)";
        this.ctx.shadowBlur = 8;
        this.ctx.drawImage(avatarImg, avatarX, avatarY, avatarSide, avatarSide);
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

    __makeBadges = (badgesX: number, badgesY: number, badgeW: number, badgeH: number, badgeCornerOffset: number, badgeCornerR: number, badges: Image[]) => {
        this.ctx.moveTo(badgesX + badgeCornerOffset, badgesY);
        this.ctx.lineTo(badgesX + badgeW - badgeCornerOffset, badgesY);
        this.ctx.arcTo(badgesX + badgeW, badgesY, badgesX + badgeW, badgesY + badgeCornerOffset, badgeCornerR);
        this.ctx.lineTo(badgesX + badgeW, badgesY + badgeH - badgeCornerOffset);
        this.ctx.arcTo(badgesX + badgeW, badgesY + badgeH, badgesX + badgeW - badgeCornerOffset, badgesY + badgeH, badgeCornerR);
        this.ctx.lineTo(badgesX + badgeCornerOffset, badgesY + badgeH);
        this.ctx.arcTo(badgesX, badgesY + badgeH, badgesX, badgesY + badgeH - badgeCornerOffset, badgeCornerR);
        this.ctx.lineTo(badgesX, badgesY + badgeCornerOffset);
        this.ctx.arcTo(badgesX, badgesY, badgesX + badgeCornerOffset, badgesY, badgeCornerR);
        this.ctx.closePath();
        this.ctx.clip();

        this.ctx.fillStyle = "rgba(255,255,255,0.36)";
        this.ctx.fillRect(badgesX, badgeW, badgesX, badgesY);

        const badgeSide = 42;
        const badge0X = badgesX + badgeW * 0.30 - badgeSide / 2;
        const badge1X = badgesX + badgeW * 0.70 - badgeSide / 2;
        const badgeY = badgesY + (badgeH / 2 - badgeSide / 2);
        this.ctx.drawImage(badges[0], badge0X, badgeY, badgeSide, badgeSide);
        this.ctx.drawImage(badges[1], badge1X, badgeY, badgeSide, badgeSide);
    }

    __makeBetaLogo = (betaX: number, betaY: number, betaW: number, betaH: number, betaCornerOffset: number, betaCornerR: number) => {
        this.ctx.beginPath();
        this.ctx.moveTo(betaX + betaW / 2, betaY);
        this.ctx.lineTo(betaX + betaW - betaCornerOffset, betaY);
        this.ctx.arcTo(betaX + betaW - 2, betaY, betaX + betaW, betaY + betaH / 2, betaCornerR);
        this.ctx.arcTo(betaX + betaW - 2, betaY + betaH, betaX + betaW - betaCornerOffset, betaY + betaH, betaCornerR);
        this.ctx.lineTo(betaX + betaCornerOffset, betaY + betaH);

        this.ctx.arcTo(betaX + 2, betaY + betaH, betaX, betaY + betaH / 2, betaCornerR);
        this.ctx.lineTo(betaX, betaY + betaH / 2);
        this.ctx.arcTo(betaX + 2, betaY, betaX + betaW / 2, betaY, betaCornerR);

        this.ctx.closePath();
        this.ctx.clip();

        this.ctx.fillStyle = "#F04747";
        this.ctx.fillRect(betaX, betaY, betaW, betaH);

        const betaTextX = betaX + 8;
        const betaTextY = betaY + betaH / 2 + 4;
        this.ctx.fillStyle = "white";
        this.ctx.font = "bold 12px Helvetica";
        this.ctx.fillText("BETA", betaTextX, betaTextY);
    }

    __alphaToHex = (a: number) => {
        const alpha = Math.max(0, Math.min(1, a));
        const intVal = Math.round(alpha * 255);
        const hexVal = intVal.toString(16);
        return hexVal.padStart(2, "0");
    }
}

interface ProfilePayload {
    name: string;
    discriminator: string;
    badge1: string;
    badge2: string;
    bg: string;
    level: number;
    xp: number;
    cookies: number;
    coins: number;
}

const ProfileService = new _ProfileService();
export default ProfileService; 