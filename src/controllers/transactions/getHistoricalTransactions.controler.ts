import type { FastifyReply, FastifyRequest } from "fastify";
import type { GetHistoricalTransactionsQuery } from "../../schemas/transactions.schema.js";
import dayjs from "dayjs";
import "dayjs/locale/pt-br.js";
import prisma from "../../config/prisma.js";
import { TransactionType } from "@prisma/client";

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

    const { month, year, months = 6 } = request.query;

    const baseDate = new Date(year, month - 1, 1);

    const startDate = dayjs(baseDate).subtract(months - 1, "month").startOf("month").toDate();
    const endDate = dayjs(baseDate).endOf("month").toDate();

    try {
        const transactions = await prisma.transaction.findMany({
            where: {
                userId,
                date: {
                    gte: startDate,
                    lte: endDate,
                },
            },
            select: {
                amount: true,
                type: true,
                date: true,
            },
        });

        const monthlyData = Array.from({ length: months }, (_, i) => {
            const date = dayjs(baseDate).subtract(months - 1 - i, "month");

            return {
                name: date.format("MMM/YYYY"),
                income: 0,
                expenses: 0,
            };
        });

        for (const transaction of transactions) {
            const monthKey = dayjs(transaction.date).format("MMM/YYYY");
            const monthData = monthlyData.find((m) => m.name === monthKey);

            if (!monthData) continue;

            if (transaction.type === TransactionType.income) {
                monthData.income += transaction.amount;
            } else {
                monthData.expenses += transaction.amount;
            }
        }

        reply.send({ history: monthlyData });
    } catch (err) {
        request.log.error({ err }, "Erro ao buscar histórico de transações");
        reply.status(500).send({ error: "Erro do servidor" });
    }
};
