import type { FastifyReply, FastifyRequest } from "fastify";
import prisma from "../../config/prisma.js";
import {
	type CreateTransactionSchema,
	createTransactionSchema,
} from "../../schemas/transactions.schema.js";

const createTransaction = async (
	request: FastifyRequest<{ Body: CreateTransactionSchema }>,
	reply: FastifyReply,
): Promise<void> => {
	const userId = request.userId;

	if (!userId) {
		reply.status(401).send({ error: "Usuário não autenticado" });
		return;
	}

	const result = createTransactionSchema.safeParse(request.body);

	if (!result.success) {
		const errorMessage =
			result.error.issues[0]?.message ?? "Dados da transação inválidos";
		reply.status(400).send({ error: errorMessage });
		return;
	}

	const transaction = result.data;

	try {
		const category = await prisma.category.findFirst({
			where: {
				id: transaction.categoryId,
				type: transaction.type,
			},
		});

		if (!category) {
			reply.status(400).send({ error: "Categoria inválida" });
			return;
		}

		const parsedDate = new Date(transaction.date);

		if (Number.isNaN(parsedDate.getTime())) {
			reply.status(400).send({ error: "Data inválida" });
			return;
		}

		const newTransaction = await prisma.transaction.create({
			data: {
				...transaction,
				userId,
				date: parsedDate,
			},
			include: {
				Category: { select: { color: true, name: true, type: true } },
			},
		});

		reply.status(201).send(newTransaction);
	} catch (err) {
		request.log.error({ err }, "Erro ao criar transação");
		reply.status(500).send({ error: "Erro interno do servidor" });
	}
};

export default createTransaction;
