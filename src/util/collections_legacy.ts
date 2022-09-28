import { db } from "./firebase";

// TODO: Migrate events to use repo instead. Keeping for Halloween 2022
export const EVENTS = db.collection("events");