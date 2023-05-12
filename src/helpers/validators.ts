export const isArrayUnavailable = (arr: any[]) => arr === null || arr === undefined;
export const isStringBlank = (str: string) => str === null || str === undefined || str.trim().length === 0;