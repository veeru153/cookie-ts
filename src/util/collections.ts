import { db } from "./firebase";

export const RANKS = db.collection("ranks");
export const INVENTORY = db.collection("inventory");

export default {
    RANKS,
    INVENTORY
}