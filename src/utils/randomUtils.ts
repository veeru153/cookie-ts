export const getRandomNumberBetween = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min + 1) + min)
}

export const getRandomElementsFromArray = (array: any[], count: number) => {
    const res = [];
    for (let i = 0; i < count; i++) {
        const index = getRandomNumberBetween(0, array.length - 1);
        res.push(array[index]);
    }
    return res;
}

export const getOneRandomlyFromArray = (array: any[]) => {
    const [res] = getRandomElementsFromArray(array, 1);
    return res;
}