import { env } from "./env.js";
import { initializeApp, cert, getApps } from "firebase-admin/app";

const initializeFirebaseAdmin = (): void => {
    if (getApps().length > 0) return;

    const { FIREBASE_CLIENTE_EMAIL, FIREBASE_PRIVATE_KEY, FIREBASE_PROJECT_ID } = env;

    if (!FIREBASE_CLIENTE_EMAIL || !FIREBASE_PRIVATE_KEY || !FIREBASE_PROJECT_ID) {
        throw new Error("Falha ao iniciar o firebase - faltando as credenciais");
    }

    try {
        initializeApp({
            credential: cert({
                projectId: FIREBASE_PROJECT_ID,
                clientEmail: FIREBASE_CLIENTE_EMAIL,
                privateKey: FIREBASE_PRIVATE_KEY,
            }),
        });
    } catch (err) {
        console.error("Falha ao conectar ao Firebase", err);
        process.exit(1);
    }
};

export default initializeFirebaseAdmin;