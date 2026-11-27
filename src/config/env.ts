import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
	PORT: z.coerce.number().default(3001),
	DATABASE_URL: z.string().min(5, "DATABASE_URL é obrigatório"),
	NODE_ENV: z.enum(["dev", "prod"], {
		message: "O NODE_ENV deve ser dev ou prod",
	}),

	// Origens permitidas no CORS, separadas por vírgula (vazio = qualquer origem)
	CORS_ORIGIN: z.string().optional(),

	// Firebase
	FIREBASE_PROJECT_ID: z.string().optional(),
	FIREBASE_PRIVATE_KEY: z.string().optional(),
	FIREBASE_CLIENTE_EMAIL: z.string().optional(),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
	console.error("🚨 Variáveis de ambiente INVÁLIDAS");
	for (const issue of _env.error.issues) {
		console.error(`  - ${issue.path.join(".")}: ${issue.message}`);
	}
	process.exit(1);
}

export const env = _env.data;
