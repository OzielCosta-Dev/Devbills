import type { FastifyReply, FastifyRequest } from "fastify";
import prisma from "../../config/prisma.js";
import {
	type CreateTransactionSchema,
	createTransactionSchema,
	type TransactionIdParams,
} from "../../schemas/transactions.schema.js";

export const updateTransaction = async (
	request: FastifyRequest<{
		Params: TransactionIdParams;
		Body: CreateTransactionSchema;
	}>,
	reply: FastifyReply,
): Promise<void> => {
	const userId = request.userId;
	const { id } = request.params;

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

	const data = result.data;

	try {
		const existing = await prisma.transaction.findFirst({
			where: { id, userId },
		});

		if (!existing) {
			reply.status(404).send({ error: "Transação não encontrada" });
			return;
		}

		const category = await prisma.category.findFirst({
			where: { id: data.categoryId, type: data.type },
		});

		if (!category) {
			reply.status(400).send({ error: "Categoria inválida" });
			return;
		}

		const parsedDate = new Date(data.date);

		if (Number.isNaN(parsedDate.getTime())) {
			reply.status(400).send({ error: "Data inválida" });
			return;
		}

		const updated = await prisma.transaction.update({
			where: { id },
			data: {
				description: data.description,
				amount: data.amount,
				type: data.type,
				categoryId: data.categoryId,
				date: parsedDate,
			},
			include: {
				Category: { select: { color: true, name: true, type: true } },
			},
		});

		reply.send(updated);
	} catch (err) {
		request.log.error({ err }, "Erro ao atualizar transação");
		reply.status(500).send({ error: "Erro do servidor, falha ao atualizar transação" });
	}
};
