import admin, { ServiceAccount } from "firebase-admin";
import serviceAccount from "../cookie-yuqicord-firebase-adminsdk-7v8yo-921f6b9665.json";

admin.initializeApp({
    credential: admin.credential.cert((serviceAccount as ServiceAccount))
})

export const db = admin.firestore();