import { TransactionType } from "@prisma/client";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc.js";
import "dayjs/locale/pt-br.js";
import type { FastifyReply, FastifyRequest } from "fastify";
import prisma from "../../config/prisma.js";
import type { GetHistoricalTransactionsQuery } from "../../schemas/transactions.schema.js";

dayjs.extend(utc);
dayjs.locale("pt-br");

export const getHistoricalTransactions = async (
	request: FastifyRequest<{ Querystring: GetHistoricalTransactionsQuery }>,
	reply: FastifyReply,
): Promise<void> => {
	const userId = request.userId;

	if (!userId) {
		reply.status(401).send({ error: "Usuário não autenticado" });
		return;
	}

	const month = Number(request.query.month);
	const year = Number(request.query.year);
	const months = Number(request.query.months ?? 6);

	// Todas as datas são tratadas em UTC, igual ao armazenamento das transações
	const baseDate = dayjs.utc(Date.UTC(year, month - 1, 1));
	const startDate = baseDate
		.subtract(months - 1, "month")
		.startOf("month")
		.toDate();
	const endDate = baseDate.endOf("month").toDate();

	try {
		const transactions = await prisma.transaction.findMany({
			where: {
				userId,
				date: { gte: startDate, lte: endDate },
			},
			select: { amount: true, type: true, date: true },
		});

		const monthlyData = Array.from({ length: months }, (_, i) => {
			const date = baseDate.subtract(months - 1 - i, "month");
			return {
				key: date.format("YYYY-MM"),
				name: date.format("MMM/YYYY"),
				income: 0,
				expenses: 0,
			};
		});

		for (const transaction of transactions) {
			const monthKey = dayjs.utc(transaction.date).format("YYYY-MM");
			const monthData = monthlyData.find((m) => m.key === monthKey);

			if (!monthData) continue;

			if (transaction.type === TransactionType.income) {
				monthData.income += transaction.amount;
			} else {
				monthData.expenses += transaction.amount;
			}
		}

		reply.send({
			history: monthlyData.map(({ name, income, expenses }) => ({
				name,
				income: Number(income.toFixed(2)),
				expenses: Number(expenses.toFixed(2)),
			})),
		});
	} catch (err) {
		request.log.error({ err }, "Erro ao buscar histórico de transações");
		reply.status(500).send({ error: "Erro do servidor" });
	}
};
