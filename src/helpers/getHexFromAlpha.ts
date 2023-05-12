export const alphaToHex = (a: number) => {
    const alpha = Math.max(0, Math.min(1, a));
    const intVal = Math.round(alpha * 255);
    const hexVal = intVal.toString(16);
    return hexVal.padStart(2, "0");
}