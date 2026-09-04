import admin from 'firebase-admin';
import { env } from './env.js';


const initializeFirebaseAdmin = ():void => {
    if(admin.getApps.length > 0) return


    const { FIREBASE_CLIENTE_EMAIL, FIREBASE_PRIVATE_KEY, FIREBASE_PROJECT_ID } = env;

    if(!FIREBASE_CLIENTE_EMAIL || !FIREBASE_PRIVATE_KEY || !FIREBASE_PROJECT_ID){
        throw new Error(" Falha ao iniciar o firebase - faltando as credenciais");
    }


    try{
           admin.initializeApp({
              credential: admin.credential.cert({})
           })
    }catch(err){

    }
}