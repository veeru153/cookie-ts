import { createCanvas, loadImage, registerFont } from "canvas";
import { CookieException } from "../common/CookieException";
import { log } from "../common/logger";
import path from "path";
import { ProfilePayload } from "../common/types/ProfilePayload";
import { getXpCapAtLevel } from "./chatXpService";

export const generateCard = async (payload: ProfilePayload) => {
    registerFonts();
    const canvas = createCanvas(WIDTH, HEIGHT);
    const ctx = canvas.getContext('2d');
    await constructCanvas(ctx, payload);
    return canvas.toBuffer('image/png');
}

const registerFonts = () => {
    registerFont(path.join(__dirname, '..', 'assets', 'twemoji.ttf'), { family: "Twemoji" });
}

const constructCanvas = async (ctx: any, data: ProfilePayload) => {
    try {
        // makeRoundedEdges(ctx);
        await addBackground(ctx, data);
        addGradient(ctx);
        addXpBar(ctx, data);
        addLevel(ctx, data);
        await addProfilePicture(ctx, data);
        addName(ctx, data);
        // addBetaLogo(ctx);
    } catch (err) {
        throw new CookieException("Error generating profile :(", `[ProfileCardService] Could not create canvas: ${err}`);
    }
}

const makeRoundedEdges = (ctx: CanvasRenderingContext2D) => {
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(0 + MARGIN, 0);
    ctx.lineTo(WIDTH - MARGIN, 0);
    ctx.arcTo(WIDTH, 0, WIDTH, 0 + MARGIN, RADIUS);
    ctx.lineTo(WIDTH, HEIGHT - MARGIN);
    ctx.arcTo(WIDTH, HEIGHT, WIDTH - MARGIN, HEIGHT, RADIUS);
    ctx.lineTo(0 + MARGIN, HEIGHT);
    ctx.arcTo(0, HEIGHT, 0, HEIGHT - MARGIN, RADIUS);
    ctx.lineTo(0, 0 + MARGIN);
    ctx.arcTo(0, 0, 0 + MARGIN, 0, RADIUS);
    ctx.closePath();
    ctx.clip();
}

const addBackground = async (ctx: CanvasRenderingContext2D, data: ProfilePayload) => {
    ctx.save();
    const bgImg = await loadImage(data.background) as unknown as HTMLOrSVGImageElement;
    const bgW = bgImg.width as number;
    const bgH = bgImg.height as number;
    const dW = (Math.min(bgW, WIDTH) / Math.max(bgW, WIDTH));
    const dH = (Math.min(bgH, HEIGHT) / Math.max(bgH, HEIGHT));
    const diff = (bgW > bgH) ? dW : dH;
    const bgWidth = bgW * diff;
    const bgHeight = bgH * diff;
    ctx.fillStyle = "whitesmoke";
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
    ctx.drawImage(bgImg, (WIDTH - bgWidth) * 0.5, (HEIGHT - bgHeight) * 0.5, bgWidth, bgHeight);
    ctx.restore();
    log.info("[ProfileCardService] Background added");
}

const addGradient = (ctx: CanvasRenderingContext2D) => {
    ctx.save();
    const tint = ctx.createLinearGradient(WIDTH / 2, HEIGHT * 0.1, WIDTH / 2, HEIGHT);
    tint.addColorStop(0, 'rgba(0,0,0,0)');
    tint.addColorStop(1, 'rgba(0,0,0,0.56)');
    ctx.fillStyle = tint;
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
    ctx.restore();
    log.info("[ProfileCardService] Gradient added");
}

const addXpBar = (ctx: CanvasRenderingContext2D, data: ProfilePayload) => {
    ctx.save();
    const xpRatio = data.xp / getXpCapAtLevel(data.level);
    ctx.beginPath();
    ctx.moveTo(xpBarX + xpCornerOffset, xpBarY);
    ctx.lineTo(xpBarX + xpBarW - xpCornerOffset, xpBarY);
    ctx.arcTo(xpBarX + xpBarW, xpBarY, xpBarX + xpBarW, xpBarY + xpCornerOffset, xpCornerR);
    ctx.lineTo(xpBarX + xpBarW, xpBarY + xpBarH - xpCornerOffset);
    ctx.arcTo(xpBarX + xpBarW, xpBarY + xpBarH, xpBarX + xpBarW - xpCornerOffset, xpBarY + xpBarH, xpCornerR);
    ctx.lineTo(xpBarX + xpCornerOffset, xpBarY + xpBarH);
    ctx.arcTo(xpBarX, xpBarY + xpBarH, xpBarX, xpBarY + xpBarH - xpCornerOffset, xpCornerR);
    ctx.lineTo(xpBarX, xpBarY + xpCornerOffset);
    ctx.arcTo(xpBarX, xpBarY, xpBarX + xpCornerOffset, xpBarY, xpCornerR);
    ctx.closePath();
    ctx.clip();

    ctx.fillStyle = "rgba(255,255,255,0.36)";
    ctx.fillRect(xpBarX, xpBarY, xpBarW, xpBarH);

    ctx.fillStyle = "rgba(255,255,255,0.58)";
    ctx.fillRect(xpBarX, xpBarY, xpBarW * xpRatio, xpBarH);

    ctx.restore();
    log.info("[ProfileCardService] XP Bar added");
}

const addLevel = (ctx: CanvasRenderingContext2D, data: ProfilePayload) => {
    ctx.save();
    ctx.fillStyle = "black";
    ctx.shadowColor = "rgba(0,0,0,0)";
    ctx.font = `bold 11px ${FONT}`;
    ctx.textAlign = "end";
    ctx.fillText(`LEVEL ${data.level}`, levelX, levelY);
    ctx.restore();
    log.info("[ProfileCardService] Level added");
}

const addProfilePicture = async (ctx: CanvasRenderingContext2D, data: ProfilePayload) => {
    const avatarImg = await loadImage(data.avatar) as unknown as CanvasImageSource;
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(avatarX + avatarCornerOffset, avatarY);
    ctx.lineTo(avatarX + avatarSide - avatarCornerOffset, avatarY);
    ctx.arcTo(avatarX + avatarSide, avatarY, avatarX + avatarSide, avatarY + avatarCornerOffset, avatarCornerR);
    ctx.lineTo(avatarX + avatarSide, avatarY + avatarSide - avatarCornerOffset);
    ctx.arcTo(avatarX + avatarSide, avatarY + avatarSide, avatarX + avatarSide - avatarCornerOffset, avatarY + avatarSide, avatarCornerR);
    ctx.lineTo(avatarX + avatarCornerOffset, avatarY + avatarSide);
    ctx.arcTo(avatarX, avatarY + avatarSide, avatarX, avatarY + avatarSide - avatarCornerOffset, avatarCornerR);
    ctx.lineTo(avatarX, avatarY + + avatarCornerOffset);
    ctx.arcTo(avatarX, avatarY, avatarX + avatarCornerOffset, avatarY, avatarCornerR);
    ctx.closePath();
    ctx.clip();

    ctx.shadowColor = "rgba(0,0,0,0.8)";
    ctx.shadowBlur = 8;
    ctx.drawImage(avatarImg, avatarX, avatarY, avatarSide, avatarSide);
    ctx.restore();
    log.info("[ProfileCardService] Profile Picture added");
}

const addName = (ctx: CanvasRenderingContext2D, data: ProfilePayload) => {
    const userHasUpdatedUsername = data.discriminator === "0";
    if (userHasUpdatedUsername) {
        addDisplayName(ctx, data);
    } else {
        addLegacyUsername(ctx, data);
        addDiscriminator(ctx, data);
    }
}

const addDisplayName = (ctx: CanvasRenderingContext2D, data: any) => {
    ctx.save();
    ctx.shadowColor = "rgba(0,0,0,0.8)";
    ctx.shadowBlur = 4;
    ctx.font = `20px ${FONT}`;
    ctx.fillStyle = "white";
    ctx.fillText(getNameText(data.displayName), displayNameX, displayNameY);
    ctx.restore();
    log.info("[ProfileCardService] Display Name added");
}

const addLegacyUsername = (ctx: CanvasRenderingContext2D, data: any) => {
    ctx.save();
    ctx.shadowColor = "rgba(0,0,0,0.8)";
    ctx.shadowBlur = 4;
    ctx.font = `18px ${FONT}`;
    ctx.fillStyle = "white";
    ctx.fillText(getNameText(data.username), legacyUsernameX, legacyUsernameY);
    ctx.restore();
    log.info("[ProfileCardService] Legacy Username added");
}

const addDiscriminator = (ctx: CanvasRenderingContext2D, data: any) => {
    ctx.save();
    ctx.shadowColor = "rgba(0,0,0,0.8)";
    ctx.shadowBlur = 4;
    ctx.font = `14px ${FONT}`;
    ctx.fillStyle = "white";
    ctx.fillText(`#${data.discriminator}`, discrimX, discrimY);
    ctx.restore();
    log.info("[ProfileCardService] Discriminator added");
}

const addBetaLogo = (ctx: CanvasRenderingContext2D) => {
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(betaX + betaW / 2, betaY);
    ctx.lineTo(betaX + betaW - betaCornerOffset, betaY);
    ctx.arcTo(betaX + betaW - 2, betaY, betaX + betaW, betaY + betaH / 2, betaCornerR);
    ctx.arcTo(betaX + betaW - 2, betaY + betaH, betaX + betaW - betaCornerOffset, betaY + betaH, betaCornerR);
    ctx.lineTo(betaX + betaCornerOffset, betaY + betaH);

    ctx.arcTo(betaX + 2, betaY + betaH, betaX, betaY + betaH / 2, betaCornerR);
    ctx.lineTo(betaX, betaY + betaH / 2);
    ctx.arcTo(betaX + 2, betaY, betaX + betaW / 2, betaY, betaCornerR);

    ctx.closePath();
    ctx.clip();

    ctx.fillStyle = "#F04747";
    ctx.fillRect(betaX, betaY, betaW, betaH);

    ctx.fillStyle = "white";
    ctx.font = `bold 12px ${FONT}`;
    ctx.fillText("BETA", betaTextX, betaTextY);
    ctx.restore();
    log.info("[ProfileCardService] BETA Logo added");
}

const WIDTH = 480;
const HEIGHT = 332;
const PADDING = 10;
const MARGIN = 12;
const RADIUS = 16;
const FONT = "Ubuntu";

const xpBarW = WIDTH - (2 * PADDING);
const xpBarH = 16;
const xpBarX = PADDING;
const xpBarY = HEIGHT - PADDING - xpBarH;
const xpCornerOffset = 10;
const xpCornerR = 8;

const xpLabelX = PADDING + MARGIN;
const xpLabelY = xpBarY + (xpBarH / 2) + 4.5;
const levelX = WIDTH - (1.75 * PADDING);
const levelY = xpLabelY - 0.2;

const avatarSide = 40;
const avatarX = PADDING;
const avatarY = xpBarY - MARGIN - avatarSide;
const avatarCornerOffset = 10;
const avatarCornerR = 10;

const getNameText = (str: string) => str.length > 20 ? str.substring(0, 19) + "..." : str;

const legacyUsernameX = avatarX + avatarSide + MARGIN - 4;
const legacyUsernameY = avatarY + (avatarSide / 2) + 10;
const discrimX = avatarX + avatarSide + MARGIN - 4;
const discrimY = legacyUsernameY + 20;

const displayNameX = avatarX + avatarSide + 8;
const displayNameY = avatarY + (avatarSide * 0.91);

const betaW = 48;
const betaH = 20;
const betaX = WIDTH - PADDING - betaW;
const betaY = PADDING;
const betaCornerOffset = 12;
const betaCornerR = 12;

const betaTextX = betaX + 8;
const betaTextY = betaY + betaH / 2 + 4;