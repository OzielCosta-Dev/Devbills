import type { FastifyReply, FastifyRequest } from "fastify";
import prisma from "../../config/prisma.js";
import type { TransactionIdParams } from "../../schemas/transactions.schema.js";

export const deleteTransaction = async (
	request: FastifyRequest<{ Params: TransactionIdParams }>,
	reply: FastifyReply,
): Promise<void> => {
	const userId = request.userId;
	const { id } = request.params;

	if (!userId) {
		reply.status(401).send({ error: "Usuário não autenticado" });
		return;
	}

	try {
		const transaction = await prisma.transaction.findFirst({
			where: { id, userId },
		});

		if (!transaction) {
			reply.status(404).send({ error: "Transação não encontrada" });
			return;
		}

		await prisma.transaction.delete({ where: { id } });

		reply.status(200).send({ message: "Transação deletada com sucesso" });
	} catch (err) {
		request.log.error({ err }, "Erro ao deletar transação");
		reply
			.status(500)
			.send({ error: "Erro do servidor, falha ao deletar transação" });
	}
};
