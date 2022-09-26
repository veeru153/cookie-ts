import { db } from "./firebase";
import logger from "./logger";

class Repository {
    name: string;
    collection: FirebaseFirestore.CollectionReference;
    data: Map<String, FirebaseFirestore.DocumentData>;

    constructor(name: string) {
        this.name = name;
        this.collection = db.collection(name);
        this.data = new Map();

        this.collection.onSnapshot(snapshot => {
            snapshot.docChanges().forEach(change => {
                const doc = change.doc;
                this.data.set(doc.id, doc.data());
            })
        })
    }

    initialize = async () => {
        logger.info(`[Collection/${this.name}] Initialized`);
    }

    get = (key: string) => {
        return this.data.get(key);
    }

    set = async (key: string, value: FirebaseFirestore.DocumentData) => {
        if(!this.data.has(key)) {
            await this.collection.doc(key).set(value);
            return;
        }

        await this.collection.doc(key).update(value);
    }
}

export const ranksRepo = new Repository("ranks");
export const inventoryRepo = new Repository("inventory");
export const eventRepo = new Repository("events");

// export default Repository;