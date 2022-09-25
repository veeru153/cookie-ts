import { db } from "./firebase";

export const RANKS = db.collection("ranks");
export const INVENTORY = db.collection("inventory");
export const EVENTS = db.collection("events");

export default {
    RANKS,
    INVENTORY,
    EVENTS,
}