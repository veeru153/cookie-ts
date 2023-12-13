import { DateTime } from "luxon";

export const START_DATE = DateTime.fromISO("2023-12-20T00:00:00.000+09:00");
export const END_DATE = DateTime.fromISO("2024-01-04T23:59:59.000+09:00");

export const DAILY_GIFT_LIMIT = 5;
export const WALL = 0;
export const FLOOR = 1;
export const ROOF = 2;
export const WINDOW = 3;
export const DOOR = 4;
export const RATES = [0.2667, 0.5334, 0.7556, 0.8889, 1];

export const REQUIRED_WALLS = 10;
export const REQUIRED_FLOORS = 6;
export const REQUIRED_ROOFS = 6;
export const REQUIRED_WINDOWS = 4;
export const REQUIRED_DOORS = 1;