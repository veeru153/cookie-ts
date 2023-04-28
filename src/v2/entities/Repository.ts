import { db } from "../utils/firebase";
import { log } from "../utils/logger";
import { DocumentData } from "./DocumentData";

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
        log.info(`[Collection/${this.name}] Initialized`);
    }

    get = (key: string) => {
        return this.data.get(key);
    }

    set = async (key: string, value: FirebaseFirestore.DocumentData) => {
        const tempValue = { ...value };
        if ((tempValue as DocumentData).id) {
            delete tempValue.id;
        }

        if (!this.data.has(key)) {
            await this.collection.doc(key).set(tempValue);
            return value;
        }

        await this.collection.doc(key).update(tempValue);
        return value;
    }
}

export default Repository;