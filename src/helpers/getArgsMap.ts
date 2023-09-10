import { CookieException } from "../utils/CookieException";

export const getArgsMap = (args: string[], keys: string[]) => {
    // Get space separated args in a map
    const argsMap = new Map<string, string>();

    if (args.length !== keys.length) {
        throw new CookieException(`Invalid Arguments! Expected ${keys.length}. Received ${args.length}`);
    }

    args.forEach((value: string, i: number) => {
        argsMap.set(keys[i], value);
    })

    return argsMap;
}