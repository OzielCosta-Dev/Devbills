import app from './app.js';
import dotenv from 'dotenv';
import { prismaConnect } from './config/prisma.js';
import { initializeGlobalCategories } from './services/gloabalCategories.service.js';
dotenv.config();


const PORT = Number(process.env.PORT);

const startServer = async () => {

    try{
        await prismaConnect();

        await initializeGlobalCategories();

        await app.listen({ port: PORT}).then( () => {
            console.log(`Servidor rodando na porta ${PORT}`)
        })

    } catch(err){
        console.error(err)
    }
}

startServer()