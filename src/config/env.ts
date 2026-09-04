import { z } from "zod";
import dotenv from "dotenv";



dotenv.config();




const envSchema = z.object({
    PORT: z.string().transform(Number).default(3001),
    DATABASE_URL: z.string().min(5, "DATABASE_URL é obrigatório"),
    NODE_ENV: z.enum(["dev", "prod"], {
        message: "O Node ENV deve ser dev, test ou prod",
}),

// firebase

FIREBASE_PROJECT_ID: z.string().optional(),
FIREBASE_PRIVATE_KEY: z.string().optional(),
FIREBASE_CLIENTE_EMAIL: z.string().optional(),

});


const _env = envSchema.safeParse(process.env);


if(!_env.success){
    console.error( "🚨Variáveis de ambiente INVÁLIDAS")
    process.exit(1);
}


export const env = _env.data;