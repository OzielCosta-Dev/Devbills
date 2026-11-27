import { type Category, TransactionType } from "@prisma/client";
import prisma from "../config/prisma.js";

type GlobalCategoryInput = Pick<Category, "name" | "color" | "type">;

const globalCategories: GlobalCategoryInput[] = [
	// Despesas
	{ name: "Alimentação", color: "#FF5733", type: TransactionType.expense },
	{ name: "Transporte", color: "#33A8FF", type: TransactionType.expense },
	{ name: "Moradia", color: "#33FF57", type: TransactionType.expense },
	{ name: "Saúde", color: "#F033FF", type: TransactionType.expense },
	{ name: "Educação", color: "#FF3366", type: TransactionType.expense },
	{ name: "Lazer", color: "#FFBA33", type: TransactionType.expense },
	{ name: "Compras", color: "#33FFF6", type: TransactionType.expense },
	{ name: "Outros", color: "#B033FF", type: TransactionType.expense },

	// Receitas
	{ name: "Salário", color: "#33FF57", type: TransactionType.income },
	{ name: "Freelance", color: "#33A8FF", type: TransactionType.income },
	{ name: "Investimentos", color: "#FFBA33", type: TransactionType.income },
	{ name: "Outros", color: "#B033FF", type: TransactionType.income },
	{ name: "Pet", color: "#B033FF", type: TransactionType.income },
	{ name: "Viajem", color: "#33A9FF", type: TransactionType.income },
];

/**
 * Garante que as categorias globais existam no banco.
 * Busca todas de uma vez e cria apenas as que faltam. Em caso de erro
 * (ex.: banco inacessível) o erro é propagado para o servidor não subir
 * em estado inconsistente.
 */
export const initializeGlobalCategories = async (): Promise<Category[]> => {
	let existing: Category[];

	try {
		existing = await prisma.category.findMany();
	} catch (err) {
		console.error(
			"🚨 Não foi possível acessar o banco de dados. Verifique a DATABASE_URL e se o seu IP está liberado no MongoDB Atlas (Network Access).",
		);
		throw err;
	}

	const key = (c: GlobalCategoryInput): string => `${c.type}:${c.name}`;
	const existingKeys = new Set(existing.map(key));
	const missing = globalCategories.filter((c) => !existingKeys.has(key(c)));

	for (const category of missing) {
		const created = await prisma.category.create({ data: category });
		console.log(`✅ Criada: ${created.name}`);
		existing.push(created);
	}

	console.log("✅ Todas as categorias inicializadas");
	return existing;
};
