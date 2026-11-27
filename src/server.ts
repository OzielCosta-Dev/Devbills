import app from "./app.js";
import { env } from "./config/env.js";
import initializeFirebaseAdmin from "./config/firebase.js";
import prisma, { prismaConnect } from "./config/prisma.js";
import { initializeGlobalCategories } from "./services/gloabalCategories.service.js";

const PORT = env.PORT;

const startServer = async (): Promise<void> => {
	try {
		initializeFirebaseAdmin();
		console.log("🔥 Firebase Admin inicializado");

		await prismaConnect();

		// Se o banco estiver inacessível, o servidor sobe mesmo assim: as rotas
		// respondem com erro 500 (com headers de CORS) em vez de a porta ficar
		// fechada, o que no navegador aparece como um enganoso "erro de CORS".
		initializeGlobalCategories().catch((err) => {
			console.error(
				"⚠️ Categorias globais não inicializadas (banco inacessível). Elas serão criadas no próximo start com o banco disponível.",
			);
			app.log.error({ err }, "Falha ao inicializar categorias globais");
		});

		await app.listen({ port: PORT, host: "0.0.0.0" });
		console.log(`🚀 Servidor rodando na porta ${PORT}`);
	} catch (err) {
		console.error(err);
		await prisma.$disconnect();
		process.exit(1);
	}
};

const shutdown = async (): Promise<void> => {
	await app.close();
	await prisma.$disconnect();
	process.exit(0);
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

startServer();
