import app from './app.js';
import { prismaConnect } from './config/prisma.js';
import { initializeGlobalCategories } from './services/gloabalCategories.service.js';
import { env } from './config/env.js';
import initializeFirebaseAdmin from "./config/firebase.js";

const PORT = env.PORT;

const startServer = async () => {

    try{

        initializeFirebaseAdmin();
        await prismaConnect();

        await initializeGlobalCategories();

        await app.listen({ port: PORT}).then( () => {
            console.log(`Servidor rodando na porta ${PORT}`)
            console.log("🔥 Firebase Admin inicializado");
        })

    } catch(err){
        console.error(err)
    }
}

startServer()