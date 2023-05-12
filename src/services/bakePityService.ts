const DEFAULT_ODDS = {
    T0: 0.05,
    T1: 0.65,
    T3: 1 - 0.05
}

let odds = { ...DEFAULT_ODDS };
let delay = [0, 0, 0, 0];

export const getBakeTierFromPity = (bakePity: number[]) => {
    odds = { ...DEFAULT_ODDS };
    delay = [...bakePity];
    updatePityOdds();

    const luck = Math.random();
    if (luck < odds.T0) return 0;
    if (luck < odds.T1) return 1;
    if (luck >= odds.T3) return 3;
    return 2;
}

export const getUpdatedBakePity = (tier: number, bakePity: number[]) => {
    bakePity[0] = (tier !== 0) ? bakePity[0] + 1 : -1;
    bakePity[1] = (tier !== 1) ? bakePity[1] + 1 : 0;
    bakePity[2] = (tier !== 2) ? bakePity[2] + 1 : 0;
    bakePity[3] = (tier !== 3) ? bakePity[3] + 1 : 0;
    return bakePity;
}

const updatePityOdds = () => {
    updateT0Odds();
    updateT1Odds();
    updateT3Odds();
}

const updateT0Odds = () => {
    const d = delay[0];
    if (d < 0) {
        odds.T0 = 0;
    } else {
        odds.T0 = 0.05;
    }
}

const updateT1Odds = () => {
    const d = delay[1];
    if ([1, 2, 8, 9, 15, 16].includes(d)) {
        odds.T1 = 0.65;
    } else if ([3, 4, 10, 11, 17, 18].includes(d)) {
        odds.T1 = 0.35;
    } else if ([5, 6, 12, 13, 19].includes(d)) {
        odds.T1 = 0.15;
    } else if (d === 20) {
        odds.T1 = 0;
    }
}

const updateT3Odds = () => {
    const i = delay[3];
    if (i >= 1 && i <= 8) {
        odds.T3 = 1 - 0.05;
    } else if (i >= 9 && i <= 13) {
        odds.T3 = 1 - 0.10;
    } else if (i === 14 || i === 15) {
        odds.T3 = 1 - 0.15;
    } else if (i === 16) {
        odds.T3 = 1 - 0.20;
    } else if (i === 17) {
        odds.T3 = 1 - 0.30;
    } else if (i === 18) {
        odds.T3 = 1 - 0.40;
    } else if (i === 19) {
        odds.T3 = 1 - 0.60;
    } else if (i === 20) {
        odds.T3 = 1 - 0.95;
    }
}