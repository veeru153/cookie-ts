import { identity } from "../utils/constants";
import { db } from "../utils/firebase";
import logger from "../utils/logger";


class Repository {
    name: string;
    collection: FirebaseFirestore.CollectionReference;
    data: Map<string, FirebaseFirestore.DocumentData>;

    constructor(name: string) {
        this.name = name;
        this.collection = db.collection(name);
        this.data = new Map();

        this.collection.onSnapshot(snapshot => {
            snapshot.docChanges().forEach(change => {
                const doc = change.doc;
                if (change.type === "removed") {
                    this.data.delete(doc.id);
                    return;
                }
                this.data.set(doc.id, {
                    id: doc.id,
                    ...doc.data()
                });
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
        if (!this.data.has(key)) {
            await this.collection.doc(key).set(value);
            return;
        }

        await this.collection.doc(key).update(value);
    }
}

export default Repository;