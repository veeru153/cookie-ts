export const getTimeFromMs = (ms: number) => {
    const sec = Math.floor((ms / 1000) % 60);
    const min = Math.floor((ms / (60 * 1000)) % 60);
    const hrs = Math.floor((ms / (60 * 60 * 1000) % 60));

    return [hrs, min, sec].map(x => x.toString().padStart(2, '0')).join(':');
}