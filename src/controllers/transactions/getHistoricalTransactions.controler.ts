import type { FastifyRequest } from "fastify";
import type { GetHistoricalTransactionsQuery } from "../../schemas/transactions.schema.js";

export const getHistoricalTransactions = async (
    request: FastifyRequest<{Querystring: GetHistoricalTransactionsQuery}>,
    reply: FastfyReply
)