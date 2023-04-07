import { createCanvas, loadImage } from "canvas";

const WIDTH = 480;
const HEIGHT = 332;
const PADDING = 20;
const MARGIN = 12;
const RADIUS = 16;

const xpBarW = (WIDTH + PADDING) * 0.54;
const xpBarH = 26;
const xpBarX = PADDING;
const xpBarY = HEIGHT * 0.70 - xpBarH / 2;
const xpCornerOffset = 10;
const xpCornerR = 6.4;

export const getProfileCard = (payload) => {
    const canvas = createCanvas(WIDTH, HEIGHT);
    const ctx = canvas.getContext('2d');
    // TODO: Migrate from class based service
}

const constructCanvas = async (ctx: CanvasRenderingContext2D, data: any) => {
    makeRoundedEdges(ctx);
    await addBackground(ctx, data);
    addGradient(ctx);
    addXpBar(ctx, data);
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

const addBackground = async (ctx: CanvasRenderingContext2D, data: any) => {
    ctx.save();
    const bgImg = await loadImage(data.bg);
    // @ts-expect-error: ctx should be type NodeCanvasRenderingContext2D but can't use that
    ctx.drawImage(bgImg, 0, 0, WIDTH, HEIGHT);
    ctx.restore();
}

const addGradient = (ctx: CanvasRenderingContext2D) => {
    ctx.save();
    const tint = ctx.createLinearGradient(WIDTH / 2, HEIGHT * 0.1, WIDTH / 2, HEIGHT);
    tint.addColorStop(0, 'rgba(0,0,0,0.24)');
    tint.addColorStop(1, 'rgba(0,0,0,0.84)');
    ctx.fillStyle = tint;
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
    ctx.restore();
}

const addXpBar = (ctx: CanvasRenderingContext2D, data: any) => {
    ctx.save();
    const xpRatio = data.xp / ((data.level + 1) * 20);
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

    const xpLabelX = PADDING + MARGIN;
    const xpLabelY = xpBarY + (xpBarH / 2) + 4.5;
    ctx.fillStyle = "white";
    ctx.shadowColor = "black";
    ctx.shadowBlur = 4;
    ctx.textAlign = "start";
    ctx.font = "bold 16px Helvetica";
    ctx.fillText("xp", xpLabelX, xpLabelY);
    ctx.restore();
}
