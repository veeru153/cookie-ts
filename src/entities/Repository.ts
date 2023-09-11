import { sendToLogChannel } from "../helpers/sendToLogChannel";
import { db } from "../utils/firebase";
import { log } from "../utils/logger";
import { DocumentData } from "./DocumentData";

export class Repository<T> {
    name: string;
    collection: FirebaseFirestore.CollectionReference;
    data: Map<string, T>;

    constructor(name: string) {
        this.name = name;
        this.collection = db.collection(name);
        this.data = new Map();
    }

    initialize = () => {
        log.info(`[Repository/${this.name}] Initialized`);
    }

    prepopulate = () => {
        log.info(`[Repository/${this.name}] Prepopulating data to Cache`);
        this.collection.onSnapshot(snapshot => {
            snapshot.docChanges().forEach(change => {
                const doc = change.doc;
                if (change.type === "removed") {
                    this.data.delete(doc.id);
                    return;
                }
                this.data.set(doc.id, { id: doc.id, ...doc.data() } as T);
            })
        })

        return this;
    }

    get = async (key: string) => {
        if (this.data.has(key)) {
            return this.data.get(key);
        }

        const doc = await this.collection.doc(key).get();
        if (doc.exists) {
            await this.__subscribe(key);
            return doc.data() as T;
        }

        log.warn(`[Repository/${this.name}] Cannot get document : ${key} as it does not exist.`);
        return null;
    }

    set = async (key: string, value: T) => {
        const tempValue = { ...value } as any;
        if (tempValue.id) {
            delete tempValue.id;
        }

        try {
            if (this.data.has(key)) {
                await this.collection.doc(key).update(tempValue);
                return value;
            }

            const doc = await this.collection.doc(key).get();
            if (doc.exists) {
                await this.collection.doc(key).update(tempValue);
            } else {
                await this.collection.doc(key).set(tempValue);
            }
        } catch (err) {
            log.error(`${sendToLogChannel(`[Repository/${this.name}] Could not update document : ${key}`)}\n${err}`);
        }

        await this.__subscribe(key);
        return value;
    }

    __subscribe = async (key: string) => {
        this.collection.doc(key).onSnapshot(snapshot => {
            this.data.set(key, { id: key, ...snapshot.data() } as T);
            log.info(`[Repository/${this.name}] Fetched latest snapshot for document : ${key}`);
        }, err => {
            log.error(`${sendToLogChannel(`[Repository/${this.name}] Could not subscribe to document : ${key}`)}\n${err}`);
        });
    }
}